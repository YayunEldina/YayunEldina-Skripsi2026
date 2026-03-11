<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImportController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/import-semua', [ImportController::class, 'importSemua']);
