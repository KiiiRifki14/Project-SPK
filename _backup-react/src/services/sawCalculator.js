/**
 * Layanan Kalkulasi Metode Simple Additive Weighting (SAW)
 * Mengacu pada PRD Final v2.0.0 (Academic Revision)
 * Khusus Seleksi Calon Mitra Statistik BPS Kabupaten Subang
 */

/**
 * Konversi data mentah pelamar ke nilai tegas (crisp) berskala 1 - 5
 * Mengacu pada PRD Final Bagian 2.2
 * 
 * @param {Object} applicant - Objek pelamar berisi nilai mentah C1 - C5 & pendidikan
 * @returns {Object} Nilai crisp { C1, C2, C3, C4, C5 }
 */
export function convertRawToCrisp(applicant = {}) {
  // 1. C1: Nilai Ujian Kompetensi (Benefit)
  // >= 85 -> 5; 75 - 84.9 -> 4; 65 - 74.9 -> 3; 55 - 64.9 -> 2; < 55 -> 1
  const rawC1 = Number(applicant.C1 ?? applicant.c1_mentah ?? 0);
  let c1 = 1;
  if (rawC1 >= 85) c1 = 5;
  else if (rawC1 >= 75) c1 = 4;
  else if (rawC1 >= 65) c1 = 3;
  else if (rawC1 >= 55) c1 = 2;
  else c1 = 1;

  // 2. C2: Pengalaman Lapangan (Benefit)
  // >= 5 kali -> 5; 3 - 4 kali -> 4; 1 - 2 kali -> 3; 0 kali -> 1
  const rawC2 = Number(applicant.C2 ?? applicant.c2_mentah ?? 0);
  let c2 = 1;
  if (rawC2 >= 5) c2 = 5;
  else if (rawC2 >= 3) c2 = 4;
  else if (rawC2 >= 1) c2 = 3;
  else c2 = 1;

  // 3. C3: Kemahiran CAPI (Benefit)
  // >= 85 -> 5; 75 - 84.9 -> 4; 65 - 74.9 -> 3; < 65 -> 2
  const rawC3 = Number(applicant.C3 ?? applicant.c3_mentah ?? 0);
  let c3 = 2;
  if (rawC3 >= 85) c3 = 5;
  else if (rawC3 >= 75) c3 = 4;
  else if (rawC3 >= 65) c3 = 3;
  else c3 = 2;

  // 4. C4: Jenjang Pendidikan Terakhir (Benefit)
  // S1 / D4 -> 5; D3 -> 3; SMA / SMK -> 2
  const rawEdu = applicant.pendidikan || applicant.c4_mentah || applicant.C4;
  let c4 = 2;
  if (typeof rawEdu === 'string') {
    const norm = rawEdu.toUpperCase().replace(/\s+/g, '');
    if (norm.includes('S1') || norm.includes('D4') || norm.includes('SARJANA')) {
      c4 = 5;
    } else if (norm.includes('D3') || norm.includes('DIPLOMA')) {
      c4 = 3;
    } else {
      c4 = 2;
    }
  } else {
    const num = Number(rawEdu);
    if (num >= 4) c4 = 5; // Support legacy value 4 (S1) -> 5
    else if (num === 3) c4 = 3;
    else c4 = 2;
  }

  // 5. C5: Jarak Domisili ke Wilayah (Cost)
  // <= 3 km -> 1; 3.1 - 7 km -> 2; 7.1 - 15 km -> 3; 15.1 - 25 km -> 4; > 25 km -> 5
  // Nilai crisp kecil (1) = jarak dekat = terbaik
  const rawC5 = Number(applicant.C5 ?? applicant.c5_mentah ?? 0);
  let c5 = 1;
  if (rawC5 <= 3) c5 = 1;
  else if (rawC5 <= 7) c5 = 2;
  else if (rawC5 <= 15) c5 = 3;
  else if (rawC5 <= 25) c5 = 4;
  else c5 = 5;

  return { C1: c1, C2: c2, C3: c3, C4: c4, C5: c5 };
}

/**
 * Hitung bobot kriteria w_j otomatis dari Tingkat Kepentingan (skala 1-5)
 * Formula PRD 2.1: w_j = Tingkat Kepentingan_j / Sum(Tingkat Kepentingan)
 * 
 * @param {Array} criteria - Array of kriteria [{kode, tingkatKepentingan, ...}]
 * @returns {Array} Kriteria dengan bobot desimal 4 angka di belakang koma
 */
export function calculateWeightsFromPriority(criteria = []) {
  if (!criteria || criteria.length === 0) return [];
  const totalKepentingan = criteria.reduce((sum, c) => sum + Number(c.tingkatKepentingan || 1), 0);
  
  if (totalKepentingan === 0) {
    const equalWeight = Number((1 / criteria.length).toFixed(4));
    return criteria.map(c => ({
      ...c,
      bobot: equalWeight,
      perhitungan: `1 / ${criteria.length}`
    }));
  }

  return criteria.map(c => {
    const k = Number(c.tingkatKepentingan || 1);
    const w = Number((k / totalKepentingan).toFixed(4));
    return {
      ...c,
      bobot: w,
      perhitungan: `${k} / ${totalKepentingan}`
    };
  });
}

/**
 * Validasi total bobot kriteria agar mendekati 1.0 (toleransi pembulatan 4 desimal)
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
    isValid: diff < 0.005, // Toleransi pembulatan 4 desimal (misal 0.2778 + 0.2222 + 0.2222 + 0.1667 + 0.1111 = 1.0000)
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
 * Sesuai PRD Final Bagian 2 & 3:
 * Menghasilkan 4 Dataset Pembuktian Ilmiah:
 * 1. matrixRaw: Data mentah asli pendaftar
 * 2. matrixX: Matriks Keputusan Awal (Data Crisp 1 - 5)
 * 3. matrixR: Matriks Ternormalisasi (4 desimal) beserta Nilai Ekstrim Min/Max
 * 4. matrixWR: Matriks Terbobot (W * R) serta Nilai Preferensi Vi
 * 
 * @param {Array} applicants - Daftar pelamar (data mentah)
 * @param {Array} criteria - Daftar kriteria C1 - C5 beserta bobot dan sifatnya
 * @param {Object} options - { kuotaLolos, kuotaCadangan }
 * @returns {Object} Hasil komputasi transparan
 */
export function calculateSAW(applicants = [], criteria = [], options = {}) {
  const kuotaLolos = Number(options.kuotaLolos ?? 5);
  const kuotaCadangan = Number(options.kuotaCadangan ?? 2);

  if (!applicants || applicants.length === 0 || !criteria || criteria.length === 0) {
    return {
      matrixRaw: [],
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

  // 1. DATA MENTAH (Tabel 1 Dapur SAW)
  const matrixRaw = applicants.map((app, idx) => ({
    id: app.id || idx + 1,
    nik: app.nik || '-',
    nama: app.nama || app.namaLengkap || `Pelamar ${idx + 1}`,
    kecamatan: app.kecamatan || '-',
    pendidikan: app.pendidikan || '-',
    C1: Number(app.C1 ?? app.c1_mentah ?? 0),
    C2: Number(app.C2 ?? app.c2_mentah ?? 0),
    C3: Number(app.C3 ?? app.c3_mentah ?? 0),
    C4: app.pendidikan || app.c4_mentah || 'SMA/SMK',
    C5: Number(app.C5 ?? app.c5_mentah ?? 0)
  }));

  // 2. MATRIKS KEPUTUSAN AWAL X (DATA CRISP 1-5 - PRD 2.2 & 2.3)
  const matrixX = applicants.map((app, idx) => {
    const crisp = convertRawToCrisp(app);
    return {
      id: app.id || idx + 1,
      nik: app.nik || '-',
      nama: app.nama || app.namaLengkap || `Pelamar ${idx + 1}`,
      kecamatan: app.kecamatan || '-',
      pendidikan: app.pendidikan || '-',
      raw: app,
      crisp,
      C1: crisp.C1,
      C2: crisp.C2,
      C3: crisp.C3,
      C4: crisp.C4,
      C5: crisp.C5
    };
  });

  // 3. CARI NILAI EKSTRIM DARI MATRIKS CRISP (X)
  // Kriteria Benefit (C1, C2, C3, C4): Max(x_j)
  // Kriteria Cost (C5): Min(x_j)
  const extremes = {};
  criteria.forEach(c => {
    const kode = c.kode;
    const isCost = c.sifat?.toLowerCase() === 'cost';

    const crispValues = matrixX.map(row => Number(row[kode] || 1));

    extremes[kode] = {
      max: crispValues.length > 0 ? Math.max(...crispValues) : 5,
      min: crispValues.length > 0 ? Math.min(...crispValues) : 1
    };
  });

  // 4. MATRIKS TERNORMALISASI R (PRD 2.3)
  // Benefit: r_ij = x_ij / Max(x_j)
  // Cost:    r_ij = Min(x_j) / x_ij
  const matrixR = matrixX.map((rowX, idx) => {
    const normalized = {};
    const normalizedRaw = {};

    criteria.forEach(c => {
      const kode = c.kode;
      const isBenefit = c.sifat?.toLowerCase() === 'benefit';
      const xVal = Number(rowX[kode] || 1);

      let r = 0;
      if (isBenefit) {
        const maxVal = extremes[kode]?.max || 5;
        r = maxVal === 0 ? 0 : xVal / maxVal;
      } else {
        // Cost (C5 Jarak Domisili)
        // Nilai crisp kecil (1) = terdekat = minVal
        const minVal = extremes[kode]?.min || 1;
        r = xVal === 0 ? 0 : minVal / xVal;
      }

      normalizedRaw[kode] = r;
      normalized[kode] = Number(r.toFixed(4));
    });

    return {
      id: rowX.id,
      nik: rowX.nik,
      nama: rowX.nama,
      kecamatan: rowX.kecamatan,
      raw: rowX.raw,
      crisp: rowX.crisp,
      R: normalized,
      R_raw: normalizedRaw
    };
  });

  // 5. MATRIKS TERBOBOT (W * R) & PERHITUNGAN NILAI PREFERENSI V_i (PRD 2.4)
  // V_i = Sum(w_j * r_ij)
  const matrixWR = matrixR.map((rowR, idx) => {
    const rawApp = rowR.raw;
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
      rawApplicant: {
        ...rawApp,
        c1_mentah: Number(rawApp?.c1_mentah ?? rawApp?.C1 ?? 0),
        c2_mentah: Number(rawApp?.c2_mentah ?? rawApp?.C2 ?? 0),
        c3_mentah: Number(rawApp?.c3_mentah ?? rawApp?.C3 ?? 0),
        c4_mentah: rawApp?.c4_mentah || rawApp?.pendidikan || 'SMA/SMK',
        c5_mentah: Number(rawApp?.c5_mentah ?? rawApp?.C5 ?? 0),
        C1: Number(rawApp?.c1_mentah ?? rawApp?.C1 ?? 0),
        C2: Number(rawApp?.c2_mentah ?? rawApp?.C2 ?? 0),
        C3: Number(rawApp?.c3_mentah ?? rawApp?.C3 ?? 0),
        C4: rawApp?.c4_mentah || rawApp?.pendidikan || 'SMA/SMK',
        C5: Number(rawApp?.c5_mentah ?? rawApp?.C5 ?? 0),
        pendidikan: rawApp?.c4_mentah || rawApp?.pendidikan || 'SMA/SMK'
      },
      crisp: rowR.crisp,
      R: rowR.R,
      WR: weightedRow,
      scoreV: finalScore,
      scoreV_raw: totalVi
    };
  });

  // 6. PERANGKINGAN & TIE-BREAKER (PRD 2.4)
  // Urutan tie-breaker:
  // 1. Nilai preferensi V_i (Descending)
  // 2. Nilai mentah Ujian Kompetensi C1 (Descending)
  // 3. Nilai mentah Pengalaman Lapangan C2 (Descending)
  // 4. Jarak mentah Domisili C5 (Ascending - makin dekat makin prioritas)
  const sorted = [...matrixWR].sort((a, b) => {
    const diff = b.scoreV - a.scoreV;
    if (Math.abs(diff) > 0.0001) {
      return diff;
    }

    // Tie-breaker 1: C1 Mentah
    const c1A = Number(a.rawApplicant?.C1 ?? a.rawApplicant?.c1_mentah ?? 0);
    const c1B = Number(b.rawApplicant?.C1 ?? b.rawApplicant?.c1_mentah ?? 0);
    if (c1B !== c1A) {
      return c1B - c1A;
    }

    // Tie-breaker 2: C2 Mentah
    const c2A = Number(a.rawApplicant?.C2 ?? a.rawApplicant?.c2_mentah ?? 0);
    const c2B = Number(b.rawApplicant?.C2 ?? b.rawApplicant?.c2_mentah ?? 0);
    if (c2B !== c2A) {
      return c2B - c2A;
    }

    // Tie-breaker 3: C5 Jarak Mentah (Ascending)
    const c5A = Number(a.rawApplicant?.C5 ?? a.rawApplicant?.c5_mentah ?? 999);
    const c5B = Number(b.rawApplicant?.C5 ?? b.rawApplicant?.c5_mentah ?? 999);
    return c5A - c5B;
  });

  // 7. PENETAPAN STATUS KUOTA LOLOS & CADANGAN
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

    // Deteksi jika pelamar memiliki nilai kembar dengan pelamar terdekat
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
    matrixRaw,
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
