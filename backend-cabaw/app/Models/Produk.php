<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    public $timestamps = true;

    protected $fillable = [
        'nama_produk',
        'harga',
        'kategori',
        'stok'
    ];

    // Relasi ke DetailTransaksi
    public function detailTransaksi()
    {
        return $this->hasMany(DetailTransaksi::class, 'id_produk');
    }
}