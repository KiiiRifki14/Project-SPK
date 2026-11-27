<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DapurSawController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KriteriaController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PelamarController;
use App\Http\Controllers\RankingController;
use Illuminate\Support\Facades\Route;

// Guest Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');
});

// Authenticated SPK Routes (Panitia Seleksi & Superadmin BPS)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // 1. Dashboard & Sample Loader
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/sample/load', [DashboardController::class, 'loadSample'])->name('sample.load');
    Route::post('/system/reset', [DashboardController::class, 'resetAll'])
        ->middleware('superadmin')
        ->name('system.reset');

    // 2. Data Kriteria & Bobot (View: All | Edit & Reset: Superadmin ONLY)
    Route::get('/kriteria', [KriteriaController::class, 'index'])->name('kriteria.index');
    Route::put('/kriteria/{kriteria}', [KriteriaController::class, 'update'])
        ->middleware('superadmin')
        ->name('kriteria.update');
    Route::post('/kriteria/reset', [KriteriaController::class, 'resetDefault'])
        ->middleware('superadmin')
        ->name('kriteria.reset');

    // 3. Data Pelamar CRUD + Excel Import/Export
    Route::get('/pelamar', [PelamarController::class, 'index'])->name('pelamar.index');
    Route::post('/pelamar', [PelamarController::class, 'store'])->name('pelamar.store');
    Route::put('/pelamar/{pelamar}', [PelamarController::class, 'update'])->name('pelamar.update');
    Route::delete('/pelamar/{pelamar}', [PelamarController::class, 'destroy'])->name('pelamar.destroy');
    Route::get('/pelamar/export', [PelamarController::class, 'exportExcel'])->name('pelamar.export');
    Route::post('/pelamar/import', [PelamarController::class, 'importExcel'])->name('pelamar.import');

    // 4. Dapur Hitung SAW (4 Matriks Akademik)
    Route::get('/dapur-saw', [DapurSawController::class, 'index'])->name('dapur.index');

    // 5. Ranking & Kuota Dinamis + Export Excel
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking.index');
    Route::put('/ranking/kuota', [RankingController::class, 'updateKuota'])->name('ranking.kuota');
    Route::get('/ranking/export', [RankingController::class, 'exportExcel'])->name('ranking.export');

    // 6. Laporan Berita Acara SK BPS (Edit SK & Kop: Superadmin ONLY)
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::put('/laporan/pengaturan', [LaporanController::class, 'updatePengaturan'])
        ->middleware('superadmin')
        ->name('laporan.pengaturan');
});
