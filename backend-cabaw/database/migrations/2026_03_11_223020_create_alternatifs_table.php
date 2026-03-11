<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alternatifs', function (Blueprint $table) {
            // Gunakan string 10 karakter sebagai Primary Key
            $table->string('kode_alternatif', 10)->primary();
            $table->string('nama_alternatif', 100);
            
            // Kolom id_pelanggan sebagai Foreign Key
            $table->string('id_pelanggan', 10);
            
            // Menambahkan relasi ke tabel pelanggan
            $table->foreign('id_pelanggan')
                  ->references('id_pelanggan')
                  ->on('pelanggan')
                  ->onDelete('cascade'); // Hapus alternatif jika pelanggan dihapus
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alternatifs');
    }
};