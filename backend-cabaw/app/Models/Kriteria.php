<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'kriterias';
    protected $primaryKey = 'id_kriteria'; // Sesuai migration baru

    protected $fillable = [
        'kode_kriteria', 
        'nama_kriteria', 
        'bobot', 
        'bobot_fuzzy', 
        'atribut'
    ];
}