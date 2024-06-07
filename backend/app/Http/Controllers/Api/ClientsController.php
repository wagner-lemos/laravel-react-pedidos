<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Clients;

class ClientsController extends Controller
{
    public function index()
    {
        $clients = Clients::orderBy('id', 'desc')->paginate(10);

        $formattedData = $clients->map(function ($client) {
            return [
                'id' => $client->id,
                'razao_social' => $client->razao_social,
                'email' => $client->email,
                'cnpj' => $client->cnpj,
            ];
        });

        return response()->json([
            'data' => $formattedData, //$clients->items(),
            'links' => [
                'first' => $clients->url(1),
                'last' => $clients->url($clients->lastPage()),
                'prev' => $clients->previousPageUrl(),
                'next' => $clients->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $clients->currentPage(),
                'from' => $clients->firstItem(),
                'last_page' => $clients->lastPage(),
                'links' => $clients->links()->elements,
                'path' => $clients->url(1),
                'per_page' => $clients->perPage(),
                'to' => $clients->lastItem(),
                'total' => $clients->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all(); // Obtém todos os dados do request
    
            $retorna = Clients::create($data); // Cria um novo registro usando os dados recebidos
    
            return response()->json($retorna, 201); // Retorna a resposta com o registro criado
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422); // Retorna erros de validação, se houver
        }
    }

    public function show($id)
    {
        $model = Clients::find($id);

        if (!$model)
        {
            return response()->json(['error' => 'Cliente não encontrado'], 404);
        }

        return $model->toArray();
    }

    public function update(Request $request, $id)
    {
	    try {
            $model = Clients::findOrFail($id);
    
            $model->update($request->all());
    
            return response()->json(['data' => $model->toArray()], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Cliente não encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $model = Clients::findOrFail($id);
            
            $model->delete();
    
            return response()->json(['message' => 'Cliente excluído com sucesso'], 202);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Cliente não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir o cliente'], 400);
        }
    }    
}
