<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('alternatifs', function (Blueprint $table) {
        // Kita gunakan id() agar konsisten dengan tabel lainnya
        $table->id('id_alternatif'); 
        $table->string('kode_alternatif', 10)->unique(); // Kode tetap ada tapi bukan Primary Key utama
        $table->string('nama_alternatif', 100);
        $table->string('pedagang', 100);

        // BAGIAN PENTING: Menghubungkan ke ID Pelanggan yang baru (Integer)
        $table->foreignId('id_pelanggan')->constrained('pelanggan', 'id_pelanggan')->onDelete('cascade');
        
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('alternatifs');
    }
};