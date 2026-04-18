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
        if (!$request->hasFile('file')) {
            return response()->json(['message' => 'File tidak ada!'], 400);
        }

        ini_set('max_execution_time', 1800);
        ini_set('memory_limit', '1G');

        $filePath = $request->file('file')->getRealPath();
        $fastExcel = new FastExcel();

        // RESET DATABASE
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

        $plCount = 1;
        $trCount = 1;
        $dtCount = 1;

        // =========================
        // 🔥 AUTO AMBIL SEMUA SHEET
        // =========================
        $allSheets = $fastExcel->withoutHeaders()->importSheets($filePath);

        foreach ($allSheets as $i => $rows) {

            // fallback tahun
            $tahunOtomatis = 2021 + $i;

            // skip kalau sheet kosong
            if (count($rows) == 0) continue;

            $data = collect($rows)->slice(5);

            // skip kalau tidak ada data
            if ($data->isEmpty()) continue;

            foreach ($data as $line) {

                if (empty($line[2])) continue;

                // VALIDASI TANGGAL
                if (!isset($line[4]) || !isset($line[5])) continue;
                if (!is_numeric($line[4]) || !is_numeric($line[5])) continue;

                $tgl = (int)$line[4];
                $bln = (int)$line[5];

                if ($tgl <= 0 || $tgl > 31 || $bln <= 0 || $bln > 12) continue;

                // =========================
                // 🔥 FIX TAHUN (PRIORITAS DARI EXCEL)
                // =========================
                if (isset($line[6]) && is_numeric($line[6]) && $line[6] > 2000) {
                    $tahun = (int)$line[6];
                } else {
                    $tahun = $tahunOtomatis;
                }

                $tanggal = $tahun . '-' .
                    str_pad($bln, 2, '0', STR_PAD_LEFT) . '-' .
                    str_pad($tgl, 2, '0', STR_PAD_LEFT);

                // DATA UTAMA
                $namaBersih = trim($line[2]);
                $pedagang = $line[21] ?? '-';

                $keyPelanggan = strtolower($namaBersih);
                $keyAlternatif = $keyPelanggan . '|' . strtolower($pedagang);

                // =========================
                // PELANGGAN (INT)
                // =========================
                if (!isset($allPelanggan[$keyPelanggan])) {
                    $idPelanggan = $plCount++;

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

                // =========================
                // ALTERNATIF (INT)
                // =========================
                if (!isset($allAlternatif[$keyAlternatif])) {
                    $allAlternatif[$keyAlternatif] = [
                        'kode_alternatif' => count($allAlternatif) + 1,
                        'nama_alternatif' => $namaBersih,
                        'pedagang'        => $pedagang,
                        'id_pelanggan'    => $idPelanggan,
                        'created_at'      => now(),
                    ];
                }

                // =========================
                // TRANSAKSI (INT)
                // =========================
                $idTransaksi = $trCount++;

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

                // =========================
                // DETAIL TRANSAKSI (INT)
                // =========================
                for ($j = 0; $j < 10; $j++) {
                    $qty = (int)($line[8 + $j] ?? 0);

                    if ($qty > 0) {
                        $allDetail[] = [
                            'id_detail'    => $dtCount++,
                            'id_transaksi' => $idTransaksi,
                            'id_produk'    => $j + 1,
                            'jumlah'       => $qty,
                            'sub_total'    => $qty * 2500,
                            'created_at'   => now(),
                        ];
                    }
                }

                // SIMPAN PER 500 DATA
                if (count($allTransaksi) >= 500) {
                    $this->saveToDb($allPelanggan, $allAlternatif, $allTransaksi, $allDetail);
                    $allTransaksi = [];
                    $allDetail = [];
                }
            }
        }

        // SIMPAN SISA DATA
        $this->saveToDb($allPelanggan, $allAlternatif, $allTransaksi, $allDetail);

        return response()->json([
            'status' => true,
            'message' => 'SEMUA SHEET (2021-2025) BERHASIL MASUK SEMUA ✅🔥'
        ]);
    }

    private function saveToDb($pelanggan, $alternatif, $transaksi, $detail)
    {
        DB::transaction(function () use ($pelanggan, $alternatif, $transaksi, $detail) {
            if (!empty($pelanggan)) Pelanggan::insertOrIgnore(array_values($pelanggan));
            if (!empty($alternatif)) Alternatif::insertOrIgnore(array_values($alternatif));
            if (!empty($transaksi)) DB::table('transaksi')->insert($transaksi);
            if (!empty($detail)) DB::table('detail_transaksi')->insert($detail);
        });
    }
}