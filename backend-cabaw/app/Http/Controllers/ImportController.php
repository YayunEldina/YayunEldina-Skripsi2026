<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Pelanggan;
use App\Models\Alternatif;
use Rap2hpoutre\FastExcel\FastExcel;

class ImportController extends Controller
{
    public function importSemua(Request $request)
    {
        if (!$request->hasFile('file')) return response()->json(['message' => 'File tidak ada!'], 400);
        
        ini_set('max_execution_time', 1800); 
        ini_set('memory_limit', '1G');       

        $filePath = $request->file('file')->getRealPath();
        $fastExcel = new FastExcel();

        // 1. KOSONGKAN TABEL
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('detail_transaksi')->truncate();
        DB::table('transaksi')->truncate();
        DB::table('alternatifs')->truncate();
        DB::table('pelanggan')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $allPelanggan = [];
        $allAlternatif = [];
        $allTransaksi = [];
        $allDetail = [];
        
        // Counter ID Manual (Opsi 2)
        $plCount = 1;
        $trCount = 1;
        $dtCount = 1; // Counter untuk detail transaksi

        for ($i = 0; $i < 5; $i++) {
            $rows = $fastExcel->withoutHeaders()->sheet($i)->import($filePath);
            $data = $rows->slice(5);

            foreach ($data as $line) {
                if (empty($line[2])) continue;

                $namaBersih = trim($line[2]);
                $pedagang = $line[21] ?? '-';
                $keyPelanggan = strtolower($namaBersih);
                $keyAlternatif = $keyPelanggan . '|' . strtolower($pedagang);

                // LOGIKA PELANGGAN
                if (!isset($allPelanggan[$keyPelanggan])) {
                    $idPelanggan = 'PL' . str_pad($plCount++, 5, '0', STR_PAD_LEFT);
                    $allPelanggan[$keyPelanggan] = [
                        'id_pelanggan'   => $idPelanggan,
                        'nama_pelanggan' => $namaBersih,
                        'username'       => 'user_' . str_replace(' ', '', $keyPelanggan) . rand(100, 999),
                        'password'       => bcrypt('123456'),
                        'jenis_kelamin'  => $line[3] ?? 'Laki-laki',
                        'alamat'         => '-',
                        'no_telepon'     => '0'
                    ];
                }
                $idPelanggan = $allPelanggan[$keyPelanggan]['id_pelanggan'];

                // LOGIKA ALTERNATIF
                if (!isset($allAlternatif[$keyAlternatif])) {
                    $allAlternatif[$keyAlternatif] = [
                        'kode_alternatif' => 'A' . (count($allAlternatif) + 1),
                        'nama_alternatif' => $namaBersih,
                        'pedagang'        => $pedagang,
                        'id_pelanggan'    => $idPelanggan,
                        'created_at'      => now(),
                    ];
                }

                // LOGIKA TRANSAKSI
                $idTransaksi = 'TR' . str_pad($trCount++, 7, '0', STR_PAD_LEFT); // TR0000001
                $tanggal = $line[6] . '-' . str_pad($line[5], 2, '0', STR_PAD_LEFT) . '-' . str_pad($line[4], 2, '0', STR_PAD_LEFT);
                
                $allTransaksi[] = [
                    'id_transaksi'     => $idTransaksi,
                    'tanggal'          => $tanggal,
                    'total_pembelian'  => (int)($line[18] ?? 0),
                    'total_harga'      => (float)($line[19] ?? 0),
                    'tempat_transaksi' => $line[20] ?? 'Pasar',
                    'pedagang'         => $pedagang,
                    'id_pelanggan'     => $idPelanggan,
                    'created_at'       => now(),
                ];

                // LOGIKA DETAIL TRANSAKSI (PERBAIKAN OPSI 2)
                for ($j = 0; $j < 10; $j++) {
                    $qty = (int)($line[8 + $j] ?? 0);
                    if ($qty > 0) {
                        $allDetail[] = [
                            // ID Detail sekarang pendek, misal: DT0000001
                            'id_detail'    => 'DT' . str_pad($dtCount++, 8, '0', STR_PAD_LEFT), 
                            'id_transaksi' => $idTransaksi,
                            'id_produk'    => 'PR' . str_pad($j + 1, 2, '0', STR_PAD_LEFT), 
                            'jumlah'       => $qty,
                            'sub_total'    => $qty * 2500,
                            'created_at'   => now(),
                        ];
                    }
                }

                // Tiap 500 baris transaksi (biar hemat RAM), langsung save ke DB
                if (count($allTransaksi) >= 500) {
                    $this->saveToDb($allPelanggan, $allAlternatif, $allTransaksi, $allDetail);
                    $allTransaksi = [];
                    $allDetail = [];
                    // Pelanggan & Alternatif jangan direset karena butuh dicek uniknya
                }
            }
        }

        // Insert sisa data
        $this->saveToDb($allPelanggan, $allAlternatif, $allTransaksi, $allDetail);

        return response()->json(['status' => true, 'message' => 'Sukses Import 50.000+ Data!']);
    }

    private function saveToDb($pelanggan, $alternatif, $transaksi, $detail) {
        DB::transaction(function () use ($pelanggan, $alternatif, $transaksi, $detail) {
            if (!empty($pelanggan)) Pelanggan::insertOrIgnore(array_values($pelanggan));
            if (!empty($alternatif)) Alternatif::insertOrIgnore(array_values($alternatif));
            if (!empty($transaksi)) DB::table('transaksi')->insert($transaksi);
            if (!empty($detail)) DB::table('detail_transaksi')->insert($detail);
        });
    }
}