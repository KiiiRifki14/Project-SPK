# Product Requirement Document (PRD)
## Project: SPK Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang
- **Version:** 1.0.0
- **Target Release:** Q3 2026
- **Architecture:** Client-Centric SPA (React + Vite + Tailwind CSS + LocalStorage Engine)
- **Design Paradigm:** Enterprise Bureaucracy UI (Official BPS Palette & Typography)

---

## 1. Executive Summary & Goals
### 1.1 Objective
Membangun aplikasi Sistem Pendukung Keputusan (SPK) berbasis Single Page Application (SPA) untuk mengotomatisasi proses seleksi dan perankingan calon mitra statistik lapangan Badan Pusat Statistik (BPS) Kabupaten Subang menggunakan algoritma Simple Additive Weighting (SAW) sesuai kaidah Bab 5 Buku Ajar SPK Politeknik Negeri Subang.

### 1.2 Success Metrics
- **Akurasi Perhitungan:** 100% presisi matematis pada matriks normalisasi (R) dan skor preferensi (V) tanpa deviasi pembagian nol.
- **Kecepatan Render:** Komputasi ulang reaktif seketika (< 16ms) saat pengguna menggeser slider kuota kelulusan atau menyimulasikan pembobotan kriteria.
- **Interoperabilitas Data:** Mampu melakukan parsing dan ekspor file spreadsheet (.xlsx dan .csv) dengan skema kolom yang tervalidasi ketat.
- **Standar Cetak:** Format cetak Berita Acara beresolusi tinggi, bebas artefak web, dan mematuhi tata letak naskah dinas resmi instansi pemerintah.

---

## 2. User Roles & Workflows
### 2.1 Personas
1. **Panitia Rekrutmen / Tim Seleksi (User Aktif):** Melakukan input berkas pelamar, mengunggah rekap Excel, memverifikasi kriteria, memantau transparansi matriks, dan menerbitkan Berita Acara.
2. **Kepala BPS Kabupaten Subang / Dosen Penguji (Auditor):** Meninjau transparansi perhitungan 3 tabel matriks SAW dan mengotorisasi hasil penetapan kelulusan.

### 2.2 Primary User Flow

```

[Buka Dashboard]
└──> [Cek/Ubah Bobot Kriteria (Validasi ΣW = 1.0)]
└──> [Kelola Data Pelamar (Input Manual / Upload Excel / Load Sample Subang)]
└──> [Audit Dapur Perhitungan SAW (Inspeksi Matriks X, R, W*R)]
└──> [Tinjau Hasil Perangkingan (Atur Slider Kuota Lolos/Cadangan)]
└──> [Cetak Dokumen Berita Acara Resmi BPS]

```

---

## 3. Technical Stack & Dependencies
- **Runtime:** Node.js (v18+ / v20+)
- **Build Tool:** Vite
- **UI Framework:** React 18 / 19
- **CSS Architecture:** Tailwind CSS v3 dengan konfigurasi warna custom:
  - `bps-navy`: `#0B3C68` (Primary Brand & Sidebar)
  - `bps-blue`: `#00A3E0` (Action Buttons & Badges)
  - `bps-emerald`: `#10B981` (Status Lolos / Indikator Benefit)
  - `bps-amber`: `#F59E0B` (Status Cadangan / Indikator Cost)
  - `bps-slate`: `#F8FAFC` (Background Layout)
- **Icons:** `lucide-react`
- **Excel Engine:** `xlsx` (SheetJS)
- **Persistence Layer:** Web Storage API (`localStorage`) dengan Adapter Pattern (`storageService.js`)

---

## 4. Mathematical Engine Specifications (SAW Core)

### 4.1 Parameter Kriteria
| Kode | Nama Kriteria | Tipe | Bobot Default ($w_j$) | Skala Nilai | Penanganan Khusus |
| :---: | :--- | :---: | :---: | :---: | :--- |
| C1 | Nilai Tes Kompetensi | Benefit | 0.30 | 0.0 – 100.0 | Float clamp [0, 100] |
| C2 | Pengalaman Survei BPS | Benefit | 0.25 | Integer $\ge$ 0 | Satuan frekuensi survei |
| C3 | Penguasaan CAPI / Gadget | Benefit | 0.20 | 0.0 – 100.0 | Float clamp [0, 100] |
| C4 | Jenjang Pendidikan | Benefit | 0.15 | Enum {2, 3, 4} | SMA/SMK=2, D3=3, S1=4 |
| C5 | Jarak Domisili ke Tugas | Cost | 0.10 | Kilometer (KM) | Clamp minimum: $\max(0.1, \text{input})$ |

### 4.2 Aturan Normalisasi Matriks ($R$)
Diberikan himpunan alternatif $A = \{A_1, A_2, \dots, A_m\}$ dan nilai kriteria $x_{ij}$:
- Untuk Kriteria Benefit ($j \in \{C_1, C_2, C_3, C_4\}$):
  $$r_{ij} = \frac{x_{ij}}{\max_{k=1}^m (x_{kj})}$$
  *Edge case:* Jika $\max(x_{kj}) = 0$, maka $r_{ij} = 0$.
- Untuk Kriteria Cost ($j \in \{C_5\}$):
  $$r_{ij} = \frac{\min_{k=1}^m (x_{kj})}{x_{ij}}$$
  *Division-by-zero safeguard:* Jika $x_{ij} \le 0$, tetapkan $x_{ij} = 0.1$.

### 4.3 Nilai Preferensi Akhir ($V_i$)
$$V_i = \sum_{j=1}^5 (w_j \times r_{ij})$$
Format luaran visual: 4 digit desimal (contoh: `0.8742`).

### 4.4 Algoritma Tie-Breaker (Penanganan Skor Kembar)
Jika terdapat pelamar dengan nilai $V_i$ identik hingga presisi toleransi $10^{-6}$, penentuan ranking wajib dipecahkan dengan urutan prioritas:
1. $x_{i, C1}$ (Nilai Tes Kompetensi) lebih tinggi.
2. $x_{i, C2}$ (Pengalaman Survei) lebih banyak.
3. $x_{i, C5}$ (Jarak Domisili) lebih kecil/dekat.
4. Jika tetap identik, urutkan berdasarkan NIK secara alfabetis (*stable deterministic sort*).

---

## 5. Functional Requirements (FR)

### Module 1: Dashboard (`Dashboard.jsx`)
- **FR-1.1:** Menampilkan 4 kartu ringkasan: Total Pelamar, Kuota Lolos, Kuota Cadangan, dan Skor Tertinggi ($V_{max}$).
- **FR-1.2:** Menampilkan diagram progresif batang/distribusi pelamar berdasarkan asal 30 Kecamatan di Kabupaten Subang.
- **FR-1.3:** Menyediakan tombol aksi cepat (*Quick Actions*) menuju Dapur SAW, Tambah Pelamar, dan Cetak Berita Acara.

### Module 2: Manajemen Kriteria (`Kriteria.jsx`)
- **FR-2.1:** Menampilkan tabel kriteria lengkap dengan status sifat (*Benefit* / *Cost*).
- **FR-2.2:** Menyediakan input bobot interaktif. Sistem wajib melakukan validasi:
  - Error state jika $\sum w_j \ne 1.00$ (tampilkan indikator merah dan nonaktifkan tombol simpan).
- **FR-2.3:** Menyediakan tombol **"Normalisasi Otomatis"** yang membagi setiap bobot dengan total kumulatif sehingga jumlahnya menjadi tepat 1.00.

### Module 3: Manajemen Data Pelamar (`Pelamar.jsx`)
- **FR-3.1:** Menyajikan tabel data pelamar dengan kolom: NIK, Nama Lengkap, JK, No HP, Kecamatan, Pendidikan, C1, C2, C3, C4, C5, dan tombol Aksi.
- **FR-3.2:** Menyediakan form modal Tambah dan Edit pelamar dengan validasi form (NIK 16 digit, nama wajib diisi, nilai numerik valid).
- **FR-3.3:** Fitur Pencarian instan (berdasarkan Nama atau NIK) dan Filter Dropdown berdasarkan Kecamatan di Kabupaten Subang.
- **FR-3.4:** Tombol **"Muat Sampel Subang"** untuk mengisi data 8 kandidat realistis Kabupaten Subang.
- **FR-3.5:** Tombol **"Reset Data"** untuk mengosongkan atau mengembalikan ke dataset default setelah konfirmasi dialog.
- **FR-3.6 (Import/Export Excel):**
  - **Export:** Mengonversi data pelamar ke berkas `.xlsx` terstruktur menggunakan pustaka `xlsx`.
  - **Import:** Membaca file `.xlsx` atau `.csv`, melakukan validasi header kolom, dan melakukan *merge* / penambahan data secara aman.

### Module 4: Dapur Hitung SAW (`DapurSAW.jsx`)
- **FR-4.1:** Menampilkan **Tabel 1: Matriks Keputusan Awal ($X$)** lengkap dengan baris ringkasan nilai $\max(x_j)$ dan $\min(x_j)$ di baris paling bawah.
- **FR-4.2:** Menampilkan **Tabel 2: Matriks Normalisasi ($R$)** dengan penjelasan rumus benefit/cost di bagian header tabel.
- **FR-4.3:** Menampilkan **Tabel 3: Matriks Terbobot ($W \times R$)** yang memperlihatkan hasil perkalian $w_j \times r_{ij}$ per sel dan kolom total Nilai Preferensi ($V_i$).

### Module 5: Hasil Perangkingan (`Ranking.jsx`)
- **FR-5.1:** Menampilkan tabel *leaderboard* terurut dari ranking 1 hingga $N$.
- **FR-5.2 (Kontrol Kuota Interaktif):**
  - Kontrol input/slider untuk Kuota Lolos (default: 5) dan Kuota Cadangan (default: 2).
  - Pewarnaan baris otomatis:
    - Peringkat $1 \le \text{rank} \le \text{Kuota Lolos}$: Lencana Hijau ("Lolos Seleksi").
    - Peringkat $\text{Kuota Lolos} < \text{rank} \le (\text{Kuota Lolos} + \text{Kuota Cadangan})$: Lencana Kuning/Oranye ("Cadangan").
    - Peringkat selebihnya: Lencana Abu-abu ("Tidak Lolos").
- **FR-5.3:** Menampilkan badge khusus `Tie-Breaker Applied` jika peringkat ditentukan melalui mekanisme pemecah skor kembar.

### Module 6: Cetak Berita Acara (`Laporan.jsx`)
- **FR-6.1:** Merender layout dokumen resmi berstandar naskah dinas:
  - Kop Surat resmi Badan Pusat Statistik Kabupaten Subang (Alamat: Jl. Mayjen Sutoyo No. 12, Subang 41211).
  - Nomor Surat Keputusan, Judul Berita Acara, dan Pembukaan Formal.
  - Tabel rekapitulasi nama-nama yang dinyatakan Lolos Seleksi dan Cadangan.
  - Blok tanda tangan: Kepala BPS Kabupaten Subang dan Ketua Panitia Seleksi (Muhammad Rifki Hermaulana).
- **FR-6.2 (Print Optimization):**
  - Mengimplementasikan CSS `@media print` untuk menyembunyikan Navbar, Sidebar, tombol aksi, dan scrollbar.
  - Memastikan seluruh dokumen muat rapi dalam ukuran kertas A4 tanpa terpotong (*page-break* yang bersih).

---

## 6. Data Schema & Persistence Specifications

### 6.1 LocalStorage Keys
1. `spk_bps_kriteria`: Array of objects kriteria.
2. `spk_bps_pelamar`: Array of objects pelamar.
3. `spk_bps_config`: Object konfigurasi kuota dan metadata instansi.

### 6.2 Data Model Definitions (TypeScript Definition Format)
```typescript
interface Kriteria {
  id: string;          // 'C1' | 'C2' | 'C3' | 'C4' | 'C5'
  nama: string;        // 'Nilai Tes Kompetensi', dll.
  sifat: 'benefit' | 'cost';
  bobot: number;       // e.g. 0.30
  keterangan: string;
}

interface Pelamar {
  id: string;          // UUID or timestamp string
  nik: string;         // 16-digit string
  nama: string;
  jk: 'L' | 'P';
  noHp: string;
  kecamatan: string;   // e.g. 'Subang Kota', 'Kalijati', 'Pagaden'
  pendidikan: 'SMA/SMK' | 'D3' | 'S1';
  c1: number;          // Float [0 - 100]
  c2: number;          // Integer [0 - N]
  c3: number;          // Float [0 - 100]
  c4: number;          // Derived from pendidikan: SMA=2, D3=3, S1=4
  c5: number;          // Float (KM, min 0.1)
}

interface SystemConfig {
  kuotaLolos: number;
  kuotaCadangan: number;
  namaKepalaBps: string;
  nipKepalaBps: string;
  namaKetuaPanitia: string;
  periodeSurvei: string;
}

```

---

## 7. Import/Export Schema Specification

Format kolom pada file Excel/CSV wajib mematuhi aturan penamaan berikut:

| Nama Header Kolom | Tipe Data | Wajib | Contoh Nilai |
| --- | --- | --- | --- |
| `NIK` | String (16 digit) | Ya | `3213012903980001` |
| `Nama Lengkap` | String | Ya | `Asep Saepuloh` |
| `Jenis Kelamin` | String (L/P) | Ya | `L` |
| `No HP` | String | Tidak | `081234567890` |
| `Kecamatan` | String | Ya | `Jalancagak` |
| `Pendidikan` | Enum (SMA/D3/S1) | Ya | `S1` |
| `Nilai Tes (C1)` | Numerik (0-100) | Ya | `88.5` |
| `Pengalaman Survei (C2)` | Integer ($\ge$ 0) | Ya | `4` |
| `Skor CAPI (C3)` | Numerik (0-100) | Ya | `92` |
| `Jarak KM (C5)` | Numerik (> 0) | Ya | `3.2` |

*Catatan untuk Parser:* Nilai $C_4$ otomatis diisi sistem berdasarkan pemetaan kolom `Pendidikan`.

---

## 8. Non-Functional Requirements & Security

* **NFR-1 (Client-Side Isolation):** Seluruh proses perhitungan dan parsing berkas dieksekusi di sisi klien; tidak ada data sensitif kependudukan (NIK dan No HP) yang dikirim ke peladen eksternal.
* **NFR-2 (Resilience & Error Handling):** Apabila data `localStorage` rusak atau tidak valid (*JSON parse error*), sistem wajib menangkap galat tersebut dan menginisialisasi ulang data ke *default state* tanpa menyebabkan aplikasi *crash* (layar putih).
* **NFR-3 (Accessibility & Visual Contrast):** Rasio kontras teks terhadap latar belakang wajib memenuhi standar WCAG 2.1 Level AA untuk keterbacaan optimal.

---

## 9. Verification & Acceptance Criteria

1. **Verifikasi Matematis:** Output matriks $X$, $R$, $W \times R$, dan nilai preferensi $V_i$ pada 8 dataset sampel bawaan wajib menghasilkan skor identik dengan perhitungan spreadsheet acuan Bab 5 Buku Ajar SPK Polsub.
2. **Uji Kasus Ekstrim:**
* Input $C_5 = 0$ km otomatis disanitasi menjadi $0.1$ km (menghindari error `Infinity`).
* Kuota lolos melebihi total pelamar tidak menyebabkan error logika (*out of bounds*).


3. **Uji Cetak Peramban:** Tampilan pratinjau cetak (`Ctrl + P`) di peramban Google Chrome / Microsoft Edge menampilkan dokumen Berita Acara bersih tanpa elemen sidebar atau navbar.

```

---

Kedua dokumen di atas sudah dipisahkan secara tegas: **Dokumen 1** siap kamu gunakan untuk penyusunan laporan tertulis maupun bahan presentasi di depan dosen pengampu, sedangkan **Dokumen 2 (`PRD.md`)** siap kamu serahkan ke AI Developer untuk menjaga konsistensi arsitektur teknis sistem.

Bagian mana yang ingin kamu bahas atau sesuaikan lebih lanjut untuk persiapan sidang konsultasi minggu depan?

```