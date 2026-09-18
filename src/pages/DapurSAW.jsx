import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  ChevronRight,
  BookOpen,
  X
} from 'lucide-react';

export default function DapurSAW({ sawResult, kriteria = [] }) {
  const [activeMatrixTab, setActiveMatrixTab] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { matrixX = [], extremes = {}, matrixR = [], matrixWR = [] } = sawResult || {};

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-bps-blue" />
            Dapur Hitung SAW (Pembuktian Akademik)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparansi 3 matriks komputasi matematis SAW sesuai Bab 5 Buku Ajar SPK Polsub.
          </p>
        </div>

        {/* Tab Switcher: 2x2 grid on mobile, flex on desktop (Zero horizontal scroll) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs w-full sm:w-auto text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveMatrixTab('all')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'all' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Semua Matriks
          </button>
          <button
            onClick={() => setActiveMatrixTab('x')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'x' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Matriks X
          </button>
          <button
            onClick={() => setActiveMatrixTab('r')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'r' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Matriks R
          </button>
          <button
            onClick={() => setActiveMatrixTab('wr')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'wr' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Matriks W×R
          </button>
        </div>
      </div>

      {/* Banner Formula Ilmiah */}
      <div className="bg-bps-navy text-white p-4 sm:p-5 rounded-xl border border-bps-navy-dark shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-200">
          <BookOpen className="w-4 h-4 text-bps-blue" aria-hidden="true" />
          <span>Formula Komputasi SAW (Simple Additive Weighting)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Rumus Benefit */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">1. Normalisasi Benefit (C1, C2, C3, C4):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              r_ij = x_ij / max(x_j)
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Nilai pelamar dibagi nilai tertinggi kolom tersebut.</p>
          </div>

          {/* Rumus Cost */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">2. Normalisasi Cost (C5 Jarak Domisili):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              r_ij = min(x_j) / x_ij
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Nilai terendah dibagi nilai jarak pelamar.</p>
          </div>

          {/* Rumus Skor Preferensi Vi */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">3. Preferensi Akhir (Skor V):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              V_i = Σ (w_j × r_ij)
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Penjumlahan hasil kali matriks ternormalisasi dengan bobot.</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABEL 1: MATRIKS KEPUTUSAN AWAL (X) */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'x') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-navy text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Tabel 1: Matriks Keputusan Awal (X)</span>
              </h2>
              <p className="text-xs text-slate-500">Nilai mentah seluruh calon mitra dan baris nilai ekstrim (Max / Min)</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              Nilai Riil Input
            </span>
          </div>

          {/* 1. DUAL-VIEW: Mobile Native Matrix X Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {/* Top Card: Nilai Ekstrim Max & Min */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200/80 space-y-2">
              <div className="text-[11px] font-bold text-bps-navy uppercase tracking-wider">
                Nilai Ekstrim Parameter:
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {kriteria.map(c => (
                  <div key={c.kode} className="bg-white p-1.5 rounded-lg border border-slate-200/90 shadow-2xs">
                    <span className="block text-[10px] font-black text-slate-900">{c.kode}</span>
                    <span className="block text-[8px] uppercase text-slate-400 font-semibold">({c.sifat})</span>
                    <div className="mt-1 pt-1 border-t border-slate-100 space-y-0.5">
                      <span className="block text-[9px] text-slate-500">
                        Max: <strong className="text-bps-blue font-mono">{extremes[c.kode]?.max ?? '-'}</strong>
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        Min: <strong className="text-amber-700 font-mono">{extremes[c.kode]?.min ?? '-'}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Calon Mitra Matriks X */}
            {matrixX.map((row, idx) => (
              <div key={row.id || idx} className="p-4 space-y-2.5 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{row.nama}</h4>
                      <p className="text-[10px] text-slate-400 truncate">📍 {row.kecamatan}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {kriteria.map(c => (
                    <div key={c.kode} className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400">{c.kode}</span>
                      <span className="font-mono font-black text-slate-800 text-xs mt-0.5 block tabular-nums">
                        {row[c.kode]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 2. DUAL-VIEW: Desktop Full Table (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[660px]">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th scope="col" className="py-2.5 px-3.5 sticky left-0 z-20 bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)] min-w-[140px]">Nama Pelamar</th>
                  <th scope="col" className="py-2.5 px-3.5">Kecamatan</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right">
                      <div className="font-bold">{c.kode}</div>
                      <div className="text-[10px] font-normal lowercase text-slate-400">({c.sifat})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixX.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
                      {row.nama}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-medium">{row.kecamatan}</td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-800">
                        {row[c.kode]}
                        {c.kode === 'C5' && <span className="text-[10px] text-slate-400 ml-0.5 font-normal">km</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-xs">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3.5 text-right text-bps-navy uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-slate-100 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
                    Nilai Maksimum (Max):
                  </td>
                  {kriteria.map(c => (
                    <td key={c.kode} className={`py-2.5 px-3 text-right font-mono tabular-nums ${
                      c.sifat === 'benefit' ? 'text-bps-blue bg-blue-50/80 font-black' : 'text-slate-400'
                    }`}>
                      {extremes[c.kode]?.max ?? '-'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={3} className="py-2.5 px-3.5 text-right text-amber-800 uppercase tracking-wider text-[11px] sticky left-0 z-10 bg-slate-100 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
                    Nilai Minimum (Min):
                  </td>
                  {kriteria.map(c => (
                    <td key={c.kode} className={`py-2.5 px-3 text-right font-mono tabular-nums ${
                      c.sifat === 'cost' ? 'text-amber-700 bg-amber-50/80 font-black' : 'text-slate-400'
                    }`}>
                      {extremes[c.kode]?.min ?? '-'}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABEL 2: MATRIKS TERNORMALISASI (R) */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'r') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-blue text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Tabel 2: Matriks Ternormalisasi (R)</span>
              </h2>
              <p className="text-xs text-slate-500">Nilai skala [0, 1] hasil normalisasi Benefit & Cost (Presisi 4 desimal)</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-bps-navy border border-blue-200">
              Skala [0, 1]
            </span>
          </div>

          {/* 1. DUAL-VIEW: Mobile Native Matrix R Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {matrixR.map((row, idx) => (
              <div key={row.id || idx} className="p-4 space-y-2.5 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-bps-navy font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-100">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs truncate">{row.nama}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-bps-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Skala [0, 1]
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {kriteria.map(c => {
                    const val = row.R?.[c.kode] ?? row[c.kode];
                    return (
                      <div key={c.kode} className={`p-1.5 rounded-lg border text-center ${val === 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                        <span className="block text-[8px] font-bold text-slate-400">r_{c.kode}</span>
                        <span className={`font-mono text-[10.5px] block font-bold tabular-nums mt-0.5 ${val === 1 ? 'text-emerald-800 font-black' : 'text-slate-800'}`}>
                          {val !== undefined ? val.toFixed(4) : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 2. DUAL-VIEW: Desktop Full Table (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[660px]">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th scope="col" className="py-2.5 px-3.5 sticky left-0 z-20 bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)] min-w-[140px]">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right font-bold">
                      r_{c.kode}
                      <span className="block text-[10px] font-normal lowercase text-slate-400">
                        {c.sifat === 'benefit' ? `x / ${extremes[c.kode]?.max}` : `${extremes[c.kode]?.min} / x`}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixR.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
                      {row.nama}
                    </td>
                    {kriteria.map(c => {
                      const val = row.R?.[c.kode] ?? row[c.kode];
                      return (
                        <td 
                          key={c.kode} 
                          className={`py-2.5 px-3 text-right font-mono tabular-nums font-semibold ${
                            val === 1 ? 'text-emerald-700 bg-emerald-50/60 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {val !== undefined ? val.toFixed(4) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABEL 3: MATRIKS TERBOBOT (W * R) & SKOR PREFERENSI (V) */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'wr') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Tabel 3: Matriks Terbobot (W × R) & Nilai Preferensi Akhir (V)</span>
              </h2>
              <p className="text-xs text-slate-500">Perkalian r_ij dengan bobot w_j serta total penjumlahan skor akhir V</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Skor Akhir V_i
            </span>
          </div>

          {/* 1. DUAL-VIEW: Mobile Native Matrix WxR Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {matrixWR.map((row, idx) => (
              <div key={row.id || idx} className="p-4 space-y-3 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-mono font-black text-xs flex items-center justify-center flex-shrink-0 border border-emerald-200">
                      #{idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs truncate">{row.nama}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="block text-[8px] font-bold uppercase text-bps-blue">Skor Akhir (V)</span>
                    <span className="font-mono font-black text-sm text-bps-navy tabular-nums block">
                      {row.scoreV.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center bg-slate-50/90 p-2 rounded-xl border border-slate-100">
                  {kriteria.map(c => (
                    <div key={c.kode} className="bg-white p-1.5 rounded-lg border border-slate-100 shadow-2xs">
                      <span className="block text-[8px] font-bold text-slate-400">{c.kode}</span>
                      <span className="font-mono font-bold text-[10px] text-slate-700 block tabular-nums mt-0.5">
                        {row.WR[c.kode] !== undefined ? row.WR[c.kode].toFixed(4) : '-'}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedCandidate(row)}
                  aria-label={`Audit detail perhitungan SAW untuk ${row.nama}`}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold text-bps-navy bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-2 active:scale-98 focus-ring"
                >
                  <Eye className="w-4 h-4 text-bps-blue" aria-hidden="true" />
                  <span>Audit Rincian Perhitungan SAW</span>
                </button>
              </div>
            ))}
          </div>

          {/* 2. DUAL-VIEW: Desktop Full Table (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[720px]">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th scope="col" className="py-2.5 px-3.5 sticky left-0 z-20 bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)] min-w-[160px]">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right">
                      <div className="font-bold">{c.kode} × {c.bobot}</div>
                      <div className="text-[10px] font-normal text-slate-400 tabular-nums">({c.bobot * 100}%)</div>
                    </th>
                  ))}
                  <th scope="col" className="py-2.5 px-3.5 text-right bg-blue-50/80 text-bps-navy font-extrabold">
                    Nilai Preferensi (V)
                  </th>
                  <th scope="col" className="py-2.5 px-3.5 text-center w-24">Inspeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixWR.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[2px_0_4px_rgba(0,0,0,0.06)]">
                      <span className="truncate">{row.nama}</span>
                    </td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                        {row.WR[c.kode] !== undefined ? row.WR[c.kode].toFixed(4) : '-'}
                      </td>
                    ))}
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-black text-bps-navy bg-blue-50/50 text-sm">
                      {row.scoreV.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        onClick={() => setSelectedCandidate(row)}
                        aria-label={`Audit detail perhitungan SAW untuk ${row.nama}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-bps-blue bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 focus-ring"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Candidate Detail Inspector */}
      {selectedCandidate && (
        <div 
          role="region"
          aria-label="Detail Hasil Audit Perhitungan"
          className="p-4 sm:p-5 rounded-xl bg-blue-50/60 border border-bps-blue/30 shadow-xs space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-bps-blue/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-bps-blue text-white shadow-2xs">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-bps-navy text-sm">
                  Audit Aritmetika SAW: {selectedCandidate.nama} ({selectedCandidate.kecamatan})
                </h3>
                <p className="text-[11px] text-slate-500">Bukti penjabaran rumus perkalian matriks secara eksplisit</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCandidate(null)}
              aria-label="Tutup panel audit"
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-white flex items-center gap-1 focus-ring"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Tutup</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-white rounded-lg border border-slate-200/90 font-mono text-xs text-bps-navy leading-relaxed shadow-2xs space-y-2 break-words">
              <div>
                <div className="text-slate-500 text-[11px] font-sans font-medium">1. Penjabaran Nilai Bobot × Normalisasi:</div>
                <div className="text-slate-800 text-xs break-words">
                  V = {kriteria.map((c, i) => (
                    <span key={c.kode} className="inline-block mr-1">
                      ({c.bobot} × {matrixR.find(r => r.id === selectedCandidate.id)?.R[c.kode]?.toFixed(4)})
                      {i < kriteria.length - 1 ? ' +' : ''}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-[11px] font-sans font-medium">2. Hasil Perkalian:</div>
                <div className="font-bold text-bps-blue text-xs break-words">
                  = {kriteria.map(c => selectedCandidate.WR[c.kode]?.toFixed(4)).join(' + ')}
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100 flex items-baseline gap-2">
                <span className="text-slate-500 text-[11px] font-sans font-medium">3. Skor Preferensi Akhir:</span>
                <span className="text-base font-black text-bps-navy">
                  = {selectedCandidate.scoreV.toFixed(4)}
                </span>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 italic">
              * Hasil komputasi ini 100% konsisten dengan kalkulator dan formula Excel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
