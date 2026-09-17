/**
 * Layanan Kalkulasi Metode Simple Additive Weighting (SAW)
 * Mengacu pada Bab 5 Buku Ajar SPK Politeknik Negeri Subang
 * Khusus Seleksi Mitra Statistik BPS Kabupaten Subang
 */

/**
 * Validasi total bobot kriteria agar persis 1.0 (100%)
 * @param {Array} criteria - Array of kriteria [{kode, bobot, ...}]
 * @returns {Object} { isValid, total, diff }
 */
export function validateBobot(criteria = []) {
  if (!criteria || criteria.length === 0) {
    return { isValid: false, total: 0, diff: 1.0 };
  }
  const total = criteria.reduce((sum, c) => sum + Number(c.bobot || 0), 0);
  const roundedTotal = Number(total.toFixed(4));
  const diff = Number(Math.abs(1.0 - roundedTotal).toFixed(4));
  return {
    isValid: diff < 0.001,
    total: roundedTotal,
    diff
  };
}

/**
 * Normalisasi otomatis bobot jika total != 1.0
 * @param {Array} criteria 
 * @returns {Array} Kriteria dengan bobot yang sudah proporsional
 */
export function autoNormalizeBobot(criteria = []) {
  if (!criteria || criteria.length === 0) return [];
  const total = criteria.reduce((sum, c) => sum + Number(c.bobot || 0), 0);
  if (total === 0) {
    const equalWeight = Number((1 / criteria.length).toFixed(4));
    return criteria.map(c => ({ ...c, bobot: equalWeight }));
  }
  return criteria.map(c => ({
    ...c,
    bobot: Number((Number(c.bobot || 0) / total).toFixed(4))
  }));
}

/**
 * Fungsi Inti Perhitungan SAW (Simple Additive Weighting)
 * Menghasilkan 3 Matriks: X (Keputusan), R (Normalisasi), W*R (Terbobot), serta Hasil Ranking
 * 
 * @param {Array} applicants - Daftar pelamar
 * @param {Array} criteria - Daftar kriteria C1 - C5 beserta bobot dan sifatnya
 * @param {Object} options - { kuotaLolos, kuotaCadangan }
 * @returns {Object} Hasil komputasi transparan
 */
export function calculateSAW(applicants = [], criteria = [], options = {}) {
  const kuotaLolos = Number(options.kuotaLolos ?? 5);
  const kuotaCadangan = Number(options.kuotaCadangan ?? 2);

  if (!applicants || applicants.length === 0 || !criteria || criteria.length === 0) {
    return {
      matrixX: [],
      extremes: {},
      matrixR: [],
      matrixWR: [],
      ranking: [],
      summary: {
        totalPelamar: 0,
        kuotaLolos,
        kuotaCadangan,
        totalLolos: 0,
        totalCadangan: 0,
        totalTidakLolos: 0,
        highestScore: 0,
        lowestScore: 0
      }
    };
  }

  // 1. Ambil nilai mentah & cari Nilai Ekstrim: Max untuk Benefit, Min untuk Cost
  const extremes = {};
  criteria.forEach(c => {
    const kode = c.kode;
    const isCost = c.sifat?.toLowerCase() === 'cost';

    const values = applicants.map(a => {
      let val = Number(a[kode]);
      if (isNaN(val)) val = 0;
      // Proteksi khusus untuk kriteria Cost (C5 Jarak): tidak boleh <= 0 untuk cegah pembagian dengan nol
      if (isCost && val <= 0) {
        val = 0.1; // Minimal 0.1 km (100 meter dari kantor BPS)
      }
      return val;
    });

    extremes[kode] = {
      max: values.length > 0 ? Math.max(...values) : 0,
      min: values.length > 0 ? Math.min(...values) : 0.1
    };
  });

  // 2. Matriks Keputusan Awal (X)
  const matrixX = applicants.map((app, idx) => {
    const row = {
      id: app.id || idx + 1,
      nik: app.nik || '-',
      nama: app.nama || app.namaLengkap || `Pelamar ${idx + 1}`,
      kecamatan: app.kecamatan || '-',
      pendidikan: app.pendidikan || '-'
    };
    criteria.forEach(c => {
      let val = Number(app[c.kode]);
      if (isNaN(val)) val = 0;
      if (c.sifat?.toLowerCase() === 'cost' && val <= 0) val = 0.1;
      row[c.kode] = val;
    });
    return row;
  });

  // 3. Matriks Ternormalisasi (R)
  const matrixR = applicants.map((app, idx) => {
    const normalized = {};
    const normalizedRaw = {};

    criteria.forEach(c => {
      const kode = c.kode;
      const isBenefit = c.sifat?.toLowerCase() === 'benefit';
      let val = Number(app[kode]);
      if (isNaN(val)) val = 0;

      let r = 0;
      if (isBenefit) {
        const maxVal = extremes[kode].max;
        r = maxVal === 0 ? 0 : val / maxVal;
      } else {
        // Cost (Jarak)
        if (val <= 0) val = 0.1;
        const minVal = extremes[kode].min;
        r = val === 0 ? 0 : minVal / val;
      }

      normalizedRaw[kode] = r;
      normalized[kode] = Number(r.toFixed(4));
    });

    return {
      id: app.id || idx + 1,
      nik: app.nik || '-',
      nama: app.nama || app.namaLengkap || `Pelamar ${idx + 1}`,
      kecamatan: app.kecamatan || '-',
      R: normalized,
      R_raw: normalizedRaw
    };
  });

  // 4. Matriks Terbobot (W * R) & Perhitungan Nilai Preferensi Vi
  const matrixWR = matrixR.map((rowR, idx) => {
    const app = applicants[idx];
    const weightedRow = {};
    let totalVi = 0;

    criteria.forEach(c => {
      const kode = c.kode;
      const bobot = Number(c.bobot || 0);
      const rVal = rowR.R_raw[kode] || 0;
      const wxr = rVal * bobot;
      weightedRow[kode] = Number(wxr.toFixed(4));
      totalVi += wxr;
    });

    const finalScore = Number(totalVi.toFixed(4));

    return {
      id: rowR.id,
      nik: rowR.nik,
      nama: rowR.nama,
      kecamatan: rowR.kecamatan,
      rawApplicant: app,
      WR: weightedRow,
      scoreV: finalScore,
      scoreV_raw: totalVi
    };
  });

  // 5. Perangkingan (Sorting Descending) dengan Aturan Tie-Breaker
  const sorted = [...matrixWR].sort((a, b) => {
    // Selisih skor preferensi V
    const diff = b.scoreV - a.scoreV;
    if (Math.abs(diff) > 0.0001) {
      return diff;
    }

    // TIE-BREAKER 1: Nilai Ujian Kompetensi (C1) lebih tinggi
    const c1A = Number(a.rawApplicant?.C1 || 0);
    const c1B = Number(b.rawApplicant?.C1 || 0);
    if (c1B !== c1A) {
      return c1B - c1A;
    }

    // TIE-BREAKER 2: Pengalaman Survei (C2) lebih banyak
    const c2A = Number(a.rawApplicant?.C2 || 0);
    const c2B = Number(b.rawApplicant?.C2 || 0);
    if (c2B !== c2A) {
      return c2B - c2A;
    }

    // TIE-BREAKER 3: Jarak Domisili (C5) lebih dekat (Cost lebih kecil)
    const c5A = Number(a.rawApplicant?.C5 || 999);
    const c5B = Number(b.rawApplicant?.C5 || 999);
    return c5A - c5B;
  });

  // 6. Penentuan Status Rekomendasi berdasarkan Kuota
  let countLolos = 0;
  let countCadangan = 0;
  let countTidakLolos = 0;

  const ranking = sorted.map((item, index) => {
    const rank = index + 1;
    let status = 'Tidak Lolos';
    let statusColor = 'text-slate-500 bg-slate-100 border-slate-200';
    let badgeBg = 'bg-slate-100 text-slate-700';

    if (rank <= kuotaLolos) {
      status = 'Lolos';
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
      badgeBg = 'bg-emerald-100 text-emerald-800';
      countLolos++;
    } else if (rank <= kuotaLolos + kuotaCadangan) {
      status = 'Cadangan';
      statusColor = 'text-amber-700 bg-amber-50 border-amber-300';
      badgeBg = 'bg-amber-100 text-amber-800';
      countCadangan++;
    } else {
      countTidakLolos++;
    }

    // Deteksi apakah pelamar memiliki skor yang sama dengan tetangganya (Tie-breaker aktif)
    const prevItem = sorted[index - 1];
    const nextItem = sorted[index + 1];
    const hasTie = 
      (prevItem && Math.abs(prevItem.scoreV - item.scoreV) < 0.0001) ||
      (nextItem && Math.abs(nextItem.scoreV - item.scoreV) < 0.0001);

    return {
      ...item,
      ranking: rank,
      status,
      statusColor,
      badgeBg,
      isTie: Boolean(hasTie)
    };
  });

  return {
    matrixX,
    extremes,
    matrixR,
    matrixWR,
    ranking,
    summary: {
      totalPelamar: applicants.length,
      kuotaLolos,
      kuotaCadangan,
      totalLolos: countLolos,
      totalCadangan: countCadangan,
      totalTidakLolos: countTidakLolos,
      highestScore: ranking.length > 0 ? ranking[0].scoreV : 0,
      lowestScore: ranking.length > 0 ? ranking[ranking.length - 1].scoreV : 0
    }
  };
}
