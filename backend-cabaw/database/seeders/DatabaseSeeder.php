<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Panggil seeder secara berurutan
        $this->call([
            ProdukSeeder::class,   // Mengisi PR01 - PR10
            KriteriaSeeder::class, // Mengisi kriteria SPK
        ]);
    }
}