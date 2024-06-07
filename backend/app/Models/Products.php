<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = 'products';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = [
        'descricao',
        'valor',
        'estoque',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    public function pedidos()
    {
        return $this->belongsToMany(Requests::class, PedidoTemProduto::class, 'product_id', 'request_id');
    }
}
