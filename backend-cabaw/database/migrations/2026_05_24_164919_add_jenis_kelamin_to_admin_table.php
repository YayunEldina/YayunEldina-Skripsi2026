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
            // Menambahkan kolom jenis_kelamin bertipe enum (Laki-laki / Perempuan) 
            // Diletakkan persis di sebelah kiri (sebelum) kolom no_telepon
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable()->after('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin', function (Blueprint $table) {
            $table->dropColumn('jenis_kelamin');
        });
    }
};