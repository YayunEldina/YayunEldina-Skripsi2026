<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admin';
    protected $primaryKey = 'id_admin';

    protected $fillable = [
        'nama_admin',
        'username',
        'jenis_kelamin',
        'password',
        'no_telepon',
        'alamat',
        'foto_profil',
    ];

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'id_admin', 'id_admin');
    }
}