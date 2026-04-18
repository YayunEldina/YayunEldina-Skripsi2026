<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable // Gunakan Authenticatable agar bisa login
{
    protected $table = 'admin';
    protected $primaryKey = 'id_admin';
    // HAPUS incrementing false dan keyType string
    
    protected $fillable = [
        'nama_admin',
        'username',
        'password'
    ];
}