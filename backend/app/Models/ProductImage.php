<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $table = 'product_images';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = ['product_id', 'image_path'];

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
