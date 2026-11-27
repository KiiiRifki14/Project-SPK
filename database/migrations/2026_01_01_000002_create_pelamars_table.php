<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelamars', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pelamar', 25)->unique();
            $table->string('nik', 20)->index();
            $table->string('nama', 120);
            $table->string('jenis_kelamin', 1)->default('L'); // L | P
            $table->string('no_hp', 25)->nullable();
            $table->string('kecamatan', 80);
            $table->decimal('c1_mentah', 6, 2)->default(0); // Nilai Ujian Kompetensi (0-100)
            $table->unsignedSmallInteger('c2_mentah')->default(0); // Pengalaman Survei (kali)
            $table->decimal('c3_mentah', 6, 2)->default(0); // Kemahiran CAPI (0-100)
            $table->string('c4_mentah', 20)->default('SMA/SMK'); // S1 | D3 | SMA/SMK (tanpa angka crisp di DB)
            $table->decimal('c5_mentah', 6, 2)->default(1.00); // Jarak Domisili (KM, min 0.1)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelamars');
    }
};
