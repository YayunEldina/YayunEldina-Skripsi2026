<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlternatifController extends Controller
{
    /**
     * Menampilkan daftar alternatif dengan Pagination dan Pencarian
     */
    public function index(Request $request)
{
    $search = $request->query('search');

    $query = Alternatif::select(
        'id_alternatif',
        'kode_alternatif',
        'nama_alternatif',
        'pedagang'
    );

    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('nama_alternatif', 'LIKE', "%{$search}%")
              ->orWhere('kode_alternatif', 'LIKE', "%{$search}%")
              ->orWhere('pedagang', 'LIKE', "%{$search}%");
        });
    }

    $alternatif = $query
        ->orderBy('id_alternatif', 'ASC')
        ->paginate(15);

    return response()->json($alternatif);
}
    /**
     * Menampilkan data tanpa pagination (khusus untuk dropdown atau script kecil)
     * Untuk perhitungan SPK, disarankan ambil langsung di PerhitunganController 
     * seperti yang kita buat tadi agar lebih efisien memori.
     */
    public function getAllForCalculation()
    {
        // Membatasi kolom yang diambil agar hemat RAM
        $alternatif = Alternatif::select('id_alternatif', 'kode_alternatif', 'nama_alternatif', 'id_pelanggan')
                                ->orderByRaw('LENGTH(kode_alternatif) ASC')
                                ->orderBy('kode_alternatif', 'ASC')
                                ->get();

        return response()->json($alternatif, 200);
    }

    public function getListDropdown()
{
    $data = Alternatif::select(
        'id_alternatif',
        'id_pelanggan', // TAMBAHKAN INI
        'nama_alternatif',
        DB::raw('LOWER(TRIM(pedagang)) as pedagang')
    )
    ->orderBy('nama_alternatif')
    ->get();

    return response()->json($data);
}
}