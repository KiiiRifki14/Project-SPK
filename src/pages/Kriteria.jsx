import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Edit2, 
  Save, 
  X,
  TrendingUp,
  TrendingDown,
  Percent
} from 'lucide-react';
import { validateBobot, autoNormalizeBobot } from '../services/sawCalculator.js';
import { INITIAL_KRITERIA } from '../data/initialKriteria.js';

export default function Kriteria({ kriteria = [], onUpdateKriteria, onShowAlert }) {
  const [editingId, setEditingId] = useState(null);
  const [editBobot, setEditBobot] = useState('');
  const validation = validateBobot(kriteria);

  const handleStartEdit = (c) => {
    setEditingId(c.kode);
    setEditBobot(c.bobot.toString());
  };

  const handleSaveEdit = (c) => {
    const val = parseFloat(editBobot);
    if (isNaN(val) || val <= 0 || val > 1) {
      onShowAlert('Bobot harus berupa angka desimal positif antara 0.01 hingga 1.00', 'error');
      return;
    }

    const updated = kriteria.map(item => 
      item.kode === c.kode ? { ...item, bobot: Number(val.toFixed(2)) } : item
    );
    onUpdateKriteria(updated);
    setEditingId(null);
    onShowAlert(`Bobot ${c.kode} berhasil diperbarui menjadi ${val}`, 'success');
  };

  const handleAutoNormalize = () => {
    const normalized = autoNormalizeBobot(kriteria);
    onUpdateKriteria(normalized);
    onShowAlert('Bobot kriteria berhasil dinormalisasi otomatis menjadi total 1.00 (100%)', 'success');
  };

  const handleResetBobot = () => {
    onUpdateKriteria(INITIAL_KRITERIA);
    onShowAlert('Bobot kriteria dikembalikan ke konfigurasi standar rekrutmen BPS Subang', 'info');
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
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Top Header & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-bps-blue" />
            Manajemen Kriteria & Bobot Penilaian
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan bobot preferensi (W) dan sifat kriteria (Benefit / Cost) seleksi mitra statistik BPS Subang.
          </p>
        </div>

        <button
          onClick={handleResetBobot}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200/90 shadow-2xs self-start sm:self-auto focus-ring"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Reset Bobot BPS</span>
        </button>
      </div>

      {/* Visual Weight Distribution Segment Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-bps-blue" />
            Distribusi Proporsi Bobot Preferensi (Total: {(validation.total * 100).toFixed(0)}%)
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            validation.isValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {validation.isValid ? 'Total 100% Sempurna' : `Selisih ${(validation.diff * 100).toFixed(1)}%`}
          </span>
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
                title={`${c.kode}: ${(c.bobot * 100).toFixed(0)}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {kriteria.map(c => (
            <div key={c.kode} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${criteriaColors[c.kode] || 'bg-slate-400'}`} />
              <span className="font-bold text-slate-800">{c.kode}</span>
              <span className="text-slate-500 font-mono text-[11px] font-semibold">({(c.bobot * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indikator Validasi Total Bobot Warning if Invalid */}
      {!validation.isValid && (
        <div className="p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl flex-shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold">
                Total Bobot Tidak Valid: {validation.total.toFixed(2)} (Wajib 1.00 / 100%)
              </h2>
              <p className="text-[11px] sm:text-xs opacity-80 mt-0.5">
                Terdapat selisih {(validation.diff * 100).toFixed(1)}%. Mohon sesuaikan bobot atau gunakan tombol normalisasi otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={handleAutoNormalize}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-bps-navy text-white hover:bg-bps-navy-light shadow-xs transition-all w-full sm:w-auto focus-ring"
          >
            <Sparkles className="w-4 h-4 text-bps-blue" />
            <span>Normalisasi Otomatis Bobot</span>
          </button>
        </div>
      )}

      {/* Tabel & Kartu Kriteria */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Daftar Kriteria Penilaian Terstandardisasi</h2>
            <p className="text-xs text-slate-500">5 kriteria seleksi mitra survei lapangan BPS Kabupaten Subang</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-bps-navy border border-blue-200 uppercase tracking-wide">
            Metode SAW
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

                {/* Bobot Display & Mini Progress */}
                <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Bobot Preferensi (W)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-slate-900 tabular-nums">{c.bobot.toFixed(2)}</span>
                      <span className="font-mono font-bold text-xs text-bps-blue tabular-nums">({Math.round(c.bobot * 100)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${criteriaColors[c.kode] || 'bg-slate-400'} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.round(c.bobot * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Keterangan */}
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  {c.keterangan}
                </p>

                {/* Action Section */}
                <div className="pt-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="1"
                        inputMode="decimal"
                        aria-label={`Ubah bobot kriteria ${c.kode}`}
                        value={editBobot}
                        onChange={(e) => setEditBobot(e.target.value)}
                        className="flex-1 h-11 px-3 text-sm border-2 border-bps-blue rounded-xl text-center font-bold focus-ring font-mono tabular-nums bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(c)}
                        aria-label={`Simpan bobot ${c.kode}`}
                        className="h-11 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-2xs active:scale-98 focus-ring"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" />
                        <span>Simpan</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        aria-label={`Batal ubah bobot ${c.kode}`}
                        className="h-11 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors active:scale-98 focus-ring"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        <span>Batal</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(c)}
                      aria-label={`Ubah bobot kriteria ${c.kode}`}
                      className="w-full min-h-[44px] px-4 rounded-xl text-xs font-bold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue border border-slate-200/90 transition-colors flex items-center justify-center gap-2 active:scale-98 focus-ring"
                    >
                      <Edit2 className="w-4 h-4 text-bps-blue" aria-hidden="true" />
                      <span>Ubah Bobot Kriteria</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. DUAL-VIEW: Desktop Full Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-4 w-16 text-center">Kode</th>
                <th scope="col" className="py-2.5 px-4">Nama Kriteria</th>
                <th scope="col" className="py-2.5 px-4 w-36 text-center">Sifat Atribut</th>
                <th scope="col" className="py-2.5 px-4 w-36 text-center">Bobot Preferensi (W)</th>
                <th scope="col" className="py-2.5 px-4">Keterangan Skala Penilaian</th>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <TrendingDown className="w-3 h-3 text-amber-600" aria-hidden="true" />
                          Cost (Biaya)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-bps-navy border border-blue-200">
                          <TrendingUp className="w-3 h-3 text-bps-blue" aria-hidden="true" />
                          Benefit (Manfaat)
                        </span>
                      )}
                    </td>

                    {/* Bobot */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1"
                            inputMode="decimal"
                            aria-label={`Ubah bobot kriteria ${c.kode}`}
                            value={editBobot}
                            onChange={(e) => setEditBobot(e.target.value)}
                            className="w-18 px-2 py-1 text-xs border border-bps-blue rounded-lg text-center font-bold focus-ring font-mono tabular-nums"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-black text-sm text-slate-900 font-mono tabular-nums">{c.bobot.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono tabular-nums">({Math.round(c.bobot * 100)}%)</span>
                        </div>
                      )}
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
                            aria-label={`Simpan bobot ${c.kode}`}
                            className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs focus-ring"
                            title="Simpan"
                          >
                            <Save className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            aria-label={`Batal ubah bobot ${c.kode}`}
                            className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors focus-ring"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(c)}
                          aria-label={`Ubah bobot kriteria ${c.kode}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-bps-navy bg-slate-100 hover:bg-blue-50 hover:text-bps-blue transition-colors focus-ring"
                          title="Ubah Bobot"
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

      {/* Catatan Akademik Buku Ajar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-bps-navy font-bold text-xs">
          <HelpCircle className="w-4 h-4 text-bps-blue" />
          <span>Pedoman Ilmiah Sifat Kriteria Benefit vs Cost (Bab 5 Buku Ajar SPK Polsub)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-bold text-bps-navy flex items-center gap-1 text-[11.5px]">
              <TrendingUp className="w-3.5 h-3.5 text-bps-blue" />
              Kriteria Benefit (C1, C2, C3, C4):
            </p>
            <p className="text-[11px] text-slate-600">
              Semakin tinggi nilai pelamar, semakin diprioritaskan. Rumus normalisasi: <code className="bg-white border px-1 py-0.5 rounded text-bps-navy font-mono font-bold text-[10px]">r_ij = x_ij / max(x_j)</code>.
            </p>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/80 space-y-1">
            <p className="font-bold text-amber-800 flex items-center gap-1 text-[11.5px]">
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              Kriteria Cost (C5 Jarak Domisili):
            </p>
            <p className="text-[11px] text-slate-600">
              Semakin dekat jarak pelamar ke target survei (semakin kecil km), semakin hemat mobilitas. Rumus normalisasi: <code className="bg-white border px-1 py-0.5 rounded text-amber-800 font-mono font-bold text-[10px]">r_ij = min(x_j) / x_ij</code> (batas min 0.1 km).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
