<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use Illuminate\Http\Request;

class AlternatifController extends Controller
{
    /**
     * Menampilkan daftar alternatif dengan urutan alami (A1, A2, ... A10)
     */
    public function index()
    {
        // Mengurutkan berdasarkan panjang string (LENGTH), baru kemudian kodenya (ASC)
        $alternatif = Alternatif::orderByRaw('LENGTH(kode_alternatif) ASC')
                                ->orderBy('kode_alternatif', 'ASC')
                                ->get();

        return response()->json($alternatif, 200);
    }
}