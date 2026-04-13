<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->string('id_transaksi', 10)->primary();
            $table->date('tanggal');
            $table->integer('total_pembelian')->default(0);
            $table->decimal('total_harga', 12, 2)->default(0);

            $table->string('tempat_transaksi', 100);
            $table->string('pedagang', 100); // <-- Kolom baru untuk data Pedagang (Excel Kolom V)

            $table->string('id_pelanggan', 10);
            $table->foreign('id_pelanggan')
                  ->references('id_pelanggan')
                  ->on('pelanggan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};