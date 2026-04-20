<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\DetailTransaksi;
use App\Models\Produk;
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

                // 2. Simpan Transaksi Utama
                $transaksi = Transaksi::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan, 
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $request->pedagang 
                ]);

                // 3. Simpan Detail Transaksi
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
                    'message' => 'Transaksi berhasil disimpan!',
                    'data' => $transaksi->load('pelanggan')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menampilkan detail satu transaksi untuk diedit (Read single)
     */
    public function show($id)
    {
        // detailTransaksi sesuai dengan nama function di model Transaksi
        $transaksi = Transaksi::with(['pelanggan', 'detailTransaksi.produk'])->find($id);
        
        if (!$transaksi) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
    
        // Mengubah ke array agar memicu penamaan snake_case (detail_transaksi) untuk Frontend
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
                }

                // 2. Update data Transaksi Utama
                $transaksi->update([
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $request->pedagang
                ]);

                // 3. Update Detail Transaksi (Hapus lama, simpan baru)
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
                    'message' => 'Data berhasil diperbarui! ✅',
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
            // Karena relasi menggunakan ON DELETE CASCADE (opsional) atau manual hapus detail:
            DetailTransaksi::where('id_transaksi', $id)->delete();
            $transaksi->delete(); 
            
            return response()->json(['message' => 'Data berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}