<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pelanggan', function (Blueprint $table) {
            // Menambahkan kolom foto_profil setelah kolom no_telepon dan tipenya boleh kosong (nullable)
            $table->string('foto_profil', 255)->nullable()->after('no_telepon');
        });
    }

    public function down(): void
    {
        Schema::table('pelanggan', function (Blueprint $table) {
            $table->dropColumn('foto_profil');
        });
    }
};