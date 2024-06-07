<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requests extends Model
{
    protected $table = 'requests';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = ['client_id'];

    public function client()
    {
        return $this->belongsTo(Clients::class, 'client_id', 'id');
    }

    public function product()
    {
        return $this->belongsToMany(Products::class, PedidoTemProduto::class, 'request_id', 'product_id')->withPivot('qtd');
    }
}
