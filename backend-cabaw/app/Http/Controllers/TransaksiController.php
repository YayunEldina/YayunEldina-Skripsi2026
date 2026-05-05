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
     // =========================
    // ✅ FUNCTION TAMBAHAN
    // =========================
    private function normalize($text)
    {
        return strtolower(trim(preg_replace('/\s+/', ' ', $text)));
    }

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
        'total_pembelian' => 'required',
        'total_harga' => 'required',
    ]);

    try {
        return DB::transaction(function () use ($request) {

             // 🔥 TAMBAHKAN DI SINI
    $pedagang = trim($request->pedagang);
    $pedagang = $pedagang === '' ? '-' : strtolower($pedagang);

            // =========================
            // 1. PELANGGAN
            // =========================
            $pelanggan = Pelanggan::firstOrCreate(
                ['nama_pelanggan' => $request->nama_pelanggan],
                [
                    'username' => 'user_' . strtolower(str_replace(' ', '', $request->nama_pelanggan)) . substr(time(), -4),
                    'password' => bcrypt('123456'),
                    'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-laki',
                    'alamat' => '-',
                    'no_telepon' => '0'
                ]
            );

            // =========================
            // 2. ALTERNATIF SPK
            // =========================
            $exists = Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)
            ->where('pedagang', $pedagang)
                ->exists();

            if (!$exists) {
                $lastAlt = Alternatif::orderByDesc('id_alternatif')->first();
                $lastNum = $lastAlt ? intval(preg_replace('/[^0-9]/', '', $lastAlt->kode_alternatif)) : 0;

                Alternatif::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'nama_alternatif' => $pelanggan->nama_pelanggan,
                    'kode_alternatif' => 'A' . ($lastNum + 1),
                    'pedagang' => $pedagang
                ]);
            }

            // =========================
            // 3. AMBIL DISKON SPK (FIX FINAL)
            // =========================
            $tahunTransaksi = date('Y', strtotime($request->tanggal));
            $tahunAmbil = $tahunTransaksi - 1;

            $dataDiskon = DB::table('hasil_perhitungan')
                ->whereRaw('LOWER(TRIM(nama)) = ?', [$this->normalize($request->nama_pelanggan)])
                ->whereRaw('LOWER(TRIM(pedagang)) = ?', [$this->normalize($request->pedagang ?? '-')])
                ->where('tahun', $tahunAmbil)
                ->first();

            // 🔥 LOG DEBUG
            \Log::info("CEK DISKON SPK", [
                'nama' => $request->nama_pelanggan,
                'pedagang' => $request->pedagang,
                'tahun' => $tahunAmbil,
                'hasil' => $dataDiskon
            ]);

            if (!$dataDiskon) {
                \Log::warning("SPK TIDAK DITEMUKAN → DISKON 0");
            }

            // =========================
            // 4. FINAL DISKON (AMAN)
            // =========================
            $diskon = $dataDiskon ? (float) $dataDiskon->diskon : 0;

            // =========================
            // 5. SIMPAN TRANSAKSI
            // =========================
            $transaksi = Transaksi::create([
                'id_pelanggan' => $pelanggan->id_pelanggan,
                'tanggal' => $request->tanggal,
                'total_pembelian' => $request->total_pembelian,
                'total_harga' => $request->total_harga,
                'tempat_transaksi' => $request->tempat_transaksi,
                'pedagang' => $pedagang,
                'diskon' => $diskon
            ]);

            // =========================
            // 6. DETAIL TRANSAKSI
            // =========================
            $semuaProduk = Produk::pluck('id_produk', 'nama_produk')->toArray();

foreach ($request->items as $item) {

    // 🔥 ambil id produk
    $idProduk = $semuaProduk[$item['nama']] ?? null;

    // 🔥 VALIDASI DI SINI (INI POSISINYA)
    if (!$idProduk) {
        throw new \Exception("Produk tidak ditemukan: " . $item['nama']);
    }

    // 🔥 baru simpan
    DetailTransaksi::create([
        'id_transaksi' => $transaksi->id_transaksi,
        'id_produk' => $idProduk,
        'jumlah' => $item['jumlah'],
        'sub_total' => $item['jumlah'] * 2500,
    ]);
}

            return response()->json([
                'message' => 'Transaksi berhasil + diskon SPK berhasil masuk!',
                'data' => $transaksi->load('pelanggan')
            ], 201);
        });

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Gagal: ' . $e->getMessage()
        ], 500);
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
                    'pedagang' => $pedagang
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

    public function laporanDiskon(Request $request)
    {
        $tahun = $request->query('tahun', date('Y'));
    
        $data = DB::table('transaksi as t')
    ->join('pelanggan as p', 't.id_pelanggan', '=', 'p.id_pelanggan')
    ->whereBetween('t.tanggal', [
        $tahun . '-01-01',
        $tahun . '-12-31'
    ])
    ->select(
        't.id_pelanggan',
        'p.nama_pelanggan',
        't.pedagang',
        DB::raw('COUNT(*) as total_transaksi'),
        DB::raw('SUM(t.total_pembelian) as total_pembelian'),
        DB::raw('SUM(t.total_harga) as total_harga'),
    
        // 🔥 FIX DISKON %
        DB::raw('AVG(t.diskon) as rata_rata_diskon'),
    
        // 🔥 FIX NILAI RUPIAH DISKON (BENAR)
        DB::raw('SUM((t.total_harga * t.diskon) / 100) as total_diskon')
    )
    ->groupBy('t.id_pelanggan', 'p.nama_pelanggan', 't.pedagang')
    ->havingRaw('SUM(t.total_harga) > 0')
    ->orderByDesc('total_diskon')
    ->get();

    
        return response()->json($data);
    }
}