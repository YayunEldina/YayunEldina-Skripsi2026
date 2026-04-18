<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->id('id_detail'); // Berubah ke Auto Increment
            $table->integer('jumlah');
            $table->decimal('sub_total', 12, 2);
    
            // Relasi menggunakan foreignId
            $table->foreignId('id_produk')->constrained('produk', 'id_produk')->onDelete('cascade');
            $table->foreignId('id_transaksi')->constrained('transaksi', 'id_transaksi')->onDelete('cascade');
    
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};