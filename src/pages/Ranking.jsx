import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Printer, 
  Sliders, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Ranking({ 
  sawResult, 
  pengaturan, 
  onUpdatePengaturan, 
  onNavigate,
  onShowAlert 
}) {
  const { ranking = [], summary = {} } = sawResult || {};
  const kuotaLolos = pengaturan?.kuotaLolos || 5;
  const kuotaCadangan = pengaturan?.kuotaCadangan || 2;

  // Ubah kuota secara interaktif
  const handleKuotaLolosChange = (val) => {
    const num = Math.max(1, parseInt(val) || 1);
    onUpdatePengaturan({ ...pengaturan, kuotaLolos: num });
  };

  const handleKuotaCadanganChange = (val) => {
    const num = Math.max(0, parseInt(val) || 0);
    onUpdatePengaturan({ ...pengaturan, kuotaCadangan: num });
  };

  // Export Hasil Ranking ke Excel
  const handleExportExcel = () => {
    if (ranking.length === 0) {
      onShowAlert('Tidak ada data ranking untuk diekspor!', 'warning');
      return;
    }

    const exportData = ranking.map((r) => ({
      Peringkat: r.ranking,
      'Nama Lengkap': r.nama,
      NIK: r.nik,
      Kecamatan: r.kecamatan,
      'Nilai Ujian (C1)': r.rawApplicant?.C1,
      'Pengalaman Survei (C2)': r.rawApplicant?.C2,
      'Skor CAPI (C3)': r.rawApplicant?.C3,
      'Pendidikan (C4)': r.rawApplicant?.pendidikan,
      'Jarak Wilayah KM (C5)': r.rawApplicant?.C5,
      'Nilai Preferensi (V)': r.scoreV,
      'Status Rekomendasi': r.status,
      'Tie-Breaker Aktif': r.isTie ? 'Ya' : 'Tidak'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Ranking SAW');

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Hasil_Ranking_Mitra_BPS_Subang_${dateStr}.xlsx`);
    onShowAlert('File Excel hasil ranking berhasil diunduh', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman & Aksi Cepat */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-bps-navy">
            <Award className="w-6 h-6 text-bps-blue" />
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Leaderboard Hasil Perangkingan & Rekomendasi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Urutan prioritas penerimaan calon mitra statistik BPS Subang berdasarkan nilai preferensi akhir SAW (V).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Ranking (.xlsx)
          </button>
          <button
            onClick={() => onNavigate('laporan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light shadow-md shadow-bps-navy/20 transition-all"
          >
            <Printer className="w-4 h-4 text-bps-blue" />
            Cetak SK Berita Acara
          </button>
        </div>
      </div>

      {/* Kontrol Kuota Dinamis & Rekapitulasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kontrol Kuota Lolos */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Kuota Mitra Lolos
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 font-bold text-emerald-800">
              {summary.totalLolos} Orang
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="number"
              min="1"
              max={ranking.length || 100}
              value={kuotaLolos}
              onChange={(e) => handleKuotaLolosChange(e.target.value)}
              className="w-20 px-3 py-1.5 text-base font-bold text-emerald-800 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-500">
              Peringkat <strong>#1 s.d. #{kuotaLolos}</strong> otomatis berstatus <strong>Lolos</strong>.
            </p>
          </div>
        </div>

        {/* Kontrol Kuota Cadangan */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Kuota Cadangan
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 font-bold text-amber-800">
              {summary.totalCadangan} Orang
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="number"
              min="0"
              max={ranking.length || 100}
              value={kuotaCadangan}
              onChange={(e) => handleKuotaCadanganChange(e.target.value)}
              className="w-20 px-3 py-1.5 text-base font-bold text-amber-800 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-slate-500">
              Peringkat <strong>#{kuotaLolos + 1} s.d. #{kuotaLolos + kuotaCadangan}</strong> sebagai <strong>Cadangan</strong>.
            </p>
          </div>
        </div>

        {/* Jumlah Tidak Lolos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-slate-400" />
              Tidak Lolos
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-600">
              {summary.totalTidakLolos} Orang
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Peringkat <strong>#{kuotaLolos + kuotaCadangan + 1}</strong> ke bawah dinyatakan tidak memenuhi kuota rekrutmen.
          </p>
        </div>
      </div>

      {/* Tabel Leaderboard Perangkingan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-sm font-bold text-bps-navy">Daftar Peringkat Akhir Seleksi Mitra Lapangan</h2>
            <p className="text-xs text-slate-500">Urutan terhitung otomatis dari skor preferensi V tertinggi ke terendah</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total {ranking.length} Pelamar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Nama Pelamar & NIK</th>
                <th className="py-3.5 px-4">Kecamatan</th>
                <th className="py-3.5 px-4 text-center">Ujian (C1)</th>
                <th className="py-3.5 px-4 text-center">Survei (C2)</th>
                <th className="py-3.5 px-4 text-center">CAPI (C3)</th>
                <th className="py-3.5 px-4 text-center">Pendidikan (C4)</th>
                <th className="py-3.5 px-4 text-center">Jarak (C5)</th>
                <th className="py-3.5 px-4 text-center font-extrabold">Skor V</th>
                <th className="py-3.5 px-4 w-36 text-center">Status Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranking.map((item) => {
                const isLolos = item.status === 'Lolos';
                const isCadangan = item.status === 'Cadangan';

                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors ${
                      isLolos 
                        ? 'bg-emerald-50/30 hover:bg-emerald-50/60 border-l-4 border-l-emerald-500' 
                        : isCadangan 
                        ? 'bg-amber-50/30 hover:bg-amber-50/60 border-l-4 border-l-amber-500' 
                        : 'hover:bg-slate-50/70 border-l-4 border-l-slate-200'
                    }`}
                  >
                    {/* Ranking */}
                    <td className="py-3 px-4 text-center">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-extrabold text-xs ${
                        item.ranking === 1
                          ? 'bg-amber-400 text-slate-900 shadow-sm'
                          : item.ranking === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.ranking === 3
                          ? 'bg-amber-600/30 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        #{item.ranking}
                      </span>
                    </td>

                    {/* Nama & NIK */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.nama}</span>
                        {item.isTie && (
                          <span 
                            className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-100 text-purple-700 border border-purple-200"
                            title="Peringkat ditentukan oleh aturan Tie-Breaker Nilai Ujian C1 / C2"
                          >
                            Tie-Breaker
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">NIK: {item.nik}</p>
                    </td>

                    {/* Kecamatan */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {item.kecamatan}
                    </td>

                    {/* Parameter C1 - C5 */}
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {item.rawApplicant?.C1}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {item.rawApplicant?.C2}x
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {item.rawApplicant?.C3}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {item.rawApplicant?.pendidikan} ({item.rawApplicant?.C4})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-amber-700 font-semibold">
                      {item.rawApplicant?.C5} km
                    </td>

                    {/* Skor Akhir V */}
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-bps-navy text-base">
                      {item.scoreV.toFixed(4)}
                    </td>

                    {/* Status Rekomendasi */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
                        {isLolos && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isCadangan && <TrendingUp className="w-3.5 h-3.5" />}
                        {!isLolos && !isCadangan && <XCircle className="w-3.5 h-3.5" />}
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
