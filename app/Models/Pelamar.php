<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelamar extends Model
{
    protected $table = 'pelamars';

    protected $fillable = [
        'kode_pelamar',
        'nik',
        'nama',
        'jenis_kelamin',
        'no_hp',
        'kecamatan',
        'c1_mentah',
        'c2_mentah',
        'c3_mentah',
        'c4_mentah',
        'c5_mentah',
    ];

    protected function casts(): array
    {
        return [
            'c1_mentah' => 'float',
            'c2_mentah' => 'integer',
            'c3_mentah' => 'float',
            'c5_mentah' => 'float',
        ];
    }
}
