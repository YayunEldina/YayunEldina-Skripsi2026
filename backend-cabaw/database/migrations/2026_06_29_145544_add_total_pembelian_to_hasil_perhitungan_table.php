<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hasil_perhitungan', function (Blueprint $table) {
            $table->bigInteger('total_pembelian')->default(0)->after('pedagang');
        });
    }

    public function down(): void
    {
        Schema::table('hasil_perhitungan', function (Blueprint $table) {
            $table->dropColumn('total_pembelian');
        });
    }
};