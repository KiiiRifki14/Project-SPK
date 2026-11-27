<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Services\SawCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RankingController extends Controller
{
    public function __construct(private SawCalculatorService $sawService) {}

    public function index(): View
    {
        $pelamar = Pelamar::query()->orderBy('id')->get();
        $kriteria = Kriteria::query()->orderBy('kode')->get();
        $pengaturan = Pengaturan::current();

        $sawResult = $this->sawService->calculate(
            $pelamar,
            $kriteria,
            $pengaturan->kuota_lolos,
            $pengaturan->kuota_cadangan
        );

        return view('pages.ranking', [
            'sawResult' => $sawResult,
            'pengaturan' => $pengaturan,
        ]);
    }

    public function updateKuota(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kuota_lolos' => ['required', 'integer', 'min:1', 'max:500'],
            'kuota_cadangan' => ['required', 'integer', 'min:0', 'max:500'],
        ]);

        Pengaturan::current()->update($validated);

        return redirect()->route('ranking.index')->with('alert', [
            'type' => 'success',
            'message' => "Alokasi kuota berhasil diperbarui (Lolos: {$validated['kuota_lolos']}, Cadangan: {$validated['kuota_cadangan']}).",
        ]);
    }

    public function exportExcel(): StreamedResponse
    {
        $pelamar = Pelamar::query()->orderBy('id')->get();
        $kriteria = Kriteria::query()->orderBy('kode')->get();
        $pengaturan = Pengaturan::current();

        $sawResult = $this->sawService->calculate(
            $pelamar,
            $kriteria,
            $pengaturan->kuota_lolos,
            $pengaturan->kuota_cadangan
        );

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Hasil Ranking SAW');

        $sheet->fromArray([
            'Peringkat',
            'Nama Lengkap',
            'NIK',
            'Kecamatan',
            'Nilai Ujian (C1)',
            'Pengalaman Survei (C2)',
            'Skor CAPI (C3)',
            'Pendidikan (C4)',
            'Jarak Wilayah KM (C5)',
            'Nilai Preferensi (V)',
            'Status Rekomendasi',
            'Tie-Breaker Aktif',
        ], null, 'A1');

        foreach ($sawResult['ranking'] as $idx => $r) {
            $sheet->fromArray([
                $r['ranking'],
                $r['nama'],
                (string) $r['nik'],
                $r['kecamatan'],
                $r['rawApplicant']['C1'],
                $r['rawApplicant']['C2'],
                $r['rawApplicant']['C3'],
                $r['rawApplicant']['pendidikan'],
                $r['rawApplicant']['C5'],
                number_format($r['scoreV'], 4, '.', ''),
                $r['status'],
                $r['isTie'] ? 'Ya' : 'Tidak',
            ], null, 'A'.($idx + 2));
        }

        $filename = 'Hasil_Ranking_Mitra_BPS_Subang_'.now()->format('Y-m-d').'.xlsx';

        return response()->streamDownload(function () use ($spreadsheet): void {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
