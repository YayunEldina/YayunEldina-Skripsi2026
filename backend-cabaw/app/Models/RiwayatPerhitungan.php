<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatPerhitungan extends Model
{
    protected $table = 'riwayat_perhitungan';

    protected $fillable = [
        'tahun',
        'bulan',
        'matriks_fuzzy',
        'matriks_r',
        'hasil_akhir'
    ];
}