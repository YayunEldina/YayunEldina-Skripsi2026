<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    // HAPUS incrementing false dan keyType string

    protected $fillable = [
        'nama_produk',
        'harga',
        'kategori',
    ];

    public function detailTransaksi()
    {
        return $this->hasMany(DetailTransaksi::class, 'id_produk', 'id_produk');
    }
}