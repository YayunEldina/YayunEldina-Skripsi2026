<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenilaianKriteria extends Model
{
    protected $table = 'penilaian_kriteria'; 
    protected $primaryKey = 'id_penilaian';
    
    protected $fillable = [
        'id_alternatif',
        'id_kriteria',
        'nilai_mentah'
    ];

    // Relasi ke Alternatif (Pelanggan)
    public function alternatif() {
        return $this->belongsTo(Alternatif::class, 'id_alternatif');
    }

    // Relasi ke Kriteria
    public function kriteria() {
        return $this->belongsTo(Kriteria::class, 'id_kriteria');
    }
}