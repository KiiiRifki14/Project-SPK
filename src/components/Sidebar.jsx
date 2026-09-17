import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Users, 
  Calculator, 
  Award, 
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pelamarCount, kriteriaCount }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Ringkasan & statistik rekrutmen'
    },
    {
      id: 'kriteria',
      label: 'Data Kriteria',
      icon: Sliders,
      desc: 'Pengaturan bobot C1 - C5',
      badge: `${kriteriaCount || 5} Kriteria`
    },
    {
      id: 'pelamar',
      label: 'Data Pelamar',
      icon: Users,
      desc: 'CRUD & Import Excel',
      badge: `${pelamarCount || 0} Orang`
    },
    {
      id: 'dapur',
      label: 'Dapur Hitung SAW',
      icon: Calculator,
      desc: '3 Matriks Transparan Dosen',
      highlight: true
    },
    {
      id: 'ranking',
      label: 'Hasil Ranking',
      icon: Award,
      desc: 'Leaderboard & Kuota Lolos'
    },
    {
      id: 'laporan',
      label: 'Cetak Berita Acara',
      icon: Printer,
      desc: 'Format resmi SK BPS Subang'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between no-print shadow-sm">
      {/* Menu Navigasi Utama */}
      <div className="p-4 space-y-1.5">
        <div className="px-3 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama Aplikasi
          </p>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-bps-navy to-bps-navy-light text-white shadow-md shadow-bps-navy/20 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-bps-navy'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : item.highlight
                      ? 'bg-bps-blue/10 text-bps-blue'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">
                      {item.label}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Badge atau Icon Aktif */}
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {item.badge && !isActive && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-bps-blue animate-pulse" title="Modul Pengujian Ilmiah" />
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Akademik & Instansi Footer */}
      <div className="p-4 m-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2 font-bold text-bps-navy text-xs">
          <Info className="w-4 h-4 text-bps-blue flex-shrink-0" />
          <span>Buku Ajar SPK Polsub</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Penerapan Bab 5 Metode <strong>Simple Additive Weighting (SAW)</strong> pada Seleksi Mitra Statistik BPS Subang.
        </p>
        <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Kelompok 8 D3 SI</span>
          <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">v1.0 Ready</span>
        </div>
      </div>
    </aside>
  );
}
