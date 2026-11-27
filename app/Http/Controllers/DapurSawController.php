<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Services\SawCalculatorService;
use Illuminate\View\View;

class DapurSawController extends Controller
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

        return view('pages.dapur', [
            'kriteria' => $kriteria,
            'sawResult' => $sawResult,
        ]);
    }
}
