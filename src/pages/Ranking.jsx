import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Printer, 
  TrendingUp,
  Minus,
  Plus
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

  const handleKuotaLolosChange = (val) => {
    const num = Math.max(1, parseInt(val) || 1);
    onUpdatePengaturan({ ...pengaturan, kuotaLolos: num });
  };

  const handleKuotaCadanganChange = (val) => {
    const num = Math.max(0, parseInt(val) || 0);
    onUpdatePengaturan({ ...pengaturan, kuotaCadangan: num });
  };

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
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-bps-blue" />
            Leaderboard Hasil Perangkingan Mitra
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Urutan prioritas penerimaan mitra lapangan BPS Subang berdasarkan nilai preferensi SAW tertinggi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>
          <button
            onClick={() => onNavigate('laporan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-bps-navy text-white hover:bg-bps-navy-light shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-bps-blue" />
            Cetak SK Berita Acara
          </button>
        </div>
      </div>

      {/* Kontrol Kuota Dinamis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Kuota Lolos */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Kuota Mitra Lolos
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 font-bold text-emerald-800 border border-emerald-200">
              {summary.totalLolos} Orang
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex items-center border border-emerald-300 rounded-lg overflow-hidden bg-emerald-50/50">
              <button
                onClick={() => handleKuotaLolosChange(kuotaLolos - 1)}
                aria-label="Kurangi kuota lolos"
                className="p-1.5 text-emerald-700 hover:bg-emerald-100 transition-colors focus-ring"
                title="Kurangi Kuota"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <input
                type="number"
                min="1"
                max={ranking.length || 100}
                aria-label="Jumlah kuota lolos"
                inputMode="numeric"
                value={kuotaLolos}
                onChange={(e) => handleKuotaLolosChange(e.target.value)}
                className="w-12 py-1 text-xs font-black text-emerald-900 bg-transparent text-center focus:outline-none font-mono tabular-nums"
              />
              <button
                onClick={() => handleKuotaLolosChange(kuotaLolos + 1)}
                aria-label="Tambah kuota lolos"
                className="p-1.5 text-emerald-700 hover:bg-emerald-100 transition-colors focus-ring"
                title="Tambah Kuota"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Peringkat <strong>#1 s.d. #{kuotaLolos}</strong> berstatus <strong>Lolos</strong>.
            </p>
          </div>
        </div>

        {/* Kuota Cadangan */}
        <div className="bg-white p-3.5 rounded-xl border border-amber-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              Kuota Cadangan
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 font-bold text-amber-800 border border-amber-200 tabular-nums">
              {summary.totalCadangan} Orang
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-amber-50/50">
              <button
                onClick={() => handleKuotaCadanganChange(kuotaCadangan - 1)}
                aria-label="Kurangi kuota cadangan"
                className="p-1.5 text-amber-700 hover:bg-amber-100 transition-colors focus-ring"
                title="Kurangi Cadangan"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <input
                type="number"
                min="0"
                max={ranking.length || 100}
                aria-label="Jumlah kuota cadangan"
                inputMode="numeric"
                value={kuotaCadangan}
                onChange={(e) => handleKuotaCadanganChange(e.target.value)}
                className="w-12 py-1 text-xs font-black text-amber-900 bg-transparent text-center focus:outline-none font-mono tabular-nums"
              />
              <button
                onClick={() => handleKuotaCadanganChange(kuotaCadangan + 1)}
                aria-label="Tambah kuota cadangan"
                className="p-1.5 text-amber-700 hover:bg-amber-100 transition-colors focus-ring"
                title="Tambah Cadangan"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Peringkat <strong>#{kuotaLolos + 1} s.d. #{kuotaLolos + kuotaCadangan}</strong> sebagai <strong>Cadangan</strong>.
            </p>
          </div>
        </div>

        {/* Tidak Lolos */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Tidak Lolos
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
              {summary.totalTidakLolos} Orang
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Peringkat <strong>#{kuotaLolos + kuotaCadangan + 1}</strong> ke bawah belum memenuhi alokasi kuota rekrutmen.
          </p>
        </div>
      </div>

      {/* Tabel Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daftar Peringkat Akhir Seleksi Mitra Lapangan</h2>
            <p className="text-xs text-slate-500">Urutan otomatis dari skor preferensi V tertinggi ke terendah</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Total {ranking.length} Pelamar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="py-2.5 px-3.5 w-16 text-center">Rank</th>
                <th scope="col" className="py-2.5 px-3.5">Nama Pelamar & NIK</th>
                <th scope="col" className="py-2.5 px-3.5">Kecamatan</th>
                <th scope="col" className="py-2.5 px-3 text-right">Ujian (C1)</th>
                <th scope="col" className="py-2.5 px-3 text-right">Survei (C2)</th>
                <th scope="col" className="py-2.5 px-3 text-right">CAPI (C3)</th>
                <th scope="col" className="py-2.5 px-3 text-center">Pendidikan (C4)</th>
                <th scope="col" className="py-2.5 px-3 text-right">Jarak (C5)</th>
                <th scope="col" className="py-2.5 px-3.5 text-right font-extrabold bg-blue-50/70 text-bps-navy">Skor Akhir (V)</th>
                <th scope="col" className="py-2.5 px-3.5 w-32 text-center">Status</th>
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
                        ? 'bg-emerald-50/30 hover:bg-emerald-50/50 border-l-3 border-l-emerald-500' 
                        : isCadangan 
                        ? 'bg-amber-50/30 hover:bg-amber-50/50 border-l-3 border-l-amber-500' 
                        : 'hover:bg-slate-50/70 border-l-3 border-l-slate-200'
                    }`}
                  >
                    {/* Rank Medals */}
                    <td className="py-2.5 px-3.5 text-center font-mono tabular-nums">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-extrabold text-xs tabular-nums ${
                        item.ranking === 1 ? 'bg-amber-400 text-slate-950 shadow-2xs' :
                        item.ranking === 2 ? 'bg-slate-300 text-slate-800' :
                        item.ranking === 3 ? 'bg-amber-600/30 text-amber-900' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        #{item.ranking}
                      </span>
                    </td>

                    {/* Nama & NIK */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 leading-tight">{item.nama}</span>
                        {item.isTie && (
                          <span 
                            className="px-1.5 py-0.2 text-[8px] font-bold rounded bg-purple-100 text-purple-700 border border-purple-200"
                            title="Peringkat ditentukan oleh aturan Tie-Breaker Nilai Ujian C1 / C2"
                          >
                            Tie-Breaker
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono tabular-nums mt-0.5">NIK: {item.nik}</p>
                    </td>

                    {/* Kecamatan */}
                    <td className="py-2.5 px-3.5 text-slate-600 font-medium">
                      {item.kecamatan}
                    </td>

                    {/* Nilai Parameters */}
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-700 font-mono tabular-nums">
                      {item.rawApplicant?.C1}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono tabular-nums">
                      {item.rawApplicant?.C2}x
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono tabular-nums">
                      {item.rawApplicant?.C3}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {item.rawApplicant?.pendidikan}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-700 font-bold">
                      {item.rawApplicant?.C5} km
                    </td>

                    {/* Skor Akhir V */}
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-black text-bps-navy text-sm bg-blue-50/40">
                      {item.scoreV.toFixed(4)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.badgeBg}`}>
                        {isLolos && <CheckCircle2 className="w-3 h-3" aria-hidden="true" />}
                        {isCadangan && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
                        {!isLolos && !isCadangan && <XCircle className="w-3 h-3" aria-hidden="true" />}
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
