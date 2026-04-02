<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'kriterias';
    protected $primaryKey = 'kode_kriteria';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_kriteria', 
        'nama_kriteria', 
        'bobot', 
        'bobot_fuzzy', 
        'atribut'
    ];
}