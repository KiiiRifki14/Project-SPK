import React, { useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  ChevronDown,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Navbar({ onResetData, onLoadSample, activeRole, onChangeRole, summary }) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Info Instansi */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bps-navy to-bps-blue flex items-center justify-center text-white shadow-md shadow-bps-navy/20 flex-shrink-0">
              {/* BPS Subang Logo Geometry */}
              <svg viewBox="0 0 40 40" className="w-6 h-6 fill-current">
                <path d="M8 28 L20 8 L32 28 Z" fill="#00A3E0" opacity="0.9"/>
                <circle cx="20" cy="22" r="5" fill="#10B981" />
                <path d="M12 30 L28 30 L20 34 Z" fill="#F59E0B" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-bps-navy">
                  SPK SELEKSI MITRA STATISTIK
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-bps-blue/10 text-bps-blue border border-bps-blue/20">
                  Metode SAW
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Badan Pusat Statistik (BPS) Kabupaten Subang • Kelompok 8 D3 SI Polsub
              </p>
            </div>
          </div>

          {/* Quick Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Tombol Muat Ulang / Reset Data Sampel */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-bps-navy bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Muat ulang 8 data pelamar asli Subang"
              >
                <Sparkles className="w-3.5 h-3.5 text-bps-blue" />
                Muat Sampel Subang
              </button>
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                title="Reset seluruh data ke kondisi awal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Data
              </button>
            </div>

            {/* Status Perangkingan Mini */}
            {summary && summary.totalPelamar > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kuota Lolos: <strong>{summary.kuotaLolos}</strong> / {summary.totalPelamar}</span>
              </div>
            )}

            {/* Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-bps-navy text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  MR
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    Muhammad Rifki
                  </p>
                  <p className="text-[10px] text-bps-blue font-semibold uppercase tracking-wider">
                    {activeRole === 'superadmin' ? 'Superadmin BPS' : 'Panitia Seleksi'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Akun Penguji / Demo</p>
                    <p className="text-[11px] text-slate-500">Ganti peran untuk simulasi fitur</p>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        onChangeRole('panitia');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'panitia' 
                          ? 'bg-bps-blue/10 text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-bps-blue" />
                      Panitia Seleksi (Muhammad Rifki)
                    </button>
                    <button
                      onClick={() => {
                        onChangeRole('superadmin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeRole === 'superadmin' 
                          ? 'bg-bps-blue/10 text-bps-navy font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Superadmin BPS Subang
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex lg:hidden flex-col gap-1">
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
