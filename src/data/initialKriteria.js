/**
 * Data Kriteria Awal Seleksi Calon Mitra Statistik
 * BPS Kabupaten Subang
 */
export const INITIAL_KRITERIA = [
  {
    id: 'C1',
    kode: 'C1',
    nama: 'Nilai Ujian Kompetensi',
    sifat: 'benefit',
    bobot: 0.30,
    keterangan: 'Nilai tes tertulis materi dasar statistik & integritas (skala 0 - 100)',
    min: 0,
    max: 100,
    satuan: 'Poin'
  },
  {
    id: 'C2',
    kode: 'C2',
    nama: 'Rekam Jejak Pengalaman Survei',
    sifat: 'benefit',
    bobot: 0.25,
    keterangan: 'Frekuensi keterlibatan dalam survei/sensus BPS sebelumnya (0 s.d 5+ kali)',
    min: 0,
    max: 10,
    satuan: 'Kali'
  },
  {
    id: 'C3',
    kode: 'C3',
    nama: 'Penguasaan Gadget / CAPI',
    sifat: 'benefit',
    bobot: 0.20,
    keterangan: 'Skor uji coba pengisian kuesioner via aplikasi Android CAPI BPS (skala 0 - 100)',
    min: 0,
    max: 100,
    satuan: 'Poin'
  },
  {
    id: 'C4',
    kode: 'C4',
    nama: 'Jenjang Pendidikan Terakhir',
    sifat: 'benefit',
    bobot: 0.15,
    keterangan: 'Tingkat pendidikan formal (Bobot: SMA/SMK = 2, D3 = 3, D4/S1 = 4)',
    min: 1,
    max: 4,
    satuan: 'Tingkat'
  },
  {
    id: 'C5',
    kode: 'C5',
    nama: 'Jarak Domisili ke Wilayah Tugas',
    sifat: 'cost',
    bobot: 0.10,
    keterangan: 'Jarak tempat tinggal pelamar ke kecamatan/desa target sensus (makin dekat makin baik)',
    min: 0.1,
    max: 100,
    satuan: 'KM'
  }
];

export const PENDIDIKAN_OPTIONS = [
  { label: 'SMA / SMK Sederajat', value: 'SMA/SMK', bobot: 2 },
  { label: 'Diploma Tiga (D3)', value: 'D3', bobot: 3 },
  { label: 'Sarjana (S1 / D4)', value: 'S1', bobot: 4 }
];

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
