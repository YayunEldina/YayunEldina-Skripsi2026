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

            $pelanggan = null;

            // 🔥 jika pelanggan lama → ambil dari alternatif
            $dataDiskon = null;
            if ($request->id_alternatif) {

                $alternatifLama = Alternatif::find($request->id_alternatif);

                if ($alternatifLama) {
                    $pelanggan = Pelanggan::find($alternatifLama->id_pelanggan);
                }
            }

            // 🔥 jika pelanggan baru → buat pelanggan baru
            if (!$pelanggan) {

                $pelanggan = Pelanggan::create([
                    'nama_pelanggan' => $request->nama_pelanggan,
                    'username' => 'user_' . strtolower(str_replace(' ', '', $request->nama_pelanggan)) . substr(time(), -4),
                    'password' => bcrypt('123456'),
                    'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-laki',
                    'alamat' => '-',
                    'no_telepon' => '0'
                ]);
            }

            // =========================
            // 2. ALTERNATIF SPK
            // =========================
            $exists = Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)
            ->where('pedagang', $pedagang)
                ->exists();

            if (!$exists) {
                $kodeBaru = (Alternatif::max('id_alternatif') ?? 0) + 1;

                Alternatif::create([
                    'id_pelanggan'    => $pelanggan->id_pelanggan,
                    'nama_alternatif' => $pelanggan->nama_pelanggan,
                    'kode_alternatif' => $kodeBaru,
                    'pedagang'        => $pedagang
                ]);
            }

            // =========================
            // 3. AMBIL DISKON SPK (FIX FINAL)
            // =========================
            $bulanTransaksi = (int) date('m', strtotime($request->tanggal));
            $tahunTransaksi = (int) date('Y', strtotime($request->tanggal));
            
           // ======================================
            // KHUSUS AWAL SISTEM MEI 2026
            // ======================================

            if ($tahunTransaksi == 2026 && $bulanTransaksi == 5) {

                // ambil hasil historis 2025
                $tahunSumber = 2025;
                $bulanSumber = null;

            } else {

                // bulan berikutnya ambil bulan sebelumnya
                if ($bulanTransaksi == 1) {
                    $bulanSumber = 12;
                    $tahunSumber = $tahunTransaksi - 1;
                } else {
                    $bulanSumber = $bulanTransaksi - 1;
                    $tahunSumber = $tahunTransaksi;
                }
            }
        
            $sudahDapatDiskon = Transaksi::where('id_pelanggan', $pelanggan->id_pelanggan)
                    ->where('pedagang', $pedagang)
                    ->whereYear('tanggal', $tahunTransaksi)
                    ->whereMonth('tanggal', $bulanTransaksi)
                    ->where('diskon', '>', 0)
                    ->exists();

            // hanya pelanggan lama yang boleh ambil diskon SPK
            $dataDiskon = null;
            if ($request->id_alternatif) {
            
                $queryDiskon = DB::table('hasil_perhitungan')
                ->whereRaw('LOWER(TRIM(nama)) = ?', [$this->normalize($request->nama_pelanggan)])
                ->whereRaw('LOWER(TRIM(pedagang)) = ?', [$pedagang])
                ->where('tahun', $tahunSumber);
            
            // khusus Mei 2026 → tidak pakai bulan
            if ($bulanSumber !== null) {
                $queryDiskon->where('bulan', $bulanSumber);
            }
            
            $dataDiskon = $queryDiskon->first();
            }
            // 🔥 LOG DEBUG
            \Log::info("CEK DISKON SPK", [
                'nama' => $request->nama_pelanggan,
                'pedagang' => $pedagang,
                'tahun' => $tahunSumber,
                'hasil' => $dataDiskon ?? null
            ]);

            if (!$dataDiskon) {
                \Log::warning("SPK TIDAK DITEMUKAN → DISKON 0");
            }

            // =========================
            // 4. FINAL DISKON (AMAN)
            // =========================
            $diskon = 0;

            if ($request->id_alternatif && !$sudahDapatDiskon && isset($dataDiskon)) {
                $diskon = (float) $dataDiskon->diskon;
            }

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
        'tanggal'        => 'required|date',
        'items'          => 'required|array',
    ]);

    try {
        return DB::transaction(function () use ($request, $id) {

            // ✅ FIX 1: definisikan $pedagang di awal (sama seperti store())
            $pedagang = trim($request->pedagang ?? '-');
            $pedagang = $pedagang === '' ? '-' : strtolower($pedagang);

            $transaksi = Transaksi::findOrFail($id);

            // =========================
            // 1. Update data Pelanggan
            // =========================
            $pelanggan = Pelanggan::find($transaksi->id_pelanggan);
            if ($pelanggan) {
                $pelanggan->update([
                    'nama_pelanggan' => $request->nama_pelanggan,
                    'jenis_kelamin'  => $request->jenis_kelamin,
                ]);

                // Sinkron nama di tabel alternatif
                Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)
                    ->update(['nama_alternatif' => $request->nama_pelanggan]);
            }

           // =========================
            // 2. UPDATE alternatif lama
            // =========================
            $alternatif = null;

            if ($pelanggan) {

                $alternatif = Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)
                    ->where('pedagang', $pedagang)
                    ->first();

                if ($alternatif) {

                    $alternatif->update([
                        'nama_alternatif' => $request->nama_pelanggan,
                        'pedagang'        => $pedagang,
                    ]);

                } else {

                    // kalau benar-benar belum ada baru create
                    $kodeBaru = (Alternatif::max('id_alternatif') ?? 0) + 1;

                    Alternatif::create([
                        'id_pelanggan'    => $pelanggan->id_pelanggan,
                        'nama_alternatif' => $request->nama_pelanggan,
                        'kode_alternatif' => $kodeBaru,
                        'pedagang'        => $pedagang
                    ]);
                }
            }
                        
            // =========================
            // 3. Ambil diskon SPK 
            // =========================
            $bulanTransaksi = (int) date('m', strtotime($request->tanggal));
            $tahunTransaksi = (int) date('Y', strtotime($request->tanggal));
            
           // ======================================
            // KHUSUS AWAL SISTEM MEI 2026
            // ======================================

            if ($tahunTransaksi == 2026 && $bulanTransaksi == 5) {

                // ambil hasil historis 2025
                $tahunSumber = 2025;
                $bulanSumber = null;

            } else {

                // bulan berikutnya ambil bulan sebelumnya
                if ($bulanTransaksi == 1) {
                    $bulanSumber = 12;
                    $tahunSumber = $tahunTransaksi - 1;
                } else {
                    $bulanSumber = $bulanTransaksi - 1;
                    $tahunSumber = $tahunTransaksi;
                }
            }
          
            $sudahDapatDiskon = Transaksi::where('id_pelanggan', $pelanggan->id_pelanggan)
                ->where('pedagang', $pedagang)
                ->whereYear('tanggal', $tahunTransaksi)
                ->whereMonth('tanggal', $bulanTransaksi)
                ->where('diskon', '>', 0)
                ->where('id_transaksi', '!=', $id)
                ->exists();

            // hanya pelanggan lama yang boleh ambil diskon SPK
           // hanya pelanggan lama yang boleh ambil diskon SPK
$dataDiskon = null;

if ($request->id_alternatif) {

    $queryDiskon = DB::table('hasil_perhitungan')
        ->where('id_alternatif', $request->id_alternatif)
        ->whereRaw('LOWER(TRIM(nama)) = ?', [
            $this->normalize($request->nama_pelanggan)
        ])
        ->whereRaw('LOWER(TRIM(pedagang)) = ?', [
            $pedagang
        ])
        ->where('tahun', $tahunSumber);

    // khusus Mei 2026 → tidak pakai bulan
    if ($bulanSumber !== null) {
        $queryDiskon->where('bulan', $bulanSumber);
    }

    $dataDiskon = $queryDiskon->first();
}

            $diskon = 0;

            if ($request->id_alternatif && !$sudahDapatDiskon && isset($dataDiskon)) {
                $diskon = (float) $dataDiskon->diskon;
            }

            \Log::info("EDIT — CEK DISKON SPK", [
                'nama'    => $request->nama_pelanggan,
                'pedagang'=> $pedagang,
                'tahun' => $tahunSumber,
                'diskon'  => $diskon,
                'hasil' => $dataDiskon ?? null
            ]);

            // =========================
            // 4. Update Transaksi Utama
            // =========================
            $transaksi->update([
                'tanggal'          => $request->tanggal,
                'total_pembelian'  => $request->total_pembelian,
                'total_harga'      => $request->total_harga,
                'tempat_transaksi' => $request->tempat_transaksi,
                'pedagang'         => $pedagang,  
                'diskon'           => $diskon,
            ]);

            // =========================
            // 5. Update Detail Transaksi
            // =========================
            DetailTransaksi::where('id_transaksi', $id)->delete();

            $semuaProduk = Produk::pluck('id_produk', 'nama_produk')->toArray();

            foreach ($request->items as $item) {
                $idProduk = $semuaProduk[$item['nama']] ?? null;

                if (!$idProduk) {
                    throw new \Exception("Produk tidak ditemukan: " . $item['nama']);
                }

                DetailTransaksi::create([
                    'id_transaksi' => $id,
                    'id_produk'    => $idProduk,
                    'jumlah'       => $item['jumlah'],
                    'sub_total'    => $item['jumlah'] * ($request->harga_per_pcs ?? 2500),
                ]);
            }

            return response()->json([
                'message' => 'Data transaksi berhasil diperbarui!',
                'status'  => 'success',
                'diskon'  => $diskon,
            ], 200);
        });

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Gagal update: ' . $e->getMessage()
        ], 500);
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
            DB::raw('MONTH(t.tanggal) as bulan'),

            't.id_transaksi',

            'p.nama_pelanggan',
            't.pedagang',

            't.total_pembelian',
            't.total_harga',
            't.diskon',

            DB::raw('((t.total_harga * t.diskon) / 100) as total_diskon')
        )

        ->orderBy('t.tanggal', 'asc')

        ->get();

    return response()->json($data);
}

/**
 * API OMSET TAHUNAN DASHBOARD
 */
public function omsetTahunan()
{
    $data = [];

    for ($tahun = 2021; $tahun <= 2025; $tahun++) {

        $total = \App\Models\Transaksi::whereYear('tanggal', $tahun)
            ->sum('total_harga');

        $data[] = [
            'tahun' => $tahun,
            'total_omset' => $total
        ];
    }

    return response()->json($data);
}

}