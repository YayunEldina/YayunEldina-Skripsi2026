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
        Schema::create('hasil_spk', function (Blueprint $table) {
            $table->id('id_hasil');
            $table->string('id_pelanggan', 10);
            $table->double('nilai_preferensi_vi'); // Nilai akhir Vi
            $table->string('prioritas', 20);       // Tinggi/Sedang/Rendah
            $table->string('diskon', 10);          // 15%, 10%, dll
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_spk');
    }
};
