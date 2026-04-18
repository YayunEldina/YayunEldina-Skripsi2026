<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id('id_produk'); // Berubah ke Auto Increment
            $table->string('nama_produk', 100);
            $table->integer('harga');
            $table->string('kategori', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
