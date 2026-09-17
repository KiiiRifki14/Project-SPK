import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Users, 
  Calculator, 
  Award, 
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pelamarCount, kriteriaCount, bobotValid }) {
  const navigationGroups = [
    {
      group: 'MENU UTAMA',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          desc: 'Statistik ringkasan seleksi'
        }
      ]
    },
    {
      group: 'DATA & PARAMETER',
      items: [
        {
          id: 'kriteria',
          label: 'Data Kriteria',
          icon: Sliders,
          desc: 'Bobot C1 - C5 & validasi',
          badge: `${kriteriaCount || 5} Kriteria`,
          badgeColor: bobotValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700 font-bold animate-pulse'
        },
        {
          id: 'pelamar',
          label: 'Data Pelamar',
          icon: Users,
          desc: 'Manajemen kandidat & Excel',
          badge: `${pelamarCount || 0} Orang`,
          badgeColor: 'bg-slate-100 text-slate-700'
        }
      ]
    },
    {
      group: 'KOMPUTASI & KEPUTUSAN',
      items: [
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
          desc: 'Format SK Resmi BPS Subang'
        }
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200/80 flex-shrink-0 flex flex-col justify-between no-print shadow-sm min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bps-navy-dark via-bps-navy to-bps-blue flex items-center justify-center text-white shadow-md shadow-bps-navy/20 flex-shrink-0">
            {/* Logo BPS Geometry */}
            <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current">
              <polygon points="20,6 34,30 6,30" fill="#00A3E0" />
              <circle cx="20" cy="22" r="5" fill="#10B981" />
              <path d="M12 30 L28 30 L20 34 Z" fill="#F59E0B" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-bps-navy tracking-tight truncate">
                BPS SUBANG
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-bps-blue/10 text-bps-blue uppercase tracking-wide">
                SPK SAW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              Seleksi Mitra Statistik
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3.5 space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                      isActive
                        ? 'bg-bps-navy text-white shadow-md shadow-bps-navy/25 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-bps-navy font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.highlight
                            ? 'bg-bps-blue/10 text-bps-blue group-hover:bg-bps-blue/20'
                            : 'bg-slate-100 text-slate-500 group-hover:text-bps-navy'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold block truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] block truncate ${
                            isActive ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {item.badge && !isActive && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-semibold ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-bps-blue animate-ping" title="Modul Ilmiah Dosen" />
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 m-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-bps-navy text-xs">
          <BookOpen className="w-3.5 h-3.5 text-bps-blue flex-shrink-0" />
          <span>Buku Ajar SPK Polsub</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Metode SAW Bab 5 diterapkan pada rekrutmen mitra survei BPS Kabupaten Subang.
        </p>
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Kelompok 8 D3 SI</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">100% Teruji</span>
        </div>
      </div>
    </aside>
  );
}
