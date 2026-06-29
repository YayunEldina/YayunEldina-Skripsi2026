<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_perhitungan', function (Blueprint $table) {
            $table->id();

            $table->year('tahun');
            $table->unsignedTinyInteger('bulan')->nullable();

            $table->longText('matriks_fuzzy');
            $table->longText('matriks_r');
            $table->longText('hasil_akhir');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_perhitungan');
    }
};