<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'pelanggan';
    protected $primaryKey = 'id_pelanggan';
    // HAPUS incrementing false dan keyType string

    protected $fillable = [
        'nama_pelanggan', 
        'username', 
        'password', 
        'jenis_kelamin', 
        'alamat', 
        'no_telepon'
    ];
}