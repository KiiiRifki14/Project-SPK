<?php

namespace App\Providers;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Services\SawCalculatorService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        View::composer('layouts.app', function ($view): void {
            if (! Schema::hasTable('kriterias') || ! Schema::hasTable('pelamars') || ! Schema::hasTable('pengaturans')) {
                return;
            }

            $kriterias = Kriteria::query()->orderBy('kode')->get();
            $pelamarCount = Pelamar::query()->count();
            $pengaturan = Pengaturan::current();
            $bobotValidation = app(SawCalculatorService::class)->validateBobot($kriterias);

            $view->with([
                'navPelamarCount' => $pelamarCount,
                'navKriteriaCount' => $kriterias->count(),
                'navBobotValid' => $bobotValidation['isValid'],
                'navKuotaLolos' => $pengaturan->kuota_lolos,
            ]);
        });
    }
}
