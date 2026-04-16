<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailTransaksi extends Model
{
    protected $table = 'detail_transaksi';
    protected $primaryKey = 'id_detail';
    protected $keyType = 'string'; 
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'jumlah',
        'sub_total',
        'id_produk',
        'id_transaksi'
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }

    // PENTING: Relasi untuk mengambil nama_produk dan harga
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'id_produk', 'id_produk');
    }
}