import React, { useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  UserCheck, 
  Sparkles, 
  ChevronDown,
  ShieldCheck,
  Award,
  Calendar,
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumb & Current Title */}
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1 hover:text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-bps-blue" />
                BPS Kabupaten Subang
              </span>
              <span>/</span>
              <span className="text-slate-600 font-semibold">{currentInfo.category}</span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-bps-navy tracking-tight leading-none mt-0.5">
              {currentInfo.title}
            </h1>
          </div>

          {/* Quick Action Buttons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-bps-navy bg-bps-blue-light hover:bg-blue-100/80 border border-bps-blue/20 transition-all active:scale-95"
                title="Muat ulang 8 data pelamar asli Subang"
              >
                <Sparkles className="w-3.5 h-3.5 text-bps-blue" />
                Muat Sampel Subang
              </button>
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95"
                title="Reset seluruh data ke kondisi awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Quota Badge Indicator */}
            {summary && summary.totalPelamar > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kuota: <strong>{summary.kuotaLolos}</strong> / {summary.totalPelamar} Mitra</span>
              </div>
            )}

            {/* Divider */}
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Profile Avatar & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bps-navy to-bps-navy-light text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  MR
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    Muhammad Rifki
                  </p>
                  <p className="text-[10px] text-bps-blue font-semibold tracking-wide">
                    {activeRole === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Pengaturan Peran (Demo)</p>
                    <p className="text-[11px] text-slate-400">Ubah peran untuk simulasi pengujian</p>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        onChangeRole('panitia');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'panitia' 
                          ? 'bg-bps-blue-light text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-bps-blue" />
                      <div>
                        <p className="leading-tight">Panitia Seleksi</p>
                        <p className="text-[10px] text-slate-400">Muhammad Rifki (D3 SI)</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onChangeRole('superadmin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'superadmin' 
                          ? 'bg-bps-blue-light text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="leading-tight">Superadmin BPS Subang</p>
                        <p className="text-[10px] text-slate-400">Hak akses penuh sistem</p>
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
