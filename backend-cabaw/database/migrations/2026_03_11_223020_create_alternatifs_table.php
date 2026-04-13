<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alternatifs', function (Blueprint $table) {
            $table->string('kode_alternatif', 10)->primary();
            $table->string('nama_alternatif', 100);
            $table->string('pedagang', 100); // <-- Tambahkan di sini

            $table->string('id_pelanggan', 10);
            
            $table->foreign('id_pelanggan')
                  ->references('id_pelanggan')
                  ->on('pelanggan')
                  ->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alternatifs');
    }
};