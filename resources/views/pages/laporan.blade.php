@extends('layouts.app')

@section('title', 'Cetak SK Berita Acara BPS')

@section('content')
@php
    $isSuperadmin = auth()->user()->isSuperadmin();
    $tanggalFormatted = $pengaturan->tanggal_sk
        ? $pengaturan->tanggal_sk->locale('id')->translatedFormat('l, d F Y')
        : now()->locale('id')->translatedFormat('l, d F Y');
    $tanggalSingkat = $pengaturan->tanggal_sk
        ? $pengaturan->tanggal_sk->locale('id')->translatedFormat('d F Y')
        : now()->locale('id')->translatedFormat('d F Y');
@endphp

<div class="space-y-5 animate-fade-in pb-8">
    {{-- Action Toolbar (No-Print) --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <x-icon name="printer" class="w-5 h-5 text-bps-blue" />
                <span>Berita Acara Resmi Hasil Rekrutmen Mitra</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Format resmi surat dinas BPS Kabupaten Subang. Siap dicetak langsung atau disimpan ke PDF (Ctrl + P).
            </p>
        </div>

        <div class="grid grid-cols-2 sm:flex items-center gap-2">
            @if($isSuperadmin)
                <button type="button" onclick="document.getElementById('sk-settings-box').classList.toggle('hidden')" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors focus-ring">
                    <x-icon name="settings" class="w-4 h-4 text-slate-500" />
                    <span>Ubah No. SK & Kop</span>
                </button>
            @else
                <div class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed select-none" title="Pengubahan nomor SK & kop surat hanya wewenang Superadmin BPS">
                    <x-icon name="lock" class="w-3.5 h-3.5" />
                    <span>No. SK Terkunci</span>
                </div>
            @endif

            <button type="button" onclick="window.print()" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light transition-colors focus-ring">
                <x-icon name="printer" class="w-4 h-4 text-bps-blue" />
                <span>Cetak / Simpan PDF</span>
            </button>
        </div>
    </div>

    {{-- Form Edit Pengaturan SK (Superadmin Only, No-Print) --}}
    @if($isSuperadmin)
        <div id="sk-settings-box" class="hidden bg-white p-5 rounded-2xl border border-bps-blue/40 space-y-3.5 no-print animate-fade-in">
            <h3 class="text-sm font-bold text-bps-navy flex items-center gap-2">
                <x-icon name="settings" class="w-4 h-4 text-bps-blue" />
                <span>Pengaturan Informasi Lembar Surat Resmi Berita Acara</span>
            </h3>
            <form method="POST" action="{{ route('laporan.pengaturan') }}" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                @csrf
                @method('PUT')
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Nomor SK Berita Acara</label>
                    <input type="text" name="nomor_sk" value="{{ $pengaturan->nomor_sk }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Nama Periode Sensus / Survei</label>
                    <input type="text" name="nama_periode" value="{{ $pengaturan->nama_periode }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Tanggal Surat SK</label>
                    <input type="date" name="tanggal_sk" value="{{ $pengaturan->tanggal_sk?->format('Y-m-d') }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Nama Ketua Panitia Seleksi</label>
                    <input type="text" name="ketua_panitia_nama" value="{{ $pengaturan->ketua_panitia_nama }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Nama Kepala BPS Kabupaten Subang</label>
                    <input type="text" name="kepala_bps_nama" value="{{ $pengaturan->kepala_bps_nama }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label class="block font-bold text-slate-700 mb-1">NIP Kepala BPS</label>
                    <input type="text" name="kepala_bps_nip" value="{{ $pengaturan->kepala_bps_nip }}" required class="w-full h-10 px-3 rounded-xl border border-slate-200 font-mono focus:border-bps-blue focus:outline-none">
                </div>
                <div class="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button type="button" onclick="document.getElementById('sk-settings-box').classList.add('hidden')" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
                    <button type="submit" class="px-5 py-2 text-xs font-bold bg-bps-navy hover:bg-bps-navy-light text-white rounded-xl">Simpan Perubahan SK</button>
                </div>
            </form>
        </div>
    @endif

    {{-- LEMBAR DOKUMEN BERITA ACARA RESMI SIAP CETAK (A4) --}}
    <div class="bg-white p-5 sm:p-10 md:p-12 rounded-2xl border border-slate-300 w-full max-w-4xl mx-auto print-container text-slate-900 leading-relaxed font-sans">
        {{-- KOP SURAT RESMI BPS SUBANG --}}
        <div class="flex flex-col sm:flex-row items-center gap-4 border-b-4 border-double border-slate-900 pb-4 mb-6 text-center sm:text-left">
            <div class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" class="w-14 h-14 sm:w-16 sm:h-16" aria-hidden="true">
                    <polygon points="50,15 90,80 10,80" fill="#0B3C68" />
                    <polygon points="50,28 78,75 22,75" fill="#00A3E0" />
                    <circle cx="50" cy="58" r="12" fill="#10B981" />
                    <path d="M30 84 L70 84 L50 92 Z" fill="#F59E0B" />
                </svg>
            </div>
            <div class="flex-1 sm:pr-6">
                <h2 class="text-base sm:text-lg font-bold tracking-wider uppercase text-slate-900 leading-tight">
                    BADAN PUSAT STATISTIK
                </h2>
                <h2 class="text-xl sm:text-2xl font-black tracking-tight uppercase text-bps-navy">
                    KABUPATEN SUBANG
                </h2>
                <p class="text-[11px] sm:text-xs text-slate-700 mt-1">
                    {{ $pengaturan->alamat_instansi }}
                </p>
                <p class="text-[10.5px] sm:text-xs text-slate-600">
                    Telepon: (0260) 411032 • Pos-el: bps3213@bps.go.id • Laman: subangkab.bps.go.id
                </p>
            </div>
        </div>

        {{-- JUDUL DOKUMEN --}}
        <div class="text-center my-6 space-y-1">
            <h2 class="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline">
                BERITA ACARA PENETAPAN HASIL SELEKSI MITRA STATISTIK
            </h2>
            <p class="text-xs font-mono text-slate-700 tabular-nums">
                NOMOR: {{ $pengaturan->nomor_sk }}
            </p>
            <p class="text-xs text-slate-600 uppercase font-semibold">
                TENTANG: HASIL AKHIR PENILAIAN SELEKSI CALON MITRA STATISTIK LAPANGAN METODE SAW
            </p>
        </div>

        {{-- PEMBUKA --}}
        <div class="text-xs sm:text-sm text-justify space-y-3 text-slate-800">
            <p>
                Pada hari ini, tanggal <strong>{{ $tanggalFormatted }}</strong>, bertempat di Kantor Badan Pusat Statistik Kabupaten Subang, Panitia Seleksi Rekrutmen Calon Mitra Statistik telah menyelesaikan proses evaluasi dan pembobotan matematis menggunakan metode <strong>Simple Additive Weighting (SAW)</strong> terhadap seluruh berkas dan tes kompetensi pendaftar untuk kegiatan <strong>{{ $pengaturan->nama_periode }}</strong>.
            </p>
            <p>
                Berdasarkan 5 kriteria standar (Nilai Ujian Kompetensi, Pengalaman Survei, Uji CAPI Android, Jenjang Pendidikan, dan Jarak Domisili ke Wilayah Tugas) serta ketersediaan alokasi kuota kebutuhan sebanyak <strong>{{ $pengaturan->kuota_lolos }} orang</strong>, maka ditetapkan hasil rekapitulasi sebagai berikut:
            </p>
        </div>

        {{-- TABEL A: LOLOS UTAMA --}}
        <div class="my-6 space-y-2">
            <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wide text-bps-navy">
                A. DAFTAR CALON MITRA STATISTIK YANG DINYATAKAN LOLOS SELEKSI (KUOTA UTAMA)
            </h3>
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-slate-900 text-xs">
                    <thead>
                        <tr class="bg-slate-100 text-slate-900 text-center font-bold">
                            <th class="border border-slate-900 py-2 px-2 w-10">No</th>
                            <th class="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                            <th class="border border-slate-900 py-2 px-3 w-36">NIK</th>
                            <th class="border border-slate-900 py-2 px-3">Kecamatan</th>
                            <th class="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                            <th class="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($listLolos as $idx => $m)
                            <tr>
                                <td class="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{{ $idx + 1 }}</td>
                                <td class="border border-slate-900 py-1.5 px-3 font-semibold">{{ $m['nama'] }}</td>
                                <td class="border border-slate-900 py-1.5 px-3 text-center font-mono tabular-nums">{{ $m['nik'] }}</td>
                                <td class="border border-slate-900 py-1.5 px-3">{{ $m['kecamatan'] }}</td>
                                <td class="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{{ number_format($m['scoreV'], 4) }}</td>
                                <td class="border border-slate-900 py-1.5 px-2 text-center font-semibold text-emerald-800">Lolos Utama</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="border border-slate-900 text-center py-4 text-slate-500">Belum ada calon mitra yang lolos kuota.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        {{-- TABEL B: CADANGAN --}}
        @if($listCadangan->isNotEmpty())
            <div class="my-6 space-y-2">
                <h3 class="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-900">
                    B. DAFTAR CALON MITRA STATISTIK CADANGAN (PENGGANTI)
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse border border-slate-900 text-xs">
                        <thead>
                            <tr class="bg-slate-100 text-slate-900 text-center font-bold">
                                <th class="border border-slate-900 py-2 px-2 w-10">No</th>
                                <th class="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                                <th class="border border-slate-900 py-2 px-3 w-36">NIK</th>
                                <th class="border border-slate-900 py-2 px-3">Kecamatan</th>
                                <th class="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                                <th class="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($listCadangan as $idx => $m)
                                <tr>
                                    <td class="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{{ $idx + 1 }}</td>
                                    <td class="border border-slate-900 py-1.5 px-3 font-semibold">{{ $m['nama'] }}</td>
                                    <td class="border border-slate-900 py-1.5 px-3 text-center font-mono tabular-nums">{{ $m['nik'] }}</td>
                                    <td class="border border-slate-900 py-1.5 px-3">{{ $m['kecamatan'] }}</td>
                                    <td class="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{{ number_format($m['scoreV'], 4) }}</td>
                                    <td class="border border-slate-900 py-1.5 px-2 text-center font-semibold text-amber-800">Cadangan #{{ $idx + 1 }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @endif

        {{-- PENUTUP --}}
        <p class="text-xs sm:text-sm text-justify text-slate-800 mt-4 leading-relaxed">
            Demikian Berita Acara ini dibuat dengan sebenarnya berdasarkan hasil komputasi analitis yang objektif dan transparan untuk dapat dipergunakan sebagaimana mestinya dalam penerbitan Surat Keputusan (SK) Pengangkatan Mitra Statistik Lapangan BPS Kabupaten Subang.
        </p>

        {{-- KOLOM TANDA TANGAN --}}
        <div class="mt-10 pt-6 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8 text-xs sm:text-sm text-center">
            <div class="space-y-14">
                <div>
                    <p class="text-slate-600">Panitia Seleksi Rekrutmen,</p>
                    <p class="font-bold text-slate-800">BPS Kabupaten Subang</p>
                </div>
                <div>
                    <p class="font-bold underline text-slate-900">{{ $pengaturan->ketua_panitia_nama }}</p>
                    <p class="text-xs text-slate-500">Kelompok 8 D3 SI Polsub</p>
                </div>
            </div>

            <div class="space-y-14">
                <div>
                    <p class="text-slate-600">Subang, {{ $tanggalSingkat }}</p>
                    <p class="font-bold text-slate-800">Kepala BPS Kabupaten Subang,</p>
                </div>
                <div>
                    <p class="font-bold underline text-slate-900">{{ $pengaturan->kepala_bps_nama }}</p>
                    <p class="text-xs text-slate-600 font-mono">NIP. {{ $pengaturan->kepala_bps_nip }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
