<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kriterias', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 10)->unique();
            $table->string('nama', 120);
            $table->string('sifat', 20)->default('benefit'); // benefit | cost
            $table->unsignedTinyInteger('tingkat_kepentingan')->default(3); // skala 1-5
            $table->decimal('bobot', 8, 4)->default(0.2000);
            $table->string('satuan', 30)->default('Poin');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriterias');
    }
};
