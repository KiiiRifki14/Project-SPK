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
  TrendingDown
} from 'lucide-react';
import { validateBobot, autoNormalizeBobot } from '../services/sawCalculator.js';
import { INITIAL_KRITERIA } from '../data/initialKriteria.js';

export default function Kriteria({ kriteria = [], onUpdateKriteria, onShowAlert }) {
  const [editingId, setEditingId] = useState(null);
  const [editBobot, setEditBobot] = useState('');
  const validation = validateBobot(kriteria);

  // Mulai edit bobot kriteria tertentu
  const handleStartEdit = (c) => {
    setEditingId(c.kode);
    setEditBobot(c.bobot.toString());
  };

  // Simpan hasil edit bobot
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

  // Normalisasi otomatis bobot jika total != 1.0
  const handleAutoNormalize = () => {
    const normalized = autoNormalizeBobot(kriteria);
    onUpdateKriteria(normalized);
    onShowAlert('Bobot kriteria berhasil dinormalisasi otomatis menjadi total 1.00 (100%)', 'success');
  };

  // Reset bobot ke standar BPS
  const handleResetBobot = () => {
    onUpdateKriteria(INITIAL_KRITERIA);
    onShowAlert('Bobot kriteria dikembalikan ke konfigurasi standar rekrutmen BPS Subang', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-bps-navy">
            <Sliders className="w-6 h-6 text-bps-blue" />
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Manajemen Kriteria & Pembobotan SAW
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Penetapan kriteria seleksi mitra statistik BPS Subang beserta sifat (Benefit / Cost) dan bobot preferensi (W).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetBobot}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Bobot Awal
          </button>
        </div>
      </div>

      {/* Indikator Validasi Total Bobot */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm transition-all ${
        validation.isValid 
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-rose-50/80 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-center gap-3">
          {validation.isValid ? (
            <div className="p-2 bg-emerald-500 text-white rounded-xl flex-shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 bg-rose-500 text-white rounded-xl flex-shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold">
              {validation.isValid 
                ? `Total Bobot Kriteria Valid: ${validation.total} (100%)`
                : `Total Bobot Tidak Valid: ${validation.total} (Wajib 1.00 atau 100%)`}
            </h2>
            <p className="text-xs opacity-80">
              {validation.isValid
                ? 'Seluruh perhitungan matriks SAW siap dihitung dengan normalisasi matematis yang akurat.'
                : `Terdapat selisih ${(validation.diff * 100).toFixed(1)}%. Mohon sesuaikan bobot atau gunakan tombol normalisasi otomatis.`}
            </p>
          </div>
        </div>

        {!validation.isValid && (
          <button
            onClick={handleAutoNormalize}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-bps-navy text-white hover:bg-bps-navy-light shadow-md transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-bps-blue" />
            Normalisasi Otomatis Bobot
          </button>
        )}
      </div>

      {/* Tabel Kriteria & Bobot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-sm font-bold text-bps-navy">Daftar Kriteria Seleksi Mitra Statistik</h2>
            <p className="text-xs text-slate-500">Terdapat 5 kriteria terstandardisasi juknis BPS Subang</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-bps-blue/10 text-bps-blue border border-bps-blue/20">
            Metode SAW
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-16">Kode</th>
                <th className="py-3.5 px-4">Nama Kriteria</th>
                <th className="py-3.5 px-4 w-32">Sifat / Atribut</th>
                <th className="py-3.5 px-4 w-40">Bobot (W)</th>
                <th className="py-3.5 px-4">Keterangan Skala Penilaian</th>
                <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kriteria.map((c) => {
                const isCost = c.sifat?.toLowerCase() === 'cost';
                const isEditing = editingId === c.kode;

                return (
                  <tr key={c.kode} className="hover:bg-slate-50/60 transition-colors">
                    {/* Kode */}
                    <td className="py-4 px-4 font-extrabold text-bps-navy">
                      <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs">
                        {c.kode}
                      </span>
                    </td>

                    {/* Nama Kriteria */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{c.nama}</p>
                      <p className="text-xs text-slate-400">Satuan: {c.satuan}</p>
                    </td>

                    {/* Sifat: Benefit / Cost */}
                    <td className="py-4 px-4">
                      {isCost ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Cost (Biaya)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-bps-blue/10 text-bps-navy border border-bps-blue/20">
                          <TrendingUp className="w-3.5 h-3.5 text-bps-blue" />
                          Benefit (Manfaat)
                        </span>
                      )}
                    </td>

                    {/* Bobot */}
                    <td className="py-4 px-4 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max="1"
                            value={editBobot}
                            onChange={(e) => setEditBobot(e.target.value)}
                            className="w-20 px-2 py-1 text-xs border border-bps-blue rounded focus:outline-none focus:ring-2 focus:ring-bps-blue"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-base text-slate-800">{c.bobot.toFixed(2)}</span>
                          <span className="text-xs text-slate-500 ml-1.5">({Math.round(c.bobot * 100)}%)</span>
                        </div>
                      )}
                    </td>

                    {/* Keterangan */}
                    <td className="py-4 px-4 text-xs text-slate-600 leading-relaxed">
                      {c.keterangan}
                    </td>

                    {/* Aksi Edit Bobot */}
                    <td className="py-4 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(c)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            title="Simpan Bobot"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-bps-navy hover:bg-bps-blue/10 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-bps-blue" />
                          Ubah
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

      {/* Kartu Panduan Akademik untuk Dosen */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-bps-navy font-bold text-sm">
          <HelpCircle className="w-4 h-4 text-bps-blue" />
          <span>Penjelasan Ilmiah Sifat Kriteria Benefit vs Cost (Bab 5 Buku Ajar SPK)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
            <p className="font-bold text-bps-navy flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-bps-blue" />
              Kriteria Benefit (C1, C2, C3, C4):
            </p>
            <p>
              Semakin besar nilai yang dimiliki oleh pelamar, semakin menguntungkan dan diprioritaskan. 
              Rumus normalisasi: <code className="bg-slate-100 px-1 py-0.5 rounded text-bps-navy font-mono font-semibold">r_ij = x_ij / max(x_j)</code>.
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
            <p className="font-bold text-amber-800 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              Kriteria Cost (C5 Jarak Domisili):
            </p>
            <p>
              Semakin kecil jarak tempat tinggal ke wilayah tugas (semakin dekat), semakin efisien biaya operasional dan mobilitas mitra sensus.
              Rumus normalisasi: <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono font-semibold">r_ij = min(x_j) / x_ij</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
