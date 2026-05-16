<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KriteriaSeeder extends Seeder
{
    public function run()
    {
        // C1 = Bobot 4 -> Baik
        DB::table('kriterias')
            ->where('kode_kriteria', 'C1')
            ->update([
                'bobot' => 4,
                'bobot_fuzzy' => '(0.50, 0.75, 1.00)',
                'updated_at' => Carbon::now()
            ]);

        // C2 = Bobot 3 -> Cukup
        DB::table('kriterias')
            ->where('kode_kriteria', 'C2')
            ->update([
                'bobot' => 3,
                'bobot_fuzzy' => '(0.25, 0.50, 0.75)',
                'updated_at' => Carbon::now()
            ]);

        // C3 = Bobot 3 -> Cukup
        DB::table('kriterias')
            ->where('kode_kriteria', 'C3')
            ->update([
                'bobot' => 3,
                'bobot_fuzzy' => '(0.25, 0.50, 0.75)',
                'updated_at' => Carbon::now()
            ]);

        // C4 = Bobot 2 -> Kurang
        DB::table('kriterias')
            ->where('kode_kriteria', 'C4')
            ->update([
                'bobot' => 2,
                'bobot_fuzzy' => '(0.00, 0.25, 0.50)',
                'updated_at' => Carbon::now()
            ]);
    }
}