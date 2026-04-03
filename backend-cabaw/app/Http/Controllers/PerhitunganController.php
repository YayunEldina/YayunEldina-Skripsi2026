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

        // Ambil kriteria dan jadikan Key (C1, C2, dst)
        $kriterias = Kriteria::all()->keyBy('kode_kriteria'); 
        
        if (!isset($kriterias['C1'], $kriterias['C2'], $kriterias['C3'], $kriterias['C4'])) {
            return response()->json(['message' => 'Data Kriteria C1-C4 tidak lengkap di database'], 500);
        }

        $alternatifs = Alternatif::orderByRaw('LENGTH(kode_alternatif) ASC')
                                  ->orderBy('kode_alternatif', 'ASC')
                                  ->get();

        $matriksFuzzy = [];
        $matriksR = [];
        $matriksV = [];
        $hasilAkhir = [];

        foreach ($alternatifs as $alt) {
            // QUERY DISESUAIKAN DENGAN NAMA KOLOM DI DATABASE ANDA
            $stats = DB::table('transaksi') // Nama tabel: transaksi
                ->where('id_pelanggan', $alt->id_pelanggan)
                ->whereYear('tanggal', $tahun) // Kolom: tanggal
                ->select(
                    DB::raw('COALESCE(SUM(total_pembelian), 0) as c1'), // Kolom: total_pembelian
                    DB::raw('COALESCE(SUM(total_harga), 0) as c2'),     // Kolom: total_harga
                    DB::raw('COUNT(id_transaksi) as c3'),             // Kolom: id_transaksi
                    DB::raw('COALESCE(AVG(total_pembelian), 0) as c4') // Kolom: total_pembelian
                )->first();

            // Tahap 1: Fuzzifikasi
            $f = [
                'c1' => $this->konversiFuzzy($stats->c1),
                'c2' => $this->konversiFuzzy($stats->c2),
                'c3' => $this->konversiFuzzy($stats->c3),
                'c4' => $this->konversiFuzzy($stats->c4),
            ];
            
            $matriksFuzzy[] = [
                'nama' => $alt->nama_alternatif,
                'c1' => "({$f['c1'][0]}, {$f['c1'][1]}, {$f['c1'][2]})",
                'c2' => "({$f['c2'][0]}, {$f['c2'][1]}, {$f['c2'][2]})",
                'c3' => "({$f['c3'][0]}, {$f['c3'][1]}, {$f['c3'][2]})",
                'c4' => "({$f['c4'][0]}, {$f['c4'][1]}, {$f['c4'][2]})",
            ];

            // Tahap 2: Normalisasi R (Sesuai Rumus Skripsi)
            $r = [];
            // Benefit (C1, C2, C3)
            foreach(['c1', 'c2', 'c3'] as $k) {
                $r[$k] = [round($f[$k][0]/1, 2), round($f[$k][1]/1, 2), round($f[$k][2]/1, 2)];
            }
            // Cost (C4) - Rumus: l-/u, l-/m, l-/l
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

            // Tahap 3: Terbobot Y
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
                'c1' => "({$v['c1'][0]}, {$v['c1'][1]}, {$v['c1'][2]})",
                'c2' => "({$v['c2'][0]}, {$v['c2'][1]}, {$v['c2'][2]})",
                'c3' => "({$v['c3'][0]}, {$v['c3'][1]}, {$v['c3'][2]})",
                'c4' => "({$v['c4'][0]}, {$v['c4'][1]}, {$v['c4'][2]})",
            ];

            // Tahap 4: Jarak D+ dan D-
            $dPlus = 0; $dMin = 0;
            foreach ($v as $val) {
                $dPlus += sqrt((1/3) * (pow($val[0]-1, 2) + pow($val[1]-1, 2) + pow($val[2]-1, 2)));
                $dMin += sqrt((1/3) * (pow($val[0]-0, 2) + pow($val[1]-0, 2) + pow($val[2]-0, 2)));
            }

            // Tahap 5: Preferensi V
            $pembagi = $dPlus + $dMin;
            $nilaiV = ($pembagi == 0) ? 0 : ($dMin / $pembagi);

            $hasilAkhir[] = [
                'nama' => $alt->nama_alternatif,
                'd_plus' => round($dPlus, 4),
                'd_min' => round($dMin, 4),
                'nilai_v' => round($nilaiV, 4)
            ];
        }

        usort($hasilAkhir, fn($a, $b) => $b['nilai_v'] <=> $a['nilai_v']);

        return response()->json([
            'matriks_fuzzy' => $matriksFuzzy,
            'matriks_r' => $matriksR,
            'matriks_v' => $matriksV,
            'hasil_akhir' => $hasilAkhir
        ]);
    }

    private function konversiFuzzy($nilai) {
        if ($nilai >= 100) return [0.75, 1.00, 1.00];
        if ($nilai >= 50)  return [0.50, 0.75, 1.00];
        if ($nilai >= 10)  return [0.25, 0.50, 0.75];
        return [0.00, 0.25, 0.50];
    }

    private function parseFuzzy($str) {
        $clean = str_replace(['(', ')', ' '], '', $str);
        return array_map('floatval', explode(',', $clean));
    }
}