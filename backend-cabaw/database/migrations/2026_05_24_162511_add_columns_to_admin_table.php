<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('admin', function (Blueprint $table) {
            // Menambahkan kolom baru secara aman termasuk foto_profil
            $table->string('no_telepon', 15)->nullable()->after('password');
            $table->text('alamat')->nullable()->after('no_telepon');
            $table->string('foto_profil', 255)->nullable()->after('alamat'); // 🌟 Tambahkan ini untuk foto profil admin
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin', function (Blueprint $table) {
            // Logika untuk menghapus kolom jika migration di-rollback
            $table->dropColumn(['no_telepon', 'alamat', 'foto_profil']);
        });
    }
};