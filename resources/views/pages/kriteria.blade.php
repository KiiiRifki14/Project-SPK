@extends('layouts.app')

@section('title', 'Data Kriteria & Bobot')

@section('content')
@php
    $isSuperadmin = auth()->user()->isSuperadmin();
    $criteriaColors = [
        'C1' => 'bg-blue-600',
        'C2' => 'bg-emerald-600',
        'C3' => 'bg-cyan-500',
        'C4' => 'bg-violet-600',
        'C5' => 'bg-amber-500',
    ];
@endphp

<div class="space-y-6 animate-fade-in pb-8">
    {{-- Role Notice Banner --}}
    @if(!$isSuperadmin)
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <div class="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
                <x-icon name="shield-alert" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="font-extrabold text-sm text-amber-950">Mode Akses: Panitia Seleksi (Read-Only)</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-950">Wewenang Terbatas</span>
                </div>
                <p class="text-xs text-amber-800 leading-relaxed">
                    Anda dapat meninjau bobot preferensi dan aturan konversi subkriteria. Pengubahan tingkat kepentingan (1–5) dan reset bobot hanya dapat dilakukan oleh <strong>Superadmin BPS Subang</strong>.
                </p>
            </div>
        </div>
    @else
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs text-emerald-950">
            <div class="flex items-center gap-2.5">
                <div class="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                    <x-icon name="shield-check" class="w-4 h-4" />
                </div>
                <p class="font-medium leading-snug">
                    <strong class="font-bold">Mode Superadmin BPS:</strong> Hak akses penuh aktif. Ubah tingkat kepentingan (1–5) dan sistem otomatis menormalisasi bobot proporsional.
                </p>
            </div>
            <span class="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 flex-shrink-0 hidden sm:inline">Akses Penuh</span>
        </div>
    @endif

    {{-- Top Header & Reset --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <x-icon name="sliders" class="w-5 h-5 text-bps-blue" />
                <span>Manajemen Kriteria & Bobot Penilaian</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Konfigurasi tingkat kepentingan (1–5), bobot preferensi (<span class="font-mono">w_j = k_j / Σk</span>), dan konversi subkriteria PRD Final v2.0.
            </p>
        </div>

        @if($isSuperadmin)
            <form method="POST" action="{{ route('kriteria.reset') }}">
                @csrf
                <button type="submit" class="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors focus-ring">
                    <x-icon name="rotate-ccw" class="w-4 h-4 text-slate-500" />
                    <span>Reset Standar PRD (Σ=18)</span>
                </button>
            </form>
        @else
            <div class="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed select-none">
                <x-icon name="lock" class="w-3.5 h-3.5" />
                <span>Reset Kriteria Terkunci</span>
            </div>
        @endif
    </div>

    {{-- Visual Weight Distribution Bar --}}
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span class="font-bold text-slate-800 inline-flex items-center gap-1.5">
                <x-icon name="percent" class="w-4 h-4 text-bps-blue" />
                <span>Distribusi Proporsi Bobot Preferensi (<span class="font-mono">w_j = k_j / Σk</span>)</span>
            </span>
            <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-bps-navy bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 tabular-nums">
                    Total Kepentingan: {{ $totalKepentingan }}
                </span>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums {{ $validation['isValid'] ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' }}">
                    {{ $validation['isValid'] ? 'Total 100% Valid ('.number_format($validation['total'], 4).')' : 'Selisih '.number_format($validation['diff'] * 100, 1).'%' }}
                </span>
            </div>
        </div>

        <div class="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5">
            @foreach($kriteria as $c)
                @php $pct = max(2, ($c->bobot / ($validation['total'] ?: 1)) * 100); @endphp
                <div class="{{ $criteriaColors[$c->kode] ?? 'bg-slate-400' }} h-full rounded-full" style="width: {{ $pct }}%" title="{{ $c->kode }}: {{ number_format($c->bobot * 100, 1) }}%"></div>
            @endforeach
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-0.5">
            @foreach($kriteria as $c)
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <span class="w-2.5 h-2.5 rounded-full {{ $criteriaColors[$c->kode] ?? 'bg-slate-400' }}"></span>
                    <span class="font-bold text-slate-800">{{ $c->kode }}</span>
                    <span class="text-slate-500 font-mono text-[11px] font-semibold tabular-nums">
                        {{ $c->tingkat_kepentingan }}/{{ $totalKepentingan }} ({{ number_format($c->bobot * 100, 1) }}%)
                    </span>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Tabel & Kartu Kriteria --}}
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900">Daftar Kriteria & Bobot Matematis PRD Final</h3>
                <p class="text-xs text-slate-500 mt-0.5">Bobot desimal dihitung otomatis dari Tingkat Kepentingan (skala 1–5)</p>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-blue-50 text-bps-navy border border-blue-200 uppercase">
                Metode SAW
            </span>
        </div>

        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @foreach($kriteria as $c)
                <div class="p-4 space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2.5">
                            <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-extrabold text-xs text-bps-navy">{{ $c->kode }}</span>
                            <div>
                                <h4 class="font-bold text-slate-900 text-sm">{{ $c->nama }}</h4>
                                <p class="text-[11px] text-slate-400">Satuan: {{ $c->satuan }}</p>
                            </div>
                        </div>
                        @if($c->isCost())
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <x-icon name="trending-down" class="w-3 h-3" /> Cost
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-bps-navy border border-blue-200">
                                <x-icon name="trending-up" class="w-3 h-3" /> Benefit
                            </span>
                        @endif
                    </div>

                    <div class="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                        <div>
                            <span class="text-[10px] font-bold uppercase text-slate-400 block">Formula (k/Σk)</span>
                            <span class="font-mono font-bold text-slate-700 tabular-nums">{{ $c->tingkat_kepentingan }} / {{ $totalKepentingan }}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] font-bold uppercase text-slate-400 block">Bobot (w_j)</span>
                            <span class="font-mono font-extrabold text-bps-navy text-sm tabular-nums">{{ number_format($c->bobot, 4) }}</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed">{{ $c->keterangan }}</p>

                    @if($isSuperadmin)
                        <form method="POST" action="{{ route('kriteria.update', $c) }}" class="flex items-center gap-2">
                            @csrf
                            @method('PUT')
                            <select name="tingkat_kepentingan" class="flex-1 h-10 px-3 text-xs border border-slate-300 rounded-xl font-bold bg-white text-slate-900">
                                @foreach([5, 4, 3, 2, 1] as $val)
                                    <option value="{{ $val }}" @selected($c->tingkat_kepentingan === $val)>Skala {{ $val }}</option>
                                @endforeach
                            </select>
                            <button type="submit" class="h-10 px-4 rounded-xl bg-bps-navy hover:bg-bps-navy-light text-white text-xs font-bold">
                                Simpan
                            </button>
                        </form>
                    @else
                        <div class="w-full h-10 px-3 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5">
                            <x-icon name="lock" class="w-3.5 h-3.5" />
                            <span>Terkunci (Mode Panitia)</span>
                        </div>
                    @endif
                </div>
            @endforeach
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[780px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3 px-4 w-16 text-center">Kode</th>
                        <th class="py-3 px-4">Nama Kriteria</th>
                        <th class="py-3 px-4 w-28 text-center">Sifat</th>
                        <th class="py-3 px-4 w-52 text-center">Tingkat Kepentingan</th>
                        <th class="py-3 px-4 w-28 text-center">Formula</th>
                        <th class="py-3 px-4 w-32 text-center">Bobot Desimal</th>
                        <th class="py-3 px-4">Keterangan</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($kriteria as $c)
                        <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-3 px-4 text-center font-extrabold text-bps-navy font-mono">
                                <span class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs">{{ $c->kode }}</span>
                            </td>
                            <td class="py-3 px-4">
                                <p class="font-bold text-slate-900">{{ $c->nama }}</p>
                                <p class="text-[11px] text-slate-400">Satuan: {{ $c->satuan }}</p>
                            </td>
                            <td class="py-3 px-4 text-center">
                                @if($c->isCost())
                                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        <x-icon name="trending-down" class="w-3 h-3" /> Cost
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-bps-navy border border-blue-200">
                                        <x-icon name="trending-up" class="w-3 h-3" /> Benefit
                                    </span>
                                @endif
                            </td>
                            <td class="py-3 px-4 text-center">
                                @if($isSuperadmin)
                                    <form method="POST" action="{{ route('kriteria.update', $c) }}" class="inline-flex items-center gap-1.5">
                                        @csrf
                                        @method('PUT')
                                        <select name="tingkat_kepentingan" class="h-9 px-2.5 text-xs border border-slate-300 rounded-lg font-bold bg-white text-slate-900 focus:border-bps-blue focus:outline-none">
                                            @foreach([5, 4, 3, 2, 1] as $val)
                                                <option value="{{ $val }}" @selected($c->tingkat_kepentingan === $val)>Skala {{ $val }}</option>
                                            @endforeach
                                        </select>
                                        <button type="submit" class="h-9 px-3 rounded-lg bg-bps-navy hover:bg-bps-navy-light text-white text-xs font-bold transition-colors focus-ring">
                                            Simpan
                                        </button>
                                    </form>
                                @else
                                    <div class="inline-flex items-center gap-2">
                                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-bps-navy font-extrabold text-xs border border-slate-200 tabular-nums">
                                            {{ $c->tingkat_kepentingan }}
                                        </span>
                                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                            <x-icon name="lock" class="w-3 h-3" /> Terkunci
                                        </span>
                                    </div>
                                @endif
                            </td>
                            <td class="py-3 px-4 text-center font-mono text-xs text-slate-600 tabular-nums">
                                {{ $c->tingkat_kepentingan }} / {{ $totalKepentingan }}
                            </td>
                            <td class="py-3 px-4 text-center font-mono font-extrabold text-sm text-bps-navy tabular-nums">
                                {{ number_format($c->bobot, 4) }}
                            </td>
                            <td class="py-3 px-4 text-xs text-slate-600 leading-relaxed">
                                {{ $c->keterangan }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    {{-- Acuan Konversi Subkriteria --}}
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
            <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 inline-flex items-center gap-2">
                    <x-icon name="layers" class="w-4 h-4 text-bps-blue" />
                    <span>Acuan Konversi Subkriteria (Data Mentah → Crisp 1–5)</span>
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">Aturan konversi otomatis sebelum data masuk Matriks Keputusan X (PRD Bagian 2.2)</p>
            </div>
            <div class="flex flex-wrap gap-1.5">
                @foreach($subkriteriaRules as $kode => $ruleGroup)
                    <button type="button" onclick="switchSubTab('{{ $kode }}')" id="subtab-btn-{{ $kode }}"
                        class="subtab-btn px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors focus-ring {{ $kode === 'C1' ? 'bg-bps-navy text-white border-bps-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100' }}">
                        {{ $kode }}
                    </button>
                @endforeach
            </div>
        </div>

        <div class="p-4 sm:p-5">
            @foreach($subkriteriaRules as $kode => $ruleGroup)
                <div id="subtab-panel-{{ $kode }}" class="subtab-panel space-y-3.5 {{ $kode === 'C1' ? '' : 'hidden' }}">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h4 class="text-sm font-bold text-bps-navy">{{ $kode }} — {{ $ruleGroup['nama'] }}</h4>
                            <p class="text-xs text-slate-500">{{ $ruleGroup['deskripsi'] }}</p>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold {{ $ruleGroup['sifat'] === 'cost' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-bps-navy border border-blue-200' }}">
                            Sifat: {{ ucfirst($ruleGroup['sifat']) }}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                        @foreach($ruleGroup['rules'] as $r)
                            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                                <span class="text-xs font-bold text-slate-900 block">{{ $r['label'] }}</span>
                                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-bps-navy text-white font-mono font-extrabold text-sm tabular-nums">
                                    {{ $r['crisp'] }}
                                </span>
                                <span class="block text-[11px] text-slate-500 font-medium">{{ $r['keterangan'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function switchSubTab(kode) {
        document.querySelectorAll('.subtab-panel').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.subtab-btn').forEach(btn => {
            btn.classList.remove('bg-bps-navy', 'text-white', 'border-bps-navy');
            btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
        });
        document.getElementById('subtab-panel-' + kode).classList.remove('hidden');
        const activeBtn = document.getElementById('subtab-btn-' + kode);
        activeBtn.classList.add('bg-bps-navy', 'text-white', 'border-bps-navy');
        activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    }
</script>
@endpush
