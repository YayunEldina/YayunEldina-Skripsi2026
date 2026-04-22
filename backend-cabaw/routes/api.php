<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\AlternatifController;
use App\Http\Controllers\PerhitunganController;
use App\Http\Controllers\TransaksiController;

// Auth & Import
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup-admin', [AuthController::class, 'signupAdmin']);
Route::post('/import-semua', [ImportController::class, 'importSemua']);

// Alternatif
Route::get('/alternatifs', [AlternatifController::class, 'index']);

// Transaksi
Route::get('/transaksi', [TransaksiController::class, 'index']);
Route::post('/transaksi', [TransaksiController::class, 'store']);
Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);
Route::put('/transaksi/{id}', [TransaksiController::class, 'update']);
Route::delete('/transaksi/{id}', [TransaksiController::class, 'destroy']);

// Kriteria (Sudah disatukan)
Route::get('/kriteria', [KriteriaController::class, 'index']);
Route::post('/kriteria', [KriteriaController::class, 'store']);
Route::put('/kriteria/{id}', [KriteriaController::class, 'update']);
Route::delete('/kriteria/{id}', [KriteriaController::class, 'destroy']);

// Perhitungan & Sinkronisasi
Route::get('/proses-perhitungan', [PerhitunganController::class, 'hitungFuzzyTopsis']);
Route::post('/perhitungan/sinkronisasi', [PerhitunganController::class, 'sinkronisasiData']);