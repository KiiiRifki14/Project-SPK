<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Services\SawCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LaporanController extends Controller
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

        $ranking = collect($sawResult['ranking']);

        return view('pages.laporan', [
            'pengaturan' => $pengaturan,
            'listLolos' => $ranking->where('status', 'Lolos')->values(),
            'listCadangan' => $ranking->where('status', 'Cadangan')->values(),
        ]);
    }

    public function updatePengaturan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_sk' => ['required', 'string', 'max:100'],
            'nama_periode' => ['required', 'string', 'max:160'],
            'tanggal_sk' => ['required', 'date'],
            'ketua_panitia_nama' => ['required', 'string', 'max:120'],
            'kepala_bps_nama' => ['required', 'string', 'max:120'],
            'kepala_bps_nip' => ['required', 'string', 'max:50'],
        ]);

        Pengaturan::current()->update($validated);

        return redirect()->route('laporan.index')->with('alert', [
            'type' => 'success',
            'message' => 'Pengaturan surat berita acara resmi BPS Subang berhasil diperbarui!',
        ]);
    }
}
