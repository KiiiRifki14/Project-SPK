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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm no-print">
      <div className="px-5 sm:px-7 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Breadcrumb & Current Title */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:text-bps-navy hover:bg-slate-200/70 transition-colors">
                <Building2 className="w-3.5 h-3.5 text-bps-blue" aria-hidden="true" />
                BPS Kab. Subang
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-bps-blue font-bold tracking-wide">{currentInfo.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-bps-navy tracking-tight leading-snug">
              {currentInfo.title}
            </h1>
          </div>

          {/* Quick Action Buttons & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={onLoadSample}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-bps-navy bg-slate-100 hover:bg-slate-200/80 border border-slate-300/70 transition-all active:scale-95 shadow-xs focus-ring"
                title="Muat ulang 8 data pelamar asli Subang"
              >
                <Sparkles className="w-4 h-4 text-bps-blue" aria-hidden="true" />
                Muat Sampel
              </button>
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95 shadow-xs focus-ring"
                title="Reset seluruh data ke kondisi awal"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" aria-hidden="true" />
                Reset Data
              </button>
            </div>

            {/* Quota Badge Indicator */}
            {summary && summary.totalPelamar > 0 && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800 shadow-xs tabular-nums">
                <Award className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Kuota: <strong className="text-emerald-950 font-black">{summary.kuotaLolos}</strong> / {summary.totalPelamar} Mitra</span>
              </div>
            )}

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* Profile Avatar & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                aria-haspopup="true"
                aria-expanded={showRoleDropdown}
                aria-label="Pengaturan profil dan simulasi peran"
                className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100/90 transition-all border border-slate-200/80 hover:border-slate-300 shadow-xs focus-ring"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bps-navy to-bps-navy-light text-white flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-bps-blue/20">
                  MR
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Muhammad Rifki
                  </p>
                  <p className="text-[11px] text-bps-blue font-semibold tracking-wide leading-tight flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-bps-blue" aria-hidden="true" />
                    {activeRole === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
              </button>

              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div 
                  role="menu"
                  className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in"
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Pengaturan Peran (Simulasi)</p>
                    <p className="text-[11px] text-slate-400">Pilih mode akses untuk pengujian sistem</p>
                  </div>
                  <div className="py-1.5 space-y-1">
                    <button
                      role="menuitem"
                      onClick={() => {
                        onChangeRole('panitia');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        activeRole === 'panitia' 
                          ? 'bg-blue-50/80 text-bps-navy font-bold border border-blue-100' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-bps-blue" />
                      <div>
                        <p className="leading-tight text-left font-bold">Panitia Seleksi</p>
                        <p className="text-[10px] text-slate-400 text-left">Muhammad Rifki (D3 SI)</p>
                      </div>
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        onChangeRole('superadmin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        activeRole === 'superadmin' 
                          ? 'bg-blue-50/80 text-bps-navy font-bold border border-blue-100' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="leading-tight text-left font-bold">Superadmin BPS Subang</p>
                        <p className="text-[10px] text-slate-400 text-left">Hak akses penuh sistem & kriteria</p>
                      </div>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 sm:hidden space-y-1">
                    <button
                      onClick={() => {
                        onLoadSample();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-bps-navy hover:bg-slate-50 rounded-xl flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-bps-blue" /> Muat Sampel Subang
                    </button>
                    <button
                      onClick={() => {
                        onResetData();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset Data Awal
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
