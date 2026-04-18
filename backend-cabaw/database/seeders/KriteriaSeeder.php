<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class KriteriaSeeder extends Seeder
{
    public function run()
    {
        // Nonaktifkan constraint foreign key agar truncate lancar
        Schema::disableForeignKeyConstraints();
        DB::table('kriterias')->truncate();

        DB::table('kriterias')->insert([
            [
                'kode_kriteria' => 'C1', 
                'nama_kriteria' => 'Total Pembelian', 
                'bobot' => 5, 
                'bobot_fuzzy' => '(0.75, 1.00, 1.00)', 
                'atribut' => 'Benefit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kode_kriteria' => 'C2', 
                'nama_kriteria' => 'Total Pendapatan', 
                'bobot' => 4, 
                'bobot_fuzzy' => '(0.50, 0.75, 1.00)', 
                'atribut' => 'Benefit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kode_kriteria' => 'C3', 
                'nama_kriteria' => 'Frekuensi Transaksi', 
                'bobot' => 4, 
                'bobot_fuzzy' => '(0.50, 0.75, 1.00)', 
                'atribut' => 'Benefit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'kode_kriteria' => 'C4', 
                'nama_kriteria' => 'Variabilitas Pembelian', 
                'bobot' => 3, 
                'bobot_fuzzy' => '(0.25, 0.50, 0.75)', 
                'atribut' => 'Cost',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);

        Schema::enableForeignKeyConstraints();
    }
}