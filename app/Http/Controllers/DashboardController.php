<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Services\SawCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class DashboardController extends Controller
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

        $kecamatanCounts = $pelamar
            ->groupBy(fn (Pelamar $p) => $p->kecamatan ?: 'Lainnya')
            ->map(fn ($group) => $group->count())
            ->sortDesc();

        return view('pages.dashboard', [
            'pelamar' => $pelamar,
            'kriteria' => $kriteria,
            'pengaturan' => $pengaturan,
            'sawResult' => $sawResult,
            'kecamatanCounts' => $kecamatanCounts,
            'highestCandidate' => $sawResult['ranking'][0] ?? null,
        ]);
    }

    public function loadSample(): RedirectResponse
    {
        Pelamar::query()->delete();
        foreach (config('spk.sample_pelamar') as $item) {
            Pelamar::query()->create($item);
        }

        return redirect()->back()->with('alert', [
            'type' => 'success',
            'message' => '8 data kandidat pelamar asli Kabupaten Subang berhasil dimuat kembali!',
        ]);
    }

    public function resetAll(): RedirectResponse
    {
        Kriteria::query()->delete();
        foreach (config('spk.default_kriteria') as $item) {
            Kriteria::query()->create($item);
        }

        Pelamar::query()->delete();
        foreach (config('spk.sample_pelamar') as $item) {
            Pelamar::query()->create($item);
        }

        Pengaturan::query()->delete();
        Pengaturan::query()->create(config('spk.default_pengaturan'));

        return redirect()->back()->with('alert', [
            'type' => 'info',
            'message' => 'Seluruh data kriteria, pelamar, dan pengaturan SK berhasil di-reset ke standar awal PRD v2.0!',
        ]);
    }
}
