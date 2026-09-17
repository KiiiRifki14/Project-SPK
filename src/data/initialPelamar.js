/**
 * Dataset Awal 8 Kandidat Pelamar Mitra Statistik BPS Kabupaten Subang
 * Berdasarkan spesifikasi teknis kasus nyata wilayah Subang
 */
export const INITIAL_PELAMAR = [
  {
    id: 'PLM-001',
    nik: '3213012903980001',
    nama: 'Asep Saepuloh',
    jenisKelamin: 'L',
    noHp: '081223344551',
    kecamatan: 'Jalancagak',
    pendidikan: 'S1',
    C1: 88.5, // Nilai Ujian (0-100)
    C2: 4,    // Riwayat Survei (kali)
    C3: 92.0, // Skor Uji CAPI (0-100)
    C4: 4,    // Skor Pendidikan (S1=4)
    C5: 3.2   // Jarak Domisili ke Tugas (KM)
  },
  {
    id: 'PLM-002',
    nik: '3213021405990002',
    nama: 'Siti Nurhaliza',
    jenisKelamin: 'P',
    noHp: '081399887712',
    kecamatan: 'Subang Kota',
    pendidikan: 'S1',
    C1: 95.0,
    C2: 2,
    C3: 85.0,
    C4: 4,
    C5: 1.5
  },
  {
    id: 'PLM-003',
    nik: '3213051010000003',
    nama: 'Dadan Ramdani',
    jenisKelamin: 'L',
    noHp: '085711223344',
    kecamatan: 'Pagaden',
    pendidikan: 'D3',
    C1: 74.0,
    C2: 5,
    C3: 80.0,
    C4: 3,
    C5: 8.5
  },
  {
    id: 'PLM-004',
    nik: '3213082201970004',
    nama: 'Rina Marlina',
    jenisKelamin: 'P',
    noHp: '087855667788',
    kecamatan: 'Kalijati',
    pendidikan: 'D3',
    C1: 82.0,
    C2: 1,
    C3: 95.0,
    C4: 3,
    C5: 12.0
  },
  {
    id: 'PLM-005',
    nik: '3213041907010005',
    nama: 'Budi Haryanto',
    jenisKelamin: 'L',
    noHp: '089633445566',
    kecamatan: 'Cisalak',
    pendidikan: 'SMA/SMK',
    C1: 65.0,
    C2: 0,
    C3: 75.0,
    C4: 2,
    C5: 18.0
  },
  {
    id: 'PLM-006',
    nik: '3213091102960006',
    nama: 'Dewi Sartika',
    jenisKelamin: 'P',
    noHp: '081299001122',
    kecamatan: 'Pamanukan',
    pendidikan: 'S1',
    C1: 91.0,
    C2: 3,
    C3: 88.0,
    C4: 4,
    C5: 35.0
  },
  {
    id: 'PLM-007',
    nik: '3213030408990007',
    nama: 'Tatang Suherman',
    jenisKelamin: 'L',
    noHp: '082144556677',
    kecamatan: 'Purwadadi',
    pendidikan: 'SMA/SMK',
    C1: 78.0,
    C2: 3,
    C3: 82.0,
    C4: 2,
    C5: 14.5
  },
  {
    id: 'PLM-008',
    nik: '3213071804000008',
    nama: 'Neng Yulia',
    jenisKelamin: 'P',
    noHp: '085277889900',
    kecamatan: 'Subang Kota',
    pendidikan: 'D3',
    C1: 89.0,
    C2: 2,
    C3: 90.0,
    C4: 3,
    C5: 2.1
  }
];

export const INITIAL_PENGATURAN = {
  kuotaLolos: 5,
  kuotaCadangan: 2,
  namaPeriode: 'Survei Pertanian & Ekonomi BPS Subang 2026',
  nomorSK: 'B-045/32130/VS.100/2026',
  tanggalSK: new Date().toISOString().split('T')[0],
  kepalaBpsNama: 'Ir. H. Dedi Suryadi, M.M.',
  kepalaBpsNip: '19740512 199803 1 002',
  ketuaPanitiaNama: 'Muhammad Rifki Hermaulana',
  instansi: 'Badan Pusat Statistik Kabupaten Subang',
  alamatInstansi: 'Jl. Mayjen Sutoyo No. 12, Karanganyar, Kec. Subang, Kabupaten Subang, Jawa Barat 41211'
};
