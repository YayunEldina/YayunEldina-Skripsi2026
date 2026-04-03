<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\AlternatifController;
use App\Http\Controllers\PerhitunganController;

// Route untuk Login (Admin & Pelanggan)
Route::post('/login', [AuthController::class, 'login']);
// Route untuk Signup Admin
Route::post('/signup-admin', [AuthController::class, 'signupAdmin']);
Route::post('/import-semua', [ImportController::class, 'importSemua']);
Route::get('/kriterias', [KriteriaController::class, 'index']);
Route::get('/alternatifs', [AlternatifController::class, 'index']);
Route::get('/proses-perhitungan', [PerhitunganController::class, 'hitungFuzzyTopsis']);

