<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\PenilaianKriteria;
use Illuminate\Support\Facades\DB;

class PerhitunganController extends Controller
{
    public function hitungFuzzyTopsis(Request $request)
    {
        ini_set('max_execution_time', 600); 
        ini_set('memory_limit', '1G');

        $tahun = $request->query('tahun', date('Y'));

        // ========================================================
        // 1. SINKRONISASI TRANSAKSI -> ALTERNATIF
        // ========================================================
        $pelangganDariTransaksi = DB::table('transaksi')
        ->join('pelanggan', 'transaksi.id_pelanggan', '=', 'pelanggan.id_pelanggan')
        ->whereYear('transaksi.tanggal', $tahun)
        ->select('transaksi.id_pelanggan', 'pelanggan.nama_pelanggan')
        ->whereNotIn('transaksi.id_pelanggan', function($query) {
            $query->select('id_pelanggan')->from('alternatifs');
        })
        ->distinct()
        ->get();

        foreach ($pelangganDariTransaksi as $p) {
            $lastAlt = Alternatif::orderBy('id_alternatif', 'desc')->first();
            $lastNum = $lastAlt ? intval(substr($lastAlt->kode_alternatif, 1)) : 0;
            $newKode = "A" . str_pad($lastNum + 1, 3, '0', STR_PAD_LEFT);

            Alternatif::create([
                'id_pelanggan'    => $p->id_pelanggan,
                'nama_alternatif' => $p->nama_pelanggan,
                'kode_alternatif' => $newKode,
                'pedagang'        => '-' // WAJIB karena kolom NOT NULL
            ]);
        }

        // ========================================================
        // 2. AMBIL DATA KRITERIA
        // ========================================================
        $kriteriasObj = Kriteria::all();
        $kriteriasByKode = $kriteriasObj->keyBy('kode_kriteria');

        // ========================================================
        // 3. AMBIL DATA TRANSAKSI
        // ========================================================
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

        // ========================================================
        // 4. AMBIL ALTERNATIF SESUAI TAHUN
        // ========================================================
        $alternatifs = Alternatif::whereIn(
            'id_pelanggan',
            $allStats->keys()
        )->get();

        // ========================================================
        // 5. UPDATE PENILAIAN KRITERIA
        // ========================================================
        PenilaianKriteria::whereIn(
            'id_alternatif',
            $alternatifs->pluck('id_alternatif')
        )->delete();

        foreach ($alternatifs as $alt) {
            $stats = $allStats->get($alt->id_pelanggan);

            foreach ($kriteriasByKode as $kode => $k) {
                $field = strtolower($kode);
                $nilai = $stats ? $stats->$field : 0;

                PenilaianKriteria::updateOrCreate(
                    [
                        'id_alternatif' => $alt->id_alternatif,
                        'id_kriteria'   => $k->id_kriteria
                    ],
                    [
                        'nilai_mentah' => $nilai
                    ]
                );
            }
        }

        // ========================================================
        // 🔥 TAMBAHAN: MATRIKS FUZZY
        // ========================================================
        $matriksFuzzy = [];

        foreach ($alternatifs as $alt) {
            $row = ['nama' => $alt->nama_alternatif];

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);

                $nilai = PenilaianKriteria::where([
                    'id_alternatif' => $alt->id_alternatif,
                    'id_kriteria' => $k->id_kriteria
                ])->value('nilai_mentah') ?? 0;

                $method = "konversiFuzzy" . $kode;
                $fuzzy = method_exists($this, $method)
                    ? $this->$method($nilai)
                    : [0,0.25,0.5];

                $row[$kode] = "(" . implode(",", $fuzzy) . ")";
            }

            $matriksFuzzy[] = $row;
        }

        // ========================================================
        // 🔥 TAMBAHAN: MATRIKS R
        // ========================================================
        $matriksR = [];

        foreach ($alternatifs as $alt) {
            $row = ['nama' => $alt->nama_alternatif];

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);

                $nilai = PenilaianKriteria::where([
                    'id_alternatif' => $alt->id_alternatif,
                    'id_kriteria' => $k->id_kriteria
                ])->value('nilai_mentah') ?? 0;

                $method = "konversiFuzzy" . $kode;
                $f = method_exists($this, $method)
                    ? $this->$method($nilai)
                    : [0,0.25,0.5];

                if ($k->atribut == 'Benefit') {
                    $r = $f;
                } else {
                    $l_min = 0.25;
                    $r = [
                        $f[2] > 0 ? $l_min / $f[2] : 0,
                        $f[1] > 0 ? $l_min / $f[1] : 0,
                        $f[0] > 0 ? $l_min / $f[0] : 0
                    ];
                }

                $row[$kode] = "(" . implode(",", array_map(fn($v)=>round($v,3), $r)) . ")";
            }

            $matriksR[] = $row;
        }

        // ========================================================
        // 6. PROSES TOPSIS
        // ========================================================
        $penilaians = PenilaianKriteria::whereIn(
            'id_alternatif',
            $alternatifs->pluck('id_alternatif')
        )->get()->groupBy('id_alternatif');

        $hasilAkhir = [];

        foreach ($alternatifs as $alt) {
            $nilaiAlt = $penilaians->get($alt->id_alternatif)?->keyBy(function($item) {
                return strtoupper($item->kriteria->kode_kriteria);
            });

            $f = []; 
            $r = [];

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $nilaiRiil = $nilaiAlt && isset($nilaiAlt[$kode]) ? $nilaiAlt[$kode]->nilai_mentah : 0;

                $method = "konversiFuzzy" . $kode;
                $f[$kode] = method_exists($this, $method) ? $this->$method($nilaiRiil) : [0,0.25,0.5];

                if ($k->atribut == 'Benefit') {
                    $r[$kode] = $f[$kode];
                } else {
                    $l_min = 0.25;
                    $r[$kode] = [
                        $f[$kode][2] > 0 ? $l_min / $f[$kode][2] : 0,
                        $f[$kode][1] > 0 ? $l_min / $f[$kode][1] : 0,
                        $f[$kode][0] > 0 ? $l_min / $f[$kode][0] : 0
                    ];
                }
            }

            $dPlus = 0; 
            $dMin = 0;

            foreach ($kriteriasObj as $k) {
                $kode = strtoupper($k->kode_kriteria);
                $bobotArr = $this->parseFuzzy($k->bobot_fuzzy);

                $v0 = $r[$kode][0] * $bobotArr[0];
                $v1 = $r[$kode][1] * $bobotArr[1];
                $v2 = $r[$kode][2] * $bobotArr[2];

                $dPlus += sqrt((1/3)*(pow($v0-1,2)+pow($v1-1,2)+pow($v2-1,2)));
                $dMin  += sqrt((1/3)*(pow($v0-0,2)+pow($v1-0,2)+pow($v2-0,2)));
            }

            $nilaiV = ($dPlus + $dMin) == 0 ? 0 : $dMin / ($dPlus + $dMin);

            $hasilAkhir[] = [
                'nama' => $alt->nama_alternatif,
                'kode' => $alt->kode_alternatif,
                'd_plus' => round($dPlus, 4),
                'd_min'  => round($dMin, 4),
                'nilai_v' => round($nilaiV, 4)
            ];
        }

        // ========================================================
        // 7. RANKING
        // ========================================================
        usort($hasilAkhir, fn($a, $b) => $b['nilai_v'] <=> $a['nilai_v']);

        $totalN = count($hasilAkhir);
        $batasP1 = ceil($totalN * 0.1);
        $batasP2 = ceil($totalN * 0.3);
        $batasP3 = ceil($totalN * 0.6);

        foreach ($hasilAkhir as $i => $item) {
            $rank = $i + 1;
            $hasilAkhir[$i]['rank'] = $rank;

            if ($rank <= $batasP1) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Tinggi';
                $hasilAkhir[$i]['diskon'] = 15;
            } elseif ($rank <= $batasP2) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Sedang';
                $hasilAkhir[$i]['diskon'] = 10;
            } elseif ($rank <= $batasP3) {
                $hasilAkhir[$i]['status_prioritas'] = 'Prioritas Rendah';
                $hasilAkhir[$i]['diskon'] = 5;
            } else {
                $hasilAkhir[$i]['status_prioritas'] = 'Tidak Prioritas';
                $hasilAkhir[$i]['diskon'] = 0;
            }
        }

        return response()->json([
            'status' => true,
            'tahun' => $tahun,
            'total_pelanggan' => $totalN,
            'hasil_akhir' => $hasilAkhir,
            'matriks_fuzzy' => $matriksFuzzy,
            'matriks_r' => $matriksR
        ]);
    }

    // ================= HELPER =================
    private function konversiFuzzyC1($n){
        if ($n >= 20000) return [0.75,1,1];
        if ($n >= 10000) return [0.5,0.75,1];
        if ($n >= 5000) return [0.25,0.5,0.75];
        return [0,0.25,0.5];
    }

    private function konversiFuzzyC2($n){
        if ($n >= 50000000) return [0.75,1,1];
        if ($n >= 25000000) return [0.5,0.75,1];
        if ($n >= 10000000) return [0.25,0.5,0.75];
        return [0,0.25,0.5];
    }

    private function konversiFuzzyC3($n){
        if ($n >= 300) return [0.75,1,1];
        if ($n >= 150) return [0.5,0.75,1];
        if ($n >= 50) return [0.25,0.5,0.75];
        return [0,0.25,0.5];
    }

    private function konversiFuzzyC4($n){
        if ($n >= 70) return [0.75,1,1];
        if ($n >= 50) return [0.5,0.75,1];
        if ($n >= 20) return [0.25,0.5,0.75];
        return [0,0.25,0.5];
    }

    private function parseFuzzy($str){
        $clean = str_replace(['(',')',' '],'',$str);
        return array_map('floatval', explode(',', $clean));
    }
}