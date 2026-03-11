<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->string('id_detail', 10)->primary();

            $table->integer('jumlah');
            $table->decimal('sub_total', 12, 2);

            $table->string('id_produk', 10);
            $table->string('id_transaksi', 10);
            
            $table->foreign('id_produk')
                  ->references('id_produk')
                  ->on('produk')
                  ->onDelete('cascade');

            $table->foreign('id_transaksi')
                  ->references('id_transaksi')
                  ->on('transaksi')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};