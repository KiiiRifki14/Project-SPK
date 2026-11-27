@extends('layouts.app')

@section('title', 'Data Pelamar')

@section('content')
<div class="space-y-5 animate-fade-in pb-8">
    {{-- Header & Action Toolbar --}}
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
            <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <x-icon name="users" class="w-5 h-5 text-bps-blue" />
                <span>Manajemen Data Calon Mitra Statistik</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Kelola data mentah pelamar BPS Kabupaten Subang (C1–C5), serta fitur impor dan ekspor Excel (.xlsx).
            </p>
        </div>

        <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <button type="button" onclick="openPelamarModal()" class="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light transition-colors focus-ring">
                <x-icon name="user-plus" class="w-4 h-4 text-bps-blue" />
                <span>Tambah Pelamar</span>
            </button>

            <a href="{{ route('pelamar.export') }}" class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors focus-ring">
                <x-icon name="download" class="w-4 h-4 text-emerald-600" />
                <span>Export Excel</span>
            </a>

            <form method="POST" action="{{ route('pelamar.import') }}" enctype="multipart/form-data" id="import-excel-form" class="inline">
                @csrf
                <input type="file" name="excel_file" id="excel_file_input" accept=".xlsx,.xls,.csv" class="hidden" onchange="document.getElementById('import-excel-form').submit()">
                <button type="button" onclick="document.getElementById('excel_file_input').click()" class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl text-bps-navy bg-white hover:bg-slate-50 border border-slate-200 transition-colors focus-ring">
                    <x-icon name="upload" class="w-4 h-4 text-bps-blue" />
                    <span>Import Excel</span>
                </button>
            </form>
        </div>
    </div>

    {{-- Validation Errors --}}
    @if($errors->any())
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <p class="font-bold flex items-center gap-1.5">
                <x-icon name="x-circle" class="w-4 h-4 text-rose-600" />
                <span>Periksa kembali data yang diinputkan:</span>
            </p>
            <ul class="list-disc pl-6">
                @foreach($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Filter & Search Bar --}}
    <form method="GET" action="{{ route('pelamar.index') }}" class="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-2.5 flex-1">
            <div class="relative flex-1">
                <x-icon name="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    name="search"
                    value="{{ $search }}"
                    placeholder="Cari nama lengkap, NIK, atau nomor HP..."
                    class="w-full h-10 pl-10 pr-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-bps-blue focus:ring-2 focus:ring-bps-blue/25 focus:outline-none"
                >
            </div>
            <select name="kecamatan" onchange="this.form.submit()" class="h-10 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:border-bps-blue focus:outline-none">
                <option value="Semua" @selected($selectedKecamatan === 'Semua')>Semua Kecamatan ({{ $totalPelamar }})</option>
                @foreach($kecamatanList as $kec)
                    <option value="{{ $kec }}" @selected($selectedKecamatan === $kec)>{{ $kec }}</option>
                @endforeach
            </select>
            <button type="submit" class="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors focus-ring">
                Cari
            </button>
            @if($search !== '' || $selectedKecamatan !== 'Semua')
                <a href="{{ route('pelamar.index') }}" class="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center justify-center">
                    Reset
                </a>
            @endif
        </div>
        <span class="text-xs font-semibold text-slate-500 px-2 tabular-nums">
            {{ $pelamar->count() }} / {{ $totalPelamar }} kandidat
        </span>
    </form>

    {{-- Data List (Dual View: Mobile Cards + Desktop Table) --}}
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {{-- Mobile Cards --}}
        <div class="md:hidden divide-y divide-slate-100">
            @forelse($pelamar as $idx => $p)
                <div class="p-4 space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-slate-900 text-sm truncate">{{ $p->nama }}</span>
                                <span class="px-1.5 py-0.5 text-[10px] font-bold rounded {{ $p->jenis_kelamin === 'L' ? 'bg-blue-50 text-bps-navy' : 'bg-pink-50 text-pink-700' }}">{{ $p->jenis_kelamin }}</span>
                            </div>
                            <p class="text-[11px] text-slate-400 font-mono mt-0.5">NIK: {{ $p->nik }}</p>
                            <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <x-icon name="map-pin" class="w-3 h-3 text-bps-blue" />
                                <span>{{ $p->kecamatan }}</span>
                            </p>
                        </div>
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-bps-navy border border-slate-200">
                            {{ $p->c4_mentah }}
                        </span>
                    </div>

                    <div class="grid grid-cols-4 gap-1.5 text-center text-xs bg-slate-50 p-2 rounded-xl">
                        <div>
                            <span class="block text-[9px] font-bold text-slate-400 uppercase">C1 Ujian</span>
                            <span class="font-mono font-bold text-slate-800 tabular-nums">{{ $p->c1_mentah }}</span>
                        </div>
                        <div>
                            <span class="block text-[9px] font-bold text-slate-400 uppercase">C2 Survei</span>
                            <span class="font-mono font-bold text-slate-800 tabular-nums">{{ $p->c2_mentah }}x</span>
                        </div>
                        <div>
                            <span class="block text-[9px] font-bold text-slate-400 uppercase">C3 CAPI</span>
                            <span class="font-mono font-bold text-slate-800 tabular-nums">{{ $p->c3_mentah }}</span>
                        </div>
                        <div>
                            <span class="block text-[9px] font-bold text-amber-700 uppercase">C5 Jarak</span>
                            <span class="font-mono font-bold text-amber-700 tabular-nums">{{ $p->c5_mentah }}k</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                        <button type="button" onclick='openPelamarModal(@json($p))' class="flex-1 h-9 rounded-xl text-xs font-bold text-bps-navy bg-blue-50 hover:bg-blue-100 border border-blue-200 inline-flex items-center justify-center gap-1.5">
                            <x-icon name="edit" class="w-3.5 h-3.5" />
                            <span>Edit</span>
                        </button>
                        <form method="POST" action="{{ route('pelamar.destroy', $p) }}" onsubmit="return confirm('Hapus data pelamar {{ addslashes($p->nama) }}?')" class="flex-1">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="w-full h-9 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 inline-flex items-center justify-center gap-1.5">
                                <x-icon name="trash" class="w-3.5 h-3.5" />
                                <span>Hapus</span>
                            </button>
                        </form>
                    </div>
                </div>
            @empty
                <div class="p-8 text-center text-xs text-slate-400">
                    Tidak ada data pelamar ditemukan. Tambahkan pelamar baru atau klik "Muat Sampel".
                </div>
            @endforelse
        </div>

        {{-- Desktop Table --}}
        <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm min-w-[880px]">
                <thead class="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3 px-4 w-12 text-center">No</th>
                        <th class="py-3 px-4">Nama Pelamar & NIK</th>
                        <th class="py-3 px-4">Kecamatan</th>
                        <th class="py-3 px-3 text-right">C1 Ujian</th>
                        <th class="py-3 px-3 text-right">C2 Survei</th>
                        <th class="py-3 px-3 text-right">C3 CAPI</th>
                        <th class="py-3 px-3 text-center">C4 Pendidikan</th>
                        <th class="py-3 px-3 text-right">C5 Jarak</th>
                        <th class="py-3 px-4 text-center w-36">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($pelamar as $idx => $p)
                        <tr class="hover:bg-slate-50/70 transition-colors">
                            <td class="py-3 px-4 text-center font-mono text-slate-400 tabular-nums">{{ $idx + 1 }}</td>
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-1.5">
                                    <span class="font-bold text-slate-900">{{ $p->nama }}</span>
                                    <span class="px-1.5 py-0.5 text-[10px] font-bold rounded {{ $p->jenis_kelamin === 'L' ? 'bg-blue-50 text-bps-navy' : 'bg-pink-50 text-pink-700' }}">
                                        {{ $p->jenis_kelamin }}
                                    </span>
                                </div>
                                <div class="text-[11px] text-slate-400 font-mono mt-0.5 tabular-nums">
                                    NIK: {{ $p->nik }} • HP: {{ $p->no_hp ?: '-' }}
                                </div>
                            </td>
                            <td class="py-3 px-4 text-slate-700 font-medium">{{ $p->kecamatan }}</td>
                            <td class="py-3 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{{ $p->c1_mentah }}</td>
                            <td class="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">{{ $p->c2_mentah }}x</td>
                            <td class="py-3 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{{ $p->c3_mentah }}</td>
                            <td class="py-3 px-3 text-center">
                                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-bps-navy border border-slate-200">
                                    {{ $p->c4_mentah }}
                                </span>
                            </td>
                            <td class="py-3 px-3 text-right font-mono font-bold text-amber-700 tabular-nums">{{ $p->c5_mentah }} km</td>
                            <td class="py-3 px-4 text-center">
                                <div class="inline-flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onclick='openPelamarModal(@json($p))'
                                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-bps-navy bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors focus-ring"
                                    >
                                        <x-icon name="edit" class="w-3.5 h-3.5" />
                                        <span>Edit</span>
                                    </button>
                                    <form method="POST" action="{{ route('pelamar.destroy', $p) }}" onsubmit="return confirm('Hapus data pelamar {{ addslashes($p->nama) }}?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" aria-label="Hapus {{ $p->nama }}" class="inline-flex items-center justify-center p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors focus-ring">
                                            <x-icon name="trash" class="w-3.5 h-3.5" />
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" class="py-10 text-center text-slate-400 text-xs">
                                Tidak ada data pelamar ditemukan. Tambahkan pelamar baru atau klik "Muat Sampel" di navbar.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Modal Tambah / Edit Pelamar --}}
<div id="pelamar-modal" role="dialog" aria-modal="true" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 animate-fade-in my-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
                <h3 id="pelamar-modal-title" class="text-base font-extrabold text-bps-navy">Tambah Calon Mitra Baru</h3>
                <p class="text-xs text-slate-500 mt-0.5">Masukkan nilai mentah asli — sistem otomatis mengonversi ke skala crisp 1–5 saat kalkulasi SAW.</p>
            </div>
            <button type="button" onclick="closePelamarModal()" aria-label="Tutup form" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <x-icon name="x" class="w-5 h-5" />
            </button>
        </div>

        <form id="pelamar-form" method="POST" action="{{ route('pelamar.store') }}" class="space-y-4">
            @csrf
            <input type="hidden" name="_method" id="pelamar-form-method" value="POST">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                    <label for="field-nama" class="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input type="text" name="nama" id="field-nama" required class="w-full h-10 px-3 rounded-xl border border-slate-300 focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label for="field-nik" class="block font-bold text-slate-700 mb-1">NIK (16 Digit) *</label>
                    <input type="text" name="nik" id="field-nik" required maxlength="20" class="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label for="field-jk" class="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                    <select name="jenis_kelamin" id="field-jk" class="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white focus:border-bps-blue focus:outline-none">
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                    </select>
                </div>
                <div>
                    <label for="field-hp" class="block font-bold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
                    <input type="text" name="no_hp" id="field-hp" class="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono focus:border-bps-blue focus:outline-none">
                </div>
                <div>
                    <label for="field-kecamatan" class="block font-bold text-slate-700 mb-1">Kecamatan Domisili *</label>
                    <select name="kecamatan" id="field-kecamatan" class="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white focus:border-bps-blue focus:outline-none">
                        @foreach($kecamatanList as $kec)
                            <option value="{{ $kec }}">{{ $kec }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label for="field-c4" class="block font-bold text-slate-700 mb-1">C4: Pendidikan Terakhir *</label>
                    <select name="c4_mentah" id="field-c4" class="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white focus:border-bps-blue focus:outline-none">
                        @foreach($pendidikanOptions as $opt)
                            <option value="{{ $opt['value'] }}">{{ $opt['label'] }} (Crisp {{ $opt['crisp'] }})</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="pt-3 border-t border-slate-100">
                <p class="text-[11px] font-bold uppercase tracking-wider text-bps-blue-dark mb-2.5">Parameter Nilai Mentah SAW (C1, C2, C3, C5)</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label for="field-c1" class="block font-bold text-slate-700 mb-1">C1: Ujian (0–100)</label>
                        <input type="number" step="0.1" min="0" max="100" name="c1_mentah" id="field-c1" value="80" required class="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono focus:border-bps-blue focus:outline-none">
                    </div>
                    <div>
                        <label for="field-c2" class="block font-bold text-slate-700 mb-1">C2: Survei (Kali)</label>
                        <input type="number" step="1" min="0" max="50" name="c2_mentah" id="field-c2" value="2" required class="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono focus:border-bps-blue focus:outline-none">
                    </div>
                    <div>
                        <label for="field-c3" class="block font-bold text-slate-700 mb-1">C3: CAPI (0–100)</label>
                        <input type="number" step="0.1" min="0" max="100" name="c3_mentah" id="field-c3" value="85" required class="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono focus:border-bps-blue focus:outline-none">
                    </div>
                    <div>
                        <label for="field-c5" class="block font-bold text-amber-800 mb-1">C5: Jarak (KM) *</label>
                        <input type="number" step="0.1" min="0.1" max="200" name="c5_mentah" id="field-c5" value="3.5" required class="w-full h-10 px-3 rounded-xl border border-amber-300 bg-amber-50/40 font-mono focus:border-bps-blue focus:outline-none">
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onclick="closePelamarModal()" class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-bps-navy hover:bg-bps-navy-light text-white focus-ring">
                    Simpan Data Pelamar
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    const storeUrl = "{{ route('pelamar.store') }}";
    const updateUrlTemplate = "{{ route('pelamar.update', ['pelamar' => '__ID__']) }}";

    function openPelamarModal(pelamar = null) {
        const modal = document.getElementById('pelamar-modal');
        const form = document.getElementById('pelamar-form');
        const methodInput = document.getElementById('pelamar-form-method');
        const title = document.getElementById('pelamar-modal-title');

        if (pelamar) {
            title.textContent = 'Edit Data Calon Mitra: ' + pelamar.nama;
            form.action = updateUrlTemplate.replace('__ID__', pelamar.id);
            methodInput.value = 'PUT';
            document.getElementById('field-nama').value = pelamar.nama ?? '';
            document.getElementById('field-nik').value = pelamar.nik ?? '';
            document.getElementById('field-jk').value = pelamar.jenis_kelamin ?? 'L';
            document.getElementById('field-hp').value = pelamar.no_hp ?? '';
            document.getElementById('field-kecamatan').value = pelamar.kecamatan ?? 'Subang Kota';
            document.getElementById('field-c4').value = pelamar.c4_mentah ?? 'S1';
            document.getElementById('field-c1').value = pelamar.c1_mentah ?? 80;
            document.getElementById('field-c2').value = pelamar.c2_mentah ?? 2;
            document.getElementById('field-c3').value = pelamar.c3_mentah ?? 85;
            document.getElementById('field-c5').value = pelamar.c5_mentah ?? 3.5;
        } else {
            title.textContent = 'Tambah Calon Mitra Baru';
            form.action = storeUrl;
            methodInput.value = 'POST';
            form.reset();
            document.getElementById('field-c1').value = 80;
            document.getElementById('field-c2').value = 2;
            document.getElementById('field-c3').value = 85;
            document.getElementById('field-c5').value = 3.5;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closePelamarModal() {
        const modal = document.getElementById('pelamar-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
</script>
@endpush
