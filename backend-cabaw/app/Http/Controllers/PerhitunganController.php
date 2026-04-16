<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alternatif;
use App\Models\Kriteria;
use Illuminate\Support\Facades\DB;

class PerhitunganController extends Controller
{
    public function hitungFuzzyTopsis(Request $request)
    {
        $tahun = $request->query('tahun', '2021');

        // 1. Ambil kriteria
        $kriterias = Kriteria::all()->keyBy('kode_kriteria'); 
        
        if (!isset($kriterias['C1'], $kriterias['C2'], $kriterias['C3'], $kriterias['C4'])) {
            return response()->json(['message' => 'Data Kriteria C1-C4 tidak lengkap'], 500);
        }

        // 2. Ambil Alternatif
        $alternatifs = Alternatif::all();

        $matriksFuzzy = [];
        $matriksR = [];
        $matriksV = [];
        $hasilAkhir = [];

        foreach ($alternatifs as $alt) {
            // Query mendapatkan data riil dari tabel transaksi
            $stats = DB::table('transaksi')
                ->where('id_pelanggan', $alt->id_pelanggan)
                ->whereYear('tanggal', $tahun)
                ->select(
                    DB::raw('COALESCE(SUM(total_pembelian), 0) as c1'), // Total Barang
                    DB::raw('COALESCE(SUM(total_harga), 0) as c2'),     // Total Uang
                    DB::raw('COUNT(id_transaksi) as c3'),             // Frekuensi Belanja
                    DB::raw('COALESCE(AVG(total_pembelian), 0) as c4') // Rata-rata Pembelian
                )->first();

            // Tahap 1: Fuzzifikasi (Menggunakan Skala Baru yang lebih luas)
            $f = [
                'c1' => $this->konversiFuzzyC1($stats->c1),
                'c2' => $this->konversiFuzzyC2($stats->c2),
                'c3' => $this->konversiFuzzyC3($stats->c3),
                'c4' => $this->konversiFuzzyC4($stats->c4),
            ];
            
            $matriksFuzzy[] = [
                'nama' => $alt->nama_alternatif,
                'c1' => "({$f['c1'][0]}, {$f['c1'][1]}, {$f['c1'][2]})",
                'c2' => "({$f['c2'][0]}, {$f['c2'][1]}, {$f['c2'][2]})",
                'c3' => "({$f['c3'][0]}, {$f['c3'][1]}, {$f['c3'][2]})",
                'c4' => "({$f['c4'][0]}, {$f['c4'][1]}, {$f['c4'][2]})",
            ];

            // Tahap 2: Normalisasi R (Benefit & Cost)
            $r = [];
            // Benefit: C1, C2, C3
            foreach(['c1', 'c2', 'c3'] as $k) {
                $r[$k] = [$f[$k][0], $f[$k][1], $f[$k][2]]; // Normalisasi terhadap nilai max 1
            }
            // Cost: C4 (Rumus: l_min / u, l_min / m, l_min / l)
            $l_min = 0.25; 
            $r['c4'] = [
                $f['c4'][2] > 0 ? round($l_min / $f['c4'][2], 2) : 0, 
                $f['c4'][1] > 0 ? round($l_min / $f['c4'][1], 2) : 0, 
                $f['c4'][0] > 0 ? round($l_min / $f['c4'][0], 2) : 0
            ];

            $matriksR[] = [
                'nama' => $alt->nama_alternatif,
                'c1' => "({$r['c1'][0]}, {$r['c1'][1]}, {$r['c1'][2]})",
                'c2' => "({$r['c2'][0]}, {$r['c2'][1]}, {$r['c2'][2]})",
                'c3' => "({$r['c3'][0]}, {$r['c3'][1]}, {$r['c3'][2]})",
                'c4' => "({$r['c4'][0]}, {$r['c4'][1]}, {$r['c4'][2]})",
            ];

            // Tahap 3: Pembobotan V
            $v = [];
            foreach (['c1', 'c2', 'c3', 'c4'] as $key) {
                $kodeK = strtoupper($key);
                $bobotArr = $this->parseFuzzy($kriterias[$kodeK]->bobot_fuzzy);
                $v[$key] = [
                    round($r[$key][0] * $bobotArr[0], 2),
                    round($r[$key][1] * $bobotArr[1], 2),
                    round($r[$key][2] * $bobotArr[2], 2)
                ];
            }

            $matriksV[] = [
                'nama' => $alt->nama_alternatif,
                'v_data' => $v
            ];

            // Tahap 4 & 5: Jarak D+, D- dan Preferensi V
            // FPIS (A+) = [1,1,1], FNIS (A-) = [0,0,0]
            $dPlus = 0; $dMin = 0;
            foreach ($v as $val) {
                $dPlus += sqrt((1/3) * (pow($val[0]-1, 2) + pow($val[1]-1, 2) + pow($val[2]-1, 2)));
                $dMin += sqrt((1/3) * (pow($val[0]-0, 2) + pow($val[1]-0, 2) + pow($val[2]-0, 2)));
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

        // --- SORTING BERDASARKAN NILAI V TERBESAR ---
        usort($hasilAkhir, fn($a, $b) => $b['nilai_v'] <=> $a['nilai_v']);

        // Reset index dan tambah variabel rank
        $hasilAkhir = array_values($hasilAkhir);
        foreach ($hasilAkhir as $key => $val) {
            $hasilAkhir[$key]['rank'] = $key + 1;
        }

        return response()->json([
            'matriks_fuzzy' => $matriksFuzzy,
            'matriks_r' => $matriksR,
            'hasil_akhir' => $hasilAkhir
        ]);
    }

    // --- FUNGSI KONVERSI DINAMIS SESUAI DATA AGUS (TAHUNAN) ---

    private function konversiFuzzyC1($nilai) { // Total Pembelian (Asumsi Agus 24.000+)
        if ($nilai >= 20000) return [0.75, 1.00, 1.00];
        if ($nilai >= 10000) return [0.50, 0.75, 1.00];
        if ($nilai >= 5000)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC2($nilai) { // Total Harga (Asumsi Jutaan)
        if ($nilai >= 50000000) return [0.75, 1.00, 1.00];
        if ($nilai >= 25000000) return [0.50, 0.75, 1.00];
        if ($nilai >= 10000000) return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC3($nilai) { // Frekuensi (365 hari/tahun)
        if ($nilai >= 300) return [0.75, 1.00, 1.00];
        if ($nilai >= 150) return [0.50, 0.75, 1.00];
        if ($nilai >= 50)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC4($nilai) { // Rata-rata per transaksi
        if ($nilai >= 70) return [0.75, 1.00, 1.00];
        if ($nilai >= 50) return [0.50, 0.75, 1.00];
        if ($nilai >= 20) return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function parseFuzzy($str) {
        $clean = str_replace(['(', ')', ' '], '', $str);
        return array_map('floatval', explode(',', $clean));
    }
}