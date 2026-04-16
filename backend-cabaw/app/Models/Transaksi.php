<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';
    protected $keyType = 'string'; 
    public $incrementing = false;  
    public $timestamps = true;

    protected $fillable = [
        'tanggal',
        'total_pembelian', 
        'total_harga',
        'tempat_transaksi',
        'pedagang',        
        'id_pelanggan'
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    public function detailTransaksi()
    {
        // Menghubungkan ke tabel detail_transaksi
        return $this->hasMany(DetailTransaksi::class, 'id_transaksi', 'id_transaksi');
    }
}