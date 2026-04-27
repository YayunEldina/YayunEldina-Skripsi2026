<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Pelanggan;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // =========================
    // 1. SIGNUP ADMIN
    // =========================
    public function signupAdmin(Request $request)
    {
        $request->validate([
            'nama_admin' => 'required|string|max:100',
            'username'   => 'required|string|unique:admin,username|max:50',
            'password'   => 'required|string|min:6'
        ]);

        $admin = Admin::create([
            'nama_admin' => $request->nama_admin,
            'username'   => $request->username,
            'password'   => Hash::make($request->password), 
        ]);

        return response()->json([
            'message' => 'Signup Admin berhasil',
            'data'    => $admin
        ], 201);
    }

    // =========================
    // 2. LOGIN (ADMIN & PELANGGAN)
    // =========================
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);
    
        // Cari user
        $user = Admin::where('username', $request->username)->first();
        $role = 'admin';
    
        if (!$user) {
            $user = Pelanggan::where('username', $request->username)->first();
            $role = 'pelanggan';
        }
    
        // dummy hash (tidak perlu Hash::make terus)
        $hashedPassword = $user 
    ? $user->password 
    : Hash::make('dummy123');
    
        $usernameError = !$user;
        $passwordError = !Hash::check($request->password, $hashedPassword);
    
        // HANDLE ERROR
        if ($usernameError && $passwordError) {
            return response()->json([
                'field' => 'both',
                'message' => 'Nama pengguna dan kata sandi salah'
            ], 401);
        }
    
        if ($usernameError) {
            return response()->json([
                'field' => 'username',
                'message' => 'Nama pengguna tidak ditemukan'
            ], 404);
        }
    
        if ($passwordError) {
            return response()->json([
                'field' => 'password',
                'message' => 'Kata sandi salah'
            ], 401);
        }
    
        // LOGIN BERHASIL
        return response()->json([
            'message' => 'Login berhasil',
            'role'    => $role,
            'user'    => $user
        ], 200);
    }
}