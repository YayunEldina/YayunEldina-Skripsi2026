<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Pelanggan;
use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Alternatif; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
    $tahun = $request->tahun;
    $bulan = $request->bulan;
    $search = $request->search;

    $query = Transaksi::query()
        ->select([
            'id_transaksi',
            'id_pelanggan',
            'id_admin',
            'tanggal',
            'total_pembelian',
            'total_harga',
            'tempat_transaksi',
            'pedagang',
            'diskon'
        ])
        ->with([
            'pelanggan:id_pelanggan,nama_pelanggan,jenis_kelamin',
            'admin:id_admin,nama_admin',
            'detailTransaksi:id_detail,id_transaksi,id_produk,jumlah',
            'detailTransaksi.produk:id_produk,nama_produk,harga'
        ]);

        if ($tahun) {
            $query->whereBetween('tanggal', [
                "$tahun-01-01",
                "$tahun-12-31"
            ]);
        }

        if ($bulan) {
            $query->whereMonth('tanggal', $bulan);
        }

    if ($search) {
        $query->whereHas('pelanggan', function ($q) use ($search) {
            $q->where(
                'nama_pelanggan',
                'like',
                "%{$search}%"
            );
        });

        logger($query->toSql());

    }

    $data = $query
        ->latest('tanggal')
        ->latest('id_transaksi')
        ->paginate(10);

    return response()->json($data);
}

    /**
     * Menyimpan transaksi baru (Create)
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_admin' => 'required|exists:admin,id_admin',
            'nama_pelanggan' => 'required',
            'tanggal' => 'required|date',
            'items' => 'required|array',
            'total_pembelian' => 'required',
            'total_harga' => 'required',
        ]);

        try {
            return DB::transaction(function () use ($request) {

                $pedagangInput = trim($request->pedagang);
                $pedagangFinal = $pedagangInput === '' ? '-' : $pedagangInput;

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
                        'pedagang'        => $pedagangFinal
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
                }else if ($tahunTransaksi == 2026 && $bulanTransaksi == 6) {
                    $tahunSumber = 2026;
                    $bulanSumber = 5;
                } else {
                    if ($bulanTransaksi == 1) {
                        $bulanSumber = 12;
                        $tahunSumber = $tahunTransaksi - 1;
                    } else {
                        $bulanSumber = $bulanTransaksi - 1;
                        $tahunSumber = $tahunTransaksi;
                    }
                }
            
                // Cek kuota pemakaian diskon pada bulan berjalan (Gunakan LOWER TRIM agar aman)
                $sudahDapatDiskon = Transaksi::where('id_pelanggan', $pelanggan->id_pelanggan)
                    ->whereRaw('LOWER(TRIM(pedagang)) = ?', [strtolower(trim($pedagangFinal))])
                    ->whereYear('tanggal', $tahunTransaksi)
                    ->whereMonth('tanggal', $bulanTransaksi)
                    ->exists(); // ⚡ JELAS: Jika di bulan ini sudah ada transaksi apa pun, kunci kuotanya.

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
                    'id_admin' => $request->id_admin,
                    'id_pelanggan' => $pelanggan->id_pelanggan,
                    'tanggal' => $request->tanggal,
                    'total_pembelian' => $request->total_pembelian,
                    'total_harga' => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang' => $pedagangFinal,
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
        $transaksi = Transaksi::with([
            'pelanggan',
            'detailTransaksi.produk'
        ])->find($id);
    
        if (!$transaksi) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
    
        $alternatif = Alternatif::where(
            'id_pelanggan',
            $transaksi->id_pelanggan
        )->first();
    
        $data = $transaksi->toArray();
        $data['id_alternatif'] = $alternatif?->id_alternatif;
    
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

  /**
     * Memperbarui data transaksi (Update) - REVISI PROTEKSI KUOTA DISKON
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

                $pedagangInput = trim($request->pedagang ?? '-');
                $pedagangFinal = $pedagangInput === '' ? '-' : $pedagangInput;

                $transaksi = Transaksi::findOrFail($id);
                
                // Cari id_pelanggan yang tepat berdasarkan alternatif yang dikirim frontend jika ada
                $id_pelanggan_final = $transaksi->id_pelanggan;
                if ($request->filled('id_alternatif') && $request->id_alternatif !== 'null' && $request->id_alternatif !== 'undefined') {
                    $altCek = Alternatif::find($request->id_alternatif);
                    if ($altCek) {
                        $id_pelanggan_final = $altCek->id_pelanggan;
                    }
                }

                $pelanggan = Pelanggan::find($id_pelanggan_final);

                // ⚡ CEK APAKAH FORM RECONCILE SEBAGAI PELANGGAN BARU ATAU LAMA
                if (!$request->filled('id_alternatif') || $request->id_alternatif === 'null' || $request->id_alternatif === 'undefined') {
                    
                    $cekAlternatifLain = Alternatif::where('id_pelanggan', $transaksi->id_pelanggan)->count();
                    
                    if ($pelanggan && $cekAlternatifLain <= 1) {
                        $pelanggan->update([
                            'nama_pelanggan' => $request->nama_pelanggan,
                            'jenis_kelamin'  => $request->jenis_kelamin ?? 'Laki-laki',
                        ]);
                        Alternatif::where('id_pelanggan', $pelanggan->id_pelanggan)->update([
                            'nama_alternatif' => $request->nama_pelanggan,
                            'pedagang'        => $pedagangFinal
                        ]);
                    } else {
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
                            'nama_alternatif' => $request->nama_pelanggan,
                            'kode_alternatif' => $kodeBaru,
                            'pedagang'        => $pedagangFinal
                        ]);
                    }
                } else {
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
                                'pedagang'        => $pedagangFinal
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
                } elseif ($tahunTransaksi == 2026 && $bulanTransaksi == 6) { // Tambahkan handling khusus Juni 2026 seperti pada fungsi store
                    $tahunSumber = 2026;
                    $bulanSumber = 5;
                } else {
                    if ($bulanTransaksi == 1) {
                        $bulanSumber = 12;
                        $tahunSumber = $tahunTransaksi - 1;
                    } else {
                        $bulanSumber = $bulanTransaksi - 1;
                        $tahunSumber = $tahunTransaksi;
                    }
                }
              
                // Cek kuota transaksi LAIN yang sudah mengambil diskon di bulan ini
                $transaksiPertama = Transaksi::where('id_pelanggan', $pelanggan->id_pelanggan)
                ->whereRaw('LOWER(TRIM(pedagang)) = ?', [strtolower(trim($pedagangFinal))])
                ->whereYear('tanggal', $tahunTransaksi)
                ->whereMonth('tanggal', $bulanTransaksi)
                ->orderBy('tanggal', 'asc')
                ->orderBy('id_transaksi', 'asc')
                ->first();

                \Log::info('CEK TRANSAKSI PERTAMA', [
                    'id_edit' => $id,
                    'transaksi_pertama' => $transaksiPertama?->id_transaksi,
                    'tanggal_pertama' => $transaksiPertama?->tanggal,
                ]);

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

                // ======================================
                // KUNCI LOGIKA BARU PENENTUAN DISKON
                // ======================================
                $diskon = 0;

                if (
                    $request->filled('id_alternatif') &&
                    $request->id_alternatif !== 'null' &&
                    $request->id_alternatif !== 'undefined' &&
                    isset($dataDiskon)
                ) {
                
                    if (
                        $transaksiPertama &&
                        $transaksiPertama->id_transaksi == $id
                    ) {
                        $diskon = (float) $dataDiskon->diskon;
                    } else {
                        $diskon = 0;
                    }
                }

                // ==========================================
                // REVISI LOG: Ditambahkan sebelum proses save
                // ==========================================
                \Log::info('UPDATE TRANSAKSI CEK DISKON', [
                    'id_transaksi'      => $transaksi->id_transaksi,
                    'id_pelanggan'      => $pelanggan->id_pelanggan,
                    'pedagang'          => $pedagangFinal,
                    'diskon_lama'       => $transaksi->diskon,
                    'transaksi_pertama' => $transaksiPertama?->id_transaksi,
                    'diskon_baru'       => $diskon,
                ]);

                // Eksekusi Update Transaksi Utama
                $transaksi->update([
                    'id_pelanggan'     => $pelanggan->id_pelanggan,
                    'tanggal'          => $request->tanggal,
                    'total_pembelian'  => $request->total_pembelian,
                    'total_harga'      => $request->total_harga,
                    'tempat_transaksi' => $request->tempat_transaksi,
                    'pedagang'         => $pedagangFinal,  
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
    $tanggal = $request->query('tanggal');
    $id_transaksi = $request->query('id_transaksi');

    if (!$id_input || !$tanggal) {
        return response()->json([
            'sudah_transaksi' => false
        ]);
    }

    $alternatif = Alternatif::find($id_input);

    $id_pelanggan = $alternatif
    ? $alternatif->id_pelanggan
    : $id_input;

    \Log::info('CEK TRANSAKSI 48886', [
        'data' => Transaksi::where('id_transaksi', 48886)->first()
    ]);

    $semuaData = Transaksi::where('id_pelanggan', $id_pelanggan)
    ->get([
        'id_transaksi',
        'id_pelanggan',
        'pedagang',
        'diskon',
        'tanggal'
    ]);

foreach ($semuaData as $trx) {
    \Log::info('DETAIL TRANSAKSI', [
        'id_transaksi' => $trx->id_transaksi,
        'id_pelanggan' => $trx->id_pelanggan,
        'pedagang' => $trx->pedagang,
        'diskon' => $trx->diskon,
        'tanggal' => $trx->tanggal,
    ]);
}
    $bulanTransaksi = date('m', strtotime($tanggal));
    $tahunTransaksi = date('Y', strtotime($tanggal));

    $query = Transaksi::where('id_pelanggan', $id_pelanggan)
        ->whereRaw(
            'LOWER(TRIM(pedagang)) = ?',
            [strtolower(trim($pedagang))]
        )
        ->whereYear('tanggal', $tahunTransaksi)
        ->whereMonth('tanggal', $bulanTransaksi)
        ->where('diskon', '>', 0);

    if ($id_transaksi) {
        $query->where('id_transaksi', '!=', $id_transaksi);
    }

    // ==========================
    // DEBUG CEK KUOTA
    // ==========================
    \Log::info('CEK KUOTA DEBUG', [
        'id_input' => $id_input,
        'id_pelanggan_hasil' => $id_pelanggan,
        'pedagang' => $pedagang,
        'tanggal' => $tanggal,
        'id_transaksi' => $id_transaksi,
        'jumlah_ditemukan' => $query->count(),
        'data_ditemukan' => $query->get([
            'id_transaksi',
            'id_pelanggan',
            'diskon',
            'tanggal',
            'pedagang'
        ])->toArray()
    ]);

    \Log::info('HASIL CEK KUOTA', [
        'id_transaksi_edit' => $id_transaksi,
        'exists' => $query->exists(),
        'data' => $query->get()->toArray()
    ]);

    return response()->json([
        'sudah_transaksi' => $query->exists()
    ]);
}
}