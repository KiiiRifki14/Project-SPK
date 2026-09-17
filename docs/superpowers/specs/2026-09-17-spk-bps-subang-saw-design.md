# Desain Teknis Sistem Pendukung Keputusan Seleksi Mitra Statistik BPS Kabupaten Subang Menggunakan Metode Simple Additive Weighting (SAW)

- **Tanggal:** 2026-09-17
- **Pengembang:** Muhammad Rifki Hermaulana (Kelompok 8 - D3 Sistem Informasi, Politeknik Negeri Subang) & AI Assistant
- **Instansi Mitra:** Badan Pusat Statistik (BPS) Kabupaten Subang
- **Metode SPK:** Simple Additive Weighting (SAW)
- **Arsitektur:** Single Page Application (SPA) - React + Vite + Tailwind CSS + Client-Side Persistence (LocalStorage)

---

## 1. Latar Belakang & Tujuan Sistem
BPS Kabupaten Subang secara berkala melakukan rekrutmen mitra statistik lapangan untuk berbagai sensus dan survei (seperti Survei Pertanian, Survei Ekonomi, dan Susenas). Dalam proses rekrutmen tersebut, jumlah pelamar sering kali mencapai ratusan orang sementara kuota yang tersedia terbatas (misalnya 50 kuota lolos). 

Sebelumnya, penentuan kelulusan dihitung secara manual menggunakan spreadsheet atau penilaian subjektif yang rentan bias. Sistem Pendukung Keputusan (SPK) ini dibangun sebagai instrumen analitis yang objektif, matematis, dan transparan berdasarkan metode *Simple Additive Weighting* (SAW) sesuai materi Bab 5 Buku Ajar SPK Politeknik Negeri Subang.

---

## 2. Arsitektur & Teknologi

### 2.1 Tech Stack
- **Framework & Bundler:** React 18 / 19 + Vite
- **Styling:** Tailwind CSS (dengan palet warna resmi BPS: Navy Blue `#0B3C68`, Sky Blue `#00A3E0`, Emerald Green `#10B981`, Amber Gold `#F59E0B`)
- **Icon Library:** Lucide React
- **Spreadsheet Utility:** `xlsx` (SheetJS) untuk import & export data pelamar ke format Excel (.xlsx / .csv)
- **Data Persistence:** Browser `localStorage` terisolasi melalui modul adapter `storageService.js` (memungkinkan transisi mudah ke REST API MySQL di masa depan)

### 2.2 Struktur File Proyek
```text
d:\Project SPK\
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── initialKriteria.js     # Definisi awal C1-C5 & bobot default
│   │   └── initialPelamar.js      # 8 data dummy realistis warga Kabupaten Subang
│   ├── services/
│   │   ├── storageService.js      # Abstraksi akses LocalStorage & helper resetToDefault()
│   │   └── sawCalculator.js       # Logika murni rumus SAW (Matriks X, R, W*R, skor V, tie-breaker)
│   ├── components/
│   │   ├── Navbar.jsx             # Header BPS Subang, profil panitia, role switcher demo
│   │   ├── Sidebar.jsx            # Navigasi 6 modul utama
│   │   ├── Modal.jsx              # Reusable modal dialog untuk form pelamar
│   │   └── Alert.jsx              # Toast notifikasi
│   └── pages/
│       ├── Dashboard.jsx          # Statistik ringkasan, kuota, top score, diagram kecamatan
│       ├── Kriteria.jsx           # Form pengaturan bobot & validasi total bobot = 1.0 (100%)
│       ├── Pelamar.jsx            # CRUD data pelamar, pencarian/filter kecamatan, import/export Excel & data sampel
│       ├── DapurSAW.jsx           # 3 Tabel Transparan Dosen: Matriks X, Matriks R, Matriks W*R
│       ├── Ranking.jsx            # Leaderboard perangkingan, kuota interaktif (Lolos/Cadangan), badge tie-breaker
│       └── Laporan.jsx            # Berita Acara resmi BPS Subang (Kop Surat, No. SK, TTD Kepala BPS)
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-09-17-spk-bps-subang-saw-design.md
```

---

## 3. Spesifikasi Kriteria & Logika Matematika SAW

### 3.1 Kriteria Penilaian
| Kode | Nama Kriteria | Sifat (*Attribute*) | Bobot Awal ($W_j$) | Skala Nilai / Satuan |
| :--- | :--- | :---: | :---: | :--- |
| **C1** | Nilai Ujian Kompetensi | **Benefit** | **0.30** (30%) | Angka 0 – 100 |
| **C2** | Rekam Jejak Pengalaman Survei | **Benefit** | **0.25** (25%) | Frekuensi terlibat survei BPS (0 s.d 5+) |
| **C3** | Penguasaan Gadget / CAPI | **Benefit** | **0.20** (20%) | Nilai uji CAPI Android (0 – 100) |
| **C4** | Jenjang Pendidikan Terakhir | **Benefit** | **0.15** (15%) | Konversi: SMA/SMK = 2, D3 = 3, S1 = 4 |
| **C5** | Jarak Domisili ke Wilayah Tugas | **Cost** | **0.10** (10%) | Jarak dalam KM (minimal 0.1 km, non-zero) |

Total bobot divalidasi: $\sum_{j=1}^{5} W_j = 1.00$.

### 3.2 Tiga Matriks Transparan Dapur SAW
1. **Matriks Keputusan ($X$):**
   $$X = \begin{bmatrix} x_{11} & x_{12} & \dots & x_{1m} \\ x_{21} & x_{22} & \dots & x_{2m} \\ \vdots & \vdots & \ddots & \vdots \\ x_{n1} & x_{n2} & \dots & x_{nm} \end{bmatrix}$$
   Disertai baris ekstrim $\max(x_j)$ untuk kriteria Benefit dan $\min(x_j)$ untuk kriteria Cost.

2. **Matriks Ternormalisasi ($R$):**
   * Untuk kriteria Benefit ($C_1, C_2, C_3, C_4$):
     $$r_{ij} = \frac{x_{ij}}{\max_i(x_{ij})}$$
   * Untuk kriteria Cost ($C_5$ Jarak):
     $$r_{ij} = \frac{\min_i(x_{ij})}{x_{ij}}$$
   * Presisi angka diformat 4 angka di belakang koma.

3. **Matriks Terbobot ($W \times R$) & Nilai Preferensi ($V_i$):**
   $$V_i = \sum_{j=1}^{m} w_j \times r_{ij}$$

### 3.3 Aturan Pemecah Nilai Kembar (*Tie-Breaker*)
Jika ada kandidat dengan nilai preferensi $V_i$ yang sama:
1. **Prioritas 1:** Nilai Ujian Kompetensi ($C_1$) tertinggi.
2. **Prioritas 2:** Frekuensi Pengalaman Survei BPS ($C_2$) terbanyak.
3. **Prioritas 3:** Jarak domisili ($C_5$) terdekat.

---

## 4. Rincian Modul & Fitur Aplikasi

### 4.1 Dashboard
- Kartu Metrik: Total Pelamar, Kuota Lolos, Kuota Cadangan, Nilai Preferensi Tertinggi.
- Kartu Quick-Action: Tombol langsung ke Dapur SAW, Tambah Pelamar, dan Cetak Laporan.
- Diagram Distribusi Kecamatan: Menampilkan visualisasi asal pelamar di Kabupaten Subang (Subang Kota, Pagaden, Jalancagak, Kalijati, dll).

### 4.2 Manajemen Kriteria & Bobot
- Tabel ringkasan kriteria dengan indikator visual *Benefit* (biru) dan *Cost* (oranye).
- Form pengaturan bobot dengan validasi total = 1.0 (100%).
- Tombol "Normalisasi Otomatis" untuk menyesuaikan bobot secara proporsional.

### 4.3 Manajemen Data Pelamar
- Tabel data pelamar lengkap dengan NIK, Nama, Jenis Kelamin, Kecamatan, Pendidikan, dan nilai $C_1 - C_5$.
- Fitur Pencarian instan (nama/NIK) dan Filter Kecamatan.
- Modal Tambah dan Edit pelamar dengan validasi form.
- Tombol **"Muat Data Sampel Subang"** (8 kandidat realistis Subang).
- Tombol **"Reset ke Kondisi Awal"**.
- Fitur **Export Excel (.xlsx)** dan **Import Excel (.xlsx / .csv)**.

### 4.4 Dapur Perhitungan SAW (Auditing Akademik Dosen)
- Tampilan tabbed atau accordion interaktif untuk 3 tabel matriks ($X$, $R$, dan $W \times R$).
- Rumus interaktif ditampilkan di atas tabel dengan penjelasan detail nilai $\max$ dan $\min$.

### 4.5 Hasil Ranking & Rekomendasi
- Tabel Leaderboard Ranking 1 s.d. $N$ berdasarkan nilai preferensi $V_i$.
- Kontrol Kuota Interaktif: Slider / input kuota lolos dan kuota cadangan yang langsung memperbarui pewarnaan baris:
  - Hijau: Lolos Seleksi
  - Oranye/Kuning: Cadangan
  - Abu-abu netral: Tidak Lolos
- Indikator Tie-Breaker jika ada pelamar dengan skor identik.

### 4.6 Cetak Laporan / Berita Acara Resmi BPS Subang
- Format surat resmi siap cetak (Print-friendly CSS `@media print`):
  - Kop Surat Resmi Badan Pusat Statistik Kabupaten Subang (lengkap dengan logo BPS, alamat Jl. Mayjen Sutoyo No. 12 Subang).
  - Judul: Berita Acara Hasil Seleksi Calon Mitra Statistik Lapangan BPS Kabupaten Subang.
  - Tabel rekapitulasi daftar mitra yang dinyatakan Lolos dan Cadangan.
  - Tanda tangan Kepala BPS Kabupaten Subang dan Panitia Seleksi (Muhammad Rifki Hermaulana).

---

## 5. Dataset Bawaan (Warga Kabupaten Subang)
1. **Asep Saepuloh** (NIK: 3213012903980001) - Jalancagak | C1: 88.5, C2: 4, C3: 92.0, C4: 4 (S1), C5: 3.2 km
2. **Siti Nurhaliza** (NIK: 3213021405990002) - Subang Kota | C1: 95.0, C2: 2, C3: 85.0, C4: 4 (S1), C5: 1.5 km
3. **Dadan Ramdani** (NIK: 3213051010000003) - Pagaden | C1: 74.0, C2: 5, C3: 80.0, C4: 3 (D3), C5: 8.5 km
4. **Rina Marlina** (NIK: 3213082201970004) - Kalijati | C1: 82.0, C2: 1, C3: 95.0, C4: 3 (D3), C5: 12.0 km
5. **Budi Haryanto** (NIK: 3213041907010005) - Cisalak | C1: 65.0, C2: 0, C3: 75.0, C4: 2 (SMA), C5: 18.0 km
6. **Dewi Sartika** (NIK: 3213091102960006) - Pamanukan | C1: 91.0, C2: 3, C3: 88.0, C4: 4 (S1), C5: 35.0 km
7. **Tatang Suherman** (NIK: 3213030408990007) - Purwadadi | C1: 78.0, C2: 3, C3: 82.0, C4: 2 (SMA), C5: 14.5 km
8. **Neng Yulia** (NIK: 3213071804000008) - Subang Kota | C1: 89.0, C2: 2, C3: 90.0, C4: 3 (D3), C5: 2.1 km

---

## 6. Rencana Verifikasi & Uji Kualitas
1. **Verifikasi Matematis:** Membandingkan output matriks $R$, perkalian bobot, dan skor $V_i$ sistem dengan perhitungan manual di spreadsheet.
2. **Verifikasi Tie-Breaker:** Memastikan jika ada 2 pelamar dengan skor $V$ sama, pelamar dengan $C_1$ lebih tinggi menempati peringkat atas.
3. **Verifikasi Pembagian Nol:** Memastikan pelamar dengan jarak dekat ($< 0.1$ km) tidak menyebabkan error `NaN` atau `Infinity`.
4. **Verifikasi Import & Export:** Menguji ekspor tabel ke `.xlsx` dan impor kembali.
5. **Verifikasi Cetak:** Memastikan layout cetak di browser rapi, kop surat presisi, dan elemen navigasi (sidebar/navbar) otomatis tersembunyi saat dicetak (`@media print`).
