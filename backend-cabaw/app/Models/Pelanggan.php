<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'pelanggan';
    protected $primaryKey = 'id_pelanggan';
    public $timestamps = true;

    protected $fillable = [
        'nama_pelanggan',
        'username',
        'password',
        'jenis_kelamin',
        'alamat',
        'no_telepon'
    ];

    // Relasi ke Transaksi
    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'id_pelanggan');
    }
}