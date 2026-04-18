<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('kriterias', function (Blueprint $table) {
            $table->id('id_kriteria'); // Auto Increment ID
            $table->string('kode_kriteria', 10)->unique(); // Contoh: C1, C2
            $table->string('nama_kriteria', 100);
            $table->integer('bobot');
            $table->string('bobot_fuzzy', 50); 
            $table->string('atribut', 10); 
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kriterias');
    }
};
