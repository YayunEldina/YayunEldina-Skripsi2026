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
        // Meningkatkan limit memori dan waktu eksekusi untuk menangani ratusan ribu data
        ini_set('max_execution_time', 600); // 10 Menit
        ini_set('memory_limit', '1G');

        $tahun = $request->query('tahun', '2021');

        // 1. Ambil data kriteria dan simpan dalam array berdasarkan kode
        $kriterias = Kriteria::all()->keyBy('kode_kriteria'); 
        
        if (!isset($kriterias['C1'], $kriterias['C2'], $kriterias['C3'], $kriterias['C4'])) {
            return response()->json(['message' => 'Data Kriteria C1-C4 tidak lengkap di database'], 500);
        }

        // 2. OPTIMASI: Hitung statistik semua pelanggan sekaligus dalam satu query (Bukan di dalam loop)
        $allStats = DB::table('transaksi')
            ->whereYear('tanggal', $tahun)
            ->select(
                'id_pelanggan',
                DB::raw('COALESCE(SUM(total_pembelian), 0) as c1'), // Total Barang
                DB::raw('COALESCE(SUM(total_harga), 0) as c2'),     // Total Uang
                DB::raw('COUNT(id_transaksi) as c3'),             // Frekuensi Belanja
                DB::raw('COALESCE(AVG(total_pembelian), 0) as c4') // Rata-rata Pembelian
            )
            ->groupBy('id_pelanggan')
            ->get()
            ->keyBy('id_pelanggan');

        // 3. Ambil data Alternatif (Pelanggan yang masuk penilaian)
        $alternatifs = Alternatif::all();

        $matriksFuzzy = [];
        $matriksR = [];
        $hasilAkhir = [];

        foreach ($alternatifs as $alt) {
            // Ambil statistik dari hasil query kolektif
            $stats = $allStats->get($alt->id_pelanggan);

            // Jika pelanggan tidak punya transaksi di tahun terpilih, beri nilai 0
            $valC1 = $stats ? $stats->c1 : 0;
            $valC2 = $stats ? $stats->c2 : 0;
            $valC3 = $stats ? $stats->c3 : 0;
            $valC4 = $stats ? $stats->c4 : 0;

            // TAHAP 1: Fuzzifikasi (Konversi nilai riil ke Triangular Fuzzy Number)
            $f = [
                'c1' => $this->konversiFuzzyC1($valC1),
                'c2' => $this->konversiFuzzyC2($valC2),
                'c3' => $this->konversiFuzzyC3($valC3),
                'c4' => $this->konversiFuzzyC4($valC4),
            ];
            
            $matriksFuzzy[] = [
                'nama' => $alt->nama_alternatif,
                'c1' => "({$f['c1'][0]}, {$f['c1'][1]}, {$f['c1'][2]})",
                'c2' => "({$f['c2'][0]}, {$f['c2'][1]}, {$f['c2'][2]})",
                'c3' => "({$f['c3'][0]}, {$f['c3'][1]}, {$f['c3'][2]})",
                'c4' => "({$f['c4'][0]}, {$f['c4'][1]}, {$f['c4'][2]})",
            ];

            // TAHAP 2: Normalisasi Matriks R (Benefit & Cost)
            $l_min = 0.25; 
            $r = [
                'c1' => [$f['c1'][0], $f['c1'][1], $f['c1'][2]], // Benefit
                'c2' => [$f['c2'][0], $f['c2'][1], $f['c2'][2]], // Benefit
                'c3' => [$f['c3'][0], $f['c3'][1], $f['c3'][2]], // Benefit
                'c4' => [ // Cost: (l_min/u, l_min/m, l_min/l)
                    $f['c4'][2] > 0 ? round($l_min / $f['c4'][2], 2) : 0, 
                    $f['c4'][1] > 0 ? round($l_min / $f['c4'][1], 2) : 0, 
                    $f['c4'][0] > 0 ? round($l_min / $f['c4'][0], 2) : 0
                ]
            ];

            $matriksR[] = [
                'nama' => $alt->nama_alternatif,
                'c1' => "({$r['c1'][0]}, {$r['c1'][1]}, {$r['c1'][2]})",
                'c2' => "({$r['c2'][0]}, {$r['c2'][1]}, {$r['c2'][2]})",
                'c3' => "({$r['c3'][0]}, {$r['c3'][1]}, {$r['c3'][2]})",
                'c4' => "({$r['c4'][0]}, {$r['c4'][1]}, {$r['c4'][2]})",
            ];

            // TAHAP 3, 4, 5: Pembobotan V, Jarak D+ D-, dan Kedekatan Kedekatan Relatif
            $dPlus = 0; $dMin = 0;
            foreach (['c1', 'c2', 'c3', 'c4'] as $key) {
                $kodeK = strtoupper($key);
                $bobotArr = $this->parseFuzzy($kriterias[$kodeK]->bobot_fuzzy);
                
                // Matriks Terbobot V = R * W
                $v0 = $r[$key][0] * $bobotArr[0];
                $v1 = $r[$key][1] * $bobotArr[1];
                $v2 = $r[$key][2] * $bobotArr[2];

                // Hitung Jarak Vertex ke FPIS (Ideal+) dan FNIS (Ideal-)
                // FPIS = (1,1,1), FNIS = (0,0,0)
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

        // SORTING: Urutkan berdasarkan Nilai V tertinggi
        usort($hasilAkhir, fn($a, $b) => $b['nilai_v'] <=> $a['nilai_v']);

        // Tambahkan Ranking
        foreach ($hasilAkhir as $index => $item) {
            $hasilAkhir[$index]['rank'] = $index + 1;
        }

        return response()->json([
            'status' => true,
            'tahun' => $tahun,
            'matriks_fuzzy' => array_slice($matriksFuzzy, 0, 50), // Batasi 50 untuk preview
            'matriks_r' => array_slice($matriksR, 0, 50),
            'hasil_akhir' => $hasilAkhir // Tampilkan semua hasil akhir
        ]);
    }

    // --- FUNGSI HELPER KONVERSI FUZZY (Sesuai Skala Penilaian) ---

    private function konversiFuzzyC1($nilai) { 
        if ($nilai >= 20000) return [0.75, 1.00, 1.00];
        if ($nilai >= 10000) return [0.50, 0.75, 1.00];
        if ($nilai >= 5000)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC2($nilai) { 
        if ($nilai >= 50000000) return [0.75, 1.00, 1.00];
        if ($nilai >= 25000000) return [0.50, 0.75, 1.00];
        if ($nilai >= 10000000) return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC3($nilai) { 
        if ($nilai >= 300) return [0.75, 1.00, 1.00];
        if ($nilai >= 150) return [0.50, 0.75, 1.00];
        if ($nilai >= 50)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function konversiFuzzyC4($nilai) { 
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