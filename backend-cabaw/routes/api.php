<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\AlternatifController;
use App\Http\Controllers\PerhitunganController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\AdminController; 

// Auth & Import
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup-admin', [AuthController::class, 'signupAdmin']);
Route::post('/import-semua', [ImportController::class, 'importSemua']);

// Alternatif
Route::get('/alternatifs', [AlternatifController::class, 'index']);
Route::get('/alternatif/list', [AlternatifController::class, 'getListDropdown']);

// Transaksi
Route::get('/transaksi', [TransaksiController::class, 'index']);
Route::post('/transaksi', [TransaksiController::class, 'store']);
Route::get('/transaksi/cek-bulan', [TransaksiController::class, 'cekBulan']);
Route::get('/transaksi/cek-kuota', [TransaksiController::class, 'cekKuotaDiskon']);
Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);
Route::put('/transaksi/{id}', [TransaksiController::class, 'update']);
Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy']);

Route::get('/omset-tahunan', [TransaksiController::class, 'omsetTahunan']);
// Kriteria (Sudah disatukan)
Route::get('/kriteria', [KriteriaController::class, 'index']);
Route::post('/kriteria', [KriteriaController::class, 'store']);
Route::put('/kriteria/{id}', [KriteriaController::class, 'update']);
Route::delete('/kriteria/{id}', [KriteriaController::class, 'destroy']);

// Perhitungan & Sinkronisasi
Route::get('/proses-perhitungan', [PerhitunganController::class, 'hitungFuzzyTopsis']);
Route::post('/perhitungan/sinkronisasi', [PerhitunganController::class, 'sinkronisasiData']);

// Diskon
// 🛒 FIX: Menangani pencarian data tahun dan bulan (termasuk IS NULL) secara murni & dinamis
Route::get('/hasil-perhitungan', function (Request $request) {
    $tahun = $request->query('tahun', date('Y'));
    $bulan = $request->query('bulan');

    $query = DB::table('hasil_perhitungan')->where('tahun', $tahun);

    // Jika parameter bulan bernilai 'null' (string), kosong '', atau tidak diisi, cari yang IS NULL di DB
    if (!$request->has('bulan') || $bulan === 'null' || $bulan === '') {
        $query->whereNull('bulan');
    } else {
        $query->where('bulan', $bulan);
    }

    return $query->orderBy('ranking', 'asc')->get();
});
Route::get('/laporan-diskon', [TransaksiController::class, 'laporanDiskon']);
Route::match(['POST', 'PUT'], '/pelanggan/{id}', [AuthController::class, 'updateProfile']);
Route::put('/admin/{id}', [AdminController::class, 'update']);
Route::get('/dashboard-summary', function () {
    return response()->json([
        'total_pelanggan' => DB::table('alternatifs')->count(),
        'total_kriteria'  => DB::table('kriterias')->count(),
        'total_transaksi' => DB::table('transaksi')->count(),
    ]);
});