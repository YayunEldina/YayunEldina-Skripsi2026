<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('pelanggan', function (Blueprint $table) {
        $table->id('id_pelanggan'); // Berubah ke Auto Increment
        $table->string('nama_pelanggan', 100);
        $table->string('username', 50)->unique()->nullable(); // Nullable jika pelanggan daftar lewat kasir
        $table->string('password', 255)->nullable();
        $table->string('jenis_kelamin', 50);
        $table->string('alamat', 100)->nullable();
        $table->string('no_telepon', 15)->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('pelanggan');
    }
};
