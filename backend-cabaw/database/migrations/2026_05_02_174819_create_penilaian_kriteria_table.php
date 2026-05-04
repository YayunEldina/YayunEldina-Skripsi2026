<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penilaian_kriteria', function (Blueprint $table) {
            $table->id('id_penilaian');

            $table->unsignedBigInteger('id_alternatif');
            $table->unsignedBigInteger('id_kriteria');

            $table->double('nilai_mentah')->default(0);

            $table->timestamps();

            // Foreign Key
            $table->foreign('id_alternatif')
                ->references('id_alternatif')
                ->on('alternatifs')
                ->onDelete('cascade');

            $table->foreign('id_kriteria')
                ->references('id_kriteria')
                ->on('kriterias')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_kriteria');
    }
};