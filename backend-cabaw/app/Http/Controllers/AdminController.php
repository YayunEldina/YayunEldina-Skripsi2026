<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function update(Request $request, $id)
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'message' => 'Data admin tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_admin'    => 'required|string|max:255',
            'username'      => 'required|string|max:255|unique:admin,username,' . $id . ',id_admin',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'no_telepon'    => 'nullable|string|max:15',
            'alamat'        => 'nullable|string',
            'old_password'  => 'nullable|string',
            'password'      => 'nullable|string|min:6',
            'foto_profil'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first()
            ], 422);
        }

        // Logika Kata Sandi
        if ($request->filled('password')) {
            if (!$request->filled('old_password')) {
                return response()->json([
                    'message' => 'Kata sandi lama wajib diisi untuk mengganti kata sandi baru.'
                ], 422);
            }

            if (!Hash::check($request->old_password, $admin->password)) {
                return response()->json([
                    'message' => 'Kata sandi lama Anda salah.'
                ], 400);
            }

            $admin->password = Hash::make($request->password);
        }

        // Logika Unggah Foto Profil Admin
        if ($request->hasFile('foto_profil')) {
            if ($admin->foto_profil && Storage::disk('public')->exists($admin->foto_profil)) {
                Storage::disk('public')->delete($admin->foto_profil);
            }

            $file = $request->file('foto_profil');
            $path = $file->store('admin_avatar', 'public');
            $admin->foto_profil = $path;
        }

        // Update data informasi profil lainnya
        $admin->nama_admin    = $request->nama_admin;
        $admin->username      = $request->username;
        $admin->jenis_kelamin = $request->jenis_kelamin;
        $admin->no_telepon    = $request->no_telepon;
        $admin->alamat        = $request->alamat;
        
        $admin->save();

        return response()->json([
            'message' => 'Profil admin berhasil diperbarui.',
            'user'    => $admin
        ], 200);
    }
}