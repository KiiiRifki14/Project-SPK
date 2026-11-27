<?php

namespace Database\Seeders;

use App\Models\Kriteria;
use App\Models\Pelamar;
use App\Models\Pengaturan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Bawaan RBAC (Superadmin BPS & Panitia Seleksi)
        User::query()->updateOrCreate(
            ['email' => 'superadmin@bpssubang.go.id'],
            [
                'name' => 'Muhammad Rifki Hermaulana',
                'role' => 'superadmin',
                'jabatan' => 'Superadmin BPS Kab. Subang',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'panitia@bpssubang.go.id'],
            [
                'name' => 'Panitia Seleksi Mitra',
                'role' => 'panitia',
                'jabatan' => 'Panitia Seleksi Rekrutmen (D3 SI Polsub)',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Kriteria Standar PRD Final v2.0 (Total Kepentingan = 18)
        foreach (config('spk.default_kriteria') as $kriteria) {
            Kriteria::query()->updateOrCreate(
                ['kode' => $kriteria['kode']],
                $kriteria
            );
        }

        // 3. 8 Data Sampel Pelamar Asli Kabupaten Subang
        foreach (config('spk.sample_pelamar') as $pelamar) {
            Pelamar::query()->updateOrCreate(
                ['kode_pelamar' => $pelamar['kode_pelamar']],
                $pelamar
            );
        }

        // 4. Pengaturan Default Surat SK & Kuota
        if (Pengaturan::query()->count() === 0) {
            Pengaturan::query()->create(config('spk.default_pengaturan'));
        }
    }
}
