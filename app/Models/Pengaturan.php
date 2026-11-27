<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    protected $table = 'pengaturans';

    protected $fillable = [
        'kuota_lolos',
        'kuota_cadangan',
        'nama_periode',
        'nomor_sk',
        'tanggal_sk',
        'kepala_bps_nama',
        'kepala_bps_nip',
        'ketua_panitia_nama',
        'instansi',
        'alamat_instansi',
    ];

    protected function casts(): array
    {
        return [
            'kuota_lolos' => 'integer',
            'kuota_cadangan' => 'integer',
            'tanggal_sk' => 'date',
        ];
    }

    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create(config('spk.default_pengaturan'));
    }
}
