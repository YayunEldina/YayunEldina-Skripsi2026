<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admin';
    protected $primaryKey = 'id_admin';
    public $incrementing = false; // Karena id_admin bukan auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'id_admin',
        'nama_admin',
        'username',
        'password'
    ];
}