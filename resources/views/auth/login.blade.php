<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk Sistem — SPK Seleksi Mitra Statistik BPS Kabupaten Subang</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-[#EEF2F7] flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-[920px] bg-white rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-fade-in">
        {{-- Left Panel: Institutional Identity --}}
        <div class="md:col-span-5 bg-bps-navy text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div class="relative z-10 space-y-6">
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 100 100" class="w-7 h-7" aria-hidden="true">
                            <polygon points="50,15 90,80 10,80" fill="#ffffff" />
                            <polygon points="50,28 78,75 22,75" fill="#00A3E0" />
                            <circle cx="50" cy="58" r="11" fill="#10B981" />
                            <path d="M30 84 L70 84 L50 92 Z" fill="#F59E0B" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-bold uppercase tracking-widest text-bps-blue">SPK Metode SAW</p>
                        <p class="text-base font-extrabold text-white leading-tight">BPS Kabupaten Subang</p>
                    </div>
                </div>

                <div class="space-y-2.5">
                    <h1 class="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
                        Sistem Pendukung Keputusan Seleksi Mitra Statistik
                    </h1>
                    <p class="text-xs sm:text-[13px] text-blue-100/90 leading-relaxed">
                        Evaluasi dan pemeringkatan calon mitra lapangan secara transparan dengan konversi data mentah ke skala crisp 1–5 dan pembobotan objektif.
                    </p>
                </div>

                <div class="space-y-3 pt-4 border-t border-white/15 text-xs text-blue-50">
                    <div class="flex items-start gap-2.5">
                        <x-icon name="calculator" class="w-4 h-4 text-bps-blue flex-shrink-0 mt-0.5" />
                        <span>4 Matriks Dapur Hitung SAW (Mentah, X, R, W×R)</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <x-icon name="shield-check" class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Kontrol Hak Akses Superadmin & Panitia Seleksi</span>
                    </div>
                    <div class="flex items-start gap-2.5">
                        <x-icon name="printer" class="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                        <span>Ekspor Excel (.xlsx) & Cetak SK Berita Acara A4</span>
                    </div>
                </div>
            </div>

            <div class="relative z-10 pt-6 mt-8 border-t border-white/15 text-[11px] text-blue-200/85 space-y-0.5">
                <p class="font-bold text-white">Kelompok 8 — D3 Sistem Informasi Polsub</p>
                <p>Jl. Mayjen Sutoyo No. 12, Subang, Jawa Barat</p>
            </div>
        </div>

        {{-- Right Panel: Login Form --}}
        <div class="md:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
            <div class="mb-6">
                <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke Panel Seleksi</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">
                    Gunakan akun panitia BPS Subang atau pilih salah satu akun uji coba di bawah.
                </p>
            </div>

            @if(session('alert'))
                <div class="mb-4 px-4 py-3 rounded-xl text-xs font-semibold border flex items-center gap-2 {{ session('alert.type') === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-blue-50 text-bps-navy border-blue-200' }}">
                    <x-icon name="shield-alert" class="w-4 h-4 flex-shrink-0" />
                    <span>{{ session('alert.message') }}</span>
                </div>
            @endif

            @if($errors->any())
                <div class="mb-4 px-4 py-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
                    <x-icon name="x-circle" class="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            <form method="POST" action="{{ route('login.attempt') }}" class="space-y-4">
                @csrf
                <div>
                    <label for="email" class="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autofocus
                        value="{{ old('email') }}"
                        placeholder="nama@bpssubang.go.id"
                        class="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-bps-blue focus:ring-2 focus:ring-bps-blue/25 focus:outline-none transition-colors"
                    >
                </div>

                <div>
                    <label for="password" class="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
                    <div class="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Masukkan kata sandi"
                            class="w-full h-11 pl-3.5 pr-11 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-bps-blue focus:ring-2 focus:ring-bps-blue/25 focus:outline-none transition-colors"
                        >
                        <button type="button" onclick="togglePassword()" aria-label="Tampilkan atau sembunyikan kata sandi" class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                            <x-icon name="eye" class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between text-xs pt-0.5">
                    <label class="inline-flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-300 text-bps-navy focus:ring-bps-blue">
                        <span>Ingat sesi masuk</span>
                    </label>
                    <span class="text-slate-400 text-[11px]">Sandi bawaan: <code class="font-mono font-bold text-slate-600">password</code></span>
                </div>

                <button
                    type="submit"
                    class="w-full h-11 rounded-xl bg-bps-navy hover:bg-bps-navy-light text-white font-bold text-sm transition-colors focus-ring flex items-center justify-center gap-2"
                >
                    <span>Masuk ke Sistem</span>
                    <x-icon name="arrow-right" class="w-4 h-4" />
                </button>
            </form>

            {{-- Quick Fill Demo Accounts --}}
            <div class="mt-6 pt-5 border-t border-slate-200/80 space-y-2.5">
                <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Akun Uji Coba RBAC (Klik untuk Mengisi)
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                        type="button"
                        onclick="fillAccount('superadmin@bpssubang.go.id', 'password')"
                        class="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50/70 hover:border-emerald-300 text-left transition-colors focus-ring group"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                                <x-icon name="shield-check" class="w-3.5 h-3.5 text-emerald-600" />
                                Superadmin BPS
                            </span>
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Penuh</span>
                        </div>
                        <p class="text-[11px] font-mono text-slate-600 mt-1 truncate">superadmin@bpssubang.go.id</p>
                        <p class="text-[10.5px] text-slate-500 mt-0.5">Ubah bobot, edit SK & kop, reset</p>
                    </button>

                    <button
                        type="button"
                        onclick="fillAccount('panitia@bpssubang.go.id', 'password')"
                        class="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50/70 hover:border-blue-300 text-left transition-colors focus-ring group"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                                <x-icon name="user-check" class="w-3.5 h-3.5 text-bps-blue" />
                                Panitia Seleksi
                            </span>
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-bps-navy">Terbatas</span>
                        </div>
                        <p class="text-[11px] font-mono text-slate-600 mt-1 truncate">panitia@bpssubang.go.id</p>
                        <p class="text-[10.5px] text-slate-500 mt-0.5">Kelola pelamar, audit SAW, cetak</p>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        function fillAccount(email, password) {
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
        }
        function togglePassword() {
            const input = document.getElementById('password');
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    </script>
</body>
</html>
