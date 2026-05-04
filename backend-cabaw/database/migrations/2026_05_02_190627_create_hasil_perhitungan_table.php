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
        Schema::create('hasil_perhitungan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('pedagang')->nullable();
            $table->double('nilai_v')->nullable(); // ✅ lebih akurat
            $table->integer('ranking')->nullable();
            $table->integer('diskon')->default(0);
            $table->string('prioritas')->nullable();
            $table->year('tahun');
            $table->timestamps();
        
            // 🚀 Performance & konsistensi
            $table->index(['nama', 'pedagang', 'tahun']);
            $table->unique(['nama', 'pedagang', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_perhitungan');
    }
};
