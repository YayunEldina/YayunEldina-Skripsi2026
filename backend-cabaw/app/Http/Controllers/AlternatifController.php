<?php

namespace App\Http\Controllers;

use App\Models\Alternatif;
use Illuminate\Http\Request;

class AlternatifController extends Controller
{
    /**
     * Menampilkan daftar alternatif dengan Pagination dan Pencarian
     */
    public function index(Request $request)
    {
        // 1. Ambil query pencarian jika ada
        $search = $request->query('search');

        $query = Alternatif::query();

        // 2. Logika Pencarian (Search by Nama atau Kode)
        if ($search) {
            $query->where('nama_alternatif', 'LIKE', "%{$search}%")
                  ->orWhere('kode_alternatif', 'LIKE', "%{$search}%");
        }

        // 3. Urutan Alami (A1, A2, A10...)
        // Kita urutkan berdasarkan panjang karakter dulu, baru abjadnya
        $alternatif = $query->orderByRaw('LENGTH(kode_alternatif) ASC')
                            ->orderBy('kode_alternatif', 'ASC')
                            ->paginate(10); // Menampilkan 10 data per halaman

        return response()->json($alternatif, 200);
    }

    /**
     * Optional: Jika kamu butuh data tanpa pagination untuk perhitungan (tapi hati-hati RAM)
     */
    public function getAllForCalculation()
    {
        $alternatif = Alternatif::orderByRaw('LENGTH(kode_alternatif) ASC')
                                ->orderBy('kode_alternatif', 'ASC')
                                ->get();
        return response()->json($alternatif, 200);
    }
}