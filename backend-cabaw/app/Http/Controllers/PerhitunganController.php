<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\PenilaianKriteria;
use Illuminate\Support\Facades\DB;

class PerhitunganController extends Controller
{
    /**
     * FUNGSI UTAMA: Hitung Fuzzy TOPSIS dengan Sinkronisasi Otomatis
     */
    public function hitungFuzzyTopsis(Request $request)
    {
        // Meningkatkan limit memori dan waktu eksekusi
        ini_set('max_execution_time', 600); 
        ini_set('memory_limit', '1G');

        $tahun = $request->query('tahun', date('Y'));

        // ========================================================
        // BAGIAN 1: SINKRONISASI OTOMATIS (Tanpa Klik Tombol)
        // ========================================================
        $kriteriasObj = Kriteria::all();
        $kriteriasByKode = $kriteriasObj->keyBy('kode_kriteria');
        $alternatifs = Alternatif::all();

        // Ambil statistik terbaru dari tabel transaksi berdasarkan tahun
        $allStats = DB::table('transaksi')
            ->whereYear('tanggal', $tahun)
            ->select(
                'id_pelanggan',
                DB::raw('COALESCE(SUM(total_pembelian), 0) as c1'),
                DB::raw('COALESCE(SUM(total_harga), 0) as c2'),
                DB::raw('COUNT(id_transaksi) as c3'),
                DB::raw('COALESCE(AVG(total_pembelian), 0) as c4')
            )
            ->groupBy('id_pelanggan')
            ->get()
            ->keyBy('id_pelanggan');

        // Update tabel penilaian_kriteria secara real-time
        foreach ($alternatifs as $alt) {
            $stats = $allStats->get($alt->id_pelanggan);
            
            foreach ($kriteriasByKode as $kode => $k) {
                $field = strtolower($kode); // c1, c2, c3, c4
                $nilai = $stats ? $stats->$field : 0;

                PenilaianKriteria::updateOrCreate(
                    ['id_alternatif' => $alt->id_alternatif, 'id_kriteria' => $k->id_kriteria],
                    ['nilai_mentah' => $nilai]
                );
            }
        }
        // ========================================================


        // ========================================================
        // BAGIAN 2: LOGIKA FUZZY TOPSIS
        // ========================================================
        
        // Ambil ulang penilaian yang sudah diupdate tadi
        $penilaians = PenilaianKriteria::all()->groupBy('id_alternatif');

        if ($kriteriasObj->isEmpty() || $alternatifs->isEmpty()) {
            return response()->json(['message' => 'Data Kriteria atau Alternatif kosong'], 500);
        }

        $matriksFuzzy = [];
        $matriksR = [];
        $hasilAkhir = [];

        foreach ($alternatifs as $alt) {
            $nilaiAlt = $penilaians->get($alt->id_alternatif)?->keyBy(function($item) {
                return strtoupper($item->kriteria->kode_kriteria);
            });

            $f = []; $r = [];
            $tempFuzzy = ['nama' => $alt->nama_alternatif];
            $tempR = ['nama' => $alt->nama_alternatif];

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $nilaiRiil = $nilaiAlt && isset($nilaiAlt[$kode]) ? $nilaiAlt[$kode]->nilai_mentah : 0;

                // Fuzzifikasi
                $method = "konversiFuzzy" . $kode;
                $fuzzyVal = method_exists($this, $method) ? $this->$method($nilaiRiil) : [0.00, 0.25, 0.50];
                
                $f[$kode] = $fuzzyVal;
                $tempFuzzy[$kode] = "({$f[$kode][0]}, {$f[$kode][1]}, {$f[$kode][2]})";

                // Normalisasi R
                if ($k->atribut == 'Benefit') {
                    $r[$kode] = $f[$kode];
                } else {
                    $l_min = 0.25;
                    $r[$kode] = [
                        $f[$kode][2] > 0 ? round($l_min / $f[$kode][2], 2) : 0,
                        $f[$kode][1] > 0 ? round($l_min / $f[$kode][1], 2) : 0,
                        $f[$kode][0] > 0 ? round($l_min / $f[$kode][0], 2) : 0
                    ];
                }
                $tempR[$kode] = "({$r[$kode][0]}, {$r[$kode][1]}, {$r[$kode][2]})";
            }

            $matriksFuzzy[] = $tempFuzzy;
            $matriksR[] = $tempR;

            // Jarak D+/D-
            $dPlus = 0; $dMin = 0;
            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $bobotArr = $this->parseFuzzy($k->bobot_fuzzy);
                
                $v0 = $r[$kode][0] * $bobotArr[0];
                $v1 = $r[$kode][1] * $bobotArr[1];
                $v2 = $r[$kode][2] * $bobotArr[2];

                $dPlus += sqrt((1/3) * (pow($v0 - 1, 2) + pow($v1 - 1, 2) + pow($v2 - 1, 2)));
                $dMin += sqrt((1/3) * (pow($v0 - 0, 2) + pow($v1 - 0, 2) + pow($v2 - 0, 2)));
            }

            $pembagi = $dPlus + $dMin;
            $nilaiV = ($pembagi == 0) ? 0 : ($dMin / $pembagi);

            $hasilAkhir[] = [
                'nama' => $alt->nama_alternatif,
                'kode' => $alt->kode_alternatif,
                'd_plus' => round($dPlus, 4),
                'd_min' => round($dMin, 4),
                'nilai_v' => round($nilaiV, 4)
            ];
        }

        // Sorting
       // 1. Sorting berdasarkan nilai_v tertinggi
       usort($hasilAkhir, fn($a, $b) => $b['nilai_v'] <=> $a['nilai_v']);

       // 2. Hitung Total Populasi (N)
       $totalN = count($hasilAkhir);

       // 3. Tentukan Batas Kuota Berdasarkan Tabel 3.16
       $batasP1 = ceil($totalN * 0.1); // 10% Teratas
       $batasP2 = ceil($totalN * 0.3); // 30% Teratas (10% + 20%)
       $batasP3 = ceil($totalN * 0.6); // 60% Teratas (30% + 30%)

       foreach ($hasilAkhir as $index => $item) {
           $rank = $index + 1;
           $hasilAkhir[$index]['rank'] = $rank;

           // Logika Penentuan Diskon Sesuai Tabel 3.16
           if ($rank <= $batasP1) {
               $hasilAkhir[$index]['status_prioritas'] = 'Prioritas Tinggi';
               $hasilAkhir[$index]['diskon'] = 15;
           } elseif ($rank <= $batasP2) {
               $hasilAkhir[$index]['status_prioritas'] = 'Prioritas Sedang';
               $hasilAkhir[$index]['diskon'] = 10;
           } elseif ($rank <= $batasP3) {
               $hasilAkhir[$index]['status_prioritas'] = 'Prioritas Rendah';
               $hasilAkhir[$index]['diskon'] = 5;
           } else {
               $hasilAkhir[$index]['status_prioritas'] = 'Tidak Prioritas';
               $hasilAkhir[$index]['diskon'] = 0;
           }
       }

       return response()->json([
           'status' => true,
           'tahun' => $tahun,
           'total_pelanggan' => $totalN, // Tambahan informasi total N
           'matriks_fuzzy' => array_slice($matriksFuzzy, 0, 50),
           'matriks_r' => array_slice($matriksR, 0, 50),
           'hasil_akhir' => $hasilAkhir
       ]);
    }

    // --- HELPER KONVERSI ---
    private function konversiFuzzyC1($n) { 
        if ($n >= 20000) return [0.75, 1.00, 1.00];
        if ($n >= 10000) return [0.50, 0.75, 1.00];
        if ($n >= 5000)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC2($n) { 
        if ($n >= 50000000) return [0.75, 1.00, 1.00];
        if ($n >= 25000000) return [0.50, 0.75, 1.00];
        if ($n >= 10000000) return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC3($n) { 
        if ($n >= 300) return [0.75, 1.00, 1.00];
        if ($n >= 150) return [0.50, 0.75, 1.00];
        if ($n >= 50)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC4($n) { 
        if ($n >= 70) return [0.75, 1.00, 1.00];
        if ($n >= 50) return [0.50, 0.75, 1.00];
        if ($n >= 20) return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function parseFuzzy($str) {
        $clean = str_replace(['(', ')', ' '], '', $str);
        return array_map('floatval', explode(',', $clean));
    }
}