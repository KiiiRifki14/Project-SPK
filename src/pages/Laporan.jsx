import React, { useState } from 'react';
import { 
  Printer, 
  Settings, 
  CheckCircle2, 
  FileText, 
  Save, 
  RotateCcw,
  Building2,
  Calendar,
  Check
} from 'lucide-react';

export default function Laporan({ 
  sawResult, 
  pengaturan, 
  onUpdatePengaturan, 
  onShowAlert 
}) {
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [formSettings, setFormSettings] = useState(pengaturan || {});

  const { ranking = [] } = sawResult || {};
  const kuotaLolos = pengaturan?.kuotaLolos || 5;

  const listLolos = ranking.filter(r => r.status === 'Lolos');
  const listCadangan = ranking.filter(r => r.status === 'Cadangan');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdatePengaturan(formSettings);
    setIsEditingSettings(false);
    onShowAlert('Pengaturan surat berita acara berhasil diperbarui', 'success');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Action Toolbar (No-Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Printer className="w-5 h-5 text-bps-blue" />
            Berita Acara Resmi Hasil Rekrutmen Mitra
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Format resmi surat dinas BPS Kabupaten Subang. Siap dicetak langsung atau disimpan ke format PDF (Ctrl + P).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            aria-expanded={isEditingSettings}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-200/90 shadow-2xs focus-ring"
          >
            <Settings className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>{isEditingSettings ? 'Tutup Pengaturan' : 'Ubah No. SK & Kop'}</span>
          </button>
          <button
            onClick={handlePrint}
            aria-label="Cetak atau simpan dokumen berita acara ke format PDF"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light shadow-xs transition-all active:scale-95 focus-ring"
          >
            <Printer className="w-4 h-4 text-bps-blue" aria-hidden="true" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Form Edit Pengaturan Surat (No-Print) */}
      {isEditingSettings && (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-bps-blue/30 shadow-xs space-y-3.5 no-print animate-fade-in">
          <h3 className="text-xs sm:text-sm font-bold text-bps-navy flex items-center gap-2">
            <Settings className="w-4 h-4 text-bps-blue" aria-hidden="true" />
            <span>Pengaturan Informasi Lembar Surat Resmi</span>
          </h3>
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label htmlFor="sk-nomor" className="block text-xs font-bold text-slate-700 mb-1">Nomor SK Berita Acara</label>
              <input
                id="sk-nomor"
                type="text"
                value={formSettings.nomorSK || ''}
                onChange={(e) => setFormSettings({ ...formSettings, nomorSK: e.target.value })}
                className="w-full px-3 h-11 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue/40 focus-ring font-medium"
              />
            </div>
            <div>
              <label htmlFor="sk-periode" className="block text-xs font-bold text-slate-700 mb-1">Nama Periode Sensus / Survei</label>
              <input
                id="sk-periode"
                type="text"
                value={formSettings.namaPeriode || ''}
                onChange={(e) => setFormSettings({ ...formSettings, namaPeriode: e.target.value })}
                className="w-full px-3 h-11 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue/40 focus-ring font-medium"
              />
            </div>
            <div>
              <label htmlFor="sk-kepala" className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala BPS Kabupaten Subang</label>
              <input
                id="sk-kepala"
                type="text"
                value={formSettings.namaKepala || ''}
                onChange={(e) => setFormSettings({ ...formSettings, namaKepala: e.target.value })}
                className="w-full px-3 h-11 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue/40 focus-ring font-medium"
              />
            </div>
            <div>
              <label htmlFor="sk-nip" className="block text-xs font-bold text-slate-700 mb-1">NIP Kepala BPS</label>
              <input
                id="sk-nip"
                type="text"
                value={formSettings.nipKepala || ''}
                onChange={(e) => setFormSettings({ ...formSettings, nipKepala: e.target.value })}
                className="w-full px-3 h-11 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue/40 focus-ring font-mono tabular-nums font-medium"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingSettings(false)}
                className="px-4 py-2.5 min-h-[44px] text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl focus-ring"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 min-h-[44px] text-xs font-bold bg-bps-navy text-white hover:bg-bps-navy-light rounded-xl shadow-xs focus-ring"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pb-4 w-full">
        {/* ========================================================== */}
        {/* LEMBAR DOKUMEN BERITA ACARA RESMI SIAP CETAK (A4 PAPER)    */}
        {/* ========================================================== */}
        <div className="bg-white p-4 sm:p-10 md:p-12 rounded-xl border border-slate-200 sm:border-slate-300 shadow-sm w-full max-w-4xl mx-auto print-container text-slate-900 leading-relaxed font-sans">
        
        {/* KOP SURAT RESMI */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 border-b-2 sm:border-b-4 border-double border-slate-900 pb-4 mb-6 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 fill-current text-bps-navy">
              <polygon points="50,15 90,80 10,80" fill="#0B3C68" />
              <polygon points="50,28 78,75 22,75" fill="#00A3E0" />
              <circle cx="50" cy="58" r="12" fill="#10B981" />
              <path d="M30 84 L70 84 L50 92 Z" fill="#F59E0B" />
            </svg>
          </div>

          <div className="flex-1 sm:pr-6">
            <h2 className="text-base sm:text-lg font-bold tracking-wider uppercase text-slate-900 leading-tight">
              BADAN PUSAT STATISTIK
            </h2>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-bps-navy">
              KABUPATEN SUBANG
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-700 mt-1 leading-normal">
              Jl. Mayjen Sutoyo No. 12, Karanganyar, Kec. Subang, Kabupaten Subang, Jawa Barat 41211
            </p>
            <p className="text-[10.5px] sm:text-xs text-slate-600">
              Telepon: (0260) 411032 • Pos-el: bps3213@bps.go.id • Laman: subangkab.bps.go.id
            </p>
          </div>
        </div>

        {/* JUDUL DOKUMEN */}
        <div className="text-center my-6 space-y-1">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 underline">
            BERITA ACARA PENETAPAN HASIL SELEKSI MITRA STATISTIK
          </h2>
          <p className="text-xs font-mono text-slate-700 tabular-nums">
            NOMOR: {pengaturan?.nomorSK || 'B-045/32130/VS.100/2026'}
          </p>
          <p className="text-xs text-slate-600 uppercase font-semibold">
            TENTANG: HASIL AKHIR PENILAIAN SELEKSI CALON MITRA STATISTIK LAPANGAN METODE SAW
          </p>
        </div>

        {/* PEMBUKA */}
        <div className="text-xs sm:text-sm text-justify space-y-3 text-slate-800">
          <p>
            Pada hari ini, tanggal <strong>{new Date(pengaturan?.tanggalSK || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>, 
            bertempat di Kantor Badan Pusat Statistik Kabupaten Subang, Panitia Seleksi Rekrutmen Calon Mitra Statistik telah menyelesaikan 
            proses evaluasi dan pembobotan matematis menggunakan metode <strong>Simple Additive Weighting (SAW)</strong> terhadap seluruh berkas dan tes kompetensi pendaftar.
          </p>
          <p>
            Berdasarkan 5 kriteria standar (Nilai Ujian Kompetensi, Pengalaman Survei, Uji CAPI Android, Jenjang Pendidikan, dan Jarak Domisili ke Wilayah Tugas) 
            serta ketersediaan alokasi kuota kebutuhan sebanyak <strong>{kuotaLolos} orang</strong>, maka ditetapkan hasil rekapitulasi sebagai berikut:
          </p>
        </div>

        {/* TABEL A: DAFTAR MITRA LOLOS */}
        <div className="my-6 space-y-2">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-bps-navy">
            A. DAFTAR CALON MITRA STATISTIK YANG DINYATAKAN LOLOS SELEKSI (KUOTA UTAMA)
          </h3>

          {/* 1. Mobile Native Cards (sm:hidden print:hidden) */}
          <div className="sm:hidden print:hidden space-y-2">
            {listLolos.length === 0 ? (
              <p className="p-3 bg-slate-50 text-center text-xs text-slate-500 rounded-lg border border-slate-200">
                Belum ada calon mitra yang lolos kuota.
              </p>
            ) : (
              listLolos.map((m, idx) => (
                <div key={m.id} className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-bps-navy text-white text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{m.nama}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex-shrink-0">
                      Lolos Utama
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pl-8">
                    <span>{m.kecamatan}</span>
                    <span className="font-mono font-bold text-bps-navy">Skor V: {m.scoreV.toFixed(4)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pl-8">
                    NIK: {m.nik}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 2. Desktop & Print Formal Table (hidden sm:block print:block) */}
          <div className="hidden sm:block print:block">
            <table className="w-full border-collapse border border-slate-900 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                  <th scope="col" className="border border-slate-900 py-2 px-2 w-10">No</th>
                  <th scope="col" className="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                  <th scope="col" className="border border-slate-900 py-2 px-3 w-36">NIK</th>
                  <th scope="col" className="border border-slate-900 py-2 px-3">Kecamatan</th>
                  <th scope="col" className="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                  <th scope="col" className="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {listLolos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="border border-slate-900 text-center py-4 text-slate-500">
                      Belum ada calon mitra yang lolos kuota.
                    </td>
                  </tr>
                ) : (
                  listLolos.map((m, idx) => (
                    <tr key={m.id} className="text-slate-900">
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{idx + 1}</td>
                      <td className="border border-slate-900 py-1.5 px-3 font-semibold">{m.nama}</td>
                      <td className="border border-slate-900 py-1.5 px-3 text-center font-mono tabular-nums">{m.nik}</td>
                      <td className="border border-slate-900 py-1.5 px-3">{m.kecamatan}</td>
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">
                        {m.scoreV.toFixed(4)}
                      </td>
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-semibold text-emerald-800">
                        Lolos Utama
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL B: DAFTAR MITRA CADANGAN */}
        {listCadangan.length > 0 && (
          <div className="my-6 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-900">
              B. DAFTAR CALON MITRA STATISTIK CADANGAN (PENGGANTI)
            </h3>

            {/* 1. Mobile Native Cards (sm:hidden print:hidden) */}
            <div className="sm:hidden print:hidden space-y-2">
              {listCadangan.map((m, idx) => (
                <div key={m.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs truncate">{m.nama}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-md flex-shrink-0">
                      Cadangan #{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pl-8">
                    <span>{m.kecamatan}</span>
                    <span className="font-mono font-bold text-bps-navy">Skor V: {m.scoreV.toFixed(4)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pl-8">
                    NIK: {m.nik}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop & Print Formal Table (hidden sm:block print:block) */}
            <div className="hidden sm:block print:block">
              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                    <th scope="col" className="border border-slate-900 py-2 px-2 w-10">No</th>
                    <th scope="col" className="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                    <th scope="col" className="border border-slate-900 py-2 px-3 w-36">NIK</th>
                    <th scope="col" className="border border-slate-900 py-2 px-3">Kecamatan</th>
                    <th scope="col" className="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                    <th scope="col" className="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {listCadangan.map((m, idx) => (
                    <tr key={m.id} className="text-slate-900">
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">{idx + 1}</td>
                      <td className="border border-slate-900 py-1.5 px-3 font-semibold">{m.nama}</td>
                      <td className="border border-slate-900 py-1.5 px-3 text-center font-mono tabular-nums">{m.nik}</td>
                      <td className="border border-slate-900 py-1.5 px-3">{m.kecamatan}</td>
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono tabular-nums">
                        {m.scoreV.toFixed(4)}
                      </td>
                      <td className="border border-slate-900 py-1.5 px-2 text-center font-semibold text-amber-800">
                        Cadangan #{idx + 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PENUTUP */}
        <div className="text-xs sm:text-sm text-justify text-slate-800 mt-4 leading-relaxed">
          <p>
            Demikian Berita Acara ini dibuat dengan sebenarnya berdasarkan hasil komputasi analitis yang objektif dan transparan 
            untuk dapat dipergunakan sebagaimana mestinya dalam penerbitan Surat Keputusan (SK) Pengangkatan Mitra Statistik Lapangan BPS Kabupaten Subang.
          </p>
        </div>

        {/* KOLOM TANDA TANGAN */}
        <div className="mt-8 sm:mt-12 pt-6 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8 text-xs sm:text-sm text-center">
          <div className="space-y-12 sm:space-y-16">
            <div>
              <p className="text-slate-600">Panitia Seleksi Rekrutmen,</p>
              <p className="font-bold text-slate-800">BPS Kabupaten Subang</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900">
                {pengaturan?.ketuaPanitiaNama || 'Muhammad Rifki Hermaulana'}
              </p>
              <p className="text-xs text-slate-500">Kelompok 8 D3 SI Polsub</p>
            </div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            <div>
              <p className="text-slate-600">Subang, {new Date(pengaturan?.tanggalSK || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-bold text-slate-800">Kepala BPS Kabupaten Subang,</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900">
                {pengaturan?.kepalaBpsNama || 'Ir. H. Dedi Suryadi, M.M.'}
              </p>
              <p className="text-xs text-slate-600 font-mono">
                NIP. {pengaturan?.kepalaBpsNip || '19740512 199803 1 002'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
