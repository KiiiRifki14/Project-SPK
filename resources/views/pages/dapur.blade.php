@extends('layouts.app')

@section('title', 'Dapur Hitung SAW (4 Tabel)')

@section('content')
@php
    $matrixRaw = $sawResult['matrixRaw'] ?? [];
    $matrixX = $sawResult['matrixX'] ?? [];
    $extremes = $sawResult['extremes'] ?? [];
    $matrixR = $sawResult['matrixR'] ?? [];
    $matrixWR = $sawResult['matrixWR'] ?? [];
@endphp

<div class="space-y-6 animate-fade-in pb-8">
    {{-- Top Header & Tab Switcher --}}
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <x-icon name="calculator" class="w-5 h-5 text-bps-blue" />
                <span>Dapur Hitung SAW (Pembuktian Akademik 4 Tabel)</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Transparansi komputasi SAW sesuai PRD Final v2.0.0 & Bab 5 Buku Ajar SPK Polsub.
            </p>
        </div>

        <div class="grid grid-cols-2 sm:flex items-center p-1 bg-white rounded-xl border border-slate-200 text-xs font-semibold gap-1">
            <button type="button" onclick="filterMatrix('all')" id="mtab-all" class="mtab-btn px-3 py-2 rounded-lg bg-bps-navy text-white font-bold transition-colors focus-ring">Semua (4 Tabel)</button>
            <button type="button" onclick="filterMatrix('raw')" id="mtab-raw" class="mtab-btn px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors focus-ring">1. Data Mentah</button>
            <button type="button" onclick="filterMatrix('x')" id="mtab-x" class="mtab-btn px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors focus-ring">2. Matriks X</button>
            <button type="button" onclick="filterMatrix('r')" id="mtab-r" class="mtab-btn px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors focus-ring">3. Matriks R</button>
            <button type="button" onclick="filterMatrix('wr')" id="mtab-wr" class="mtab-btn px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors focus-ring col-span-2 sm:col-span-1">4. Matriks W×R</button>
        </div>
    </div>

    {{-- Banner Formula Ilmiah --}}
    <div class="bg-bps-navy text-white p-4 sm:p-5 rounded-2xl border border-bps-navy-dark space-y-3">
        <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-200">
            <x-icon name="book-open" class="w-4 h-4 text-bps-blue" />
            <span>Formula Komputasi SAW PRD Final v2.0</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1.5">
                <p class="font-bold text-amber-300">1. Normalisasi Benefit (C1, C2, C3, C4)</p>
                <p class="font-mono text-xs bg-black/25 py-1.5 px-2.5 rounded-lg text-center font-bold text-white tabular-nums">r_ij = x_ij / max(x_j)</p>
                <p class="text-[11px] text-blue-100/90">Nilai crisp pelamar dibagi nilai crisp tertinggi kolom.</p>
            </div>
            <div class="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1.5">
                <p class="font-bold text-amber-300">2. Normalisasi Cost (C5 Jarak Domisili)</p>
                <p class="font-mono text-xs bg-black/25 py-1.5 px-2.5 rounded-lg text-center font-bold text-white tabular-nums">r_ij = min(x_j) / x_ij</p>
                <p class="text-[11px] text-blue-100/90">Nilai crisp terendah (terdekat) dibagi nilai crisp jarak pelamar.</p>
            </div>
            <div class="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1.5">
                <p class="font-bold text-amber-300">3. Preferensi Akhir (Skor V)</p>
                <p class="font-mono text-xs bg-black/25 py-1.5 px-2.5 rounded-lg text-center font-bold text-white tabular-nums">V_i = Σ (w_j × r_ij)</p>
                <p class="text-[11px] text-blue-100/90">Penjumlahan hasil kali matriks ternormalisasi dengan bobot w_j.</p>
            </div>
        </div>
    </div>

    {{-- TABEL 1: DATA MENTAH --}}
    <div id="section-raw" class="matrix-section bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span>Tabel 1: Data Mentah Pelamar (Raw Inputs)</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Nilai riil asli dari berkas & hasil tes sebelum konversi crisp</p>
            </div>
            <span class="px-2.5 py-1 text-[10.5px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">Data Mentah</span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @foreach($matrixRaw as $idx => $row)
                <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">{{ $idx + 1 }}</span>
                        <h4 class="font-bold text-slate-900 text-xs truncate">{{ $row['nama'] }}</h4>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5 text-center text-[10.5px]">
                        <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-[9px] font-bold">C1</span><span class="font-mono font-bold text-slate-800 tabular-nums">{{ $row['C1'] }}</span></div>
                        <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-[9px] font-bold">C2</span><span class="font-mono font-bold text-slate-800 tabular-nums">{{ $row['C2'] }}x</span></div>
                        <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-[9px] font-bold">C3</span><span class="font-mono font-bold text-slate-800 tabular-nums">{{ $row['C3'] }}</span></div>
                        <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-[9px] font-bold">C4</span><span class="font-bold text-slate-800">{{ $row['C4'] }}</span></div>
                        <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-[9px] font-bold">C5</span><span class="font-mono font-bold text-amber-700 tabular-nums">{{ $row['C5'] }}k</span></div>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-2.5 px-4 w-12 text-center">No</th>
                        <th class="py-2.5 px-4">Nama Pelamar</th>
                        <th class="py-2.5 px-4">Kecamatan</th>
                        <th class="py-2.5 px-3 text-right">C1: Ujian</th>
                        <th class="py-2.5 px-3 text-right">C2: Survei</th>
                        <th class="py-2.5 px-3 text-right">C3: CAPI</th>
                        <th class="py-2.5 px-3 text-center">C4: Pendidikan</th>
                        <th class="py-2.5 px-4 text-right">C5: Jarak</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($matrixRaw as $idx => $row)
                        <tr class="hover:bg-slate-50/70">
                            <td class="py-2.5 px-4 text-center font-mono text-slate-400 tabular-nums">{{ $idx + 1 }}</td>
                            <td class="py-2.5 px-4 font-bold text-slate-900">{{ $row['nama'] }}</td>
                            <td class="py-2.5 px-4 text-slate-600">{{ $row['kecamatan'] }}</td>
                            <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{{ $row['C1'] }}</td>
                            <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{{ $row['C2'] }} kali</td>
                            <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{{ $row['C3'] }}</td>
                            <td class="py-2.5 px-3 text-center"><span class="px-2 py-0.5 rounded bg-slate-100 font-bold text-[11px]">{{ $row['C4'] }}</span></td>
                            <td class="py-2.5 px-4 text-right font-mono font-bold text-amber-700 tabular-nums">{{ $row['C5'] }} km</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    {{-- TABEL 2: MATRIKS X (CRISP 1-5) --}}
    <div id="section-x" class="matrix-section bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-bps-navy text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span>Tabel 2: Matriks Keputusan Awal (X) — Data Crisp 1–5</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Hasil konversi subkriteria data mentah ke skala crisp baku 1–5 (PRD Bagian 2.2)</p>
            </div>
            <span class="px-2.5 py-1 text-[10.5px] font-bold rounded-lg bg-blue-50 text-bps-navy border border-blue-200">Skala Crisp 1–5</span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            <div class="p-3.5 bg-slate-50 space-y-2">
                <p class="text-[11px] font-bold text-bps-navy uppercase tracking-wider">Nilai Ekstrim Crisp:</p>
                <div class="grid grid-cols-5 gap-1.5 text-center">
                    @foreach($kriteria as $c)
                        <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span class="block text-[10px] font-extrabold text-slate-900">{{ $c->kode }}</span>
                            <span class="block text-[9px] text-slate-500 mt-0.5 font-mono">
                                {{ $c->isCost() ? 'Min: '.($extremes[$c->kode]['min'] ?? '-') : 'Max: '.($extremes[$c->kode]['max'] ?? '-') }}
                            </span>
                        </div>
                    @endforeach
                </div>
            </div>
            @foreach($matrixX as $idx => $row)
                <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center">{{ $idx + 1 }}</span>
                        <h4 class="font-bold text-slate-900 text-xs truncate">{{ $row['nama'] }}</h4>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5 text-center">
                        @foreach($kriteria as $c)
                            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                <span class="block text-[9px] font-bold text-slate-400">{{ $c->kode }}</span>
                                <span class="font-mono font-extrabold text-slate-800 text-xs tabular-nums">{{ $row[$c->kode] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[660px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-2.5 px-4 w-12 text-center">No</th>
                        <th class="py-2.5 px-4">Nama Pelamar</th>
                        <th class="py-2.5 px-4">Kecamatan</th>
                        @foreach($kriteria as $c)
                            <th class="py-2.5 px-3 text-right">
                                <div class="font-bold">{{ $c->kode }} (Crisp)</div>
                                <div class="text-[10px] font-normal lowercase text-slate-400">({{ $c->sifat }})</div>
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($matrixX as $idx => $row)
                        <tr class="hover:bg-slate-50/70">
                            <td class="py-2.5 px-4 text-center font-mono text-slate-400 tabular-nums">{{ $idx + 1 }}</td>
                            <td class="py-2.5 px-4 font-bold text-slate-900">{{ $row['nama'] }}</td>
                            <td class="py-2.5 px-4 text-slate-600">{{ $row['kecamatan'] }}</td>
                            @foreach($kriteria as $c)
                                <td class="py-2.5 px-3 text-right font-mono font-extrabold text-slate-800 tabular-nums">{{ $row[$c->kode] }}</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
                <tfoot class="bg-slate-50 font-bold border-t-2 border-slate-300 text-xs">
                    <tr>
                        <td colspan="3" class="py-2.5 px-4 text-bps-navy uppercase tracking-wider">Nilai Ekstrim Max(x_j) / Min(x_j) Crisp:</td>
                        @foreach($kriteria as $c)
                            <td class="py-2.5 px-3 text-right font-mono tabular-nums">
                                @if($c->isCost())
                                    <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Min: {{ $extremes[$c->kode]['min'] ?? '-' }}</span>
                                @else
                                    <span class="text-bps-blue-dark bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Max: {{ $extremes[$c->kode]['max'] ?? '-' }}</span>
                                @endif
                            </td>
                        @endforeach
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    {{-- TABEL 3: MATRIKS R --}}
    <div id="section-r" class="matrix-section bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-bps-blue text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span>Tabel 3: Matriks Ternormalisasi (R)</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Nilai r_ij hasil pembagian dengan nilai ekstrim (Presisi 4 desimal)</p>
            </div>
            <span class="px-2.5 py-1 text-[10.5px] font-bold rounded-lg bg-blue-50 text-bps-navy border border-blue-200">Skala [0, 1]</span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @foreach($matrixR as $idx => $row)
                <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-md bg-blue-50 text-bps-navy border border-blue-200 font-mono font-bold text-xs flex items-center justify-center">{{ $idx + 1 }}</span>
                        <h4 class="font-bold text-slate-900 text-xs truncate">{{ $row['nama'] }}</h4>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5 text-center">
                        @foreach($kriteria as $c)
                            @php $val = $row['R'][$c->kode] ?? 0; @endphp
                            <div class="p-1.5 rounded-lg border {{ $val == 1.0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100' }}">
                                <span class="block text-[9px] font-bold text-slate-400">r_{{ $c->kode }}</span>
                                <span class="font-mono text-[10.5px] font-bold tabular-nums {{ $val == 1.0 ? 'text-emerald-800' : 'text-slate-800' }}">{{ number_format($val, 4) }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[660px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-2.5 px-4 w-12 text-center">No</th>
                        <th class="py-2.5 px-4">Nama Pelamar</th>
                        @foreach($kriteria as $c)
                            <th class="py-2.5 px-3 text-right">
                                <div class="font-bold">r_{{ $c->kode }}</div>
                                <div class="text-[10px] font-normal lowercase text-slate-400">({{ $c->sifat }})</div>
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($matrixR as $idx => $row)
                        <tr class="hover:bg-slate-50/70">
                            <td class="py-2.5 px-4 text-center font-mono text-slate-400 tabular-nums">{{ $idx + 1 }}</td>
                            <td class="py-2.5 px-4 font-bold text-slate-900">{{ $row['nama'] }}</td>
                            @foreach($kriteria as $c)
                                @php $val = $row['R'][$c->kode] ?? 0; @endphp
                                <td class="py-2.5 px-3 text-right font-mono tabular-nums">
                                    <span class="{{ $val == 1.0 ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-slate-700 font-semibold' }}">
                                        {{ number_format($val, 4) }}
                                    </span>
                                </td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    {{-- TABEL 4: MATRIKS W x R & VEKTOR V --}}
    <div id="section-wr" class="matrix-section bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <span>Tabel 4: Matriks Terbobot (W × R) & Nilai Preferensi Akhir (V)</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Perkalian r_ij dengan bobot w_j serta total penjumlahan skor akhir V_i</p>
            </div>
            <span class="px-2.5 py-1 text-[10.5px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">Skor Akhir V_i</span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @foreach($matrixWR as $idx => $row)
                <div class="p-4 space-y-2.5">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs flex items-center justify-center">#{{ $idx + 1 }}</span>
                            <h4 class="font-bold text-slate-900 text-xs truncate">{{ $row['nama'] }}</h4>
                        </div>
                        <div class="text-right">
                            <span class="block text-[9px] font-bold uppercase text-bps-blue-dark">Skor V</span>
                            <span class="font-mono font-extrabold text-sm text-bps-navy tabular-nums">{{ number_format($row['scoreV'], 4) }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-5 gap-1.5 text-center">
                        @foreach($kriteria as $c)
                            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                <span class="block text-[9px] font-bold text-slate-400">{{ $c->kode }}</span>
                                <span class="font-mono font-bold text-[10px] text-slate-700 tabular-nums">{{ number_format($row['WR'][$c->kode] ?? 0, 4) }}</span>
                            </div>
                        @endforeach
                    </div>
                    <button type="button" onclick='showAuditPanel(@json($row))' class="w-full h-9 rounded-xl text-xs font-bold text-bps-navy bg-blue-50 hover:bg-blue-100 border border-blue-200 inline-flex items-center justify-center gap-1.5">
                        <x-icon name="eye" class="w-4 h-4 text-bps-blue" />
                        <span>Audit Rincian Rumus</span>
                    </button>
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[740px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-2.5 px-4 w-12 text-center">No</th>
                        <th class="py-2.5 px-4">Nama Pelamar</th>
                        @foreach($kriteria as $c)
                            <th class="py-2.5 px-3 text-right">
                                <div class="font-bold">{{ $c->kode }} × w_{{ $c->kode }}</div>
                                <div class="text-[10px] font-normal text-slate-400 font-mono">({{ number_format($c->bobot, 4) }})</div>
                            </th>
                        @endforeach
                        <th class="py-2.5 px-4 text-right bg-emerald-50 text-emerald-950 font-extrabold">Skor V_i</th>
                        <th class="py-2.5 px-4 text-center w-24">Audit</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($matrixWR as $idx => $row)
                        <tr class="hover:bg-slate-50/70">
                            <td class="py-2.5 px-4 text-center font-mono text-slate-400 tabular-nums">{{ $idx + 1 }}</td>
                            <td class="py-2.5 px-4 font-bold text-slate-900">{{ $row['nama'] }}</td>
                            @foreach($kriteria as $c)
                                <td class="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                                    {{ number_format($row['WR'][$c->kode] ?? 0, 4) }}
                                </td>
                            @endforeach
                            <td class="py-2.5 px-4 text-right font-mono font-extrabold text-sm text-bps-navy bg-emerald-50/40 tabular-nums">
                                {{ number_format($row['scoreV'], 4) }}
                            </td>
                            <td class="py-2.5 px-4 text-center">
                                <button type="button" onclick='showAuditPanel(@json($row))' class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue-dark border border-slate-200 transition-colors focus-ring">
                                    <x-icon name="eye" class="w-3.5 h-3.5 text-bps-blue" />
                                    <span>Audit</span>
                                </button>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    {{-- Panel Audit Rumus Eksplisit Kandidat --}}
    <div id="audit-panel" class="hidden bg-blue-50/80 border-2 border-bps-blue rounded-2xl p-5 space-y-4 animate-fade-in">
        <div class="flex items-start justify-between gap-3 border-b border-blue-200 pb-3">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-bps-navy text-white flex items-center justify-center font-extrabold text-xs">SAW</div>
                <div>
                    <h3 id="audit-title" class="font-extrabold text-slate-900 text-sm sm:text-base">Audit Komputasi Ilmiah</h3>
                    <p class="text-xs text-slate-600">Penjabaran Data Mentah → Crisp → Normalisasi R → Perkalian Bobot W → Skor V_i</p>
                </div>
            </div>
            <button type="button" onclick="document.getElementById('audit-panel').classList.add('hidden')" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900">
                <x-icon name="x" class="w-3.5 h-3.5" />
                <span>Tutup</span>
            </button>
        </div>
        <div id="audit-body" class="space-y-3 text-xs"></div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const kriteriaMeta = @json($kriteria);
    const extremesMeta = @json($extremes);

    function filterMatrix(tab) {
        const sections = ['raw', 'x', 'r', 'wr'];
        sections.forEach(s => {
            const el = document.getElementById('section-' + s);
            if (tab === 'all' || tab === s) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });

        document.querySelectorAll('.mtab-btn').forEach(btn => {
            btn.classList.remove('bg-bps-navy', 'text-white', 'font-bold');
            btn.classList.add('text-slate-600');
        });
        const active = document.getElementById('mtab-' + tab);
        active.classList.add('bg-bps-navy', 'text-white', 'font-bold');
        active.classList.remove('text-slate-600');
    }

    function showAuditPanel(row) {
        const panel = document.getElementById('audit-panel');
        document.getElementById('audit-title').textContent = 'Audit Komputasi Ilmiah: ' + row.nama;

        let crispRows = '';
        let normRows = '';
        let formulaParts = [];
        let wrParts = [];

        kriteriaMeta.forEach(c => {
            const kode = c.kode;
            const isCost = c.sifat.toLowerCase() === 'cost';
            const rawVal = row.rawApplicant[kode];
            const crispVal = row.crisp[kode];
            const extVal = isCost ? extremesMeta[kode].min : extremesMeta[kode].max;
            const rVal = Number(row.R[kode]).toFixed(4);
            const bobotVal = Number(c.bobot).toFixed(4);
            const wrVal = Number(row.WR[kode]).toFixed(4);

            crispRows += `<div class="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span class="text-slate-700 font-medium">${kode} (${c.nama})</span>
                <span class="font-mono tabular-nums font-bold text-slate-900">${rawVal} ${c.satuan} → <span class="text-bps-blue-dark">Crisp ${crispVal}</span></span>
            </div>`;

            normRows += `<div class="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span class="text-slate-700 font-medium">r_${kode} (${isCost ? 'Min / x' : 'x / Max'})</span>
                <span class="font-mono tabular-nums font-bold text-slate-900">${isCost ? extVal + ' / ' + crispVal : crispVal + ' / ' + extVal} = <span class="text-emerald-700">${rVal}</span></span>
            </div>`;

            formulaParts.push(`(${bobotVal} × ${rVal})`);
            wrParts.push(wrVal);
        });

        document.getElementById('audit-body').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <p class="font-bold text-bps-navy text-xs">Tahap 1: Konversi Data Mentah ke Crisp 1–5</p>
                    <div>${crispRows}</div>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <p class="font-bold text-bps-navy text-xs">Tahap 2: Normalisasi Matriks (R)</p>
                    <div>${normRows}</div>
                </div>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <p class="font-bold text-bps-navy text-xs">Tahap 3 & 4: Perkalian Bobot (W × R) & Total Skor V_i</p>
                <p class="font-mono text-xs text-slate-700 break-words tabular-nums">V = ${formulaParts.join(' + ')}</p>
                <p class="font-mono text-xs font-bold text-bps-blue-dark break-words tabular-nums">= ${wrParts.join(' + ')}</p>
                <div class="pt-2 border-t border-slate-100 flex items-baseline gap-2">
                    <span class="font-bold text-slate-700">Total Skor Preferensi (V):</span>
                    <span class="font-mono text-lg font-extrabold text-bps-navy tabular-nums">= ${Number(row.scoreV).toFixed(4)}</span>
                </div>
            </div>
        `;
        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
</script>
@endpush
