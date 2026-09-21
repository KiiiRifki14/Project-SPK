import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Edit2, 
  Save, 
  X,
  TrendingUp,
  TrendingDown,
  Percent,
  Layers,
  Award
} from 'lucide-react';
import { 
  validateBobot, 
  calculateWeightsFromPriority, 
  autoNormalizeBobot 
} from '../services/sawCalculator.js';
import { INITIAL_KRITERIA, SUBKRITERIA_RULES } from '../data/initialKriteria.js';

export default function Kriteria({ kriteria = [], onUpdateKriteria, onShowAlert }) {
  const [editingId, setEditingId] = useState(null);
  const [editKepentingan, setEditKepentingan] = useState(5);
  const [activeSubkriteriaTab, setActiveSubkriteriaTab] = useState('C1');

  const validation = validateBobot(kriteria);
  const totalKepentingan = kriteria.reduce((sum, c) => sum + Number(c.tingkatKepentingan || 1), 0);

  const TINGKAT_KEPENTINGAN_OPTIONS = [
    { value: 5, label: '5 - Sangat Tinggi / Sangat Penting', desc: 'Prioritas tertinggi seleksi mitra' },
    { value: 4, label: '4 - Tinggi / Penting', desc: 'Sangat dibutuhkan dalam survei lapangan' },
    { value: 3, label: '3 - Cukup / Sedang', desc: 'Kualifikasi penunjang standar' },
    { value: 2, label: '2 - Rendah', desc: 'Pertimbangan pelengkap efisiensi' },
    { value: 1, label: '1 - Sangat Rendah', desc: 'Bobot minimal penentu' }
  ];

  const handleStartEdit = (c) => {
    setEditingId(c.kode);
    setEditKepentingan(Number(c.tingkatKepentingan || 3));
  };

  const handleSaveEdit = (c) => {
    const kVal = parseInt(editKepentingan, 10);
    if (isNaN(kVal) || kVal < 1 || kVal > 5) {
      onShowAlert('Tingkat kepentingan harus berupa angka skala 1 sampai 5!', 'error');
      return;
    }

    const updatedRaw = kriteria.map(item => 
      item.kode === c.kode ? { ...item, tingkatKepentingan: kVal } : item
    );
    // Hitung ulang bobot proporsional w_j = k_j / sum(k)
    const normalized = calculateWeightsFromPriority(updatedRaw);
    onUpdateKriteria(normalized);
    setEditingId(null);
    onShowAlert(`Tingkat kepentingan ${c.kode} berhasil diubah ke skala ${kVal}. Seluruh bobot otomatis disesuaikan proporsional!`, 'success');
  };

  const handleResetBobot = () => {
    onUpdateKriteria(INITIAL_KRITERIA);
    onShowAlert('Kriteria dikembalikan ke konfigurasi standar akademik PRD Final BPS Subang (Total Kepentingan: 18)', 'info');
  };

  // Color map for visual weight distribution
  const criteriaColors = {
    C1: 'bg-blue-500',
    C2: 'bg-emerald-500',
    C3: 'bg-cyan-500',
    C4: 'bg-purple-500',
    C5: 'bg-amber-500'
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Header & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-bps-blue" />
            Manajemen Kriteria & Bobot Penilaian
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi tingkat kepentingan (skala 1–5), bobot preferensi ($W_j$), serta konversi subkriteria metode SAW.
          </p>
        </div>

        <button
          onClick={handleResetBobot}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200/90 shadow-2xs self-start sm:self-auto focus-ring"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Reset Standar PRD (Σ=18)</span>
        </button>
      </div>

      {/* Visual Weight Distribution Segment Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-bps-blue" />
            Distribusi Proporsi Bobot Preferensi (w_j = k_j / &Sigma; k)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-bps-navy bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Total Kepentingan: {totalKepentingan}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              validation.isValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {validation.isValid ? 'Total 100% Sempurna' : `Selisih ${(validation.diff * 100).toFixed(1)}%`}
            </span>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5">
          {kriteria.map(c => {
            const pct = Math.max(2, (c.bobot / (validation.total || 1)) * 100);
            return (
              <div 
                key={c.kode}
                className={`${criteriaColors[c.kode] || 'bg-slate-400'} h-full rounded-xs transition-all duration-300`}
                style={{ width: `${pct}%` }}
                title={`${c.kode}: ${(c.bobot * 100).toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {kriteria.map(c => (
            <div key={c.kode} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${criteriaColors[c.kode] || 'bg-slate-400'}`} />
              <span className="font-bold text-slate-800">{c.kode}</span>
              <span className="text-slate-500 font-mono text-[11px] font-semibold">
                ({c.tingkatKepentingan || 1}/{totalKepentingan} = {(c.bobot * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabel & Kartu Kriteria */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Daftar Kriteria & Bobot Matematis PRD Final</h2>
            <p className="text-xs text-slate-500">Nilai bobot dihitung proporsional dari tingkat kepentingan 1–5</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-bps-navy border border-blue-200 uppercase tracking-wide">
            Metode SAW (PRD 2.1)
          </span>
        </div>

        {/* 1. DUAL-VIEW: Mobile Native Kriteria Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-slate-100">
          {kriteria.map((c) => {
            const isCost = c.sifat?.toLowerCase() === 'cost';
            const isEditing = editingId === c.kode;

            return (
              <div key={c.kode} className="p-4 space-y-3 hover:bg-slate-50/40 transition-colors">
                {/* Header: Kode, Nama, Sifat */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-bps-navy text-white font-mono font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {c.kode}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.nama}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Satuan: {c.satuan}</p>
                    </div>
                  </div>

                  {/* Sifat Badge */}
                  {isCost ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex-shrink-0">
                      <TrendingDown className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                      <span>Cost</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-bps-navy border border-blue-200 flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-bps-blue" aria-hidden="true" />
                      <span>Benefit</span>
                    </span>
                  )}
                </div>

                {/* Tingkat Kepentingan & Bobot Display */}
                <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Tingkat Kepentingan:</span>
                    <span className="font-black text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-bps-navy">
                      Skala {c.tingkatKepentingan || 3} / 5
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-700">Bobot Desimal (w_j):</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-slate-500 text-[11px]">({c.tingkatKepentingan}/{totalKepentingan}) =</span>
                      <span className="font-black text-sm text-bps-navy tabular-nums">{c.bobot.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Keterangan */}
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  {c.keterangan}
                </p>

                {/* Edit Tingkat Kepentingan Action */}
                <div className="pt-1">
                  {isEditing ? (
                    <div className="space-y-2.5 bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                      <label className="block text-[11px] font-bold text-bps-navy">
                        Pilih Tingkat Kepentingan (1–5):
                      </label>
                      <select
                        value={editKepentingan}
                        onChange={(e) => setEditKepentingan(Number(e.target.value))}
                        className="w-full h-11 px-3 text-xs bg-white border border-blue-300 rounded-xl font-bold text-slate-900 focus-ring"
                      >
                        {TINGKAT_KEPENTINGAN_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleSaveEdit(c)}
                          className="flex-1 h-11 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-2xs active:scale-98 focus-ring"
                        >
                          <Save className="w-4 h-4" aria-hidden="true" />
                          <span>Simpan & Normalisasi</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="h-11 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-300 transition-colors active:scale-98 focus-ring"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                          <span>Batal</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(c)}
                      aria-label={`Ubah tingkat kepentingan kriteria ${c.kode}`}
                      className="w-full min-h-[44px] px-4 rounded-xl text-xs font-bold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue border border-slate-200/90 transition-colors flex items-center justify-center gap-2 active:scale-98 focus-ring"
                    >
                      <Edit2 className="w-4 h-4 text-bps-blue" aria-hidden="true" />
                      <span>Ubah Tingkat Kepentingan (1–5)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. DUAL-VIEW: Desktop Full Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[760px]">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-4 w-16 text-center">Kode</th>
                <th scope="col" className="py-2.5 px-4">Nama Kriteria</th>
                <th scope="col" className="py-2.5 px-4 w-32 text-center">Sifat</th>
                <th scope="col" className="py-2.5 px-4 w-40 text-center">Tingkat Kepentingan</th>
                <th scope="col" className="py-2.5 px-4 w-32 text-center">Formula ($w_j$)</th>
                <th scope="col" className="py-2.5 px-4 w-32 text-center">Bobot Desimal</th>
                <th scope="col" className="py-2.5 px-4">Keterangan</th>
                <th scope="col" className="py-2.5 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kriteria.map((c) => {
                const isCost = c.sifat?.toLowerCase() === 'cost';
                const isEditing = editingId === c.kode;

                return (
                  <tr key={c.kode} className="hover:bg-slate-50/70 transition-colors">
                    {/* Kode */}
                    <td className="py-3 px-4 text-center font-extrabold text-bps-navy font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-mono">
                        {c.kode}
                      </span>
                    </td>

                    {/* Nama Kriteria */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{c.nama}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Satuan: {c.satuan}</p>
                    </td>

                    {/* Sifat: Benefit / Cost */}
                    <td className="py-3 px-4 text-center">
                      {isCost ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <TrendingDown className="w-3 h-3 text-amber-600" aria-hidden="true" />
                          Cost
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-bps-navy border border-blue-200">
                          <TrendingUp className="w-3 h-3 text-bps-blue" aria-hidden="true" />
                          Benefit
                        </span>
                      )}
                    </td>

                    {/* Tingkat Kepentingan (1-5) */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <select
                          value={editKepentingan}
                          onChange={(e) => setEditKepentingan(Number(e.target.value))}
                          className="h-8 px-2 text-xs border border-bps-blue rounded-lg font-bold bg-white text-slate-900 focus-ring"
                        >
                          {[5, 4, 3, 2, 1].map(k => (
                            <option key={k} value={k}>Skala {k}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-bps-navy font-black text-xs border border-slate-200">
                          {c.tingkatKepentingan || 3}
                        </span>
                      )}
                    </td>

                    {/* Perhitungan Formula */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-600 tabular-nums">
                      {c.tingkatKepentingan || 1} / {totalKepentingan}
                    </td>

                    {/* Bobot Desimal */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      <span className="font-black text-sm text-bps-navy font-mono">
                        {c.bobot.toFixed(4)}
                      </span>
                    </td>

                    {/* Keterangan */}
                    <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed">
                      {c.keterangan}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(c)}
                            aria-label={`Simpan kepentingan ${c.kode}`}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs focus-ring"
                            title="Simpan"
                          >
                            <Save className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            aria-label={`Batal ubah ${c.kode}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors focus-ring"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(c)}
                          aria-label={`Ubah kriteria ${c.kode}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue transition-colors focus-ring"
                          title="Ubah Tingkat Kepentingan"
                        >
                          <Edit2 className="w-3 h-3" aria-hidden="true" />
                          <span>Ubah</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================== */}
      {/* TABEL PANDUAN KONVERSI SUBKRITERIA (PRD FINAL BAGIAN 2.2)  */}
      {/* ========================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-bps-blue" />
              <span>Tabel Referensi Konversi Subkriteria (Data Mentah ke Nilai Crisp 1–5)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Standar baku konversi data pendaftar sebelum diproses ke dalam Matriks Keputusan $X$ (PRD Bagian 2.2)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Wajib Crisp 1–5
          </span>
        </div>

        {/* Tab Subkriteria Selector */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 text-xs font-semibold">
          {Object.keys(SUBKRITERIA_RULES).map(kode => {
            const ruleObj = SUBKRITERIA_RULES[kode];
            const isActive = activeSubkriteriaTab === kode;
            return (
              <button
                key={kode}
                onClick={() => setActiveSubkriteriaTab(kode)}
                className={`py-2 px-1 text-center rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isActive 
                    ? 'bg-bps-navy text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className="font-mono font-black">{kode}</span>
                <span className="hidden sm:inline text-[11px] truncate">({ruleObj.sifat})</span>
              </button>
            );
          })}
        </div>

        {/* Subkriteria Content */}
        {SUBKRITERIA_RULES[activeSubkriteriaTab] && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {activeSubkriteriaTab}: {SUBKRITERIA_RULES[activeSubkriteriaTab].nama}
                </h3>
                <p className="text-xs text-slate-500">
                  {SUBKRITERIA_RULES[activeSubkriteriaTab].deskripsi}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                SUBKRITERIA_RULES[activeSubkriteriaTab].sifat === 'cost' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-blue-100 text-bps-navy'
              }`}>
                Sifat: {SUBKRITERIA_RULES[activeSubkriteriaTab].sifat}
              </span>
            </div>

            {/* Conversion Rules Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/90">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="py-2.5 px-4 w-40">Rentang Data Mentah</th>
                    <th scope="col" className="py-2.5 px-4 w-36 text-center">Nilai Crisp (x_ij)</th>
                    <th scope="col" className="py-2.5 px-4">Kualifikasi / Arti Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SUBKRITERIA_RULES[activeSubkriteriaTab].rules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-bold text-slate-900 font-mono">
                        {rule.label}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-black text-xs ${
                          rule.crisp === 5 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          rule.crisp === 4 ? 'bg-blue-100 text-bps-navy border border-blue-200' :
                          rule.crisp === 3 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {rule.crisp}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {rule.keterangan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Catatan Akademik Buku Ajar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-bps-navy font-bold text-xs">
          <HelpCircle className="w-4 h-4 text-bps-blue" />
          <span>Pedoman Matematis SAW (PRD Final v2.0.0 & Bab 5 Buku Ajar SPK Polsub)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-bold text-bps-navy flex items-center gap-1 text-[11.5px]">
              <TrendingUp className="w-3.5 h-3.5 text-bps-blue" />
              Benefit (C1, C2, C3, C4):
            </p>
            <p className="text-[11px] text-slate-600">
              Makin tinggi nilai crisp (skala 1–5), makin baik. Normalisasi: <code className="bg-white border px-1 py-0.5 rounded text-bps-navy font-mono font-bold text-[10px]">r_ij = x_ij / max(x_j)</code>.
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-bold text-amber-800 flex items-center gap-1 text-[11.5px]">
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              Cost (C5 Jarak Domisili):
            </p>
            <p className="text-[11px] text-slate-600">
              Jarak terdekat dikonversi ke crisp 1. Nilai crisp 1 adalah yang terbaik (minVal). Normalisasi: <code className="bg-white border px-1 py-0.5 rounded text-amber-800 font-mono font-bold text-[10px]">r_ij = min(x_j) / x_ij</code> (misal crisp 1/1 = 1, crisp 5 = 1/5 = 0.2).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
