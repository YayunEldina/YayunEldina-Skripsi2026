<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportController;

// Rute untuk halaman utama (welcome)
Route::get('/', function () {
    return view('welcome');
});

// Rute untuk menampilkan halaman upload data
Route::get('/upload-data', function () {
    return view('upload_data'); 
});

// Rute untuk memproses import (POST)
Route::post('/import-semua', [ImportController::class, 'importSemua'])->name('import.semua');