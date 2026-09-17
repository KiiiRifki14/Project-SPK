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
  FileSpreadsheet,
  Layers,
  ChevronRight
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
    { step: '01', title: 'Data Pelamar', desc: 'Input nilai ujian, riwayat survei, & CAPI', tab: 'pelamar' },
    { step: '02', title: 'Atur Bobot', desc: 'Validasi bobot C1 - C5 = 100%', tab: 'kriteria' },
    { step: '03', title: 'Dapur Hitung', desc: 'Normalisasi Benefit & Cost SAW', tab: 'dapur' },
    { step: '04', title: 'Ranking', desc: 'Leaderboard & seleksi kuota', tab: 'ranking' },
    { step: '05', title: 'Cetak Berita Acara', desc: 'Format resmi berkop BPS Subang', tab: 'laporan' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bps-navy-dark via-bps-navy to-bps-blue p-6 sm:p-8 text-white shadow-xl">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-100 backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Badan Pusat Statistik Kabupaten Subang • Rekrutmen Mitra 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Sistem Pendukung Keputusan Seleksi Mitra Statistik
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            Implementasi komputasi analitis berbasis metode <strong>Simple Additive Weighting (SAW)</strong> untuk menetapkan mitra survei lapangan secara objektif, transparan, dan terukur.
          </p>
          
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('dapur')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-bps-navy hover:bg-blue-50 shadow-lg shadow-black/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calculator className="w-4 h-4 text-bps-blue" />
              Buka Dapur Hitung SAW
            </button>
            <button
              onClick={() => onNavigate('ranking')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-300" />
              Lihat Ranking ({sawResult?.ranking?.length || 0})
            </button>
            <button
              onClick={() => onNavigate('laporan')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-100 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              Pratinjau Berita Acara →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Pelamar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pelamar</span>
            <div className="p-2 rounded-xl bg-bps-blue-light text-bps-blue">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-bps-navy tracking-tight">{totalPelamar}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-bps-blue">Warga Terdaftar</span> di database
            </p>
          </div>
        </div>

        {/* Kuota Lolos */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kuota Lolos</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-emerald-700 tracking-tight">{kuotaLolos}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-emerald-700">Peringkat 1 s.d. {kuotaLolos}</span> dinyatakan Lolos
            </p>
          </div>
        </div>

        {/* Kuota Cadangan */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kuota Cadangan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-amber-600 tracking-tight">{kuotaCadangan}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Peringkat {kuotaLolos + 1} s.d. {kuotaLolos + kuotaCadangan}
            </p>
          </div>
        </div>

        {/* Skor Tertinggi */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi (V1)</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-purple-900 tracking-tight">
              {highestCandidate ? highestCandidate.scoreV.toFixed(4) : '0.0000'}
            </h2>
            <p className="text-xs text-slate-600 font-semibold truncate mt-1">
              {highestCandidate ? `${highestCandidate.nama} (${highestCandidate.kecamatan})` : 'Belum Dihitung'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Tengah: Alur Sistem & Persebaran Kecamatan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: 5 Tahapan Alur Kerja Sistem */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-bps-navy">
                Alur Tahapan Rekrutmen SPK
              </h2>
              <p className="text-xs text-slate-500">Siklus berurutan dari pengumpulan data hingga SK kelulusan</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
              5 Langkah
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {steps.map((s) => (
              <div 
                key={s.step} 
                onClick={() => onNavigate(s.tab)}
                className="group p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-bps-blue-light hover:border-bps-blue/30 transition-all duration-150 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-extrabold text-bps-blue group-hover:text-bps-navy transition-colors">
                    {s.step}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-bps-navy transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center text-[10px] font-bold text-bps-blue group-hover:underline">
                  <span>Buka</span>
                  <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 3: Persebaran Domisili Kecamatan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-bps-navy flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-bps-blue" />
                  Persebaran Domisili
                </h2>
                <p className="text-xs text-slate-500">Asal kecamatan pelamar Subang</p>
              </div>
              <span className="text-xs font-bold text-bps-blue px-2 py-0.5 rounded bg-blue-50">
                {kecamatanList.length} Wilayah
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
            <span>Kabupaten Subang</span>
            <button 
              onClick={() => onNavigate('pelamar')}
              className="text-bps-blue font-semibold hover:underline"
            >
              Lihat Pelamar →
            </button>
          </div>
        </div>
      </div>

      {/* Tabel 3 Kandidat Teratas (Leaderboard Showcase) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-bps-navy flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Tiga Besar Kandidat Rekomendasi Teratas
            </h2>
            <p className="text-xs text-slate-500">Skor nilai preferensi (V) tertinggi hasil komputasi SAW</p>
          </div>
          <button
            onClick={() => onNavigate('ranking')}
            className="text-xs font-bold text-bps-navy hover:text-bps-blue transition-colors flex items-center gap-1"
          >
            Buka Leaderboard Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Peringkat</th>
                <th className="py-3 px-4">Nama Pelamar</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4">Pendidikan</th>
                <th className="py-3 px-4 text-center">Nilai Ujian (C1)</th>
                <th className="py-3 px-4 text-center">Jarak (C5)</th>
                <th className="py-3 px-4 text-center">Skor Akhir (V)</th>
                <th className="py-3 px-4 text-center">Status Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sawResult?.ranking?.slice(0, 3).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-extrabold text-xs ${
                      item.ranking === 1 ? 'bg-amber-400 text-slate-900 shadow-sm' :
                      item.ranking === 2 ? 'bg-slate-300 text-slate-800' :
                      'bg-amber-600/30 text-amber-900'
                    }`}>
                      #{item.ranking}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {item.nama}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.kecamatan}</td>
                  <td className="py-3 px-4 text-slate-600">{item.rawApplicant?.pendidikan}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">{item.rawApplicant?.C1}</td>
                  <td className="py-3 px-4 text-center text-slate-600 font-mono">{item.rawApplicant?.C5} km</td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-bps-navy text-base">
                    {item.scoreV.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${item.badgeBg}`}>
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
