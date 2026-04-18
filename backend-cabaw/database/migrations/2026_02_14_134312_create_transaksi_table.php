<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('transaksi', function (Blueprint $table) {
        $table->id('id_transaksi'); // Berubah ke Auto Increment
        $table->date('tanggal');
        $table->integer('total_pembelian')->default(0);
        $table->decimal('total_harga', 12, 2)->default(0);
        $table->string('tempat_transaksi', 100);
        $table->string('pedagang', 100);

        // Relasi menggunakan foreignId (wajib untuk menyambungkan ke id Auto Increment)
        $table->foreignId('id_pelanggan')->constrained('pelanggan', 'id_pelanggan')->onDelete('cascade');

        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};