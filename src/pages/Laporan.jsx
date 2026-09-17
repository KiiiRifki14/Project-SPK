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

  const { ranking = [], summary = {} } = sawResult || {};
  const kuotaLolos = pengaturan?.kuotaLolos || 5;
  const kuotaCadangan = pengaturan?.kuotaCadangan || 2;

  // Pisahkan pelamar Lolos dan Cadangan
  const listLolos = ranking.filter(r => r.status === 'Lolos');
  const listCadangan = ranking.filter(r => r.status === 'Cadangan');

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Simpan perubahan pengaturan surat
  const handleSaveSettings = (e) => {
    e.preventDefault();
    onUpdatePengaturan(formSettings);
    setIsEditingSettings(false);
    onShowAlert('Pengaturan surat berita acara berhasil diperbarui', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Toolbar (Tidak Dicetak) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-bps-navy">
            <Printer className="w-6 h-6 text-bps-blue" />
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Berita Acara & Laporan Penetapan Hasil Seleksi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dokumen resmi penetapan kelulusan calon mitra statistik berformat kop surat BPS Kabupaten Subang siap cetak atau simpan ke PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            {isEditingSettings ? 'Tutup Pengaturan' : 'Ubah No. SK & Kop'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-bps-navy text-white hover:bg-bps-navy-light shadow-md shadow-bps-navy/20 transition-all transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4 text-bps-blue" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Form Edit Pengaturan Surat (No-Print) */}
      {isEditingSettings && (
        <div className="bg-white p-6 rounded-2xl border border-bps-blue/30 shadow-md space-y-4 no-print animate-in fade-in">
          <h3 className="text-sm font-bold text-bps-navy flex items-center gap-2">
            <Settings className="w-4 h-4 text-bps-blue" />
            Pengaturan Informasi Surat Resmi
          </h3>
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor SK Berita Acara</label>
              <input
                type="text"
                value={formSettings.nomorSK || ''}
                onChange={(e) => setFormSettings({ ...formSettings, nomorSK: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Periode Kegiatan / Sensus</label>
              <input
                type="text"
                value={formSettings.namaPeriode || ''}
                onChange={(e) => setFormSettings({ ...formSettings, namaPeriode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kepala BPS Kabupaten Subang</label>
              <input
                type="text"
                value={formSettings.kepalaBpsNama || ''}
                onChange={(e) => setFormSettings({ ...formSettings, kepalaBpsNama: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">NIP Kepala BPS Subang</label>
              <input
                type="text"
                value={formSettings.kepalaBpsNip || ''}
                onChange={(e) => setFormSettings({ ...formSettings, kepalaBpsNip: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Ketua Panitia Seleksi</label>
              <input
                type="text"
                value={formSettings.ketuaPanitiaNama || ''}
                onChange={(e) => setFormSettings({ ...formSettings, ketuaPanitiaNama: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Penetapan Surat</label>
              <input
                type="date"
                value={formSettings.tanggalSK || ''}
                onChange={(e) => setFormSettings({ ...formSettings, tanggalSK: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-bps-blue"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingSettings(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-bps-navy text-white hover:bg-bps-navy-light rounded-xl shadow"
              >
                Simpan Pengaturan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* LEMBAR BERITA ACARA RESMI SIAP CETAK (A4 PRINTABLE PAPER)   */}
      {/* ========================================================== */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto print-container text-slate-900 font-serif leading-relaxed">
        
        {/* KOP SURAT RESMI BPS KABUPATEN SUBANG */}
        <div className="flex items-center gap-5 border-b-4 border-double border-slate-900 pb-4 mb-6">
          {/* Logo BPS */}
          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-16 h-16 fill-current text-bps-navy">
              <polygon points="50,15 90,80 10,80" fill="#0B3C68" />
              <polygon points="50,28 78,75 22,75" fill="#00A3E0" />
              <circle cx="50" cy="58" r="12" fill="#10B981" />
              <path d="M30 84 L70 84 L50 92 Z" fill="#F59E0B" />
            </svg>
          </div>

          {/* Teks Kop Surat */}
          <div className="text-center flex-1 pr-6">
            <h2 className="text-xl font-bold tracking-wider font-sans uppercase text-slate-900 leading-tight">
              BADAN PUSAT STATISTIK
            </h2>
            <h2 className="text-2xl font-extrabold tracking-tight font-sans uppercase text-bps-navy">
              KABUPATEN SUBANG
            </h2>
            <p className="text-xs font-sans text-slate-700 mt-1 leading-normal">
              Jl. Mayjen Sutoyo No. 12, Karanganyar, Kec. Subang, Kabupaten Subang, Jawa Barat 41211
            </p>
            <p className="text-xs font-sans text-slate-600">
              Telepon: (0260) 411032 • Pos-el: bps3213@bps.go.id • Laman: subangkab.bps.go.id
            </p>
          </div>
        </div>

        {/* JUDUL DOKUMEN BERITA ACARA */}
        <div className="text-center my-6 space-y-1">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide font-sans text-slate-900 underline">
            BERITA ACARA PENETAPAN HASIL SELEKSI MITRA STATISTIK
          </h2>
          <p className="text-xs font-mono text-slate-700">
            NOMOR: {pengaturan?.nomorSK || 'B-045/32130/VS.100/2026'}
          </p>
          <p className="text-xs font-sans text-slate-600 uppercase font-semibold">
            TENTANG: HASIL AKHIR PENILAIAN SELEKSI CALON MITRA STATISTIK LAPANGAN METODE SAW
          </p>
        </div>

        {/* KATA PENGANTAR / PEMBUKA */}
        <div className="text-xs sm:text-sm text-justify space-y-3 font-sans text-slate-800">
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

        {/* TABEL A: DAFTAR MITRA DINYATAKAN LOLOS */}
        <div className="my-6 space-y-2">
          <h3 className="text-xs sm:text-sm font-bold font-sans uppercase tracking-wide text-bps-navy">
            A. DAFTAR CALON MITRA STATISTIK YANG DINYATAKAN LOLOS SELEKSI (KUOTA UTAMA)
          </h3>
          <table className="w-full border-collapse border border-slate-900 text-xs font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                <th className="border border-slate-900 py-2 px-2 w-10">No</th>
                <th className="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                <th className="border border-slate-900 py-2 px-3 w-36">NIK</th>
                <th className="border border-slate-900 py-2 px-3">Kecamatan</th>
                <th className="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                <th className="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
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
                    <td className="border border-slate-900 py-1.5 px-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-900 py-1.5 px-3 font-semibold">{m.nama}</td>
                    <td className="border border-slate-900 py-1.5 px-3 text-center font-mono">{m.nik}</td>
                    <td className="border border-slate-900 py-1.5 px-3">{m.kecamatan}</td>
                    <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono">
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

        {/* TABEL B: DAFTAR MITRA CADANGAN */}
        {listCadangan.length > 0 && (
          <div className="my-6 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold font-sans uppercase tracking-wide text-amber-900">
              B. DAFTAR CALON MITRA STATISTIK CADANGAN (PENGGANTI)
            </h3>
            <table className="w-full border-collapse border border-slate-900 text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                  <th className="border border-slate-900 py-2 px-2 w-10">No</th>
                  <th className="border border-slate-900 py-2 px-3">Nama Lengkap</th>
                  <th className="border border-slate-900 py-2 px-3 w-36">NIK</th>
                  <th className="border border-slate-900 py-2 px-3">Kecamatan</th>
                  <th className="border border-slate-900 py-2 px-2 w-20">Skor (V)</th>
                  <th className="border border-slate-900 py-2 px-2 w-28">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {listCadangan.map((m, idx) => (
                  <tr key={m.id} className="text-slate-900">
                    <td className="border border-slate-900 py-1.5 px-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-900 py-1.5 px-3 font-semibold">{m.nama}</td>
                    <td className="border border-slate-900 py-1.5 px-3 text-center font-mono">{m.nik}</td>
                    <td className="border border-slate-900 py-1.5 px-3">{m.kecamatan}</td>
                    <td className="border border-slate-900 py-1.5 px-2 text-center font-bold font-mono">
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
        )}

        {/* KATA PENUTUP */}
        <div className="text-xs sm:text-sm text-justify font-sans text-slate-800 mt-4 leading-relaxed">
          <p>
            Demikian Berita Acara ini dibuat dengan sebenarnya berdasarkan hasil komputasi analitis yang objektif dan transparan 
            untuk dapat dipergunakan sebagaimana mestinya dalam penerbitan Surat Keputusan (SK) Pengangkatan Mitra Statistik Lapangan BPS Kabupaten Subang.
          </p>
        </div>

        {/* KOLOM TANDA TANGAN RESMI */}
        <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-xs sm:text-sm font-sans text-center">
          {/* Tanda Tangan Panitia */}
          <div className="space-y-16">
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

          {/* Tanda Tangan Kepala BPS */}
          <div className="space-y-16">
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
  );
}
