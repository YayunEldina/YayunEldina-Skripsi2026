<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Pelanggan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // 1. SIGNUP KHUSUS ADMIN
    public function signupAdmin(Request $request)
    {
        $request->validate([
            'nama_admin' => 'required|string|max:100',
            'username'   => 'required|string|unique:admin,username|max:50',
            'password'   => 'required|string|min:6'
        ]);

        // Generate ID Admin otomatis (Contoh: AD00001)
        $last = Admin::orderBy('id_admin', 'desc')->first();
        $number = $last ? ((int) substr($last->id_admin, 2)) + 1 : 1;
        $idAdmin = 'AD' . str_pad($number, 5, '0', STR_PAD_LEFT);

        $admin = Admin::create([
            'id_admin'   => $idAdmin,
            'nama_admin' => $request->nama_admin,
            'username'   => $request->username,
            'password'   => Hash::make($request->password), // Enkripsi password
        ]);

        return response()->json([
            'message' => 'Signup Admin berhasil',
            'data'    => $admin
        ], 201);
    }

    // 2. LOGIN UNTUK ADMIN DAN PELANGGAN
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // Cek di tabel Admin dahulu
        $user = Admin::where('username', $request->username)->first();
        $role = 'admin';

        // Jika tidak ada di Admin, cek di tabel Pelanggan
        if (!$user) {
            $user = Pelanggan::where('username', $request->username)->first();
            $role = 'pelanggan';
        }

        // Jika user tidak ditemukan di kedua tabel
        if (!$user) {
            return response()->json(['message' => 'Username tidak ditemukan'], 404);
        }

        // Cek Password (menggunakan Hash::check karena password di DB terenkripsi)
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password salah'], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'role'    => $role,
            'user'    => $user
        ], 200);
    }
}