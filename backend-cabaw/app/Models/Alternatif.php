<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alternatif extends Model
{
    protected $table = 'alternatifs';
    protected $primaryKey = 'id_alternatif'; // Sesuai migration baru
    
    protected $fillable = [
        'kode_alternatif', 
        'nama_alternatif', 
        'pedagang',
        'id_pelanggan'
    ];
}