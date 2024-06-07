<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Requests;
use Illuminate\Http\Request as Solicitacao;
use Illuminate\Validation\ValidationException;

class RequestsController extends Controller
{
    public function index()
    {
        $requests = Requests::with('client', 'product')->orderBy('id', 'desc')->paginate(10);

        $formattedData = $requests->map(function ($pedido) {
            return [
                'id' => $pedido->id,
                'client' => [
                    'razao_social' => $pedido->client->razao_social,
                ],
                'quant_products' => $pedido->product->count(),
            ];
        });

        return response()->json([
            'data' => $formattedData, //$products->items(),
            'links' => [
                'first' => $requests->url(1),
                'last' => $requests->url($requests->lastPage()),
                'prev' => $requests->previousPageUrl(),
                'next' => $requests->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $requests->currentPage(),
                'from' => $requests->firstItem(),
                'last_page' => $requests->lastPage(),
                'links' => $requests->links()->elements,
                'path' => $requests->url(1),
                'per_page' => $requests->perPage(),
                'to' => $requests->lastItem(),
                'total' => $requests->total(),
            ],
        ]);
    }

    public function store(Solicitacao $request)
    {
        try {
            $data = $request->all();
    
            $retorna = Requests::create($data);
    
            return response()->json($retorna, 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    public function show($id)
    {
        $model = Requests::with('product')->find($id);

        if (!$model)
        {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        }

        return $model->toArray();
    }

    public function update(Solicitacao $request, $id)
    {
	    try {
            $model = Requests::findOrFail($id);
    
            $model->update($request->all());
    
            return response()->json(['data' => $model->toArray()], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $model = Requests::findOrFail($id);
            
            $model->delete();
    
            return response()->json(['message' => 'Pedido excluído com sucesso'], 202);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Pedido não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir o pedido'], 400);
        }
    }    
}
