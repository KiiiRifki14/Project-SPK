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
  X,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DapurSAW({ sawResult, kriteria = [] }) {
  const [activeMatrixTab, setActiveMatrixTab] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { 
    matrixRaw = [], 
    matrixX = [], 
    extremes = {}, 
    matrixR = [], 
    matrixWR = [] 
  } = sawResult || {};

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-bps-blue" />
            Dapur Hitung SAW (Pembuktian Akademik 4 Tabel)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparansi komputasi SAW sesuai PRD Final v2.0.0 & Bab 5 Buku Ajar SPK Polsub.
          </p>
        </div>

        {/* Tab Switcher: 5 buttons, responsive grid on mobile, flex on desktop (Zero horizontal scroll) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs w-full sm:w-auto text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveMatrixTab('all')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'all' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Semua (4 Tabel)
          </button>
          <button
            onClick={() => setActiveMatrixTab('raw')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'raw' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            1. Data Mentah
          </button>
          <button
            onClick={() => setActiveMatrixTab('x')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'x' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            2. Matriks X (Crisp)
          </button>
          <button
            onClick={() => setActiveMatrixTab('r')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'r' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            3. Matriks R
          </button>
          <button
            onClick={() => setActiveMatrixTab('wr')}
            className={`px-3 py-2 min-h-[40px] rounded-lg transition-all focus-ring text-center flex items-center justify-center ${
              activeMatrixTab === 'wr' 
                ? 'bg-bps-navy text-white shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            4. Matriks W×R
          </button>
        </div>
      </div>

      {/* Banner Formula Ilmiah */}
      <div className="bg-bps-navy text-white p-4 sm:p-5 rounded-xl border border-bps-navy-dark shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-200">
          <BookOpen className="w-4 h-4 text-bps-blue" aria-hidden="true" />
          <span>Formula Komputasi SAW PRD Final v2.0 (Academic Revision)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Rumus Benefit */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">1. Normalisasi Benefit (C1, C2, C3, C4):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              r_ij = x_ij / max(x_j)
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Nilai crisp pelamar dibagi nilai crisp tertinggi kolom.</p>
          </div>

          {/* Rumus Cost */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">2. Normalisasi Cost (C5 Jarak Domisili):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              r_ij = min(x_j) / x_ij
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Nilai crisp terendah (terdekat) dibagi nilai crisp jarak pelamar.</p>
          </div>

          {/* Rumus Skor Preferensi Vi */}
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 space-y-1">
            <p className="font-bold text-amber-300 text-[11.5px]">3. Preferensi Akhir (Skor V):</p>
            <p className="font-mono text-xs bg-black/30 py-1.5 px-2 rounded-lg text-center font-bold text-white tabular-nums">
              V_i = Σ (w_j × r_ij)
            </p>
            <p className="text-[10.5px] text-blue-100/90 leading-tight">Penjumlahan hasil kali matriks ternormalisasi dengan bobot w_j.</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABEL 1: DATA MENTAH PELAMAR (RAW INPUTS)               */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'raw') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Tabel 1: Data Mentah Pelamar (Raw Inputs)</span>
              </h2>
              <p className="text-xs text-slate-500">Nilai riil asli yang diinputkan dari berkas dan hasil ujian seleksi</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              Data Mentah
            </span>
          </div>

          {/* Mobile Cards for Raw Data */}
          <div className="md:hidden divide-y divide-slate-100">
            {matrixRaw.map((row, idx) => (
              <div key={row.id || idx} className="p-4 space-y-2 hover:bg-slate-50/40">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs truncate">{row.nama}</h4>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[8px]">C1 Ujian</span>
                    <span className="font-mono font-bold text-slate-800">{row.C1}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[8px]">C2 Surv</span>
                    <span className="font-mono font-bold text-slate-800">{row.C2}x</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[8px]">C3 CAPI</span>
                    <span className="font-mono font-bold text-slate-800">{row.C3}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[8px]">C4 Edu</span>
                    <span className="font-mono font-bold text-slate-800 truncate">{row.C4}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-bold text-[8px]">C5 Jarak</span>
                    <span className="font-mono font-bold text-slate-800">{row.C5} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table for Raw Data */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th scope="col" className="py-2.5 px-3.5 min-w-[140px]">Nama Pelamar</th>
                  <th scope="col" className="py-2.5 px-3.5">Kecamatan</th>
                  <th scope="col" className="py-2.5 px-3 text-right">C1: Ujian (Poin)</th>
                  <th scope="col" className="py-2.5 px-3 text-right">C2: Pengalaman (Kali)</th>
                  <th scope="col" className="py-2.5 px-3 text-right">C3: CAPI (Poin)</th>
                  <th scope="col" className="py-2.5 px-3 text-center">C4: Pendidikan</th>
                  <th scope="col" className="py-2.5 px-3 text-right">C5: Jarak (KM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixRaw.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 truncate">{row.nama}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{row.kecamatan}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{row.C1}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{row.C2} kali</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{row.C3}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {row.C4}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 tabular-nums">{row.C5} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABEL 2: MATRIKS KEPUTUSAN AWAL (X) - DATA CRISP 1–5    */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'x') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-navy text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Tabel 2: Matriks Keputusan Awal (X) - Data Crisp 1–5</span>
              </h2>
              <p className="text-xs text-slate-500">Hasil konversi subkriteria data mentah ke skala crisp baku 1–5 (PRD Bagian 2.2)</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-bps-navy border border-blue-200">
              Skala Crisp 1–5
            </span>
          </div>

          {/* 1. DUAL-VIEW: Mobile Native Matrix X Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {/* Top Card: Nilai Ekstrim Max & Min */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200/80 space-y-2">
              <div className="text-[11px] font-bold text-bps-navy uppercase tracking-wider">
                Nilai Ekstrim Parameter Crisp:
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
                  <th scope="col" className="py-2.5 px-3.5 min-w-[140px]">Nama Pelamar</th>
                  <th scope="col" className="py-2.5 px-3.5">Kecamatan</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right">
                      <div className="font-bold">{c.kode} (Crisp)</div>
                      <div className="text-[10px] font-normal lowercase text-slate-400">({c.sifat})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixX.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 truncate">{row.nama}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{row.kecamatan}</td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-2.5 px-3 text-right font-mono font-black tabular-nums text-slate-800">
                        {row[c.kode]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-xs">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3.5 text-bps-navy font-bold uppercase tracking-wider">
                    Nilai Ekstrim Max(x_j) / Min(x_j) Crisp:
                  </td>
                  {kriteria.map(c => {
                    const isCost = c.sifat?.toLowerCase() === 'cost';
                    return (
                      <td key={c.kode} className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {isCost ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Min: {extremes[c.kode]?.min ?? '-'}
                          </span>
                        ) : (
                          <span className="text-bps-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            Max: {extremes[c.kode]?.max ?? '-'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TABEL 3: MATRIKS TERNORMALISASI (R)                     */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'r') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-blue text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Tabel 3: Matriks Ternormalisasi (R)</span>
              </h2>
              <p className="text-xs text-slate-500">Nilai r_ij hasil pembagian dengan nilai ekstrim (Skala [0, 1])</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-bps-navy border border-blue-200">
              Skala [0, 1]
            </span>
          </div>

          {/* 1. DUAL-VIEW: Mobile Native Matrix R Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-slate-100">
            {matrixR.map((row, idx) => (
              <div key={row.id || idx} className="p-4 space-y-2.5 hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-blue-50 text-bps-navy font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-blue-200">
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
                  <th scope="col" className="py-2.5 px-3.5 min-w-[140px]">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right">
                      <div className="font-bold">r_{c.kode}</div>
                      <div className="text-[10px] font-normal lowercase text-slate-400">({c.sifat})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixR.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 truncate">{row.nama}</td>
                    {kriteria.map(c => {
                      const val = row.R?.[c.kode] ?? row[c.kode];
                      return (
                        <td key={c.kode} className="py-2.5 px-3 text-right font-mono tabular-nums">
                          <span className={val === 1 ? 'text-emerald-700 font-black bg-emerald-50 px-1 py-0.5 rounded' : 'text-slate-700 font-bold'}>
                            {val !== undefined ? val.toFixed(4) : '-'}
                          </span>
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
      {/* TABEL 4: MATRIKS TERBOBOT (W × R) & NILAI PREFERENSI (V) */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'wr') && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Tabel 4: Matriks Terbobot (W × R) & Nilai Preferensi Akhir (V)</span>
              </h2>
              <p className="text-xs text-slate-500">Perkalian r_ij dengan bobot w_j serta total penjumlahan skor akhir V_i</p>
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
                  <th scope="col" className="py-2.5 px-3.5 min-w-[140px]">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th scope="col" key={c.kode} className="py-2.5 px-3 text-right">
                      <div className="font-bold">{c.kode} × w_{c.kode}</div>
                      <div className="text-[10px] font-normal text-slate-400">({c.bobot.toFixed(4)})</div>
                    </th>
                  ))}
                  <th scope="col" className="py-2.5 px-4 text-right bg-emerald-50/80 text-emerald-950 font-black">
                    Skor V_i
                  </th>
                  <th scope="col" className="py-2.5 px-3.5 text-center w-24">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixWR.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-2.5 px-3.5 font-bold text-slate-900 truncate">
                      {row.nama}
                    </td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                        {row.WR[c.kode] !== undefined ? row.WR[c.kode].toFixed(4) : '-'}
                      </td>
                    ))}
                    <td className="py-2.5 px-4 text-right font-mono font-black text-sm text-bps-navy bg-emerald-50/40 tabular-nums">
                      {row.scoreV.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        onClick={() => setSelectedCandidate(row)}
                        aria-label={`Audit rumus ${row.nama}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue transition-colors focus-ring"
                        title="Audit Detail Rumus"
                      >
                        <Eye className="w-3.5 h-3.5 text-bps-blue" aria-hidden="true" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL AUDIT FORMULA EKSPLISIT KANDIDAT                   */}
      {/* ======================================================== */}
      {selectedCandidate && (
        <div className="bg-blue-50/90 border-2 border-bps-blue rounded-xl p-4 sm:p-5 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-start justify-between gap-3 border-b border-blue-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bps-navy text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
                SAW
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Audit Komputasi Ilmiah: {selectedCandidate.nama}
                </h3>
                <p className="text-[11px] text-slate-600">
                  Rincian alur konversi Data Mentah $\to$ Nilai Crisp $\to$ Normalisasi Matriks R $\to$ Perkalian Bobot W
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCandidate(null)}
              aria-label="Tutup panel audit"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-white flex items-center gap-1 focus-ring"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Tutup</span>
            </button>
          </div>

          {/* 4-Step Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Box 1: Raw vs Crisp */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="font-bold text-bps-navy flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-bps-blue" />
                <span>Tahap 1: Konversi Data Mentah ke Crisp 1–5</span>
              </div>
              <div className="space-y-1 text-slate-700">
                {kriteria.map(c => {
                  const rawVal = selectedCandidate.rawApplicant?.[c.kode] ?? selectedCandidate.rawApplicant?.[`c${c.kode.slice(1)}_mentah`] ?? '-';
                  const crispVal = selectedCandidate.crisp?.[c.kode] ?? selectedCandidate[c.kode];
                  return (
                    <div key={c.kode} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0 font-mono text-[11px]">
                      <span>{c.kode} ({c.nama}):</span>
                      <span className="font-bold text-slate-900">
                        {rawVal} {c.satuan} <ArrowRight className="w-3 h-3 inline text-slate-400 mx-1" />
                        <span className="text-bps-blue font-black">Crisp {crispVal}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Box 2: Normalisasi R */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="font-bold text-bps-navy flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-bps-blue" />
                <span>Tahap 2: Normalisasi Matriks (R)</span>
              </div>
              <div className="space-y-1 text-slate-700 font-mono text-[11px]">
                {kriteria.map(c => {
                  const isCost = c.sifat?.toLowerCase() === 'cost';
                  const crispVal = selectedCandidate.crisp?.[c.kode] ?? selectedCandidate[c.kode];
                  const extVal = isCost ? extremes[c.kode]?.min : extremes[c.kode]?.max;
                  const rVal = matrixR.find(r => r.id === selectedCandidate.id)?.R[c.kode]?.toFixed(4);

                  return (
                    <div key={c.kode} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <span>r_{c.kode} ({isCost ? 'Min/x' : 'x/Max'}):</span>
                      <span className="font-bold text-slate-900">
                        {isCost ? `${extVal} / ${crispVal}` : `${crispVal} / ${extVal}`} = 
                        <span className="text-emerald-700 font-black ml-1">{rVal}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Box 3: Perkalian Bobot & Hasil Akhir V */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 font-mono text-xs text-bps-navy leading-relaxed shadow-2xs space-y-2.5 break-words">
            <div>
              <div className="text-slate-600 text-[11px] font-sans font-bold">
                Tahap 3 & 4: Penjabaran Perkalian Bobot (W_j × r_ij) & Penjumlahan Skor Akhir (V):
              </div>
              <div className="text-slate-800 text-xs break-words pt-1 font-mono">
                V = {kriteria.map((c, i) => (
                  <span key={c.kode} className="inline-block mr-1">
                    ({c.bobot.toFixed(4)} × {matrixR.find(r => r.id === selectedCandidate.id)?.R[c.kode]?.toFixed(4)})
                    {i < kriteria.length - 1 ? ' +' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px] font-sans font-medium">Hasil Kali per Kriteria:</div>
              <div className="font-bold text-bps-blue text-xs break-words font-mono">
                = {kriteria.map(c => selectedCandidate.WR[c.kode]?.toFixed(4)).join(' + ')}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-baseline gap-2">
              <span className="text-slate-700 text-xs font-sans font-black">Total Skor Preferensi (V_i):</span>
              <span className="text-lg font-black text-bps-navy font-mono">
                = {selectedCandidate.scoreV.toFixed(4)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic">
            * Seluruh tahapan komputasi ini 100% konsisten dengan formula akademik PRD Final v2.0 & Buku Ajar SPK Politeknik Negeri Subang.
          </p>
        </div>
      )}
    </div>
  );
}
