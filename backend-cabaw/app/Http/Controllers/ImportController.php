<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Pelanggan;
use App\Models\Alternatif; // Pastikan model ini sudah dibuat
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\Log;

class ImportController extends Controller
{
    private function generateNewId($table, $column, $prefix) {
        $last = DB::table($table)->orderBy($column, 'desc')->first();
        if (!$last) return $prefix . '00001';
        
        $lastId = (int) substr($last->$column, strlen($prefix));
        return $prefix . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);
    }

    public function importSemua(Request $request)
    {
        if (!$request->hasFile('file')) return response()->json(['message' => 'File tidak ada!'], 400);
    
        $filePath = $request->file('file')->getRealPath();
        $fastExcel = new FastExcel();
    
        for ($i = 0; $i < 5; $i++) {
            try {
                $rows = $fastExcel->withoutHeaders()->sheet($i)->import($filePath);
                
                // Pastikan slice sesuai dengan baris data pertama Anda
                $data = $rows->slice(5); 
    
                foreach ($data as $line) {
                    if (empty($line[2])) continue;
    
                    // Bersihkan nama dari spasi awal/akhir
                    $namaBersih = trim($line[2]);
    
                    DB::beginTransaction();
                    try {
                        // 1. CEK ATAU BUAT PELANGGAN
                        $pelanggan = Pelanggan::whereRaw('TRIM(nama_pelanggan) = ?', [$namaBersih])->first();
                        
                        if (!$pelanggan) {
                            $idPelanggan = $this->generateNewId('pelanggan', 'id_pelanggan', 'PL');
                            $pelanggan = Pelanggan::create([
                                'id_pelanggan'   => $idPelanggan,
                                'nama_pelanggan' => $namaBersih,
                                'username'       => 'user_' . strtolower(str_replace(' ', '', $namaBersih)) . rand(100, 999),
                                'password'       => bcrypt('123456'),
                                'jenis_kelamin'  => $line[3] ?? 'Laki-laki',
                                'alamat'         => '-',
                                'no_telepon'     => '0'
                            ]);

                            // 2. Isi tabel 'alternatifs' secara otomatis hanya saat pelanggan baru dibuat
                            $count = Alternatif::count();
                            Alternatif::create([
                                'kode_alternatif' => 'A' . ($count + 1),
                                'nama_alternatif' => $namaBersih,
                                'id_pelanggan'    => $idPelanggan
                            ]);
                        } else {
                            $idPelanggan = $pelanggan->id_pelanggan;
                        }
    
                        // 3. Generate ID Transaksi
                        $idTransaksi = $this->generateNewId('transaksi', 'id_transaksi', 'TR');
                        $tanggal = $line[6] . '-' . str_pad($line[5], 2, '0', STR_PAD_LEFT) . '-' . str_pad($line[4], 2, '0', STR_PAD_LEFT);
                        
                        DB::table('transaksi')->insert([
                            'id_transaksi'     => $idTransaksi,
                            'tanggal'          => $tanggal,
                            'total_pembelian'  => (int)($line[18] ?? 0),
                            'total_harga'      => (float)($line[19] ?? 0),
                            'tempat_transaksi' => $line[20] ?? 'Pasar',
                            'id_pelanggan'     => $idPelanggan,
                            'created_at'       => now(),
                        ]);
    
                        // 4. Detail Transaksi
                        for ($j = 0; $j < 10; $j++) {
                            $qty = (int)($line[7 + $j] ?? 0);
                            if ($qty > 0) {
                                DB::table('detail_transaksi')->insert([
                                    'id_detail'    => 'DT' . bin2hex(random_bytes(3)), 
                                    'id_transaksi' => $idTransaksi,
                                    'id_produk'    => 'PR' . str_pad($j + 1, 2, '0', STR_PAD_LEFT), 
                                    'jumlah'       => $qty,
                                    'sub_total'    => $qty * 2500,
                                    'created_at'   => now(),
                                ]);
                            }
                        }
                        DB::commit();
                    } catch (\Exception $e) {
                        DB::rollBack();
                        Log::error("Gagal import baris: " . $e->getMessage());
                    }
                }
            } catch (\Exception $e) {
                Log::error("Gagal membaca sheet index $i: " . $e->getMessage());
            }
        }
        return response()->json(['status' => true, 'message' => 'Import Selesai!']);
    }
}