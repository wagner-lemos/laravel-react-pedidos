<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\RequestsController;
use App\Http\Controllers\Api\PedidoTemProdutoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    Route::apiResource('/clients', ClientsController::class);

    Route::get('/products', [ProductsController::class, 'index']);
    Route::post('/products', [ProductsController::class, 'store']);
    Route::get('/products/{id}', [ProductsController::class, 'show']);
    Route::post('/products/{id}', [ProductsController::class, 'update']);
    Route::delete('/products/{id}', [ProductsController::class, 'destroy']);

    Route::get('/requests', [RequestsController::class, 'index']);
    Route::post('/requests', [RequestsController::class, 'store']);
    Route::get('/requests/{id}', [RequestsController::class, 'show']);
    Route::put('/requests/{id}', [RequestsController::class, 'update']);
    Route::delete('/requests/{id}', [RequestsController::class, 'destroy']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
