<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Pelanggan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; // 💡 TAMBAHKAN INI UNTUK PENGELOLAAN FILE FOTO

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

    // ==========================================
    // 3. UPDATE PROFILE PELANGGAN (FITUR BARU)
    // ==========================================
    public function updateProfile(Request $request, $id)
    {
        // Cari pelanggan berdasarkan primary key 'id_pelanggan'
        $pelanggan = Pelanggan::find($id);

        if (!$pelanggan) {
            return response()->json([
                'message' => 'Data pelanggan tidak ditemukan'
            ], 404);
        }

        // Validasi input - Sesuaikan dengan kolom 'username' (bukan user_name)
        $request->validate([
            'nama_pelanggan' => 'required|string|max:100',
            'username'       => 'required|string|max:50|unique:pelanggan,username,' . $id . ',id_pelanggan',
            'jenis_kelamin'  => 'required|in:Laki-laki,Perempuan',
            'no_telepon'     => 'nullable|string|max:20',
            'alamat'         => 'nullable|string',
            'foto_profil'    => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // Proses ganti file foto profil jika ada unggahan baru
        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama di folder jika ada agar penyimpanan local tidak penuh
            if ($pelanggan->foto_profil && Storage::disk('public')->exists($pelanggan->foto_profil)) {
                Storage::disk('public')->delete($pelanggan->foto_profil);
            }

            // Simpan foto baru ke folder public/avatars
            $path = $request->file('foto_profil')->store('avatars', 'public');
            $pelanggan->foto_profil = $path;
        }

        // Simpan data perubahan ke database
        $pelanggan->nama_pelanggan = $request->nama_pelanggan;
        $pelanggan->username       = $request->username; // Menyesuaikan field asli tabel
        $pelanggan->jenis_kelamin  = $request->jenis_kelamin;
        $pelanggan->no_telepon     = $request->no_telepon;
        $pelanggan->alamat         = $request->alamat;

        // Update password jika user mengetikkan password baru
        if ($request->filled('password')) {
            $pelanggan->password = Hash::make($request->password);
        }

        $pelanggan->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui!',
            'foto_profil' => $pelanggan->foto_profil,
            'user' => $pelanggan
        ], 200);
    }
}