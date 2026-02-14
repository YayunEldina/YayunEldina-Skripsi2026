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
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->id('id_detail');
            $table->integer('jumlah');
            $table->decimal('sub_total', 12, 2);
            $table->unsignedBigInteger('id_produk');
            $table->unsignedBigInteger('id_transaksi');
    
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
