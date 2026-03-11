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

        DB::table('produk')->insert([
            ['id_produk' => 'PR01', 'nama_produk' => 'Uyel Putih', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR02', 'nama_produk' => 'Uyel Kuning', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR03', 'nama_produk' => 'Kotak', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR04', 'nama_produk' => 'Ikan', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR05', 'nama_produk' => 'Pedas', 'harga' => 2500, 'kategori' => 'Pedas'],
            ['id_produk' => 'PR06', 'nama_produk' => 'Saleho', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR07', 'nama_produk' => 'Gorok', 'harga' => 2500, 'kategori' => 'Manis'],
            ['id_produk' => 'PR08', 'nama_produk' => 'Keong', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR09', 'nama_produk' => 'Jari', 'harga' => 2500, 'kategori' => 'Gurih'],
            ['id_produk' => 'PR10', 'nama_produk' => 'Padi', 'harga' => 2500, 'kategori' => 'Gurih'],
        ]);

        Schema::enableForeignKeyConstraints();
    }
}