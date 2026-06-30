<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';
    // HAPUS incrementing false dan keyType string

    protected $fillable = [
        'id_admin',
        'tanggal',
        'total_pembelian', 
        'total_harga',
        'tempat_transaksi',
        'pedagang',        
        'id_pelanggan',
        'harga_per_pcs',
        'diskon',
        'is_pelanggan_baru'
    ];

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan', 'id_pelanggan');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }

    public function detailTransaksi()
    {
        return $this->hasMany(DetailTransaksi::class, 'id_transaksi', 'id_transaksi');
    }
}