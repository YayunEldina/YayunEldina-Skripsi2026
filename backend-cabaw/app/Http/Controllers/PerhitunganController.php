<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\PenilaianKriteria;
use App\Models\RiwayatPerhitungan;
use Illuminate\Support\Facades\DB;

class PerhitunganController extends Controller
{
    public function hitungFuzzyTopsis(Request $request)
    {
        ini_set('max_execution_time', 600); 
        ini_set('memory_limit', '1G');

        $tahun = $request->query('tahun', date('Y'));
        $bulan = $request->query('bulan'); 

        // ========================================================
        // 1. SINKRONISASI TRANSAKSI -> ALTERNATIF (HANYA TAHUN TERPILIH)
        // ========================================================
        $pelangganQuery = DB::table('transaksi')
            ->join('pelanggan', 'transaksi.id_pelanggan', '=', 'pelanggan.id_pelanggan');
        
        $pelangganQuery->whereYear('transaksi.tanggal', $tahun);

        if ($bulan) {
            $pelangganQuery->whereMonth('transaksi.tanggal', $bulan);
        }
        
        $pelangganDariTransaksi = $pelangganQuery
            ->select(
                'transaksi.id_pelanggan',
                'pelanggan.nama_pelanggan as nama_alternatif', // samakan aliasnya dengan property model
                'transaksi.pedagang'
            )
            ->distinct()
            ->get();

        // Jaga-jaga jika di tahun tersebut benar-benar tidak ada transaksi sama sekali
        if ($pelangganDariTransaksi->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => "Tidak ada data transaksi pada tahun $tahun",
                'hasil_akhir' => []
            ]);
        }

        // ========================================================
        // 2. AMBIL DATA KRITERIA
        // ========================================================
        $kriteriasObj = Kriteria::all();
        $kriteriasByKode = $kriteriasObj->keyBy('kode_kriteria');
        $totalBobot = $kriteriasObj->sum('bobot');

        // PENTING: Gunakan pelanggan dari transaksi tahun tersebut sebagai pengganti Alternatif::all()
        $alternatifs = $pelangganDariTransaksi; 

        // Ambil data ID alternatif asli dari table master alternatif untuk kebutuhan relasi simpan data
        $masterAlternatif = Alternatif::all()->map(function($item) {
            $item->search_key = $item->id_pelanggan . '_' . strtolower(trim($item->pedagang));
            return $item;
        })->keyBy('search_key');

        // ========================================================
        // 3. DATA BULANAN 12 BULAN
        // ========================================================
        $dataBulanan = [];

        foreach ($alternatifs as $alt) {
            $keyAlt = $alt->id_pelanggan . '_' . strtolower(trim($alt->pedagang));

            for ($bln = 1; $bln <= 12; $bln++) {
                $trx = DB::table('transaksi')
                    ->where('id_pelanggan', $alt->id_pelanggan)
                    ->whereRaw(
                        'LOWER(TRIM(pedagang)) = ?',
                        [strtolower(trim($alt->pedagang))]
                    )
                    ->whereYear('tanggal', $tahun)
                    ->whereMonth('tanggal', $bln);

                $c1 = (clone $trx)->sum('total_pembelian');
                $c2 = (clone $trx)->sum('total_harga');
                $c3 = (clone $trx)->count();

                $listPembelian = (clone $trx)->pluck('total_pembelian')->toArray();
                $c4 = 0;

                if (count($listPembelian) > 1) {
                    $avg = array_sum($listPembelian) / count($listPembelian);
                    $variance = 0;

                    foreach ($listPembelian as $v) {
                        $variance += pow($v - $avg, 2);
                    }

                    $variance = $variance / count($listPembelian);
                    $stddev = sqrt($variance);

                    $c4 = $avg > 0 ? $stddev / $avg : 0;
                }

                $dataBulanan[$keyAlt][$bln] = [
                    'c1' => $c1,
                    'c2' => $c2,
                    'c3' => $c3,
                    'c4' => $c4
                ];
            }
        }

        // ========================================================
        // 4. FUZZY BULANAN
        // ========================================================
        $fuzzyBulanan = [];

        foreach ($alternatifs as $alt) {
            $keyAlt = $alt->id_pelanggan . '_' . strtolower(trim($alt->pedagang));

            foreach ($dataBulanan[$keyAlt] as $bulanKe => $nilai) {
                if ($nilai['c3'] == 0) {
                    // Jika tidak ada transaksi, nilai fuzzy kosong [0,0,0] (akan dilewati saat pembagian)
                    $fuzzyBulanan[$keyAlt][$bulanKe] = [
                        'C1' => [0.00, 0.00, 0.00],
                        'C2' => [0.00, 0.00, 0.00],
                        'C3' => [0.00, 0.00, 0.00],
                        'C4' => [0.00, 0.00, 0.00],
                    ];
                } else {
                    $fuzzyBulanan[$keyAlt][$bulanKe] = [
                        'C1' => $this->konversiFuzzySkripsiC1($nilai['c1']),
                        'C2' => $this->konversiFuzzySkripsiC2($nilai['c2']),
                        'C3' => $this->konversiFuzzySkripsiC3($nilai['c3']),
                        // Mengirimkan nilai c3 (frekuensi) untuk mengunci validasi bias di C4
                        'C4' => $this->konversiFuzzySkripsiC4($nilai['c4'], $nilai['c3'])
                    ];
                }
            }
        }

        // ========================================================
        // 5. RATA-RATA FUZZY 12 BULAN (HANYA BULAN AKTIF)
        // ========================================================
        $nilaiTahunan = [];

        foreach ($alternatifs as $alt) {
            $keyAlt = $alt->id_pelanggan . '_' . strtolower(trim($alt->pedagang));

            $bulanAktif = 0;
            for ($bln = 1; $bln <= 12; $bln++) {
                if ($dataBulanan[$keyAlt][$bln]['c3'] > 0) {
                    $bulanAktif++;
                }
            }

            foreach (['C1','C2','C3','C4'] as $kode) {
                $l = 0; $m = 0; $u = 0;

                for ($bln = 1; $bln <= 12; $bln++) {
                    if ($dataBulanan[$keyAlt][$bln]['c3'] > 0) {
                        $l += $fuzzyBulanan[$keyAlt][$bln][$kode][0];
                        $m += $fuzzyBulanan[$keyAlt][$bln][$kode][1];
                        $u += $fuzzyBulanan[$keyAlt][$bln][$kode][2];
                    }
                }

                if ($bulanAktif > 0) {
                    $nilaiTahunan[$keyAlt][$kode] = [
                        round($l / $bulanAktif, 5),
                        round($m / $bulanAktif, 5),
                        round($u / $bulanAktif, 5)
                    ];
                } else {
                    $nilaiTahunan[$keyAlt][$kode] = [0.00000, 0.00000, 0.25000];
                }
            }
        }

        // ========================================================
        // MATRIKS FUZZY & MATRIKS R
        // ========================================================
        $matriksFuzzy = [];
        $matriksR = [];

        foreach ($alternatifs as $alt) {
            $keyAlt = $alt->id_pelanggan . '_' . strtolower(trim($alt->pedagang));
            
            $rowFuzzy = ['nama' => $alt->nama_alternatif];
            $rowR = ['nama' => $alt->nama_alternatif];
        
            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $f = $nilaiTahunan[$keyAlt][$kode];

                $rowFuzzy[$kode] = "(" . $f[0] . "," . $f[1] . "," . $f[2] . ")";

                if ($k->atribut == 'Benefit') {
                    $r = $f;
                } else {
                    $lmin = 0.25;
                    $r = [
                        $f[2] > 0 ? $lmin / $f[2] : 0,
                        $f[1] > 0 ? $lmin / $f[1] : 0,
                        $f[0] > 0 ? $lmin / $f[0] : 0,
                    ];
                }
                $rowR[$kode] = "(" . round($r[0],5) . "," . round($r[1],5) . "," . round($r[2],5) . ")";
            }

            $matriksFuzzy[] = $rowFuzzy;
            $matriksR[] = $rowR;
        }

        // ========================================================
        // 6. TOPSIS CORE PROCESS
        // ========================================================
        $matriksRTahunan = [];
        foreach ($nilaiTahunan as $idAlt => $nilaiKriteria) {
            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $f = $nilaiKriteria[$kode];

                if ($k->atribut == 'Benefit') {
                    $matriksRTahunan[$idAlt][$kode] = $f;
                } else {
                    $lmin = 0.25;
                    $matriksRTahunan[$idAlt][$kode] = [
                        $f[2] > 0 ? $lmin / $f[2] : 0,
                        $f[1] > 0 ? $lmin / $f[1] : 0,
                        $f[0] > 0 ? $lmin / $f[0] : 0,
                    ];
                }
            }
        }

        $matriksY = [];
        foreach ($matriksRTahunan as $idAlt => $nilaiKriteria) {
            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $bobotFuzzy = $this->parseFuzzy($k->bobot_fuzzy);
                $normalBobot = $k->bobot / $totalBobot;

                $matriksY[$idAlt][$kode] = [
                    $nilaiKriteria[$kode][0] * $bobotFuzzy[0] * $normalBobot,
                    $nilaiKriteria[$kode][1] * $bobotFuzzy[1] * $normalBobot,
                    $nilaiKriteria[$kode][2] * $bobotFuzzy[2] * $normalBobot,
                ];
            }
        }

        $Aplus = []; $Amin = [];
        foreach ($kriteriasObj as $k) {
            $kode = strtoupper($k->kode_kriteria);
            $allL = []; $allM = []; $allU = [];

            foreach ($matriksY as $row) {
                $allL[] = $row[$kode][0];
                $allM[] = $row[$kode][1];
                $allU[] = $row[$kode][2];
            }

            $Aplus[$kode] = [max($allL), max($allM), max($allU)];
            $Amin[$kode] = [min($allL), min($allM), min($allU)];
        }

        $hasilAkhir = [];
        foreach ($alternatifs as $alt) {
            $keyAlt = $alt->id_pelanggan . '_' . strtolower(trim($alt->pedagang));
            $dPlus = 0; $dMin = 0;

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $y = $matriksY[$keyAlt][$kode];

                $dp = sqrt((pow($y[0]-$Aplus[$kode][0],2) + pow($y[1]-$Aplus[$kode][1],2) + pow($y[2]-$Aplus[$kode][2],2)) / 3);
                $dn = sqrt((pow($y[0]-$Amin[$kode][0],2) + pow($y[1]-$Amin[$kode][1],2) + pow($y[2]-$Amin[$kode][2],2)) / 3);

                $dPlus += $dp;
                $dMin += $dn;
            }

            $nilaiV = ($dPlus + $dMin) == 0 ? 0 : $dMin / ($dPlus + $dMin);

            // Cari ID Alternatif asli dari master database
            $idAlternatifAsli = isset($masterAlternatif[$keyAlt]) ? $masterAlternatif[$keyAlt]->id_alternatif : null;

            $totalPembelian = 0;

            for ($bln = 1; $bln <= 12; $bln++) {
                $totalPembelian += $dataBulanan[$keyAlt][$bln]['c1'] ?? 0;
            }
            
            $hasilAkhir[] = [
                'id_alternatif' => $idAlternatifAsli,
                'nama' => $alt->nama_alternatif,
                'pedagang' => $alt->pedagang,
            
                'total_pembelian' => $totalPembelian,
            
                'nilai_v' => number_format($nilaiV, 5, '.', ''),
                'd_plus' => number_format($dPlus, 5, '.', ''),
                'd_min' => number_format($dMin, 5, '.', '')
            ];
        }

        // ========================================================
    // TEPAT DI SINI: POSISI KODE BARU UNTUK TIE-BREAKER C1
    // ========================================================
    usort($hasilAkhir, function($a, $b) use ($dataBulanan, $alternatifs) {
        // 1. Jika nilai Preferensi V berbeda, urutkan berdasarkan nilai V terbesar
        if ($b['nilai_v'] != $a['nilai_v']) {
            return $b['nilai_v'] <=> $a['nilai_v'];
        }

        // 2. JIKA NILAI V KEMBAR (Sama-sama 1), Urutkan berdasarkan TOTAL PEMBELIAN RIIL (C1) selama 12 bulan
        $altA = $alternatifs->firstWhere('nama_alternatif', $a['nama']);
        $altB = $alternatifs->firstWhere('nama_alternatif', $b['nama']);

        $keyA = $altA ? $altA->id_pelanggan . '_' . strtolower(trim($altA->pedagang)) : '';
        $keyB = $altB ? $altB->id_pelanggan . '_' . strtolower(trim($altB->pedagang)) : '';

        // Hitung total pembelian riil (bukan fuzzy) dari bulan 1 - 12
        $totalC1RiilA = 0;
        $totalC1RiilB = 0;

        for ($bln = 1; $bln <= 12; $bln++) {
            $totalC1RiilA += $dataBulanan[$keyA][$bln]['c1'] ?? 0;
            $totalC1RiilB += $dataBulanan[$keyB][$bln]['c1'] ?? 0;
        }

        // Urutkan dari total pembelian riil yang paling besar (Agus & Juleha akan naik ke atas)
        return $totalC1RiilB <=> $totalC1RiilA;
    });


        // ========================================================
        // 7. PENENTUAN KATEGORI PRIORITAS BERDASARKAN KUOTA
        // ========================================================

        $totalN = count($hasilAkhir);
        $kuotaTinggi = ceil(0.10 * $totalN);
        $kuotaSedang = ceil(0.30 * $totalN);
        $kuotaRendah = ceil(0.60 * $totalN);

        foreach ($hasilAkhir as $i => $item) {
            $rank = $i + 1;
            $hasilAkhir[$i]['rank'] = $rank;
            if ($rank <= $kuotaTinggi) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Tinggi';
                $hasilAkhir[$i]['diskon'] = 15;
            } elseif ($rank <= $kuotaSedang) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Sedang';
                $hasilAkhir[$i]['diskon'] = 10;
            } elseif ($rank <= $kuotaRendah) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Rendah';
                $hasilAkhir[$i]['diskon'] = 5;
            } else {
                $hasilAkhir[$i]['status_prioritas'] = 'Tidak Prioritas';
                $hasilAkhir[$i]['diskon'] = 0;
            }
        }

        // ========================================================
        // SIMPAN DATA KE DATABASE
        // ========================================================
        $queryDelete = DB::table('hasil_perhitungan')->where('tahun', $tahun);
        if ($bulan) { $queryDelete->where('bulan', $bulan); }
        $queryDelete->delete();

        foreach ($hasilAkhir as $index => $item) {
            if ($item['id_alternatif'] != null) {
                DB::table('hasil_perhitungan')->insert([
                    'id_alternatif' => $item['id_alternatif'],
                    'nama' => strtolower(trim($item['nama'])),
                    'pedagang' => strtolower(trim($item['pedagang'] ?? '-')),
                    'total_pembelian' => $item['total_pembelian'],
                    'nilai_v' => $item['nilai_v'],
                    'ranking' => $index + 1,
                    'diskon' => $item['diskon'],
                    'prioritas' => $item['status_prioritas'],
                    'tahun' => $tahun,
                    'bulan' => $bulan,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        RiwayatPerhitungan::updateOrCreate(
            [
                'tahun' => $tahun,
                'bulan' => $bulan
            ],
            [
                'matriks_fuzzy' => json_encode($matriksFuzzy),
                'matriks_r' => json_encode($matriksR),
                'hasil_akhir' => json_encode($hasilAkhir)
            ]
        );

        return response()->json([
            'status' => true,
            'tahun' => $tahun,
            'bulan' => $bulan,
            'total_pelanggan' => $totalN,
            'hasil_akhir' => $hasilAkhir,
            'matriks_fuzzy' => $matriksFuzzy,
            'matriks_r' => $matriksR
        ]);
    }

    private function getFuzzyMethod($kode)
    {
        return "konversiFuzzySkripsi" . $kode;
    }

    // C1: Total Pembelian
    private function konversiFuzzySkripsiC1($n){
        if ($n <= 100)  return [0.00, 0.00, 0.25]; 
        if ($n <= 300)  return [0.00, 0.25, 0.50]; 
        if ($n <= 700)  return [0.25, 0.50, 0.75]; 
        if ($n <= 1000) return [0.50, 0.75, 1.00]; 
        return [0.75, 1.00, 1.00];                 
    }

    // C2: Total Pendapatan
    private function konversiFuzzySkripsiC2($n){
        if ($n <= 2000000)  return [0.00, 0.00, 0.25]; 
        if ($n <= 6000000)  return [0.00, 0.25, 0.50]; 
        if ($n <= 10000000) return [0.25, 0.50, 0.75]; 
        if ($n <= 18000000) return [0.50, 0.75, 1.00]; 
        return [0.75, 1.00, 1.00];                 
    }

    // C3: Frekuensi Transaksi
    private function konversiFuzzySkripsiC3($n){
        if ($n <= 1)  return [0.00, 0.00, 0.25]; 
        if ($n <= 7)  return [0.00, 0.25, 0.50]; 
        if ($n <= 15) return [0.25, 0.50, 0.75]; 
        if ($n <= 25) return [0.50, 0.75, 1.00]; 
        return [0.75, 1.00, 1.00];               
    }

    // C4: Variabilitas Pembelian
    private function konversiFuzzySkripsiC4($n, $frekuensi = 1){
        // Jika dalam bulan tersebut transaksi hanya 1x atau 0x, variabilitas di-set terendah
        if ($frekuensi <= 1) return [0.00, 0.00, 0.25]; 

        if ($n <= 0.1) return [0.75, 1.00, 1.00]; 
        if ($n <= 0.2) return [0.50, 0.75, 1.00]; 
        if ($n <= 0.3) return [0.25, 0.50, 0.75]; 
        if ($n <= 0.4) return [0.00, 0.25, 0.50]; 
        return [0.00, 0.00, 0.25];                
    }

    private function parseFuzzy($str){
        $clean = str_replace(['(',')',' '],'',$str);
        return array_map('floatval', explode(',', $clean));
    }

    public function getRiwayatPerhitungan(Request $request)
{
    $tahun = $request->query('tahun');
    $bulan = $request->query('bulan');

    $query = RiwayatPerhitungan::where('tahun', $tahun);

    if ($bulan) {
        $query->where('bulan', $bulan);
    }

    $data = $query->first();

    if (!$data) {
        return response()->json([
            'status' => false,
            'message' => 'Data belum digenerate'
        ]);
    }

    return response()->json([
        'status' => true,
        'matriks_fuzzy' => json_decode($data->matriks_fuzzy, true),
        'matriks_r' => json_decode($data->matriks_r, true),
        'hasil_akhir' => json_decode($data->hasil_akhir, true),
    ]);
}

public function getRanking(Request $request)
{
    $tahun = $request->query('tahun');
    $bulan = $request->query('bulan');

    $query = DB::table('hasil_perhitungan')
        ->where('tahun', $tahun);

    if ($bulan) {
        $query->where('bulan', $bulan);
    }

    $data = $query
        ->orderBy('ranking')
        ->get();

    return response()->json([
        'status' => true,
        'data' => $data
    ]);
}
}