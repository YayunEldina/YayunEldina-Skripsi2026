<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Alternatif; // Tambahkan import Model Alternatif
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    /**
     * Menampilkan daftar transaksi dengan pagination
     */
    public function index(Request $request)
    {
        $tahun = $request->query('tahun');
        
        $query = Transaksi::with(['pelanggan', 'detailTransaksi.produk']);
        
        if ($tahun && $tahun !== 'undefined') {
            $query->whereYear('tanggal', $tahun);
        }
        
        $data = $query->orderBy('tanggal', 'desc')
                      ->orderBy('id_transaksi', 'desc')
                      ->paginate(20);
        
        return response()->json($data);
    }

    /**
     * Menyimpan transaksi baru (Create)
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'tanggal' => 'required|date',
            'items' => 'required|array',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Cari atau buat Pelanggan
                $pelanggan = Pelanggan::firstOrCreate(
                    ['nama_pelanggan' => $request->nama_pelanggan],
                    [
                        'username' => 'user_' . strtolower(str_replace(' ', '', $request->nama_pelanggan)) . rand(10, 99),
                        'password' => bcrypt('123456'),
                        'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-laki',
                        'alamat' => '-',
                        'no_telepon' => '0'
                    ]
                );

                // 2. LOGIKA SINKRONISASI KE TABEL ALTERNATIF
                // Cek apakah pelanggan ini sudah terdaftar sebagai alternatif SPK
                $exists = Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)->exists();
                
                if (!$exists) {
                    // Ambil kode terakhir untuk menentukan nomor urut (A1, A2, dst)
                    $lastAlt = Alternatif::orderByRaw('LENGTH(kode_alternatif) DESC')
                                ->orderBy('kode_alternatif', 'desc')
                                ->first();
                                
                    $lastNum = $lastAlt ? intval(preg_replace('/[^0-9]/', '', $lastAlt->kode_alternatif)) : 0;
                    $newKode = "A" . ($lastNum + 1);

                    Alternatif::create([
                        'id_pelanggan'    => $pelanggan->id_pelanggan,
                        'nama_alternatif' => $pelanggan->nama_pelanggan,
                        'kode_alternatif' => $newKode,
                        'pedagang'        => $request->pedagang ?? 'Lainnya'
                    ]);
                }

                // 3. Simpan Transaksi Utama
                $transaksi = Transaksi::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan, 
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $request->pedagang 
                ]);

                // 4. Simpan Detail Transaksi
                $semuaProduk = Produk::pluck('id_produk', 'nama_produk')->toArray();

                foreach ($request->items as $item) {
                    $idProduk = $semuaProduk[$item['nama']] ?? null;
                    
                    DetailTransaksi::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_produk' => $idProduk,
                        'jumlah' => $item['jumlah'],
                        'sub_total' => $item['jumlah'] * ($request->harga_per_pcs ?? 2500),
                    ]);
                }

                return response()->json([
                    'message' => 'Transaksi berhasil disimpan dan disinkronkan ke Alternatif!',
                    'data' => $transaksi->load('pelanggan')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menampilkan detail satu transaksi untuk diedit
     */
    public function show($id)
    {
        $transaksi = Transaksi::with(['pelanggan', 'detailTransaksi.produk'])->find($id);
        
        if (!$transaksi) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
    
        $data = $transaksi->toArray();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    /**
     * Memperbarui data transaksi (Update)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'tanggal' => 'required|date',
            'items' => 'required|array',
        ]);

        try {
            return DB::transaction(function () use ($request, $id) {
                $transaksi = Transaksi::findOrFail($id);

                // 1. Update data Pelanggan
                $pelanggan = Pelanggan::find($transaksi->id_pelanggan);
                if ($pelanggan) {
                    $pelanggan->update([
                        'nama_pelanggan' => $request->nama_pelanggan,
                        'jenis_kelamin' => $request->jenis_kelamin
                    ]);

                    // Update juga nama di tabel alternatif agar sinkron
                    Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)->update([
                        'nama_alternatif' => $request->nama_pelanggan
                    ]);
                }

                // 2. Update data Transaksi Utama
                $transaksi->update([
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $request->pedagang
                ]);

                // 3. Update Detail Transaksi
                DetailTransaksi::where('id_transaksi', $id)->delete();
                
                $semuaProduk = Produk::pluck('id_produk', 'nama_produk')->toArray();

                foreach ($request->items as $item) {
                    $idProduk = $semuaProduk[$item['nama']] ?? null;
                    
                    DetailTransaksi::create([
                        'id_transaksi' => $id,
                        'id_produk' => $idProduk,
                        'jumlah' => $item['jumlah'],
                        'sub_total' => $item['jumlah'] * ($request->harga_per_pcs ?? 2500),
                    ]);
                }

                return response()->json([
                    'message' => 'Data transaksi dan alternatif berhasil diperbarui!',
                    'status' => 'success'
                ], 200);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal update: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus transaksi (Delete)
     */
    public function destroy($id)
    {
        $transaksi = Transaksi::find($id);
        if ($transaksi) {
            DetailTransaksi::where('id_transaksi', $id)->delete();
            $transaksi->delete(); 
            
            return response()->json(['message' => 'Data berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}