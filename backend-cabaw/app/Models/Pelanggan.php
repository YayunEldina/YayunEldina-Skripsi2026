<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'pelanggan';
    protected $primaryKey = 'id_pelanggan'; // Sesuai kolom di DB
    public $incrementing = false;           // Penting: agar tidak dianggap auto-increment
    protected $keyType = 'string';          // Penting: karena ID berupa string
    protected $fillable = ['id_pelanggan', 'nama_pelanggan', 'username', 'password', 'jenis_kelamin', 'alamat', 'no_telepon'];
}