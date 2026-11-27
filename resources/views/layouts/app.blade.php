<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Dashboard') — SPK Mitra Statistik BPS Kabupaten Subang</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
@php
    $user = auth()->user();
    $isSuperadmin = $user && $user->isSuperadmin();
    $currentRoute = Route::currentRouteName();

    $pageMeta = [
        'dashboard' => ['category' => 'Ringkasan Eksekutif', 'title' => 'Dashboard Utama'],
        'kriteria.index' => ['category' => 'Bobot Penilaian C1–C5', 'title' => 'Manajemen Kriteria'],
        'pelamar.index' => ['category' => 'Manajemen Kandidat', 'title' => 'Data Calon Mitra'],
        'dapur.index' => ['category' => 'Pembuktian 4 Matriks', 'title' => 'Dapur Hitung SAW'],
        'ranking.index' => ['category' => 'Leaderboard & Kuota', 'title' => 'Hasil Perangkingan'],
        'laporan.index' => ['category' => 'Format Cetak SK BPS', 'title' => 'Berita Acara Resmi'],
    ];
    $currentMeta = $pageMeta[$currentRoute] ?? ['category' => 'SPK SAW', 'title' => 'BPS Kabupaten Subang'];

    $navGroups = [
        [
            'label' => 'MENU UTAMA',
            'items' => [
                [
                    'route' => 'dashboard',
                    'label' => 'Dashboard',
                    'desc' => 'Statistik & alur seleksi',
                    'icon' => 'dashboard',
                ],
            ],
        ],
        [
            'label' => 'DATA & PARAMETER',
            'items' => [
                [
                    'route' => 'kriteria.index',
                    'label' => 'Data Kriteria',
                    'desc' => $isSuperadmin ? 'Bobot C1–C5 & sifat' : 'Bobot C1–C5 (Read-Only)',
                    'icon' => 'sliders',
                    'badge' => ($navKriteriaCount ?? 5).' Kriteria',
                    'badgeClass' => ($navBobotValid ?? true)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-300',
                ],
                [
                    'route' => 'pelamar.index',
                    'label' => 'Data Pelamar',
                    'desc' => 'Manajemen kandidat & nilai',
                    'icon' => 'users',
                    'badge' => ($navPelamarCount ?? 0).' Calon',
                    'badgeClass' => 'bg-slate-100 text-slate-600 border border-slate-200',
                ],
            ],
        ],
        [
            'label' => 'KOMPUTASI & KEPUTUSAN',
            'items' => [
                [
                    'route' => 'dapur.index',
                    'label' => 'Dapur Hitung SAW',
                    'desc' => 'Matriks Mentah, X, R, W×R',
                    'icon' => 'calculator',
                    'highlight' => true,
                ],
                [
                    'route' => 'ranking.index',
                    'label' => 'Hasil Perangkingan',
                    'desc' => 'Leaderboard & kuota mitra',
                    'icon' => 'award',
                ],
                [
                    'route' => 'laporan.index',
                    'label' => 'Cetak Berita Acara',
                    'desc' => 'Format SK Resmi BPS Subang',
                    'icon' => 'printer',
                ],
            ],
        ],
    ];
@endphp
<body class="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row font-sans relative w-full max-w-full overflow-x-clip">

    {{-- Toast Flash Notification --}}
    @if(session('alert'))
        @php
            $alertType = session('alert.type', 'info');
            $alertClasses = match($alertType) {
                'success' => 'bg-emerald-700 text-white border-emerald-800',
                'error' => 'bg-rose-700 text-white border-rose-800',
                'warning' => 'bg-amber-500 text-slate-950 border-amber-600',
                default => 'bg-bps-navy text-white border-bps-navy-dark',
            };
            $alertIcon = match($alertType) {
                'success' => 'check-circle',
                'error' => 'x-circle',
                'warning' => 'shield-alert',
                default => 'shield-check',
            };
        @endphp
        <div id="flash-toast" role="status" class="fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in no-print {{ $alertClasses }}">
            <x-icon :name="$alertIcon" class="w-4 h-4 flex-shrink-0" />
            <span class="flex-1">{{ session('alert.message') }}</span>
            <button type="button" onclick="document.getElementById('flash-toast').remove()" aria-label="Tutup notifikasi" class="p-1 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10">
                <x-icon name="x" class="w-4 h-4" />
            </button>
        </div>
        <script>
            setTimeout(() => {
                const toast = document.getElementById('flash-toast');
                if (toast) toast.remove();
            }, 5000);
        </script>
    @endif

    {{-- Mobile Backdrop --}}
    <div id="mobile-sidebar-backdrop" onclick="toggleMobileSidebar(false)" class="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-40 hidden md:hidden no-print"></div>

    {{-- Sidebar --}}
    <aside id="app-sidebar" class="fixed inset-y-0 left-0 z-50 w-72 md:w-64 lg:w-72 bg-white border-r border-slate-200 flex flex-col justify-between transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-out h-screen overflow-y-auto no-print">
        <div>
            {{-- Brand Header --}}
            <div class="h-16 sm:h-20 px-4 sm:px-5 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
                <a href="{{ route('dashboard') }}" class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-bps-navy flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 100 100" class="w-6 h-6" aria-hidden="true">
                            <polygon points="50,15 90,80 10,80" fill="#ffffff" />
                            <polygon points="50,28 78,75 22,75" fill="#00A3E0" />
                            <circle cx="50" cy="58" r="11" fill="#10B981" />
                            <path d="M30 84 L70 84 L50 92 Z" fill="#F59E0B" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-1.5">
                            <span class="font-extrabold text-sm text-bps-navy tracking-tight truncate">BPS KAB. SUBANG</span>
                            <span class="px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-bps-blue/15 text-bps-blue-dark uppercase">SAW</span>
                        </div>
                        <p class="text-[11px] text-slate-500 font-medium truncate mt-0.5">Seleksi Mitra Statistik</p>
                    </div>
                </a>
                <button type="button" onclick="toggleMobileSidebar(false)" aria-label="Tutup menu" class="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <x-icon name="x" class="w-5 h-5" />
                </button>
            </div>

            {{-- Active Role Status Pill --}}
            <div class="mx-3 mt-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span class="text-[11px] text-slate-500 font-semibold">Hak Akses</span>
                <span class="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-md border {{ $isSuperadmin ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-bps-navy border-blue-200' }}">
                    <x-icon :name="$isSuperadmin ? 'shield-check' : 'user-check'" class="w-3 h-3" />
                    <span>{{ $isSuperadmin ? 'Superadmin' : 'Panitia' }}</span>
                </span>
            </div>

            {{-- Navigation Groups --}}
            <nav class="p-3 space-y-5">
                @foreach($navGroups as $group)
                    <div class="space-y-1">
                        <p class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {{ $group['label'] }}
                        </p>
                        @foreach($group['items'] as $item)
                            @php $isActive = $currentRoute === $item['route']; @endphp
                            <a href="{{ route($item['route']) }}"
                               aria-current="{{ $isActive ? 'page' : 'false' }}"
                               class="w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left focus-ring {{ $isActive ? 'bg-bps-navy text-white font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-bps-navy font-medium' }}">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <div class="p-1.5 rounded-lg flex-shrink-0 transition-colors {{ $isActive ? 'bg-white/15 text-white' : (!empty($item['highlight']) ? 'bg-bps-blue/10 text-bps-blue-dark' : 'bg-slate-100 text-slate-500 group-hover:text-bps-navy') }}">
                                        <x-icon :name="$item['icon']" class="w-4 h-4" />
                                    </div>
                                    <div class="truncate">
                                        <span class="text-xs font-bold block truncate leading-tight">{{ $item['label'] }}</span>
                                        <span class="text-[10.5px] block truncate leading-tight mt-0.5 {{ $isActive ? 'text-blue-200' : 'text-slate-400' }}">
                                            {{ $item['desc'] }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                                    @if(!empty($item['badge']) && !$isActive)
                                        <span class="px-1.5 py-0.5 text-[10px] rounded-md font-semibold {{ $item['badgeClass'] }}">
                                            {{ $item['badge'] }}
                                        </span>
                                    @endif
                                    @if($isActive)
                                        <x-icon name="chevron-right" class="w-3.5 h-3.5 text-white/75" />
                                    @endif
                                </div>
                            </a>
                        @endforeach
                    </div>
                @endforeach
            </nav>
        </div>

        {{-- Academic Citation Footer --}}
        <div class="p-3.5 m-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div class="flex items-center gap-2 font-bold text-bps-navy text-xs">
                <x-icon name="book-open" class="w-3.5 h-3.5 text-bps-blue flex-shrink-0" />
                <span>Buku Ajar SPK Polsub</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed">
                Metode SAW Bab 5 karya Pak Chepy Perdana dkk diterapkan pada seleksi mitra BPS Subang.
            </p>
            <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[10.5px]">
                <span class="font-semibold text-slate-600">Kelompok 8 D3 SI</span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Laravel 13</span>
            </div>
        </div>
    </aside>

    {{-- Right Canvas: Navbar + Main Content --}}
    <div class="flex-1 flex flex-col min-w-0 w-full max-w-full md:pl-64 lg:pl-72 print:pl-0 overflow-x-clip">
        {{-- Top Navbar --}}
        <header class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 no-print">
            <div class="max-w-[1440px] mx-auto flex items-center justify-between h-16 sm:h-20 gap-3">
                {{-- Left: Mobile Hamburger + Breadcrumb & Title --}}
                <div class="flex items-center gap-3 min-w-0">
                    <button type="button" onclick="toggleMobileSidebar(true)" class="md:hidden w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 focus-ring flex-shrink-0" aria-label="Buka menu navigasi">
                        <x-icon name="menu" class="w-5 h-5 text-bps-navy" />
                    </button>
                    <div class="min-w-0">
                        <div class="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                <x-icon name="building" class="w-3.5 h-3.5 text-bps-blue" />
                                <span>BPS Kab. Subang</span>
                            </span>
                            <span class="text-slate-300">/</span>
                            <span class="text-bps-blue-dark font-bold">{{ $currentMeta['category'] }}</span>
                        </div>
                        <h1 class="text-base sm:text-xl font-extrabold text-bps-navy tracking-tight truncate">
                            {{ $currentMeta['title'] }}
                        </h1>
                    </div>
                </div>

                {{-- Right: Quick Actions + Kuota + Profile --}}
                <div class="flex items-center gap-2.5 sm:gap-3">
                    <div class="hidden sm:flex items-center gap-2">
                        <form method="POST" action="{{ route('sample.load') }}">
                            @csrf
                            <button type="submit" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-bps-navy bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors focus-ring" title="Muat ulang 8 data pelamar asli Subang">
                                <x-icon name="sparkles" class="w-3.5 h-3.5 text-bps-blue" />
                                <span>Muat Sampel</span>
                            </button>
                        </form>

                        @if($isSuperadmin)
                            <button type="button" onclick="openResetModal()" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors focus-ring" title="Reset seluruh data ke kondisi awal (Superadmin)">
                                <x-icon name="rotate-ccw" class="w-3.5 h-3.5 text-rose-600" />
                                <span>Reset Data</span>
                            </button>
                        @else
                            <div class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed select-none" title="Fitur Reset Data hanya dapat diakses oleh Superadmin BPS">
                                <x-icon name="lock" class="w-3.5 h-3.5 text-slate-400" />
                                <span>Reset Terkunci</span>
                            </div>
                        @endif
                    </div>

                    @if(($navPelamarCount ?? 0) > 0)
                        <div class="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 tabular-nums">
                            <x-icon name="award" class="w-4 h-4 text-emerald-600" />
                            <span>Kuota: <strong class="text-emerald-950 font-extrabold">{{ $navKuotaLolos ?? 5 }}</strong> / {{ $navPelamarCount }} Mitra</span>
                        </div>
                    @endif

                    <div class="h-7 w-px bg-slate-200 hidden sm:block"></div>

                    {{-- User Profile & Logout Dropdown --}}
                    <div class="relative">
                        <button type="button" onclick="toggleProfileDropdown()" class="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors focus-ring">
                            <div class="w-9 h-9 rounded-lg bg-bps-navy text-white flex items-center justify-center font-extrabold text-xs">
                                {{ $user ? $user->initials() : 'US' }}
                            </div>
                            <div class="text-left hidden md:block">
                                <p class="text-xs font-bold text-slate-800 leading-tight">{{ $user->name }}</p>
                                <p class="text-[11px] font-semibold leading-tight mt-0.5 flex items-center gap-1 {{ $isSuperadmin ? 'text-emerald-700' : 'text-bps-blue-dark' }}">
                                    <x-icon :name="$isSuperadmin ? 'shield-check' : 'user-check'" class="w-3 h-3" />
                                    <span>{{ $user->roleLabel() }}</span>
                                </p>
                            </div>
                            <x-icon name="chevron-down" class="w-4 h-4 text-slate-400" />
                        </button>

                        <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                            <div class="px-3 py-2.5 border-b border-slate-100">
                                <p class="text-xs font-bold text-slate-900">{{ $user->name }}</p>
                                <p class="text-[11px] text-slate-500 font-mono truncate mt-0.5">{{ $user->email }}</p>
                                <span class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold border {{ $isSuperadmin ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-bps-navy border-blue-200' }}">
                                    <x-icon :name="$isSuperadmin ? 'shield-check' : 'user-check'" class="w-3 h-3" />
                                    <span>{{ $user->roleLabel() }}</span>
                                </span>
                            </div>
                            <div class="pt-1.5 space-y-1">
                                <form method="POST" action="{{ route('sample.load') }}" class="sm:hidden">
                                    @csrf
                                    <button type="submit" class="w-full text-left px-3 py-2 text-xs font-bold text-bps-navy hover:bg-slate-50 rounded-xl flex items-center gap-2">
                                        <x-icon name="sparkles" class="w-4 h-4 text-bps-blue" />
                                        <span>Muat Sampel Subang</span>
                                    </button>
                                </form>
                                @if($isSuperadmin)
                                    <button type="button" onclick="toggleProfileDropdown(); openResetModal();" class="sm:hidden w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2">
                                        <x-icon name="rotate-ccw" class="w-4 h-4" />
                                        <span>Reset Data Awal</span>
                                    </button>
                                @endif
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full text-left px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl flex items-center justify-between">
                                        <span>Keluar / Ganti Akun</span>
                                        <x-icon name="logout" class="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {{-- Main Dynamic Content --}}
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto min-w-0">
            @yield('content')
        </main>
    </div>

    {{-- Reset All Confirmation Modal (Superadmin Only) --}}
    @if($isSuperadmin)
        <div id="reset-modal" role="dialog" aria-modal="true" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] no-print">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-fade-in">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <div class="p-2.5 rounded-xl bg-rose-50 text-rose-600 flex-shrink-0">
                            <x-icon name="rotate-ccw" class="w-5 h-5" />
                        </div>
                        <div>
                            <h3 class="text-base font-extrabold text-slate-900">Konfirmasi Reset Seluruh Data</h3>
                            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                Seluruh <strong>Kriteria (Σ=18)</strong>, <strong>8 Pelamar Sampel Subang</strong>, dan <strong>Pengaturan SK</strong> akan dikembalikan ke standar awal PRD v2.0.
                            </p>
                        </div>
                    </div>
                    <button type="button" onclick="closeResetModal()" aria-label="Tutup modal" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                        <x-icon name="x" class="w-4 h-4" />
                    </button>
                </div>
                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button type="button" onclick="closeResetModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                        Batal
                    </button>
                    <form method="POST" action="{{ route('system.reset') }}">
                        @csrf
                        <button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white">
                            Ya, Reset Sekarang
                        </button>
                    </form>
                </div>
            </div>
        </div>
    @endif

    <script>
        function toggleMobileSidebar(open) {
            const sidebar = document.getElementById('app-sidebar');
            const backdrop = document.getElementById('mobile-sidebar-backdrop');
            if (open) {
                sidebar.classList.remove('-translate-x-full');
                backdrop.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                backdrop.classList.add('hidden');
            }
        }

        function toggleProfileDropdown() {
            const dd = document.getElementById('profile-dropdown');
            if (dd) dd.classList.toggle('hidden');
        }

        function openResetModal() {
            const modal = document.getElementById('reset-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        }

        function closeResetModal() {
            const modal = document.getElementById('reset-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        document.addEventListener('click', function (e) {
            const dd = document.getElementById('profile-dropdown');
            if (dd && !dd.classList.contains('hidden') && !e.target.closest('.relative')) {
                dd.classList.add('hidden');
            }
        });
    </script>
    @stack('scripts')
</body>
</html>
