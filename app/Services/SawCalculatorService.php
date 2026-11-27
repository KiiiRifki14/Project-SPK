<?php

namespace App\Services;

use App\Models\Kriteria;
use App\Models\Pelamar;
use Illuminate\Support\Collection;

/**
 * Layanan Kalkulasi Metode Simple Additive Weighting (SAW)
 * Mengacu pada PRD Final v2.0.0 (Academic Revision) & Bab 5 Buku Ajar SPK Polsub
 * Seleksi Calon Mitra Statistik BPS Kabupaten Subang
 */
class SawCalculatorService
{
    /**
     * Konversi data mentah pelamar ke nilai tegas (crisp) skala 1 - 5 (PRD Bagian 2.2)
     *
     * @param  array<string, mixed>|Pelamar  $applicant
     * @return array{C1: int, C2: int, C3: int, C4: int, C5: int}
     */
    public function convertRawToCrisp(array|Pelamar $applicant): array
    {
        $data = $applicant instanceof Pelamar ? $applicant->toArray() : $applicant;

        // 1. C1: Nilai Ujian Kompetensi (Benefit)
        // >=85 -> 5 | 75-84.9 -> 4 | 65-74.9 -> 3 | 55-64.9 -> 2 | <55 -> 1
        $rawC1 = (float) ($data['c1_mentah'] ?? $data['C1'] ?? 0);
        $c1 = match (true) {
            $rawC1 >= 85 => 5,
            $rawC1 >= 75 => 4,
            $rawC1 >= 65 => 3,
            $rawC1 >= 55 => 2,
            default => 1,
        };

        // 2. C2: Pengalaman Lapangan (Benefit)
        // >=5 kali -> 5 | 3-4 kali -> 4 | 1-2 kali -> 3 | 0 kali -> 1
        $rawC2 = (float) ($data['c2_mentah'] ?? $data['C2'] ?? 0);
        $c2 = match (true) {
            $rawC2 >= 5 => 5,
            $rawC2 >= 3 => 4,
            $rawC2 >= 1 => 3,
            default => 1,
        };

        // 3. C3: Kemahiran CAPI (Benefit)
        // >=85 -> 5 | 75-84.9 -> 4 | 65-74.9 -> 3 | <65 -> 2
        $rawC3 = (float) ($data['c3_mentah'] ?? $data['C3'] ?? 0);
        $c3 = match (true) {
            $rawC3 >= 85 => 5,
            $rawC3 >= 75 => 4,
            $rawC3 >= 65 => 3,
            default => 2,
        };

        // 4. C4: Pendidikan Terakhir (Benefit — strictly derived from raw education string)
        // S1/D4 -> 5 | D3 -> 3 | SMA/SMK -> 2
        $rawEdu = $data['c4_mentah'] ?? $data['pendidikan'] ?? $data['C4'] ?? 'SMA/SMK';
        if (is_string($rawEdu)) {
            $norm = strtoupper(preg_replace('/\s+/', '', $rawEdu) ?? '');
            if (str_contains($norm, 'S1') || str_contains($norm, 'D4') || str_contains($norm, 'SARJANA')) {
                $c4 = 5;
            } elseif (str_contains($norm, 'D3') || str_contains($norm, 'DIPLOMA')) {
                $c4 = 3;
            } else {
                $c4 = 2;
            }
        } else {
            $num = (float) $rawEdu;
            $c4 = $num >= 4 ? 5 : ($num == 3 ? 3 : 2);
        }

        // 5. C5: Jarak Domisili ke Wilayah (Cost)
        // <=3 km -> 1 | 3.1-7 km -> 2 | 7.1-15 km -> 3 | 15.1-25 km -> 4 | >25 km -> 5
        // Proteksi batas bawah 0.1 km untuk menghindari division-by-zero
        $rawC5 = max(0.1, (float) ($data['c5_mentah'] ?? $data['C5'] ?? 0.1));
        $c5 = match (true) {
            $rawC5 <= 3.0 => 1,
            $rawC5 <= 7.0 => 2,
            $rawC5 <= 15.0 => 3,
            $rawC5 <= 25.0 => 4,
            default => 5,
        };

        return [
            'C1' => $c1,
            'C2' => $c2,
            'C3' => $c3,
            'C4' => $c4,
            'C5' => $c5,
        ];
    }

    /**
     * Hitung ulang bobot w_j otomatis dari Tingkat Kepentingan (skala 1-5)
     * Formula PRD 2.1: w_j = k_j / Sum(k)
     *
     * @param  Collection<int, Kriteria>|array<int, array<string, mixed>>  $criteria
     * @return array<int, array<string, mixed>>
     */
    public function calculateWeightsFromPriority(Collection|array $criteria): array
    {
        $items = $criteria instanceof Collection
            ? $criteria->map(fn ($c) => $c instanceof Kriteria ? $c->toArray() : $c)->values()->all()
            : array_values($criteria);

        if (count($items) === 0) {
            return [];
        }

        $totalKepentingan = array_reduce(
            $items,
            fn (int $sum, array $c): int => $sum + (int) ($c['tingkat_kepentingan'] ?? 1),
            0
        );

        if ($totalKepentingan === 0) {
            $equal = round(1 / count($items), 4);

            return array_map(fn (array $c): array => [
                ...$c,
                'bobot' => $equal,
                'perhitungan' => '1 / '.count($items),
            ], $items);
        }

        return array_map(function (array $c) use ($totalKepentingan): array {
            $k = (int) ($c['tingkat_kepentingan'] ?? 1);

            return [
                ...$c,
                'bobot' => round($k / $totalKepentingan, 4),
                'perhitungan' => "{$k} / {$totalKepentingan}",
            ];
        }, $items);
    }

    /**
     * Sinkronisasi & simpan bobot desimal semua kriteria di database dari tingkat_kepentingan
     */
    public function syncDatabaseWeights(): void
    {
        $kriterias = Kriteria::query()->orderBy('kode')->get();
        if ($kriterias->isEmpty()) {
            return;
        }

        $totalKepentingan = max(1, (int) $kriterias->sum('tingkat_kepentingan'));

        foreach ($kriterias as $kriteria) {
            $kriteria->update([
                'bobot' => round($kriteria->tingkat_kepentingan / $totalKepentingan, 4),
            ]);
        }
    }

    /**
     * Validasi jumlah total bobot kriteria agar mendekati 1.0 (toleransi pembulatan 4 desimal)
     *
     * @param  Collection<int, Kriteria>|array<int, array<string, mixed>>  $criteria
     * @return array{isValid: bool, total: float, diff: float}
     */
    public function validateBobot(Collection|array $criteria): array
    {
        $items = $criteria instanceof Collection
            ? $criteria->map(fn ($c) => $c instanceof Kriteria ? $c->toArray() : $c)->values()->all()
            : array_values($criteria);

        if (count($items) === 0) {
            return ['isValid' => false, 'total' => 0.0, 'diff' => 1.0];
        }

        $total = array_reduce($items, fn (float $sum, array $c): float => $sum + (float) ($c['bobot'] ?? 0), 0.0);
        $roundedTotal = round($total, 4);
        $diff = round(abs(1.0 - $roundedTotal), 4);

        return [
            'isValid' => $diff < 0.005,
            'total' => $roundedTotal,
            'diff' => $diff,
        ];
    }

    /**
     * Fungsi Inti Perhitungan SAW (Simple Additive Weighting)
     * Menghasilkan 4 dataset pembuktian ilmiah + Ranking & Tie-Breaker (PRD v2.0)
     *
     * @param  Collection<int, Pelamar>|array<int, array<string, mixed>>  $applicants
     * @param  Collection<int, Kriteria>|array<int, array<string, mixed>>  $criteria
     * @return array<string, mixed>
     */
    public function calculate(
        Collection|array $applicants,
        Collection|array $criteria,
        int $kuotaLolos = 5,
        int $kuotaCadangan = 2
    ): array {
        $appList = $applicants instanceof Collection
            ? $applicants->map(fn ($a) => $a instanceof Pelamar ? $a->toArray() : $a)->values()->all()
            : array_values($applicants);

        $critList = $criteria instanceof Collection
            ? $criteria->map(fn ($c) => $c instanceof Kriteria ? $c->toArray() : $c)->values()->all()
            : array_values($criteria);

        if (count($appList) === 0 || count($critList) === 0) {
            return [
                'matrixRaw' => [],
                'matrixX' => [],
                'extremes' => [],
                'matrixR' => [],
                'matrixWR' => [],
                'ranking' => [],
                'summary' => [
                    'totalPelamar' => 0,
                    'kuotaLolos' => $kuotaLolos,
                    'kuotaCadangan' => $kuotaCadangan,
                    'totalLolos' => 0,
                    'totalCadangan' => 0,
                    'totalTidakLolos' => 0,
                    'highestScore' => 0.0,
                    'lowestScore' => 0.0,
                ],
            ];
        }

        // 1. TABEL 1: DATA MENTAH (RAW INPUTS)
        $matrixRaw = [];
        foreach ($appList as $idx => $app) {
            $pendidikan = (string) ($app['c4_mentah'] ?? $app['pendidikan'] ?? 'SMA/SMK');
            $matrixRaw[] = [
                'id' => $app['id'] ?? ($idx + 1),
                'kode_pelamar' => $app['kode_pelamar'] ?? ('PLM-'.str_pad((string) ($idx + 1), 3, '0', STR_PAD_LEFT)),
                'nik' => $app['nik'] ?? '-',
                'nama' => $app['nama'] ?? ('Pelamar '.($idx + 1)),
                'kecamatan' => $app['kecamatan'] ?? '-',
                'pendidikan' => $pendidikan,
                'C1' => (float) ($app['c1_mentah'] ?? $app['C1'] ?? 0),
                'C2' => (int) ($app['c2_mentah'] ?? $app['C2'] ?? 0),
                'C3' => (float) ($app['c3_mentah'] ?? $app['C3'] ?? 0),
                'C4' => $pendidikan,
                'C5' => max(0.1, (float) ($app['c5_mentah'] ?? $app['C5'] ?? 0.1)),
            ];
        }

        // 2. TABEL 2: MATRIKS KEPUTUSAN AWAL X (DATA CRISP 1-5)
        $matrixX = [];
        foreach ($appList as $idx => $app) {
            $crisp = $this->convertRawToCrisp($app);
            $matrixX[] = [
                'id' => $app['id'] ?? ($idx + 1),
                'kode_pelamar' => $matrixRaw[$idx]['kode_pelamar'],
                'nik' => $matrixRaw[$idx]['nik'],
                'nama' => $matrixRaw[$idx]['nama'],
                'kecamatan' => $matrixRaw[$idx]['kecamatan'],
                'pendidikan' => $matrixRaw[$idx]['pendidikan'],
                'raw' => $matrixRaw[$idx],
                'crisp' => $crisp,
                'C1' => $crisp['C1'],
                'C2' => $crisp['C2'],
                'C3' => $crisp['C3'],
                'C4' => $crisp['C4'],
                'C5' => $crisp['C5'],
            ];
        }

        // 3. NILAI EKSTRIM (MAX / MIN) DARI MATRIKS CRISP X
        $extremes = [];
        foreach ($critList as $c) {
            $kode = $c['kode'];
            $crispValues = array_map(fn (array $row): float => (float) ($row[$kode] ?? 1), $matrixX);
            $extremes[$kode] = [
                'max' => count($crispValues) > 0 ? max($crispValues) : 5.0,
                'min' => count($crispValues) > 0 ? min($crispValues) : 1.0,
            ];
        }

        // 4. TABEL 3: MATRIKS TERNORMALISASI R (Benefit: x/max, Cost: min/x)
        $matrixR = [];
        foreach ($matrixX as $rowX) {
            $normalized = [];
            $normalizedRaw = [];

            foreach ($critList as $c) {
                $kode = $c['kode'];
                $isBenefit = strtolower((string) ($c['sifat'] ?? 'benefit')) === 'benefit';
                $xVal = (float) ($rowX[$kode] ?? 1);

                if ($isBenefit) {
                    $maxVal = (float) ($extremes[$kode]['max'] ?? 5);
                    $r = $maxVal == 0.0 ? 0.0 : ($xVal / $maxVal);
                } else {
                    $minVal = (float) ($extremes[$kode]['min'] ?? 1);
                    $r = $xVal == 0.0 ? 0.0 : ($minVal / $xVal);
                }

                $normalizedRaw[$kode] = $r;
                $normalized[$kode] = round($r, 4);
            }

            $matrixR[] = [
                'id' => $rowX['id'],
                'kode_pelamar' => $rowX['kode_pelamar'],
                'nik' => $rowX['nik'],
                'nama' => $rowX['nama'],
                'kecamatan' => $rowX['kecamatan'],
                'raw' => $rowX['raw'],
                'crisp' => $rowX['crisp'],
                'R' => $normalized,
                'R_raw' => $normalizedRaw,
            ];
        }

        // 5. TABEL 4: MATRIKS TERBOBOT (W * R) & NILAI PREFERENSI V_i
        $matrixWR = [];
        foreach ($matrixR as $rowR) {
            $weightedRow = [];
            $totalVi = 0.0;

            foreach ($critList as $c) {
                $kode = $c['kode'];
                $bobot = (float) ($c['bobot'] ?? 0);
                $rVal = (float) ($rowR['R_raw'][$kode] ?? 0);
                $wxr = $rVal * $bobot;

                $weightedRow[$kode] = round($wxr, 4);
                $totalVi += $wxr;
            }

            $matrixWR[] = [
                'id' => $rowR['id'],
                'kode_pelamar' => $rowR['kode_pelamar'],
                'nik' => $rowR['nik'],
                'nama' => $rowR['nama'],
                'kecamatan' => $rowR['kecamatan'],
                'rawApplicant' => $rowR['raw'],
                'crisp' => $rowR['crisp'],
                'R' => $rowR['R'],
                'WR' => $weightedRow,
                'scoreV' => round($totalVi, 4),
                'scoreV_raw' => $totalVi,
            ];
        }

        // 6. PERANGKINGAN & TIE-BREAKER BERLAPIS (PRD 2.4)
        // V_i (Desc) -> C1 Mentah (Desc) -> C2 Mentah (Desc) -> C5 Jarak Mentah (Asc)
        $sorted = $matrixWR;
        usort($sorted, function (array $a, array $b): int {
            $diff = $b['scoreV'] - $a['scoreV'];
            if (abs($diff) > 0.0001) {
                return $diff > 0 ? 1 : -1;
            }

            $c1A = (float) ($a['rawApplicant']['C1'] ?? 0);
            $c1B = (float) ($b['rawApplicant']['C1'] ?? 0);
            if ($c1B != $c1A) {
                return $c1B <=> $c1A;
            }

            $c2A = (float) ($a['rawApplicant']['C2'] ?? 0);
            $c2B = (float) ($b['rawApplicant']['C2'] ?? 0);
            if ($c2B != $c2A) {
                return $c2B <=> $c2A;
            }

            $c5A = (float) ($a['rawApplicant']['C5'] ?? 999);
            $c5B = (float) ($b['rawApplicant']['C5'] ?? 999);

            return $c5A <=> $c5B;
        });

        // 7. PENETAPAN STATUS KUOTA LOLOS & CADANGAN
        $countLolos = 0;
        $countCadangan = 0;
        $countTidakLolos = 0;
        $ranking = [];

        foreach ($sorted as $index => $item) {
            $rank = $index + 1;
            $status = 'Tidak Lolos';
            $badgeBg = 'bg-slate-100 text-slate-700';

            if ($rank <= $kuotaLolos) {
                $status = 'Lolos';
                $badgeBg = 'bg-emerald-100 text-emerald-800';
                $countLolos++;
            } elseif ($rank <= $kuotaLolos + $kuotaCadangan) {
                $status = 'Cadangan';
                $badgeBg = 'bg-amber-100 text-amber-800';
                $countCadangan++;
            } else {
                $countTidakLolos++;
            }

            $prevItem = $sorted[$index - 1] ?? null;
            $nextItem = $sorted[$index + 1] ?? null;
            $hasTie = ($prevItem !== null && abs($prevItem['scoreV'] - $item['scoreV']) < 0.0001)
                || ($nextItem !== null && abs($nextItem['scoreV'] - $item['scoreV']) < 0.0001);

            $ranking[] = [
                ...$item,
                'ranking' => $rank,
                'status' => $status,
                'badgeBg' => $badgeBg,
                'isTie' => $hasTie,
            ];
        }

        return [
            'matrixRaw' => $matrixRaw,
            'matrixX' => $matrixX,
            'extremes' => $extremes,
            'matrixR' => $matrixR,
            'matrixWR' => $matrixWR,
            'ranking' => $ranking,
            'summary' => [
                'totalPelamar' => count($appList),
                'kuotaLolos' => $kuotaLolos,
                'kuotaCadangan' => $kuotaCadangan,
                'totalLolos' => $countLolos,
                'totalCadangan' => $countCadangan,
                'totalTidakLolos' => $countTidakLolos,
                'highestScore' => count($ranking) > 0 ? $ranking[0]['scoreV'] : 0.0,
                'lowestScore' => count($ranking) > 0 ? $ranking[count($ranking) - 1]['scoreV'] : 0.0,
            ],
        ];
    }
}
