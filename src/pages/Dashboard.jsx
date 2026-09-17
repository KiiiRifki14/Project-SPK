import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  Sliders, 
  Calculator, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({ 
  pelamar = [], 
  kriteria = [], 
  sawResult, 
  pengaturan, 
  onNavigate 
}) {
  const totalPelamar = pelamar.length;
  const kuotaLolos = pengaturan?.kuotaLolos || 5;
  const kuotaCadangan = pengaturan?.kuotaCadangan || 2;
  const highestCandidate = sawResult?.ranking?.[0];

  // Hitung persebaran kecamatan pelamar
  const kecamatanMap = {};
  pelamar.forEach(p => {
    const kec = p.kecamatan || 'Lainnya';
    kecamatanMap[kec] = (kecamatanMap[kec] || 0) + 1;
  });
  const kecamatanList = Object.entries(kecamatanMap).sort((a, b) => b[1] - a[1]);

  // Alur Langkah Sistem
  const steps = [
    { step: '1', title: 'Input Data Pelamar', desc: 'Nilai ujian, survei, CAPI, pendidikan, jarak', tab: 'pelamar' },
    { step: '2', title: 'Atur Bobot Kriteria', desc: 'Validasi bobot C1 - C5 = 1.0 (100%)', tab: 'kriteria' },
    { step: '3', title: 'Dapur Hitung SAW', desc: 'Normalisasi Benefit & Cost transparan', tab: 'dapur' },
    { step: '4', title: 'Perangkingan Mitra', desc: 'Leaderboard objektif & kuota lolos', tab: 'ranking' },
    { step: '5', title: 'Cetak Berita Acara', desc: 'Format resmi berkop surat BPS Subang', tab: 'laporan' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bps-navy via-bps-navy-light to-bps-blue p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Badan Pusat Statistik Kabupaten Subang • Tahun 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Seleksi Mitra Statistik Lapangan
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            Sistem Pendukung Keputusan berbasis metode <strong>Simple Additive Weighting (SAW)</strong> untuk menentukan calon mitra survei secara objektif, transparan, dan akuntabel.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('dapur')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-bps-navy hover:bg-blue-50 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Calculator className="w-4 h-4 text-bps-blue" />
              Buka Dapur Hitung SAW
            </button>
            <button
              onClick={() => onNavigate('ranking')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-bps-blue/30 text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all"
            >
              <Award className="w-4 h-4" />
              Lihat Ranking ({sawResult?.ranking?.length || 0})
            </button>
          </div>
        </div>

        {/* Decorative Watermark Geometry */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <polygon points="100,20 180,160 20,160" />
          </svg>
        </div>
      </div>

      {/* Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pelamar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pelamar</span>
            <div className="p-2.5 rounded-xl bg-bps-blue/10 text-bps-blue">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold text-bps-navy">{totalPelamar}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-bps-blue">Warga Terdaftar</span> di database
            </p>
          </div>
        </div>

        {/* Kuota Kebutuhan Lolos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kuota Lolos</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold text-emerald-700">{kuotaLolos}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-emerald-700">Peringkat 1 s.d. {kuotaLolos}</span> dinyatakan Lolos
            </p>
          </div>
        </div>

        {/* Kuota Cadangan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kuota Cadangan</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold text-amber-600">{kuotaCadangan}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Peringkat {kuotaLolos + 1} s.d. {kuotaLolos + kuotaCadangan}
            </p>
          </div>
        </div>

        {/* Pelamar Terbaik / Top Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi (V1)</span>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold text-purple-900">
              {highestCandidate ? highestCandidate.scoreV : '0.0000'}
            </h2>
            <p className="text-xs text-slate-600 font-semibold truncate mt-1">
              {highestCandidate ? `${highestCandidate.nama} (${highestCandidate.kecamatan})` : 'Belum Dihitung'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Tengah: Alur Sistem & Persebaran Kecamatan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Diagram Alur Kerja SPK BPS */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-bps-navy">Alur Kerja Sistem Seleksi Mitra SPK</h2>
              <p className="text-xs text-slate-500">Panduan langkah tahapan seleksi dari hulu ke hilir</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
              5 Tahapan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {steps.map((s, idx) => (
              <div 
                key={s.step} 
                onClick={() => onNavigate(s.tab)}
                className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-bps-blue/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-bps-navy group-hover:bg-bps-blue text-white font-bold text-xs flex items-center justify-center mb-2.5 transition-colors">
                    {s.step}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-bps-navy">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center text-[10px] font-semibold text-bps-blue group-hover:underline">
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 3: Persebaran Asal Kecamatan Pelamar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-bps-navy flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-bps-blue" />
                  Persebaran Domisili
                </h2>
                <p className="text-xs text-slate-500">Asal kecamatan pelamar Kabupaten Subang</p>
              </div>
              <span className="text-xs font-semibold text-bps-blue">
                {kecamatanList.length} Kecamatan
              </span>
            </div>

            <div className="space-y-3">
              {kecamatanList.slice(0, 5).map(([kec, count]) => {
                const percentage = totalPelamar > 0 ? Math.round((count / totalPelamar) * 100) : 0;
                return (
                  <div key={kec} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{kec}</span>
                      <span className="text-slate-500 font-bold">{count} orang ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-bps-blue to-bps-navy rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sensus Pertanian & Ekonomi</span>
            <button 
              onClick={() => onNavigate('pelamar')}
              className="text-bps-blue font-semibold hover:underline"
            >
              Lihat Seluruh Pelamar →
            </button>
          </div>
        </div>
      </div>

      {/* Tabel 3 Kandidat Teratas (Preview) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-bps-navy flex items-center gap-2">
              <Award className="w-5 h-5 text-bps-amber" />
              Preview 3 Besar Kandidat Rekomendasi Teratas
            </h2>
            <p className="text-xs text-slate-500">Hasil kalkulasi nilai preferensi (V) metode SAW tertinggi</p>
          </div>
          <button
            onClick={() => onNavigate('ranking')}
            className="text-xs font-bold text-bps-navy hover:text-bps-blue transition-colors flex items-center gap-1"
          >
            Buka Leaderboard Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Nama Pelamar</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4">Pendidikan</th>
                <th className="py-3 px-4">Nilai Ujian (C1)</th>
                <th className="py-3 px-4">Jarak (C5)</th>
                <th className="py-3 px-4">Skor Akhir (V)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sawResult?.ranking?.slice(0, 3).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-bps-navy">
                    <span className="w-6 h-6 rounded-full bg-bps-navy/10 text-bps-navy flex items-center justify-center text-xs">
                      #{item.ranking}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {item.nama}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.kecamatan}</td>
                  <td className="py-3 px-4 text-slate-600">{item.rawApplicant?.pendidikan}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{item.rawApplicant?.C1}</td>
                  <td className="py-3 px-4 text-slate-600">{item.rawApplicant?.C5} km</td>
                  <td className="py-3 px-4 font-extrabold text-bps-blue text-base">
                    {item.scoreV.toFixed(4)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
