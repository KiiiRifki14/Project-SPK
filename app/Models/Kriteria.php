<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'kriterias';

    protected $fillable = [
        'kode',
        'nama',
        'sifat',
        'tingkat_kepentingan',
        'bobot',
        'satuan',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'tingkat_kepentingan' => 'integer',
            'bobot' => 'float',
        ];
    }

    public function isCost(): bool
    {
        return strtolower($this->sifat) === 'cost';
    }
}
