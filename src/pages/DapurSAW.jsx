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
  Info,
  BookOpen,
  Layers
} from 'lucide-react';

export default function DapurSAW({ sawResult, kriteria = [] }) {
  const [activeMatrixTab, setActiveMatrixTab] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { matrixX = [], extremes = {}, matrixR = [], matrixWR = [] } = sawResult || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-bps-navy">
            <Calculator className="w-5 h-5 text-bps-blue" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Dapur Hitung SAW (Pembuktian Akademik)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transparansi penuh 3 matriks komputasi matematis metode Simple Additive Weighting (SAW) sesuai Bab 5 Buku Ajar SPK Polsub.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveMatrixTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMatrixTab === 'all' 
                ? 'bg-white text-bps-navy shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua Matriks (3 Tabel)
          </button>
          <button
            onClick={() => setActiveMatrixTab('x')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMatrixTab === 'x' 
                ? 'bg-white text-bps-navy shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Matriks X
          </button>
          <button
            onClick={() => setActiveMatrixTab('r')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMatrixTab === 'r' 
                ? 'bg-white text-bps-navy shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Matriks R
          </button>
          <button
            onClick={() => setActiveMatrixTab('wr')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMatrixTab === 'wr' 
                ? 'bg-white text-bps-navy shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Matriks W×R
          </button>
        </div>
      </div>

      {/* Banner Formula Ilmiah */}
      <div className="bg-gradient-to-r from-bps-navy-dark via-bps-navy to-bps-blue text-white p-6 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-200">
          <BookOpen className="w-4 h-4 text-bps-blue" />
          <span>Formula Komputasi SAW (Simple Additive Weighting)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Rumus Benefit */}
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 space-y-1.5">
            <p className="font-bold text-amber-300">1. Normalisasi Benefit (C1, C2, C3, C4):</p>
            <p className="font-mono text-sm bg-black/25 p-2 rounded-xl text-center font-bold">
              r_ij = x_ij / max(x_j)
            </p>
            <p className="text-[11px] text-blue-100/90">Nilai pelamar dibagi nilai tertinggi pada kolom tersebut.</p>
          </div>

          {/* Rumus Cost */}
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 space-y-1.5">
            <p className="font-bold text-amber-300">2. Normalisasi Cost (C5 Jarak Domisili):</p>
            <p className="font-mono text-sm bg-black/25 p-2 rounded-xl text-center font-bold">
              r_ij = min(x_j) / x_ij
            </p>
            <p className="text-[11px] text-blue-100/90">Nilai minimum kolom dibagi nilai jarak pelamar.</p>
          </div>

          {/* Rumus Skor Preferensi Vi */}
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 space-y-1.5">
            <p className="font-bold text-amber-300">3. Nilai Preferensi Akhir (Vi):</p>
            <p className="font-mono text-sm bg-black/25 p-2 rounded-xl text-center font-bold">
              V_i = Σ (w_j × r_ij)
            </p>
            <p className="text-[11px] text-blue-100/90">Penjumlahan seluruh elemen terbobot (w_j × r_ij).</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABEL 1: MATRIKS KEPUTUSAN AWAL (X) */}
      {/* ======================================================== */}
      {(activeMatrixTab === 'all' || activeMatrixTab === 'x') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-bps-navy flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-navy text-white flex items-center justify-center text-xs font-bold">1</span>
                Tabel 1: Matriks Keputusan Awal (X)
              </h2>
              <p className="text-xs text-slate-500">Nilai mentah seluruh pelamar beserta baris nilai ekstrim (Max & Min)</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {matrixX.length} Pelamar × {kriteria.length} Kriteria
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Pelamar</th>
                  <th className="py-3 px-4">Kecamatan</th>
                  {kriteria.map(c => (
                    <th key={c.kode} className="py-3 px-4 text-center">
                      <div className="font-bold">{c.kode}</div>
                      <div className="text-[10px] font-normal lowercase text-slate-400">({c.sifat})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixX.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                    <td className="py-3 px-4 text-slate-600">{row.kecamatan}</td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                        {row[c.kode]}
                        {c.kode === 'C5' && <span className="text-[10px] text-slate-400 ml-0.5">km</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {/* Baris Nilai Ekstrim: Max & Min */}
              <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-xs">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-bps-navy uppercase tracking-wider">
                    Nilai Maksimum (Max):
                  </td>
                  {kriteria.map(c => (
                    <td key={c.kode} className={`py-3 px-4 text-center font-mono ${
                      c.sifat === 'benefit' ? 'text-bps-blue bg-blue-50/60 font-extrabold' : 'text-slate-400'
                    }`}>
                      {extremes[c.kode]?.max ?? '-'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-amber-800 uppercase tracking-wider">
                    Nilai Minimum (Min):
                  </td>
                  {kriteria.map(c => (
                    <td key={c.kode} className={`py-3 px-4 text-center font-mono ${
                      c.sifat === 'cost' ? 'text-amber-700 bg-amber-50/60 font-extrabold' : 'text-slate-400'
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-bps-navy flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-bps-blue text-white flex items-center justify-center text-xs font-bold">2</span>
                Tabel 2: Matriks Ternormalisasi (R)
              </h2>
              <p className="text-xs text-slate-500">Nilai skala [0, 1] hasil normalisasi Benefit & Cost (Presisi 4 desimal)</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-bps-blue-light text-bps-blue border border-bps-blue/20">
              Skala [0, 1]
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th key={c.kode} className="py-3 px-4 text-center font-bold">
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
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                    {kriteria.map(c => {
                      const val = row.R[c.kode];
                      return (
                        <td 
                          key={c.kode} 
                          className={`py-3 px-4 text-center font-mono font-semibold ${
                            val === 1 ? 'text-emerald-700 bg-emerald-50/40 font-bold' : 'text-slate-700'
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-bps-navy flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                Tabel 3: Matriks Terbobot (W × R) & Nilai Preferensi Akhir (V)
              </h2>
              <p className="text-xs text-slate-500">Perkalian r_ij dengan bobot w_j serta total penjumlahan skor akhir V</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Skor Akhir V_i
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Pelamar</th>
                  {kriteria.map(c => (
                    <th key={c.kode} className="py-3 px-4 text-center">
                      <div className="font-bold">{c.kode} × {c.bobot}</div>
                      <div className="text-[10px] font-normal text-slate-400">({c.bobot * 100}%)</div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center bg-blue-50/80 text-bps-navy font-extrabold">
                    Nilai Preferensi (V)
                  </th>
                  <th className="py-3 px-4 text-center w-28">Inspeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixWR.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{row.nama}</td>
                    {kriteria.map(c => (
                      <td key={c.kode} className="py-3 px-4 text-center font-mono text-slate-700">
                        {row.WR[c.kode] !== undefined ? row.WR[c.kode].toFixed(4) : '-'}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-bps-navy bg-blue-50/40 text-base">
                      {row.scoreV.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedCandidate(row)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-bps-blue bg-bps-blue-light hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
        <div className="p-6 rounded-3xl bg-gradient-to-br from-bps-blue-light/60 via-white to-blue-50 border-2 border-bps-blue/30 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-bps-blue/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-bps-blue text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-bps-navy text-sm sm:text-base">
                  Audit Aritmetika SAW: {selectedCandidate.nama} ({selectedCandidate.kecamatan})
                </h3>
                <p className="text-xs text-slate-500">Bukti penjabaran rumus perkalian matriks secara eksplisit</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCandidate(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white"
            >
              Tutup Audit
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 font-mono text-xs sm:text-sm text-bps-navy overflow-x-auto leading-relaxed shadow-sm">
              <div className="text-slate-500 text-xs mb-1 font-sans">1. Penjabaran Nilai Bobot × Normalisasi:</div>
              <div className="text-slate-800">
                V = {kriteria.map((c, i) => (
                  <span key={c.kode}>
                    ({c.bobot} × {matrixR.find(r => r.id === selectedCandidate.id)?.R[c.kode]?.toFixed(4)})
                    {i < kriteria.length - 1 ? ' + ' : ''}
                  </span>
                ))}
              </div>

              <div className="text-slate-500 text-xs mt-3 mb-1 font-sans">2. Hasil Perkalian:</div>
              <div className="font-bold text-bps-blue">
                = {kriteria.map(c => selectedCandidate.WR[c.kode]?.toFixed(4)).join(' + ')}
              </div>

              <div className="text-slate-500 text-xs mt-3 mb-1 font-sans">3. Skor Preferensi Akhir:</div>
              <div className="text-xl font-extrabold text-bps-navy">
                = {selectedCandidate.scoreV.toFixed(4)}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Hasil komputasi ini 100% konsisten dengan perhitungan manual kalkulator dan spreadsheet Excel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
