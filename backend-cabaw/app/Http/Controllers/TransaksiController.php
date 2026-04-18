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
    public function index(Request $request)
    {
        $tahun = $request->query('tahun');
        
        $query = Transaksi::with(['pelanggan', 'detailTransaksi.produk']);
        
        if ($tahun && $tahun !== 'undefined') {
            $query->whereYear('tanggal', $tahun);
        }
        
        // Tetap gunakan paginate agar aplikasi tidak crash/lemot
        // Tapi kita pastikan datanya terurut dari yang terbaru
        $data = $query->orderBy('tanggal', 'desc')->orderBy('id_transaksi', 'desc')->paginate(20);
        
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'tanggal' => 'required|date',
            'items' => 'required|array',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Pelanggan (Gunakan firstOrCreate agar tidak duplikat)
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

                // 2. Simpan Transaksi
                $transaksi = Transaksi::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan, 
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $request->pedagang 
                ]);

                // 3. Simpan Detail
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

    public function destroy($id)
    {
        $transaksi = Transaksi::find($id);
        if ($transaksi) {
            $transaksi->delete(); 
            return response()->json(['message' => 'Data berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}