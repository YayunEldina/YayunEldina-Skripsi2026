<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Alternatif; 
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

                $pedagang = trim($request->pedagang);
                $pedagang = $pedagang === '' ? '-' : strtolower($pedagang);

                $pelanggan = null;

                // ⚡ JIKA PELANGGAN LAMA (Valid & bukan string 'null')
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined') {
                    $alternatifLama = Alternatif::find($request->id_alternatif);
                    if ($alternatifLama) {
                        $pelanggan = Pelanggan::find($alternatifLama->id_pelanggan);
                    }
                }

                // ⚡ JIKA PELANGGAN BARU (Buat entitas baru murni)
                if (!$pelanggan) {
                    $pelanggan = Pelanggan::create([
                        'nama_pelanggan' => $request->nama_pelanggan,
                        'username' => 'user_' . strtolower(str_replace(' ', '', $request->nama_pelanggan)) . substr(time(), -4),
                        'password' => bcrypt('123456'),
                        'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-laki',
                        'alamat' => '-',
                        'no_telepon' => '0'
                    ]);

                    // Buat alternatif SPK baru terpisah khusus untuk entitas pelanggan baru ini
                    $kodeBaru = (Alternatif::max('id_alternatif') ?? 0) + 1;
                    Alternatif::create([
                        'id_pelanggan'    => $pelanggan->id_pelanggan,
                        'nama_alternatif' => $pelanggan->nama_pelanggan,
                        'kode_alternatif' => $kodeBaru,
                        'pedagang'        => $pedagang
                    ]);
                }

                // ======================================
                // Perhitungan Sumber Tahun/Bulan SPK
                // ======================================
                $bulanTransaksi = (int) date('m', strtotime($request->tanggal));
                $tahunTransaksi = (int) date('Y', strtotime($request->tanggal));
                
                if ($tahunTransaksi == 2026 && $bulanTransaksi == 5) {
                    $tahunSumber = 2025;
                    $bulanSumber = null;
                } else {
                    if ($bulanTransaksi == 1) {
                        $bulanSumber = 12;
                        $tahunSumber = $tahunTransaksi - 1;
                    } else {
                        $bulanSumber = $bulanTransaksi - 1;
                        $tahunSumber = $tahunTransaksi;
                    }
                }
            
                // Cek kuota pemakaian diskon pada bulan berjalan
                $sudahDapatDiskon = Transaksi::where('id_pelanggan', $pelanggan->id_pelanggan)
                    ->where('pedagang', $pedagang)
                    ->whereYear('tanggal', $tahunTransaksi)
                    ->whereMonth('tanggal', $bulanTransaksi)
                    ->whereNotNull('diskon')
                    ->where('diskon', '>', 0)
                    ->exists();

                // Tarik nilai diskon SPK dari tabel hasil_perhitungan
                $dataDiskon = null;
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined') {
                    $queryDiskon = DB::table('hasil_perhitungan')
                        ->where('id_alternatif', $request->id_alternatif)
                        ->where('tahun', $tahunSumber);
                
                    if ($bulanSumber !== null) {
                        $queryDiskon->where('bulan', $bulanSumber);
                    }
                
                    $dataDiskon = $queryDiskon->first();
                }

                // Kalkulasi final diskon
                $diskon = 0;
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined' && !$sudahDapatDiskon && isset($dataDiskon)) {
                    $diskon = (float) $dataDiskon->diskon;
                }

                // Simpan data transaksi induk
                $transaksi = Transaksi::create([
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $pedagang,
                    'diskon' => $diskon
                ]);

                // Simpan item belanja kerupuk
                $semuaProduk = Produk::pluck('id_produk', 'nama_produk')->toArray();
                foreach ($request->items as $item) {
                    $idProduk = $semuaProduk[$item['nama']] ?? null;
                    if (!$idProduk) {
                        throw new \Exception("Produk tidak ditemukan: " . $item['nama']);
                    }

                    DetailTransaksi::create([
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_produk' => $idProduk,
                        'jumlah' => $item['jumlah'],
                        'sub_total' => $item['jumlah'] * 2500,
                    ]);
                }

                return response()->json([
                    'message' => 'Transaksi berhasil diproses!',
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
    
        return response()->json([
            'status' => 'success',
            'data' => $transaksi->toArray()
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

                $pedagang = trim($request->pedagang ?? '-');
                $pedagang = $pedagang === '' ? '-' : strtolower($pedagang);

                $transaksi = Transaksi::findOrFail($id);
                $pelanggan = Pelanggan::find($transaksi->id_pelanggan);

                // ⚡ CEK APAKAH FORM RECONCILE SEBAGAI PELANGGAN BARU ATAU LAMA
                if (!$request->filled('id_alternatif') || $request->id_alternatif === 'null' || $request->id_alternatif === 'undefined') {
                    
                    // Skenario 1: Dipaksa/Diubah jadi Pelanggan Baru
                    // Optimasi: Jika transaksi ini sebelumnya sudah membuat pelanggan baru, update saja datanya agar tidak duplikat record master
                    $cekAlternatifLain = Alternatif::where('id_pelanggan', $transaksi->id_pelanggan)->count();
                    
                    if ($pelanggan && $cekAlternatifLain <= 1) {
                        // Jika pelanggan ini hanya terikat pada 1 alternatif milik transaksi ini, update profilnya langsung
                        $pelanggan->update([
                            'nama_pelanggan' => $request->nama_pelanggan,
                            'jenis_kelamin'  => $request->jenis_kelamin ?? 'Laki-laki',
                        ]);
                        Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)->update([
                            'nama_alternatif' => $request->nama_pelanggan,
                            'pedagang'        => $pedagang
                        ]);
                    } else {
                        // Jika ternyata pelanggan lama, buat record pelanggan baru gres agar relasi historis transaksi lain aman
                        $pelanggan = Pelanggan::create([
                            'nama_pelanggan' => $request->nama_pelanggan,
                            'username' => 'user_' . strtolower(str_replace(' ', '', $request->nama_pelanggan)) . substr(time(), -4),
                            'password' => bcrypt('123456'),
                            'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-laki',
                            'alamat' => '-',
                            'no_telepon' => '0'
                        ]);

                        $kodeBaru = (Alternatif::max('id_alternatif') ?? 0) + 1;
                        Alternatif::create([
                            'id_pelanggan'    => $pelanggan->id_pelanggan,
                            'nama_alternatif' => $pelanggan->nama_pelanggan,
                            'kode_alternatif' => $kodeBaru,
                            'pedagang'        => $pedagang
                        ]);
                    }
                } else {
                    // Skenario 2: Dipilih kembali ke Pelanggan Lama dari Dropdown React
                    $alternatifPilihan = Alternatif::find($request->id_alternatif);
                    if ($alternatifPilihan) {
                        $pelanggan = Pelanggan::find($alternatifPilihan->id_pelanggan);
                        if ($pelanggan) {
                            $pelanggan->update([
                                'nama_pelanggan' => $request->nama_pelanggan,
                                'jenis_kelamin'  => $request->jenis_kelamin,
                            ]);
                            $alternatifPilihan->update([
                                'nama_alternatif' => $request->nama_pelanggan,
                                'pedagang'        => $pedagang
                            ]);
                        }
                    }
                }

                // ======================================
                // Hitung Ulang Perolehan Diskon SPK
                // ======================================
                $bulanTransaksi = (int) date('m', strtotime($request->tanggal));
                $tahunTransaksi = (int) date('Y', strtotime($request->tanggal));
                
                if ($tahunTransaksi == 2026 && $bulanTransaksi == 5) {
                    $tahunSumber = 2025;
                    $bulanSumber = null;
                } else {
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
                    ->whereNotNull('diskon')
                    ->where('diskon', '>', 0)
                    ->where('id_transaksi', '!=', $id) // Abaikan id transaksi saat ini
                    ->exists();

                $dataDiskon = null;
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined') {
                    $queryDiskon = DB::table('hasil_perhitungan')
                        ->where('id_alternatif', $request->id_alternatif)
                        ->where('tahun', $tahunSumber);

                    if ($bulanSumber !== null) {
                        $queryDiskon->where('bulan', $bulanSumber);
                    }

                    $dataDiskon = $queryDiskon->first();
                }

                $diskon = 0;
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined' && !$sudahDapatDiskon && isset($dataDiskon)) {
                    $diskon = (float) $dataDiskon->diskon;
                }

                // Eksekusi Update Transaksi Utama
                $transaksi->update([
                    'id_pelanggan'     => $pelanggan->id_pelanggan,
                    'tanggal'          => $request->tanggal,
                    'total_pembelian'  => $request->total_pembelian,
                    'total_harga'      => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang'         => $pedagang,  
                    'diskon'           => $diskon,
                ]);

                // Reset dan Simpan Ulang Detail Item
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

    /**
     * Laporan rekapitulasi diskon bulanan
     */
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
     * API Omset Tahunan untuk Dashboard
     */
    public function omsetTahunan()
    {
        $data = [];

        for ($tahun = 2021; $tahun <= 2025; $tahun++) {
            $total = Transaksi::whereYear('tanggal', $tahun)->sum('total_harga');
            $data[] = [
                'tahun' => $tahun,
                'total_omset' => $total
            ];
        }

        return response()->json($data);
    }

    /**
     * API untuk cek kuota diskon secara realtime
     */
    public function cekKuotaDiskon(Request $request)
    {
        $id_input = $request->query('id_pelanggan');
        $pedagang = trim($request->query('pedagang', '-'));
        $pedagang = $pedagang === '' ? '-' : strtolower($pedagang);
        $tanggal = $request->query('tanggal');
        $id_transaksi = $request->query('id_transaksi'); 

        if (!$id_input || $id_input === 'undefined' || $id_input === 'null' || !$tanggal) {
            return response()->json(['sudah_transaksi' => false]);
        }

        $id_pelanggan = $id_input;
        $alternatif = Alternatif::find($id_input);
        if ($alternatif) {
            $id_pelanggan = $alternatif->id_pelanggan;
        }

        $bulanTransaksi = (int) date('m', strtotime($tanggal));
        $tahunTransaksi = (int) date('Y', strtotime($tanggal));

        $query = Transaksi::where('id_pelanggan', $id_pelanggan)
            ->where('pedagang', $pedagang)
            ->whereYear('tanggal', $tahunTransaksi)
            ->whereMonth('tanggal', $bulanTransaksi)
            ->where(function ($q) {
                $q->whereNotNull('diskon')
                  ->where('diskon', '>', 0);
            });

        if ($id_transaksi && $id_transaksi !== 'undefined' && $id_transaksi !== 'null') {
            $query->where('id_transaksi', '!=', $id_transaksi);
        }

        $sudahDapatDiskon = $query->exists();

        \Log::info("REALTIME CEK KUOTA (FIXED WITH EDIT MODE)", [
            'id_input_dari_react' => $id_input,
            'id_pelanggan_asli'   => $id_pelanggan,
            'id_transaksi_edit'   => $id_transaksi,
            'pedagang'            => $pedagang,
            'bulan'               => $bulanTransaksi,
            'tahun'               => $tahunTransaksi,
            'sudah_transaksi'     => $sudahDapatDiskon
        ]);

        return response()->json([
            'sudah_transaksi' => $sudahDapatDiskon
        ]);
    }
}