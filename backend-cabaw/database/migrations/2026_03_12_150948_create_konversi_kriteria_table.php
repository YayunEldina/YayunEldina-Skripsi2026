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
        Schema::create('konversi_kriteria', function (Blueprint $table) {
            $table->id('id_konversi');
            $table->string('id_pelanggan', 10);
            $table->string('kode_kriteria', 10);
            $table->double('nilai_fuzzy_a'); // Lower
            $table->double('nilai_fuzzy_b'); // Middle
            $table->double('nilai_fuzzy_c'); // Upper
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('konversi_kriteria');
    }
};
