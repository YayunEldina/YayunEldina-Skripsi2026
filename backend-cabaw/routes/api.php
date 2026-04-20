<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\AlternatifController;
use App\Http\Controllers\PerhitunganController;
use App\Http\Controllers\TransaksiController;

// Route untuk Login (Admin & Pelanggan)
Route::post('/login', [AuthController::class, 'login']);
// Route untuk Signup Admin
Route::post('/signup-admin', [AuthController::class, 'signupAdmin']);
Route::post('/import-semua', [ImportController::class, 'importSemua']);
Route::get('/kriterias', [KriteriaController::class, 'index']);
Route::get('/alternatifs', [AlternatifController::class, 'index']);
Route::get('/proses-perhitungan', [PerhitunganController::class, 'hitungFuzzyTopsis']);
Route::get('/transaksi', [TransaksiController::class, 'index']);
Route::post('/transaksi', [TransaksiController::class, 'store']);
Route::get('/transaksi/{id}', [TransaksiController::class, 'show']); // Tambahkan ini
Route::put('/transaksi/{id}', [TransaksiController::class, 'update']); // Untuk update nanti
Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy']);

