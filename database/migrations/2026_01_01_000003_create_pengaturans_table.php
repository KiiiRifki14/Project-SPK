<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturans', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('kuota_lolos')->default(5);
            $table->unsignedInteger('kuota_cadangan')->default(2);
            $table->string('nama_periode', 160)->default('Survei Pertanian & Ekonomi BPS Subang 2026');
            $table->string('nomor_sk', 100)->default('B-045/32130/VS.100/2026');
            $table->date('tanggal_sk');
            $table->string('kepala_bps_nama', 120)->default('Ir. H. Dedi Suryadi, M.M.');
            $table->string('kepala_bps_nip', 50)->default('19740512 199803 1 002');
            $table->string('ketua_panitia_nama', 120)->default('Muhammad Rifki Hermaulana');
            $table->string('instansi', 160)->default('Badan Pusat Statistik Kabupaten Subang');
            $table->text('alamat_instansi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturans');
    }
};
