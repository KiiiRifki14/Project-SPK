import React, { useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  UserCheck, 
  Sparkles, 
  ChevronDown,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onResetData, 
  onLoadSample, 
  activeRole, 
  onChangeRole, 
  summary 
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Tab Breadcrumb Map
  const tabTitles = {
    dashboard: { title: 'Dashboard Utama', category: 'Ringkasan Eksekutif' },
    kriteria: { title: 'Manajemen Kriteria', category: 'Bobot Penilaian C1 - C5' },
    pelamar: { title: 'Data Calon Mitra', category: 'Manajemen Kandidat' },
    dapur: { title: 'Dapur Hitung SAW', category: 'Pembuktian 3 Matriks' },
    ranking: { title: 'Hasil Perangkingan', category: 'Leaderboard & Kuota' },
    laporan: { title: 'Berita Acara Resmi', category: 'Format Cetak SK BPS' }
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] no-print">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Breadcrumb & Current Title */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1 hover:text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-bps-blue" />
                BPS Subang
              </span>
              <span>/</span>
              <span className="text-slate-600 font-semibold">{currentInfo.category}</span>
            </div>
            <h1 className="text-base font-extrabold text-bps-navy tracking-tight leading-none mt-0.5">
              {currentInfo.title}
            </h1>
          </div>

          {/* Quick Action Buttons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-bps-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 focus-ring"
                title="Muat ulang 8 data pelamar asli Subang"
              >
                <Sparkles className="w-3.5 h-3.5 text-bps-blue" aria-hidden="true" />
                Muat Sampel
              </button>
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 transition-all active:scale-95 focus-ring"
                title="Reset seluruh data ke kondisi awal"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                Reset
              </button>
            </div>

            {/* Quota Badge Indicator */}
            {summary && summary.totalPelamar > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/90 text-xs font-semibold text-emerald-800 tabular-nums">
                <Award className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Kuota: <strong>{summary.kuotaLolos}</strong> / {summary.totalPelamar} Mitra</span>
              </div>
            )}

            {/* Divider */}
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Profile Avatar & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                aria-haspopup="true"
                aria-expanded={showRoleDropdown}
                aria-label="Pengaturan profil dan simulasi peran"
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 focus-ring"
              >
                <div className="w-8 h-8 rounded-lg bg-bps-navy text-white flex items-center justify-center font-bold text-xs shadow-xs border border-bps-navy-light/50">
                  MR
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    Muhammad Rifki
                  </p>
                  <p className="text-[10px] text-bps-blue font-semibold tracking-wide leading-tight">
                    {activeRole === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div 
                  role="menu"
                  className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Pengaturan Peran (Demo)</p>
                    <p className="text-[11px] text-slate-400">Ubah peran untuk simulasi pengujian</p>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      role="menuitem"
                      onClick={() => {
                        onChangeRole('panitia');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'panitia' 
                          ? 'bg-blue-50 text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-bps-blue" />
                      <div>
                        <p className="leading-tight text-left">Panitia Seleksi</p>
                        <p className="text-[10px] text-slate-400 text-left">Muhammad Rifki (D3 SI)</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onChangeRole('superadmin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'superadmin' 
                          ? 'bg-blue-50 text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="leading-tight text-left">Superadmin BPS Subang</p>
                        <p className="text-[10px] text-slate-400 text-left">Hak akses penuh sistem</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 sm:hidden space-y-1">
                    <button
                      onClick={() => {
                        onLoadSample();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-bps-navy hover:bg-slate-50 rounded-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-bps-blue" /> Muat Sampel Subang
                    </button>
                    <button
                      onClick={() => {
                        onResetData();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Data Awal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
