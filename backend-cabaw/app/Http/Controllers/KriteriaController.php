<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;

class KriteriaController extends Controller
{
    public function index()
    {
        // Mengambil C1, C2, C3, C4 dari database
        return response()->json(Kriteria::all());
    }
}