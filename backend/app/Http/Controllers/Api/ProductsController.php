<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Products;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PgSql\Lob;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Products::orderBy('id', 'desc')->paginate(10);

        $formattedData = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'descricao' => $product->descricao,
                'valor' => $product->valor,
                'estoque' => $product->estoque,
            ];
        });

        return response()->json([
            'data' => $formattedData, //$products->items(),
            'links' => [
                'first' => $products->url(1),
                'last' => $products->url($products->lastPage()),
                'prev' => $products->previousPageUrl(),
                'next' => $products->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $products->currentPage(),
                'from' => $products->firstItem(),
                'last_page' => $products->lastPage(),
                'links' => $products->links()->elements,
                'path' => $products->url(1),
                'per_page' => $products->perPage(),
                'to' => $products->lastItem(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->except('imagens'); // Exclui as imagens do request inicial
            $product = Products::create($data); // Cria um novo registro usando os dados recebidos

            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $image) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                    ]);
                }
            }

            return response()->json($product->load('images'), 201); // Retorna a resposta com o registro criado
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422); // Retorna erros de validação, se houver
        }
    }

    public function show($id)
    {
        $model = Products::with('images')->find($id);

        if (!$model) {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        }

        return response()->json($model);
    }

    public function update(Request $request, $id)
    {
	    try {
            $model = Products::findOrFail($id);
            $data = $request->except('imagens'); // Exclui as imagens do request inicial
            $model->update($data);

            if ($request->hasFile('imagens')) {
                foreach ($model->images as $image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }

                foreach ($request->file('imagens') as $image) {
                    $path = $image->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $model->id,
                        'image_path' => $path,
                    ]);
                }
            }

            return response()->json(['data' => $model->load('images')], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $model = Products::findOrFail($id);
            
            foreach ($model->images as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }

            $model->delete();

            return response()->json(['message' => 'Produto excluído com sucesso'], 202);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Produto não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir o produto'], 400);
        }
    }    
}
