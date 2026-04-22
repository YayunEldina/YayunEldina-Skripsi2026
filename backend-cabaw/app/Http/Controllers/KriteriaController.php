<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KriteriaController extends Controller
{
    // 1. Ambil Semua Data Kriteria
    public function index()
    {
        $data = Kriteria::all();
        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    // 2. Tambah Kriteria Baru
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode_kriteria' => 'required|unique:kriterias,kode_kriteria',
            'nama_kriteria' => 'required',
            'bobot'         => 'required|numeric',
            'bobot_fuzzy'   => 'required', // Contoh format: (0.25, 0.50, 0.75)
            'atribut'       => 'required|in:Benefit,Cost'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $kriteria = Kriteria::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kriteria berhasil ditambahkan!',
            'data'    => $kriteria
        ], 201);
    }

    // 3. Update Kriteria (Edit)
    public function update(Request $request, $id)
{
    // Cari berdasarkan primary key id_kriteria
    $kriteria = Kriteria::where('id_kriteria', $id)->first();

    if (!$kriteria) {
        return response()->json(['message' => 'Kriteria tidak ditemukan'], 404);
    }

    $validator = Validator::make($request->all(), [
        'kode_kriteria' => 'required|unique:kriterias,kode_kriteria,' . $id . ',id_kriteria',
        'nama_kriteria' => 'required',
        'bobot'         => 'required|numeric',
        'bobot_fuzzy'   => 'required',
        'atribut'       => 'required|in:Benefit,Cost'
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $kriteria->update($request->all());

    return response()->json([
        'success' => true,
        'message' => 'Kriteria berhasil diperbarui!',
        'data'    => $kriteria
    ], 200);
}

    // 4. Hapus Kriteria (Opsional, gunakan dengan hati-hati)
    public function destroy($id)
    {
        $kriteria = Kriteria::find($id);
        if ($kriteria) {
            $kriteria->delete();
            return response()->json(['message' => 'Kriteria berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}