import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  Calculator, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  BarChart3
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
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-bps-navy p-6 sm:p-8 text-white shadow-md border border-bps-navy-dark">
        {/* Subtle Background Geometry */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <polygon points="100,20 180,160 20,160" fill="#00A3E0" />
            <circle cx="100" cy="115" r="30" fill="#10B981" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 text-blue-100 backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Badan Pusat Statistik Kabupaten Subang • Rekrutmen Mitra 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white">
            Sistem Pendukung Keputusan Seleksi Mitra Statistik
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            Implementasi komputasi analitis berbasis metode <strong>Simple Additive Weighting (SAW)</strong> untuk menetapkan mitra survei lapangan secara objektif, transparan, dan terukur.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => onNavigate('dapur')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-bps-navy hover:bg-blue-50 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus-ring w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4 text-bps-blue" aria-hidden="true" />
              Buka Dapur Hitung SAW
            </button>
            <button
              onClick={() => onNavigate('ranking')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-95 focus-ring w-full sm:w-auto"
            >
              <Award className="w-4 h-4 text-amber-300" aria-hidden="true" />
              Lihat Ranking ({sawResult?.ranking?.length || 0})
            </button>
            <button
              onClick={() => onNavigate('laporan')}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-100 hover:text-white transition-colors focus-ring w-full sm:w-auto"
            >
              <Printer className="w-4 h-4 text-slate-300" aria-hidden="true" />
              Pratinjau Berita Acara →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Pelamar */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pelamar</span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-blue-50 text-bps-blue">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">{totalPelamar}</h2>
            <p className="text-[10.5px] sm:text-xs text-slate-500 mt-0.5 truncate">
              <span className="font-semibold text-bps-navy">Warga Terdaftar</span>
            </p>
          </div>
        </div>

        {/* Kuota Lolos */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-emerald-200/70 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kuota Lolos</span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <h2 className="text-xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono tabular-nums">{kuotaLolos}</h2>
            <p className="text-[10.5px] sm:text-xs text-slate-500 mt-0.5 truncate">
              <span className="font-semibold text-emerald-700">1 s.d. {kuotaLolos}</span> Lolos
            </p>
          </div>
        </div>

        {/* Kuota Cadangan */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-amber-200/70 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cadangan</span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <h2 className="text-xl sm:text-3xl font-black text-amber-600 tracking-tight font-mono tabular-nums">{kuotaCadangan}</h2>
            <p className="text-[10.5px] sm:text-xs text-slate-500 mt-0.5 truncate">
              Rank {kuotaLolos + 1}..{kuotaLolos + kuotaCadangan}
            </p>
          </div>
        </div>

        {/* Skor Tertinggi */}
        <div className="bg-white p-3 sm:p-5 rounded-xl border border-purple-200/70 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Skor (V1)</span>
            <div className="p-1 sm:p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <h2 className="text-xl sm:text-3xl font-black text-purple-900 tracking-tight font-mono tabular-nums">
              {highestCandidate ? highestCandidate.scoreV.toFixed(4) : '0.0000'}
            </h2>
            <p className="text-[10.5px] sm:text-xs text-slate-600 font-semibold truncate mt-0.5">
              {highestCandidate ? `${highestCandidate.nama}` : 'Belum Dihitung'}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: 5 Steps Timeline & Domisili Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Kolom 1 & 2: 5 Tahapan Alur Kerja Sistem */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                Alur Tahapan Rekrutmen SPK
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Siklus berurutan dari data hingga SK kelulusan</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600">
              5 Tahap
            </span>
          </div>

          {/* Responsive grid on all screen sizes (Zero horizontal scroll on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-2.5 pt-1">
            {steps.map((s) => (
              <div 
                key={s.step} 
                onClick={() => onNavigate(s.tab)}
                className="group p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-blue-50/50 hover:border-bps-blue/40 transition-all duration-150 cursor-pointer flex sm:flex-col items-center sm:items-stretch justify-between gap-2 w-full active:scale-95"
              >
                <div className="flex sm:block items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-extrabold text-bps-blue group-hover:text-bps-navy transition-colors flex-shrink-0">
                    {s.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 sm:mt-1 group-hover:text-bps-navy transition-colors truncate sm:whitespace-normal">
                      {s.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 sm:mt-0.5 leading-tight hidden sm:block">
                      {s.desc}
                    </p>
                  </div>
                </div>
                <div className="sm:mt-2.5 sm:pt-2 sm:border-t sm:border-slate-200/60 flex items-center text-[11px] sm:text-[10px] font-bold text-bps-blue group-hover:underline flex-shrink-0">
                  <span>Buka</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-3 sm:h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 3: Persebaran Domisili Kecamatan */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-bps-blue" />
                  Persebaran Domisili
                </h2>
                <p className="text-xs text-slate-500">Asal kecamatan pelamar Subang</p>
              </div>
              <span className="text-[11px] font-bold text-bps-navy px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                {kecamatanList.length} Wilayah
              </span>
            </div>

            <div className="space-y-2.5">
              {kecamatanList.slice(0, 5).map(([kec, count]) => {
                const percentage = totalPelamar > 0 ? Math.round((count / totalPelamar) * 100) : 0;
                return (
                  <div key={kec} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 font-semibold">{kec}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{count} orang ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-bps-blue rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Wilayah Kab. Subang</span>
            <button 
              onClick={() => onNavigate('pelamar')}
              className="text-bps-blue font-semibold hover:underline"
            >
              Lihat Semua →
            </button>
          </div>
        </div>
      </div>

      {/* Tabel 3 Kandidat Teratas (Leaderboard Showcase) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Tiga Besar Kandidat Rekomendasi Teratas
            </h2>
            <p className="text-xs text-slate-500">Nilai preferensi (V) tertinggi hasil komputasi SAW</p>
          </div>
          <button
            onClick={() => onNavigate('ranking')}
            className="text-xs font-bold text-bps-navy hover:text-bps-blue transition-colors flex items-center gap-1"
          >
            Buka Leaderboard Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-16 text-center">Rank</th>
                <th className="py-2.5 px-4">Nama Pelamar & NIK</th>
                <th className="py-2.5 px-4">Kecamatan</th>
                <th className="py-2.5 px-4">Pendidikan</th>
                <th className="py-2.5 px-4 text-right">Ujian (C1)</th>
                <th className="py-2.5 px-4 text-right">Jarak (C5)</th>
                <th className="py-2.5 px-4 text-right">Skor Akhir (V)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sawResult?.ranking?.slice(0, 3).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 text-center">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-extrabold text-xs ${
                      item.ranking === 1 ? 'bg-amber-400 text-slate-900 shadow-xs' :
                      item.ranking === 2 ? 'bg-slate-300 text-slate-800' :
                      'bg-amber-600/30 text-amber-900'
                    }`}>
                      #{item.ranking}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-slate-900 leading-tight">{item.nama}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIK: {item.nik}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-medium">{item.kecamatan}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.rawApplicant?.pendidikan}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-700">{item.rawApplicant?.C1}</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 font-mono">{item.rawApplicant?.C5} km</td>
                  <td className="py-2.5 px-4 text-right font-mono font-black text-bps-navy text-sm">
                    {item.scoreV.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.badgeBg}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile Card View (Sleek, No Horizontal Scroll Needed) */}
        <div className="md:hidden divide-y divide-slate-100">
          {sawResult?.ranking?.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-7 h-7 rounded-xl inline-flex items-center justify-center font-black text-xs ${
                    item.ranking === 1 ? 'bg-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-300' :
                    item.ranking === 2 ? 'bg-slate-300 text-slate-800' :
                    'bg-amber-600/30 text-amber-900'
                  }`}>
                    #{item.ranking}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.nama}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIK: {item.nik}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${item.badgeBg}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Wilayah</span>
                  <span className="font-bold text-slate-700 truncate block text-[11px] mt-0.5">{item.kecamatan}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ujian (C1)</span>
                  <span className="font-bold text-slate-700 font-mono text-[11px] mt-0.5">{item.rawApplicant?.C1}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-bps-blue font-bold uppercase tracking-wider">Skor SAW</span>
                  <span className="font-black text-bps-navy font-mono text-xs mt-0.5 block">{item.scoreV.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
