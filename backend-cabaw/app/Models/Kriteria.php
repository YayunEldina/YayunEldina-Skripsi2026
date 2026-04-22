<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    use HasFactory;

    // Pastikan mengarah ke tabel dengan akhiran 's'
    protected $table = 'kriterias'; 
    protected $primaryKey = 'id_kriteria';

    protected $fillable = [
        'kode_kriteria',
        'nama_kriteria',
        'bobot',
        'bobot_fuzzy',
        'atribut'
    ];
}