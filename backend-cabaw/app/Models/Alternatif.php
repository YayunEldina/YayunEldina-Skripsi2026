<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alternatif extends Model
{
    protected $table = 'alternatifs';
    protected $primaryKey = 'kode_alternatif'; // Karena primary key kita bukan 'id'
    public $incrementing = false;             // Non-aktifkan auto-increment
    protected $keyType = 'string';            // Tipe data ID adalah string
    
    protected $fillable = ['kode_alternatif', 'nama_alternatif', 'id_pelanggan'];
}