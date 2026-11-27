@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
@php
    $totalPelamar = $pelamar->count();
    $kuotaLolos = $pengaturan->kuota_lolos;
    $kuotaCadangan = $pengaturan->kuota_cadangan;
    $ranking = $sawResult['ranking'] ?? [];

    $steps = [
        ['step' => '1', 'title' => 'Data Pelamar', 'desc' => 'Input nilai ujian, survei, & CAPI mentah', 'route' => 'pelamar.index'],
        ['step' => '2', 'title' => 'Kriteria & Bobot', 'desc' => 'Tingkat kepentingan & konversi subkriteria', 'route' => 'kriteria.index'],
        ['step' => '3', 'title' => 'Dapur Hitung', 'desc' => '4 Tabel: Mentah, Crisp, R, & W×R', 'route' => 'dapur.index'],
        ['step' => '4', 'title' => 'Ranking', 'desc' => 'Leaderboard & seleksi kuota SAW', 'route' => 'ranking.index'],
        ['step' => '5', 'title' => 'Cetak SK BPS', 'desc' => 'Format resmi berkop BPS Subang', 'route' => 'laporan.index'],
    ];
@endphp

<div class="space-y-6 animate-fade-in pb-8">
    {{-- Hero Banner --}}
    <div class="rounded-2xl bg-bps-navy p-6 sm:p-8 text-white border border-bps-navy-dark">
        <div class="max-w-3xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-blue-100 border border-white/15">
                <x-icon name="sparkles" class="w-3.5 h-3.5 text-amber-300" />
                <span>Badan Pusat Statistik Kabupaten Subang • {{ $pengaturan->nama_periode }}</span>
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight leading-tight text-white">
                Sistem Pendukung Keputusan Seleksi Mitra Statistik
            </h2>
            <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                Komputasi analitis berbasis metode <strong>Simple Additive Weighting (SAW)</strong> untuk menetapkan mitra survei lapangan secara objektif, transparan, dan teraudit tahap demi tahap.
            </p>

            <div class="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                <a href="{{ route('dapur.index') }}" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-bps-navy hover:bg-blue-50 transition-colors focus-ring">
                    <x-icon name="calculator" class="w-4 h-4 text-bps-blue" />
                    <span>Buka Dapur Hitung SAW</span>
                </a>
                <a href="{{ route('ranking.index') }}" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors focus-ring">
                    <x-icon name="award" class="w-4 h-4 text-amber-300" />
                    <span>Lihat Ranking ({{ count($ranking) }})</span>
                </a>
                <a href="{{ route('laporan.index') }}" class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-100 hover:text-white hover:bg-white/10 transition-colors focus-ring">
                    <x-icon name="printer" class="w-4 h-4" />
                    <span>Pratinjau Berita Acara</span>
                    <x-icon name="arrow-right" class="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    </div>

    {{-- 4 KPI Stat Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pelamar</span>
                <div class="p-2 rounded-xl bg-blue-50 text-bps-blue">
                    <x-icon name="users" class="w-4 h-4" />
                </div>
            </div>
            <div class="mt-2.5">
                <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">{{ $totalPelamar }}</p>
                <p class="text-xs text-slate-500 mt-0.5"><span class="font-semibold text-bps-navy">Kandidat Terdaftar</span></p>
            </div>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200">
            <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kuota Lolos</span>
                <div class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <x-icon name="user-check" class="w-4 h-4" />
                </div>
            </div>
            <div class="mt-2.5">
                <p class="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">{{ $kuotaLolos }}</p>
                <p class="text-xs text-slate-500 mt-0.5">Peringkat <span class="font-semibold text-emerald-700">1 s.d. {{ $kuotaLolos }}</span></p>
            </div>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200">
            <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cadangan</span>
                <div class="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <x-icon name="trending-up" class="w-4 h-4" />
                </div>
            </div>
            <div class="mt-2.5">
                <p class="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tabular-nums">{{ $kuotaCadangan }}</p>
                <p class="text-xs text-slate-500 mt-0.5">Peringkat {{ $kuotaLolos + 1 }}–{{ $kuotaLolos + $kuotaCadangan }}</p>
            </div>
        </div>

        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top Skor (V1)</span>
                <div class="p-2 rounded-xl bg-slate-100 text-bps-navy">
                    <x-icon name="award" class="w-4 h-4" />
                </div>
            </div>
            <div class="mt-2.5">
                <p class="text-2xl sm:text-3xl font-extrabold text-bps-navy font-mono tabular-nums">
                    {{ $highestCandidate ? number_format($highestCandidate['scoreV'], 4) : '0.0000' }}
                </p>
                <p class="text-xs text-slate-600 font-semibold truncate mt-0.5">
                    {{ $highestCandidate ? $highestCandidate['nama'] : 'Belum Dihitung' }}
                </p>
            </div>
        </div>
    </div>

    {{-- Middle Grid: Workflow & Domisili --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-slate-900">Alur Tahapan Rekrutmen SPK</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Siklus berurutan dari input data mentah hingga penerbitan berita acara</p>
                </div>
                <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-600">5 Tahap</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                @foreach($steps as $s)
                    <a href="{{ route($s['route']) }}" class="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-bps-blue/50 transition-colors flex sm:flex-col items-center sm:items-stretch justify-between gap-2 focus-ring">
                        <div class="flex sm:block items-center gap-3 min-w-0">
                            <span class="w-6 h-6 rounded-md bg-white border border-slate-200 text-[11px] font-mono font-bold text-bps-navy inline-flex items-center justify-center group-hover:bg-bps-navy group-hover:text-white group-hover:border-bps-navy transition-colors">
                                {{ $s['step'] }}
                            </span>
                            <div class="min-w-0">
                                <h3 class="text-xs font-bold text-slate-900 sm:mt-2 group-hover:text-bps-navy">{{ $s['title'] }}</h3>
                                <p class="text-[11px] text-slate-500 sm:mt-1 leading-snug hidden sm:block">{{ $s['desc'] }}</p>
                            </div>
                        </div>
                        <div class="sm:mt-3 sm:pt-2 sm:border-t sm:border-slate-200/70 flex items-center gap-1 text-[11px] font-bold text-bps-blue-dark">
                            <span>Buka</span>
                            <x-icon name="chevron-right" class="w-3.5 h-3.5" />
                        </div>
                    </a>
                @endforeach
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                            <x-icon name="map-pin" class="w-4 h-4 text-bps-blue" />
                            <span>Persebaran Domisili</span>
                        </h2>
                        <p class="text-xs text-slate-500 mt-0.5">Asal kecamatan pelamar Subang</p>
                    </div>
                    <span class="text-[11px] font-bold text-bps-navy px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                        {{ $kecamatanCounts->count() }} Wilayah
                    </span>
                </div>

                <div class="space-y-3">
                    @forelse($kecamatanCounts->take(5) as $kec => $count)
                        @php $pct = $totalPelamar > 0 ? round(($count / $totalPelamar) * 100) : 0; @endphp
                        <div class="space-y-1.5">
                            <div class="flex justify-between text-xs">
                                <span class="text-slate-700 font-semibold">{{ $kec }}</span>
                                <span class="text-slate-500 font-mono tabular-nums text-[11px]">{{ $count }} orang ({{ $pct }}%)</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-bps-blue rounded-full" style="width: {{ $pct }}%"></div>
                            </div>
                        </div>
                    @empty
                        <p class="text-xs text-slate-400">Belum ada data pelamar.</p>
                    @endforelse
                </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between">
                <span class="text-slate-400">Wilayah Kab. Subang</span>
                <a href="{{ route('pelamar.index') }}" class="text-bps-blue-dark font-bold hover:underline inline-flex items-center gap-1">
                    <span>Lihat Semua</span>
                    <x-icon name="arrow-right" class="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    </div>

    {{-- Top 3 Leaderboard --}}
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <x-icon name="award" class="w-4 h-4 text-amber-500" />
                    <span>Tiga Besar Kandidat Rekomendasi Teratas</span>
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">Nilai preferensi (V) tertinggi hasil komputasi SAW</p>
            </div>
            <a href="{{ route('ranking.index') }}" class="text-xs font-bold text-bps-navy hover:text-bps-blue-dark inline-flex items-center gap-1">
                <span class="hidden sm:inline">Buka Leaderboard Lengkap</span>
                <span class="sm:hidden">Semua</span>
                <x-icon name="arrow-right" class="w-3.5 h-3.5" />
            </a>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @forelse(array_slice($ranking, 0, 3) as $item)
                <div class="p-4 space-y-2.5">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="w-7 h-7 rounded-lg inline-flex items-center justify-center font-extrabold text-xs flex-shrink-0 {{ $item['ranking'] === 1 ? 'bg-amber-400 text-slate-950' : ($item['ranking'] === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-600/25 text-amber-950') }}">
                                #{{ $item['ranking'] }}
                            </span>
                            <div class="min-w-0">
                                <h4 class="font-bold text-slate-900 text-sm truncate">{{ $item['nama'] }}</h4>
                                <p class="text-[11px] text-slate-400 font-mono">NIK: {{ $item['nik'] }}</p>
                            </div>
                        </div>
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 {{ $item['badgeBg'] }}">
                            <x-icon name="check-circle" class="w-3 h-3" />
                            <span>{{ $item['status'] }}</span>
                        </span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                        <div>
                            <span class="block text-[10px] text-slate-400 font-bold uppercase">Kecamatan</span>
                            <span class="font-semibold text-slate-700 truncate block mt-0.5">{{ $item['kecamatan'] }}</span>
                        </div>
                        <div>
                            <span class="block text-[10px] text-slate-400 font-bold uppercase">Ujian (C1)</span>
                            <span class="font-bold text-slate-800 font-mono tabular-nums mt-0.5 block">{{ $item['rawApplicant']['C1'] }}</span>
                        </div>
                        <div>
                            <span class="block text-[10px] text-bps-blue-dark font-bold uppercase">Skor V</span>
                            <span class="font-extrabold text-bps-navy font-mono tabular-nums mt-0.5 block">{{ number_format($item['scoreV'], 4) }}</span>
                        </div>
                    </div>
                </div>
            @empty
                <div class="p-6 text-center text-xs text-slate-400">Belum ada data kandidat.</div>
            @endforelse
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[680px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3 px-4 w-16 text-center">Rank</th>
                        <th class="py-3 px-4">Nama Pelamar & NIK</th>
                        <th class="py-3 px-4">Kecamatan</th>
                        <th class="py-3 px-4 text-center">Pendidikan</th>
                        <th class="py-3 px-4 text-right">Ujian (C1)</th>
                        <th class="py-3 px-4 text-right">Jarak (C5)</th>
                        <th class="py-3 px-4 text-right">Skor Akhir (V)</th>
                        <th class="py-3 px-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse(array_slice($ranking, 0, 3) as $item)
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="py-3 px-4 text-center">
                                <span class="w-7 h-7 rounded-lg inline-flex items-center justify-center font-extrabold text-xs {{ $item['ranking'] === 1 ? 'bg-amber-400 text-slate-950' : ($item['ranking'] === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-600/25 text-amber-950') }}">
                                    #{{ $item['ranking'] }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <div class="font-bold text-slate-900">{{ $item['nama'] }}</div>
                                <div class="text-[11px] text-slate-400 font-mono">NIK: {{ $item['nik'] }}</div>
                            </td>
                            <td class="py-3 px-4 text-slate-600 font-medium">{{ $item['kecamatan'] }}</td>
                            <td class="py-3 px-4 text-center">
                                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">{{ $item['rawApplicant']['pendidikan'] }}</span>
                            </td>
                            <td class="py-3 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">{{ $item['rawApplicant']['C1'] }}</td>
                            <td class="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">{{ $item['rawApplicant']['C5'] }} km</td>
                            <td class="py-3 px-4 text-right font-mono font-extrabold text-bps-navy text-sm tabular-nums">{{ number_format($item['scoreV'], 4) }}</td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold {{ $item['badgeBg'] }}">
                                    <x-icon name="check-circle" class="w-3 h-3" />
                                    <span>{{ $item['status'] }}</span>
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="py-8 text-center text-slate-400 text-xs">Belum ada data kandidat. Klik "Muat Sampel" di navbar untuk memuat 8 kandidat Subang.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
