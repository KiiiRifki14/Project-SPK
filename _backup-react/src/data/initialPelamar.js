/**
 * Dataset Awal 8 Kandidat Pelamar Mitra Statistik BPS Kabupaten Subang
 * Berdasarkan spesifikasi teknis kasus nyata wilayah Subang
 * Mengacu pada PRD Final v2.0.0 (Schema Data Mentah Murni Tanpa C4 Numerik)
 */
export const INITIAL_PELAMAR = [
  {
    id: 'PLM-001',
    nik: '3213012903980001',
    nama: 'Asep Saepuloh',
    jenisKelamin: 'L',
    noHp: '081223344551',
    kecamatan: 'Jalancagak',
    c1_mentah: 88.5, // Nilai Ujian (0-100) -> Crisp 5 (>=85)
    c2_mentah: 4,    // Riwayat Survei (kali) -> Crisp 4 (3-4 kali)
    c3_mentah: 92.0, // Skor Uji CAPI (0-100) -> Crisp 5 (>=85)
    c4_mentah: 'S1', // Pendidikan formal -> Crisp 5 (S1/D4)
    c5_mentah: 3.2,  // Jarak Domisili (KM) -> Crisp 2 (3.1-7 km)
    // Fallback getter aliases
    pendidikan: 'S1',
    C1: 88.5,
    C2: 4,
    C3: 92.0,
    C5: 3.2
  },
  {
    id: 'PLM-002',
    nik: '3213021405990002',
    nama: 'Siti Nurhaliza',
    jenisKelamin: 'P',
    noHp: '081399887712',
    kecamatan: 'Subang Kota',
    c1_mentah: 95.0, // Crisp 5
    c2_mentah: 2,    // Crisp 3 (1-2 kali)
    c3_mentah: 85.0, // Crisp 5
    c4_mentah: 'S1', // Crisp 5
    c5_mentah: 1.5,  // Crisp 1 (<=3 km)
    pendidikan: 'S1',
    C1: 95.0,
    C2: 2,
    C3: 85.0,
    C5: 1.5
  },
  {
    id: 'PLM-003',
    nik: '3213051010000003',
    nama: 'Dadan Ramdani',
    jenisKelamin: 'L',
    noHp: '085711223344',
    kecamatan: 'Pagaden',
    c1_mentah: 74.0, // Crisp 3 (65-74.9)
    c2_mentah: 5,    // Crisp 5 (>=5 kali)
    c3_mentah: 80.0, // Crisp 4 (75-84.9)
    c4_mentah: 'D3', // Crisp 3
    c5_mentah: 8.5,  // Crisp 3 (7.1-15 km)
    pendidikan: 'D3',
    C1: 74.0,
    C2: 5,
    C3: 80.0,
    C5: 8.5
  },
  {
    id: 'PLM-004',
    nik: '3213082201970004',
    nama: 'Rina Marlina',
    jenisKelamin: 'P',
    noHp: '087855667788',
    kecamatan: 'Kalijati',
    c1_mentah: 82.0, // Crisp 4
    c2_mentah: 1,    // Crisp 3
    c3_mentah: 95.0, // Crisp 5
    c4_mentah: 'D3', // Crisp 3
    c5_mentah: 12.0, // Crisp 3
    pendidikan: 'D3',
    C1: 82.0,
    C2: 1,
    C3: 95.0,
    C5: 12.0
  },
  {
    id: 'PLM-005',
    nik: '3213041907010005',
    nama: 'Budi Haryanto',
    jenisKelamin: 'L',
    noHp: '089633445566',
    kecamatan: 'Cisalak',
    c1_mentah: 65.0, // Crisp 3
    c2_mentah: 0,    // Crisp 1 (0 kali)
    c3_mentah: 75.0, // Crisp 4
    c4_mentah: 'SMA/SMK', // Crisp 2
    c5_mentah: 18.0, // Crisp 4 (15.1-25 km)
    pendidikan: 'SMA/SMK',
    C1: 65.0,
    C2: 0,
    C3: 75.0,
    C5: 18.0
  },
  {
    id: 'PLM-006',
    nik: '3213091102960006',
    nama: 'Dewi Sartika',
    jenisKelamin: 'P',
    noHp: '081299001122',
    kecamatan: 'Pamanukan',
    c1_mentah: 91.0, // Crisp 5
    c2_mentah: 3,    // Crisp 4
    c3_mentah: 88.0, // Crisp 5
    c4_mentah: 'S1', // Crisp 5
    c5_mentah: 35.0, // Crisp 5 (>25 km)
    pendidikan: 'S1',
    C1: 91.0,
    C2: 3,
    C3: 88.0,
    C5: 35.0
  },
  {
    id: 'PLM-007',
    nik: '3213030408990007',
    nama: 'Tatang Suherman',
    jenisKelamin: 'L',
    noHp: '082144556677',
    kecamatan: 'Purwadadi',
    c1_mentah: 78.0, // Crisp 4
    c2_mentah: 3,    // Crisp 4
    c3_mentah: 82.0, // Crisp 4
    c4_mentah: 'SMA/SMK', // Crisp 2
    c5_mentah: 14.5, // Crisp 3
    pendidikan: 'SMA/SMK',
    C1: 78.0,
    C2: 3,
    C3: 82.0,
    C5: 14.5
  },
  {
    id: 'PLM-008',
    nik: '3213071804000008',
    nama: 'Neng Yulia',
    jenisKelamin: 'P',
    noHp: '085277889900',
    kecamatan: 'Subang Kota',
    c1_mentah: 89.0, // Crisp 5
    c2_mentah: 2,    // Crisp 3
    c3_mentah: 90.0, // Crisp 5
    c4_mentah: 'D3', // Crisp 3
    c5_mentah: 2.1,  // Crisp 1 (<=3 km)
    pendidikan: 'D3',
    C1: 89.0,
    C2: 2,
    C3: 90.0,
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

export const INITIAL_CONFIG = INITIAL_PENGATURAN;
