<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'id_produk';
    protected $keyType = 'string'; // PENTING: ID Anda string (PR01)
    public $incrementing = false;  // PENTING: Bukan auto-increment angka
    public $timestamps = true;

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