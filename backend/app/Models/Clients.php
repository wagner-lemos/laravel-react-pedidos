<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clients extends Model
{
    protected $table = 'clients';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = [
        'razao_social',
        'email',
        'cnpj',
    ];

    public function pedidos()
    {
        return $this->hasMany(Requests::class, 'client_id', 'id');
    }
}
