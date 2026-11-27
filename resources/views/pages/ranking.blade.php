@extends('layouts.app')

@section('title', 'Hasil Perangkingan')

@section('content')
@php
    $ranking = $sawResult['ranking'] ?? [];
    $summary = $sawResult['summary'] ?? [];
    $kuotaLolos = $pengaturan->kuota_lolos;
    $kuotaCadangan = $pengaturan->kuota_cadangan;
@endphp

<div class="space-y-5 animate-fade-in pb-8">
    {{-- Header & Actions --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <x-icon name="award" class="w-5 h-5 text-bps-blue" />
                <span>Leaderboard Hasil Perangkingan Mitra</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Urutan prioritas penerimaan mitra BPS Kabupaten Subang berdasarkan skor preferensi SAW tertinggi + Tie-Breaker (C1 → C2 → C5).
            </p>
        </div>

        <div class="grid grid-cols-2 sm:flex items-center gap-2">
            <a href="{{ route('ranking.export') }}" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors focus-ring">
                <x-icon name="download" class="w-4 h-4 text-emerald-600" />
                <span>Export Excel</span>
            </a>
            <a href="{{ route('laporan.index') }}" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light transition-colors focus-ring">
                <x-icon name="printer" class="w-4 h-4 text-bps-blue" />
                <span>Cetak SK BPS</span>
            </a>
        </div>
    </div>

    {{-- Kontrol Kuota Dinamis --}}
    <form method="POST" action="{{ route('ranking.kuota') }}" class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <h3 class="text-sm font-bold text-slate-900">Pengaturan Alokasi Kuota Seleksi</h3>
                <p class="text-xs text-slate-500">Atur jumlah kuota Mitra Lolos Utama dan Cadangan untuk penetapan status otomatis</p>
            </div>
            <button type="submit" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-bps-navy hover:bg-bps-navy-light text-white text-xs font-bold transition-colors focus-ring">
                <x-icon name="check" class="w-4 h-4" />
                <span>Terapkan Perubahan Kuota</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-emerald-900 inline-flex items-center gap-1.5">
                        <x-icon name="check-circle" class="w-4 h-4 text-emerald-600" />
                        <span>Kuota Lolos</span>
                    </span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 font-bold text-emerald-800 tabular-nums">
                        {{ $summary['totalLolos'] ?? 0 }} Orang
                    </span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="inline-flex items-center border border-emerald-300 rounded-xl overflow-hidden bg-white">
                        <button type="button" onclick="stepInput('kuota_lolos', -1, 1)" aria-label="Kurangi kuota lolos" class="w-9 h-9 flex items-center justify-center text-emerald-700 hover:bg-emerald-50">
                            <x-icon name="minus" class="w-3.5 h-3.5" />
                        </button>
                        <input type="number" id="kuota_lolos" name="kuota_lolos" min="1" max="500" value="{{ $kuotaLolos }}" class="w-12 h-9 text-sm font-extrabold text-emerald-900 text-center font-mono focus:outline-none tabular-nums">
                        <button type="button" onclick="stepInput('kuota_lolos', 1, 1)" aria-label="Tambah kuota lolos" class="w-9 h-9 flex items-center justify-center text-emerald-700 hover:bg-emerald-50">
                            <x-icon name="plus" class="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <span class="text-xs text-slate-600">Rank #1 s.d. #{{ $kuotaLolos }}</span>
                </div>
            </div>

            <div class="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-amber-900 inline-flex items-center gap-1.5">
                        <x-icon name="trending-up" class="w-4 h-4 text-amber-600" />
                        <span>Kuota Cadangan</span>
                    </span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 font-bold text-amber-800 tabular-nums">
                        {{ $summary['totalCadangan'] ?? 0 }} Orang
                    </span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="inline-flex items-center border border-amber-300 rounded-xl overflow-hidden bg-white">
                        <button type="button" onclick="stepInput('kuota_cadangan', -1, 0)" aria-label="Kurangi kuota cadangan" class="w-9 h-9 flex items-center justify-center text-amber-700 hover:bg-amber-50">
                            <x-icon name="minus" class="w-3.5 h-3.5" />
                        </button>
                        <input type="number" id="kuota_cadangan" name="kuota_cadangan" min="0" max="500" value="{{ $kuotaCadangan }}" class="w-12 h-9 text-sm font-extrabold text-amber-900 text-center font-mono focus:outline-none tabular-nums">
                        <button type="button" onclick="stepInput('kuota_cadangan', 1, 0)" aria-label="Tambah kuota cadangan" class="w-9 h-9 flex items-center justify-center text-amber-700 hover:bg-amber-50">
                            <x-icon name="plus" class="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <span class="text-xs text-slate-600">Rank #{{ $kuotaLolos + 1 }} s.d. #{{ $kuotaLolos + $kuotaCadangan }}</span>
                </div>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-600 inline-flex items-center gap-1.5">
                        <x-icon name="x-circle" class="w-4 h-4 text-slate-400" />
                        <span>Tidak Lolos</span>
                    </span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/80 font-bold text-slate-700 tabular-nums">
                        {{ $summary['totalTidakLolos'] ?? 0 }} Orang
                    </span>
                </div>
                <p class="text-xs text-slate-500 mt-2">
                    Peringkat #{{ $kuotaLolos + $kuotaCadangan + 1 }} ke bawah belum memenuhi kuota.
                </p>
            </div>
        </div>
    </form>

    {{-- Leaderboard --}}
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">Daftar Peringkat Akhir Seleksi Mitra Lapangan</h3>
                <p class="text-xs text-slate-500 mt-0.5">Urutan otomatis dari skor preferensi V tertinggi ke terendah</p>
            </div>
            <span class="text-xs font-bold text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100 tabular-nums">Total {{ count($ranking) }} Pelamar</span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @foreach($ranking as $item)
                @php
                    $isLolos = $item['status'] === 'Lolos';
                    $isCadangan = $item['status'] === 'Cadangan';
                @endphp
                <div class="p-4 space-y-2.5 {{ $isLolos ? 'bg-emerald-50/25' : ($isCadangan ? 'bg-amber-50/25' : '') }}">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="w-8 h-8 rounded-lg inline-flex items-center justify-center font-extrabold text-xs flex-shrink-0 {{ $item['ranking'] === 1 ? 'bg-amber-400 text-slate-950' : ($item['ranking'] === 2 ? 'bg-slate-300 text-slate-900' : ($item['ranking'] === 3 ? 'bg-amber-600/25 text-amber-950' : 'bg-slate-100 text-slate-700')) }}">
                                #{{ $item['ranking'] }}
                            </span>
                            <div class="min-w-0">
                                <h4 class="font-bold text-slate-900 text-sm truncate">{{ $item['nama'] }}</h4>
                                <p class="text-[11px] text-slate-400 font-mono">NIK: {{ $item['nik'] }}</p>
                            </div>
                        </div>
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 {{ $item['badgeBg'] }}">
                            <x-icon :name="$isLolos ? 'check-circle' : ($isCadangan ? 'trending-up' : 'x-circle')" class="w-3 h-3" />
                            <span>{{ $item['status'] }}</span>
                        </span>
                    </div>

                    <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-xs">
                        <span class="text-slate-600 font-medium inline-flex items-center gap-1">
                            <x-icon name="map-pin" class="w-3.5 h-3.5 text-bps-blue" />
                            <span>{{ $item['kecamatan'] }}</span>
                        </span>
                        <span class="font-mono font-extrabold text-bps-navy tabular-nums">V = {{ number_format($item['scoreV'], 4) }}</span>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[780px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3 px-4 w-16 text-center">Rank</th>
                        <th class="py-3 px-4">Nama Pelamar & NIK</th>
                        <th class="py-3 px-4">Kecamatan</th>
                        <th class="py-3 px-3 text-right">Ujian (C1)</th>
                        <th class="py-3 px-3 text-right">Survei (C2)</th>
                        <th class="py-3 px-3 text-right">CAPI (C3)</th>
                        <th class="py-3 px-3 text-center">Pendidikan (C4)</th>
                        <th class="py-3 px-3 text-right">Jarak (C5)</th>
                        <th class="py-3 px-4 text-right font-extrabold bg-blue-50/70 text-bps-navy">Skor Akhir (V)</th>
                        <th class="py-3 px-4 w-36 text-center">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($ranking as $item)
                        @php
                            $isLolos = $item['status'] === 'Lolos';
                            $isCadangan = $item['status'] === 'Cadangan';
                        @endphp
                        <tr class="{{ $isLolos ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : ($isCadangan ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50/70') }} transition-colors">
                            <td class="py-3 px-4 text-center font-mono">
                                <span class="w-7 h-7 rounded-lg inline-flex items-center justify-center font-extrabold text-xs {{ $item['ranking'] === 1 ? 'bg-amber-400 text-slate-950' : ($item['ranking'] === 2 ? 'bg-slate-300 text-slate-900' : ($item['ranking'] === 3 ? 'bg-amber-600/25 text-amber-950' : 'bg-slate-100 text-slate-600')) }}">
                                    #{{ $item['ranking'] }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-1.5">
                                    <span class="font-bold text-slate-900">{{ $item['nama'] }}</span>
                                    @if($item['isTie'])
                                        <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-100 text-purple-700 border border-purple-200" title="Tie-Breaker C1 → C2 → C5 aktif">Tie-Breaker</span>
                                    @endif
                                </div>
                                <p class="text-[11px] text-slate-400 font-mono tabular-nums">NIK: {{ $item['nik'] }}</p>
                            </td>
                            <td class="py-3 px-4 text-slate-600 font-medium">{{ $item['kecamatan'] }}</td>
                            <td class="py-3 px-3 text-right font-mono font-semibold text-slate-700 tabular-nums">{{ $item['rawApplicant']['C1'] }}</td>
                            <td class="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">{{ $item['rawApplicant']['C2'] }}x</td>
                            <td class="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">{{ $item['rawApplicant']['C3'] }}</td>
                            <td class="py-3 px-3 text-center">
                                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">{{ $item['rawApplicant']['pendidikan'] }}</span>
                            </td>
                            <td class="py-3 px-3 text-right font-mono font-bold text-amber-700 tabular-nums">{{ $item['rawApplicant']['C5'] }} km</td>
                            <td class="py-3 px-4 text-right font-mono font-extrabold text-bps-navy text-sm bg-blue-50/40 tabular-nums">
                                {{ number_format($item['scoreV'], 4) }}
                            </td>
                            <td class="py-3 px-4 text-center">
                                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold {{ $item['badgeBg'] }}">
                                    <x-icon :name="$isLolos ? 'check-circle' : ($isCadangan ? 'trending-up' : 'x-circle')" class="w-3 h-3" />
                                    <span>{{ $item['status'] }}</span>
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function stepInput(id, delta, minVal) {
        const el = document.getElementById(id);
        const current = parseInt(el.value || '0', 10);
        el.value = Math.max(minVal, current + delta);
    }
</script>
@endpush
