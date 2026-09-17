# SPK Seleksi Mitra Statistik BPS Kabupaten Subang Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web lengkap Sistem Pendukung Keputusan (SPK) Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang berbasis metode Simple Additive Weighting (SAW) dengan arsitektur React + Vite + Tailwind CSS + LocalStorage.

**Architecture:** Single Page Application (SPA) modular dengan layer pemisahan jelas antara Data (`src/data/`), Service & Storage Adapter (`src/services/`), State Management & Core UI (`src/components/`), dan 6 Halaman Modul Utama (`src/pages/`). Data tersimpan di browser LocalStorage dengan fitur Reset Data Sampel Subang & Import/Export Excel.

**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide-React, SheetJS (`xlsx`), Vitest (untuk unit testing logika SAW).

---

### File Structure Map
- `package.json`: Definisi dependensi & skrip dev, build, test.
- `vite.config.js`: Konfigurasi bundler Vite & Vitest.
- `tailwind.config.js`: Konfigurasi warna resmi BPS (#0B3C68, #00A3E0, emerald, amber).
- `postcss.config.js`: Autoprefixer & Tailwind.
- `index.html`: Judul sistem, favicon BPS, dan font Inter.
- `src/index.css`: Tailwind directive & `@media print` styling untuk Berita Acara.
- `src/data/initialKriteria.js`: Data kriteria C1 - C5 & bobot default.
- `src/data/initialPelamar.js`: 8 data pelamar dummy realistis warga Kabupaten Subang.
- `src/services/storageService.js`: Helper CRUD LocalStorage & `resetToDefault()`.
- `src/services/sawCalculator.js`: Logika komputasi SAW (Matriks X, R, W*R, Tie-Breaker, Kuota).
- `src/services/__tests__/sawCalculator.test.js`: Unit test komputasi SAW.
- `src/components/Navbar.jsx`: Header BPS Subang, user panitia (Muhammad Rifki), switch role demo.
- `src/components/Sidebar.jsx`: Menu 6 modul navigasi dengan badge & icon Lucide.
- `src/components/Modal.jsx`: Reusable modal dialog untuk form pelamar.
- `src/components/Alert.jsx`: Toast notifikasi.
- `src/pages/Dashboard.jsx`: Ringkasan statistik, kuota, top rank, grafik persebaran kecamatan.
- `src/pages/Kriteria.jsx`: Form manajemen bobot kriteria, validasi total = 1.0, auto-normalize.
- `src/pages/Pelamar.jsx`: CRUD pelamar, filter/search kecamatan, import/export Excel, muat sampel Subang.
- `src/pages/DapurSAW.jsx`: 3 Tabel Transparan Dosen: Matriks Keputusan (X), Normalisasi (R), Perkalian (W*R).
- `src/pages/Ranking.jsx`: Leaderboard ranking, kuota interaktif lolos/cadangan, badge tie-breaker.
- `src/pages/Laporan.jsx`: Pratinjau & cetak Berita Acara resmi BPS Subang berkop surat resmi.
- `src/App.jsx`: State global, navigasi antar halaman, dan integrasi notifikasi.

---

### Task 1: Scaffolding Proyek & Konfigurasi Build/Style
**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.jsx`

- [ ] **Step 1: Inisialisasi `package.json` dengan dependensi lengkap**
- [ ] **Step 2: Buat konfigurasi `vite.config.js` (React & Vitest environment)**
- [ ] **Step 3: Buat `tailwind.config.js` dengan palet resmi BPS (`bps-navy`, `bps-blue`, `bps-light`, dll)**
- [ ] **Step 4: Buat `postcss.config.js` dan `src/index.css` dengan print styling**
- [ ] **Step 5: Buat `index.html` dan `src/main.jsx`**
- [ ] **Step 6: Jalankan `npm install` dan verifikasi bahwa file konfigurasi valid**
- [ ] **Step 7: Commit perubahan struktur dasar proyek**

---

### Task 2: Data Awal Subang & Storage Service Layer
**Files:**
- Create: `src/data/initialKriteria.js`
- Create: `src/data/initialPelamar.js`
- Create: `src/services/storageService.js`
- Create: `src/services/__tests__/storageService.test.js`

- [ ] **Step 1: Buat dataset kriteria awal C1 - C5 (`src/data/initialKriteria.js`)**
- [ ] **Step 2: Buat 8 data kandidat pelamar realistis Kabupaten Subang (`src/data/initialPelamar.js`)**
- [ ] **Step 3: Buat `src/services/storageService.js` dengan fallback auto-init dan fungsi `resetToDefault()`**
- [ ] **Step 4: Buat unit test `storageService.test.js` untuk memastikan get, set, dan reset berfungsi**
- [ ] **Step 5: Jalankan test dengan `npx vitest run src/services/__tests__/storageService.test.js`**
- [ ] **Step 6: Commit modul dataset dan storage service**

---

### Task 3: Algoritma & Kalkulator Matematika SAW
**Files:**
- Create: `src/services/sawCalculator.js`
- Create: `src/services/__tests__/sawCalculator.test.js`

- [ ] **Step 1: Tulis unit test komprehensif untuk rumus Benefit, Cost C5, pembagian nol, dan Tie-Breaker**
- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan (Red phase)**
- [ ] **Step 3: Tulis implementasi lengkap `sawCalculator.js` (Matriks X, R, W*R, skor V, Tie-Breaker, Kuota Lolos/Cadangan)**
- [ ] **Step 4: Jalankan test untuk memverifikasi kelulusan 100% (Green phase)**
- [ ] **Step 5: Commit modul kalkulator SAW**

---

### Task 4: Komponen Inti UI (Navbar, Sidebar, Modal, Alert, App Layout)
**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Sidebar.jsx`
- Create: `src/components/Modal.jsx`
- Create: `src/components/Alert.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Buat komponen `Navbar.jsx` (Brand BPS Subang, user Muhammad Rifki, indikator periode)**
- [ ] **Step 2: Buat komponen `Sidebar.jsx` (Navigasi 6 modul dengan icon Lucide)**
- [ ] **Step 3: Buat reusable `Modal.jsx` dan `Alert.jsx`**
- [ ] **Step 4: Buat `App.jsx` yang mengatur state navigasi aktif, data kriteria & pelamar, serta modal/alert**
- [ ] **Step 5: Uji render dasar pada Vite dev server**
- [ ] **Step 6: Commit komponen inti antarmuka**

---

### Task 5: Halaman Dashboard & Halaman Manajemen Kriteria
**Files:**
- Create: `src/pages/Dashboard.jsx`
- Create: `src/pages/Kriteria.jsx`

- [ ] **Step 1: Bangun `Dashboard.jsx` (Statistik total pelamar, kuota, top score, diagram bar kecamatan, kartu alur SPK)**
- [ ] **Step 2: Bangun `Kriteria.jsx` (Tabel bobot C1-C5, edit bobot, validasi total = 1.0, tombol normalisasi otomatis)**
- [ ] **Step 3: Hubungkan perubahan bobot ke storageService dan auto-recalculate**
- [ ] **Step 4: Verifikasi tampilan dan fungsionalitas di browser**
- [ ] **Step 5: Commit modul Dashboard & Kriteria**

---

### Task 6: Halaman Manajemen Pelamar (CRUD, Filter, Import/Export Excel)
**Files:**
- Create: `src/pages/Pelamar.jsx`

- [ ] **Step 1: Buat antarmuka tabel pelamar dengan pencarian nama/NIK dan dropdown filter kecamatan**
- [ ] **Step 2: Buat form modal Tambah & Edit pelamar dengan konversi otomatis skor pendidikan (SMA=2, D3=3, S1=4)**
- [ ] **Step 3: Pasang tombol aksi Hapus dengan konfirmasi modal**
- [ ] **Step 4: Implementasikan tombol "Muat Data Sampel Subang" dan "Reset ke Kondisi Awal"**
- [ ] **Step 5: Implementasikan Export ke Excel (.xlsx) dan Import dari Excel (.xlsx/.csv) menggunakan `xlsx`**
- [ ] **Step 6: Verifikasi seluruh interaksi CRUD pelamar**
- [ ] **Step 7: Commit modul Pelamar**

---

### Task 7: Halaman Dapur SAW (3 Tabel Matriks Transparan Dosen)
**Files:**
- Create: `src/pages/DapurSAW.jsx`

- [ ] **Step 1: Buat tampilan Header Dapur SAW dengan penjelas rumus matematis Benefit & Cost**
- [ ] **Step 2: Buat Tabel 1 (Matriks Keputusan Awal X) beserta baris nilai Max / Min per kriteria**
- [ ] **Step 3: Buat Tabel 2 (Matriks Normalisasi R) dengan presisi 4 desimal**
- [ ] **Step 4: Buat Tabel 3 (Matriks Perkalian Bobot W*R) beserta kolom total skor akhir preferensi Vi**
- [ ] **Step 5: Tambahkan tombol toggle/collapse atau tab switcher untuk kemudahan presentasi**
- [ ] **Step 6: Verifikasi kecocokan nilai matriks dengan contoh hitung manual**
- [ ] **Step 7: Commit modul Dapur SAW**

---

### Task 8: Halaman Hasil Ranking & Halaman Cetak Berita Acara Resmi BPS
**Files:**
- Create: `src/pages/Ranking.jsx`
- Create: `src/pages/Laporan.jsx`

- [ ] **Step 1: Buat halaman `Ranking.jsx` (Leaderboard peringkat 1 s.d. N, badge status Lolos/Cadangan/Tidak Lolos)**
- [ ] **Step 2: Pasang kontrol slider kuota lolos dan kuota cadangan yang langsung memperbarui status secara reaktif**
- [ ] **Step 3: Tambahkan lencana penjelas Tie-Breaker jika ada nilai akhir yang sama**
- [ ] **Step 4: Buat halaman `Laporan.jsx` (Kop surat resmi BPS Kabupaten Subang, tabel rekapitulasi, tanda tangan Kepala BPS & Panitia)**
- [ ] **Step 5: Konfigurasi styling `@media print` agar saat tombol "Cetak / Simpan PDF" ditekan, navigasi disembunyikan dan hanya surat resmi yang dicetak**
- [ ] **Step 6: Verifikasi pratinjau cetak dan layout PDF**
- [ ] **Step 7: Commit modul Ranking & Laporan**

---

### Task 9: Verifikasi Akhir, Build Bundle, & Dokumentasi Walkthrough
**Files:**
- Modify: `README.md`
- Test: Build production & run all tests

- [ ] **Step 1: Jalankan seluruh unit test (`npm test`) dan pastikan 100% lulus**
- [ ] **Step 2: Jalankan `npm run build` untuk memverifikasi tidak ada error TypeScript/JSX/bundling**
- [ ] **Step 3: Buat `README.md` panduan instalasi dan penggunaan cepat untuk panitia BPS Subang**
- [ ] **Step 4: Uji aplikasi langsung di browser menggunakan subagent / browser tool**
- [ ] **Step 5: Buat walkthrough dokumentasi hasil pengujian**
- [ ] **Step 6: Final commit**
