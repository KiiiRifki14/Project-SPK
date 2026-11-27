/**
 * Data Kriteria Awal & Aturan Konversi Subkriteria Seleksi Calon Mitra Statistik
 * BPS Kabupaten Subang
 * Mengacu pada PRD Final v2.0.0 (Academic Revision)
 */

export const INITIAL_KRITERIA = [
  {
    id: 'C1',
    kode: 'C1',
    nama: 'Nilai Ujian Kompetensi',
    sifat: 'benefit',
    tingkatKepentingan: 5,
    perhitungan: '5 / 18',
    bobot: 0.2778,
    keterangan: 'Nilai tes tertulis materi dasar statistik & integritas (skala 0 - 100)',
    min: 0,
    max: 100,
    satuan: 'Poin'
  },
  {
    id: 'C2',
    kode: 'C2',
    nama: 'Pengalaman Lapangan',
    sifat: 'benefit',
    tingkatKepentingan: 4,
    perhitungan: '4 / 18',
    bobot: 0.2222,
    keterangan: 'Frekuensi keterlibatan dalam survei/sensus BPS sebelumnya (0 s.d 5+ kali)',
    min: 0,
    max: 10,
    satuan: 'Kali'
  },
  {
    id: 'C3',
    kode: 'C3',
    nama: 'Kemahiran CAPI',
    sifat: 'benefit',
    tingkatKepentingan: 4,
    perhitungan: '4 / 18',
    bobot: 0.2222,
    keterangan: 'Skor uji coba pengisian kuesioner via aplikasi Android CAPI BPS (skala 0 - 100)',
    min: 0,
    max: 100,
    satuan: 'Poin'
  },
  {
    id: 'C4',
    kode: 'C4',
    nama: 'Pendidikan Terakhir',
    sifat: 'benefit',
    tingkatKepentingan: 3,
    perhitungan: '3 / 18',
    bobot: 0.1667,
    keterangan: 'Tingkat pendidikan formal (Bobot Crisp: S1/D4 = 5, D3 = 3, SMA/SMK = 2)',
    min: 1,
    max: 5,
    satuan: 'Tingkat'
  },
  {
    id: 'C5',
    kode: 'C5',
    nama: 'Jarak Domisili ke Wilayah',
    sifat: 'cost',
    tingkatKepentingan: 2,
    perhitungan: '2 / 18',
    bobot: 0.1111,
    keterangan: 'Jarak tempat tinggal pelamar ke kecamatan tugas (makin dekat makin baik)',
    min: 0.1,
    max: 100,
    satuan: 'KM'
  }
];

export const PENDIDIKAN_OPTIONS = [
  { label: 'Sarjana (S1 / D4)', value: 'S1', bobot: 5 },
  { label: 'Diploma Tiga (D3)', value: 'D3', bobot: 3 },
  { label: 'SMA / SMK Sederajat', value: 'SMA/SMK', bobot: 2 }
];

/**
 * Spesifikasi Konversi Subkriteria (Data Raw ke Data Crisp 1-5)
 * Sesuai PRD Final Bagian 2.2
 */
export const SUBKRITERIA_RULES = {
  C1: {
    nama: 'Nilai Ujian Kompetensi',
    sifat: 'benefit',
    deskripsi: 'Nilai ujian tertulis dikonversi ke skala crisp 1 - 5',
    rules: [
      { min: 85, max: 100, label: '≥ 85', crisp: 5, keterangan: 'Sangat Baik' },
      { min: 75, max: 84.99, label: '75 – 84.9', crisp: 4, keterangan: 'Baik' },
      { min: 65, max: 74.99, label: '65 – 74.9', crisp: 3, keterangan: 'Cukup' },
      { min: 55, max: 64.99, label: '55 – 64.9', crisp: 2, keterangan: 'Kurang' },
      { min: 0, max: 54.99, label: '< 55', crisp: 1, keterangan: 'Sangat Kurang' }
    ]
  },
  C2: {
    nama: 'Pengalaman Lapangan',
    sifat: 'benefit',
    deskripsi: 'Frekuensi pengalaman survei/sensus BPS',
    rules: [
      { min: 5, max: Infinity, label: '≥ 5 kali', crisp: 5, keterangan: 'Sangat Berpengalaman' },
      { min: 3, max: 4.99, label: '3 – 4 kali', crisp: 4, keterangan: 'Berpengalaman' },
      { min: 1, max: 2.99, label: '1 – 2 kali', crisp: 3, keterangan: 'Cukup Berpengalaman' },
      { min: 0, max: 0.99, label: '0 kali', crisp: 1, keterangan: 'Belum Berpengalaman' }
    ]
  },
  C3: {
    nama: 'Kemahiran CAPI',
    sifat: 'benefit',
    deskripsi: 'Skor kemahiran uji CAPI Android',
    rules: [
      { min: 85, max: 100, label: '≥ 85', crisp: 5, keterangan: 'Sangat Mahir' },
      { min: 75, max: 84.99, label: '75 – 84.9', crisp: 4, keterangan: 'Mahir' },
      { min: 65, max: 74.99, label: '65 – 74.9', crisp: 3, keterangan: 'Cukup' },
      { min: 0, max: 64.99, label: '< 65', crisp: 2, keterangan: 'Dasar / Pemula' }
    ]
  },
  C4: {
    nama: 'Pendidikan Terakhir',
    sifat: 'benefit',
    deskripsi: 'Tingkat pendidikan formal pelamar',
    rules: [
      { value: 'S1', label: 'S1 / D4', crisp: 5, keterangan: 'Sarjana / Diploma Empat' },
      { value: 'D3', label: 'D3', crisp: 3, keterangan: 'Diploma Tiga' },
      { value: 'SMA/SMK', label: 'SMA / SMK', crisp: 2, keterangan: 'Sekolah Menengah Atas/Kejuruan' }
    ]
  },
  C5: {
    nama: 'Jarak Domisili ke Wilayah',
    sifat: 'cost',
    deskripsi: 'Jarak fisik domisili ke wilayah tugas (nilai kecil = dekat = prioritas)',
    rules: [
      { min: 0, max: 3, label: '≤ 3 km', crisp: 1, keterangan: 'Sangat Dekat' },
      { min: 3.01, max: 7, label: '3.1 – 7 km', crisp: 2, keterangan: 'Dekat' },
      { min: 7.01, max: 15, label: '7.1 – 15 km', crisp: 3, keterangan: 'Sedang' },
      { min: 15.01, max: 25, label: '15.1 – 25 km', crisp: 4, keterangan: 'Jauh' },
      { min: 25.01, max: Infinity, label: '> 25 km', crisp: 5, keterangan: 'Sangat Jauh' }
    ]
  }
};

export const KECAMATAN_SUBANG = [
  'Subang Kota',
  'Jalancagak',
  'Pagaden',
  'Kalijati',
  'Cisalak',
  'Pamanukan',
  'Purwadadi',
  'Ciasem',
  'Pabuaran',
  'Cijambe',
  'Kasomalang',
  'Tanjungsiang',
  'Sagalaherang',
  'Serangpanjang',
  'Dawuan',
  'Cipeundeuy',
  'Patokbeusi',
  'Tambakdahan',
  'Binong',
  'Compreng',
  'Blanakan',
  'Sukasari',
  'Legonkulon',
  'Pusakajaya',
  'Pusakanagara',
  'Kipicung',
  'Ciater',
  'Pagaden Barat',
  'Cikaum'
];
