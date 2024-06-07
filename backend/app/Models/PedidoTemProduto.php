<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoTemProduto extends Model
{
    protected $table = 'pedido_tem_produto';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = ['request_id', 'product_id', 'qtd'];
}
