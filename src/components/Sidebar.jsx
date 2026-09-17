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
          desc: 'Statistik & alur seleksi'
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
          desc: 'Bobot C1 - C5 & sifat',
          badge: `${kriteriaCount || 5} Kriteria`,
          badgeColor: bobotValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 font-bold border border-rose-300 animate-pulse'
        },
        {
          id: 'pelamar',
          label: 'Data Pelamar',
          icon: Users,
          desc: 'Manajemen kandidat & nilai',
          badge: `${pelamarCount || 0} Calon`,
          badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200'
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
          label: 'Hasil Perangkingan',
          icon: Award,
          desc: 'Leaderboard & kuota kelulusan'
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
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between no-print shadow-[1px_0_4px_rgba(0,0,0,0.02)] min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bps-navy flex items-center justify-center text-white shadow-md shadow-bps-navy/20 flex-shrink-0 border border-bps-navy-light/40">
            {/* Logo BPS Geometry */}
            <svg viewBox="0 0 40 40" className="w-6 h-6">
              <polygon points="20,6 35,31 5,31" fill="#00A3E0" />
              <circle cx="20" cy="22.5" r="5.5" fill="#10B981" />
              <polygon points="12,31 28,31 20,36" fill="#F59E0B" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[13px] text-bps-navy tracking-tight truncate">
                BPS KAB. SUBANG
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-bps-blue/10 text-bps-blue uppercase tracking-wider">
                SAW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              Seleksi Mitra Statistik Lapangan
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4">
          {navigationGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 text-left focus-ring ${
                      isActive
                        ? 'bg-bps-navy text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-bps-navy font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : item.highlight
                            ? 'bg-bps-blue/10 text-bps-blue group-hover:bg-bps-blue/20'
                            : 'bg-slate-100 text-slate-500 group-hover:text-bps-navy'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate leading-tight">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] block truncate leading-tight mt-0.5 ${
                            isActive ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                      {item.badge && !isActive && (
                        <span className={`px-1.5 py-0.5 text-[9px] rounded-md font-semibold ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-bps-blue animate-ping" title="Modul Ilmiah Dosen" />
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Academic Citation Footer */}
      <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-bps-navy text-xs">
          <BookOpen className="w-3.5 h-3.5 text-bps-blue flex-shrink-0" />
          <span>Buku Ajar SPK Polsub</span>
        </div>
        <p className="text-[10.5px] text-slate-500 leading-relaxed">
          Metode SAW Bab 5 karya Pak Chepy Perdana dkk diterapkan pada seleksi mitra BPS Subang.
        </p>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span className="font-semibold text-slate-600">Kelompok 8 D3 SI</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">100% Teruji</span>
        </div>
      </div>
    </aside>
  );
}
