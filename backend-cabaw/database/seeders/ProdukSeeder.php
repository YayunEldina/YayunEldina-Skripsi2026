<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProdukSeeder extends Seeder
{
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('produk')->truncate();

        // Hapus 'id_produk' dari array, biarkan database mengisinya otomatis
        DB::table('produk')->insert([
            ['nama_produk' => 'Uyel Putih', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Uyel Kuning', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Kotak', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Ikan', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Pedas', 'harga' => 2500, 'kategori' => 'Pedas'],
            ['nama_produk' => 'Saleho', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Gorok', 'harga' => 2500, 'kategori' => 'Manis'],
            ['nama_produk' => 'Keong', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Jari', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['nama_produk' => 'Padi', 'harga' => 2500, 'kategori' => 'Gurih'],
        ]);

        Schema::enableForeignKeyConstraints();
    }
}