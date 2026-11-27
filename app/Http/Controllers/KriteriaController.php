<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Services\SawCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class KriteriaController extends Controller
{
    public function __construct(private SawCalculatorService $sawService) {}

    public function index(): View
    {
        $kriteria = Kriteria::query()->orderBy('kode')->get();
        $totalKepentingan = (int) $kriteria->sum('tingkat_kepentingan');
        $validation = $this->sawService->validateBobot($kriteria);

        return view('pages.kriteria', [
            'kriteria' => $kriteria,
            'totalKepentingan' => $totalKepentingan,
            'validation' => $validation,
            'subkriteriaRules' => config('spk.subkriteria_rules'),
            'tingkatOptions' => config('spk.tingkat_kepentingan_options'),
        ]);
    }

    public function update(Request $request, Kriteria $kriteria): RedirectResponse
    {
        $validated = $request->validate([
            'tingkat_kepentingan' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        $kriteria->update([
            'tingkat_kepentingan' => $validated['tingkat_kepentingan'],
        ]);

        $this->sawService->syncDatabaseWeights();

        return redirect()->route('kriteria.index')->with('alert', [
            'type' => 'success',
            'message' => "Tingkat kepentingan {$kriteria->kode} berhasil diubah ke skala {$validated['tingkat_kepentingan']}. Seluruh bobot otomatis disesuaikan proporsional!",
        ]);
    }

    public function resetDefault(): RedirectResponse
    {
        foreach (config('spk.default_kriteria') as $item) {
            Kriteria::query()->updateOrCreate(
                ['kode' => $item['kode']],
                $item
            );
        }

        return redirect()->route('kriteria.index')->with('alert', [
            'type' => 'info',
            'message' => 'Kriteria dikembalikan ke konfigurasi standar akademik PRD Final BPS Subang (Total Kepentingan: 18).',
        ]);
    }
}
