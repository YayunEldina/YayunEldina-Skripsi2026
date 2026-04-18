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
        // 1. Ambil query pencarian
        $search = $request->query('search');

        // Gunakan with('pelanggan') jika di model Alternatif sudah ada relasi
        // Ini membantu jika kamu ingin menampilkan Nama Pelanggan asli di UI
        $query = Alternatif::query();

        // 2. Logika Pencarian
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nama_alternatif', 'LIKE', "%{$search}%")
                  ->orWhere('kode_alternatif', 'LIKE', "%{$search}%")
                  ->orWhere('pedagang', 'LIKE', "%{$search}%");
            });
        }

        // 3. Pengurutan
        // Karena id_alternatif sekarang angka, kita bisa urutkan berdasarkan ID
        // atau tetap menggunakan logika panjang karakter untuk Kode (A1, A2, dst)
        $alternatif = $query->orderByRaw('LENGTH(kode_alternatif) ASC')
                            ->orderBy('kode_alternatif', 'ASC')
                            ->paginate(15); // Ubah ke 15 agar lebih enak dilihat

        return response()->json($alternatif, 200);
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
}