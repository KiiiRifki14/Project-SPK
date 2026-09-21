# Product Requirement Document (PRD) - Final Revision
## Project: SPK Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang
- **Version:** 2.0.0 (Academic Revision)
- **Architecture:** Client-Centric SPA (React + Vite + Tailwind CSS + LocalStorage Engine)
- **Target AI Dev:** Sistem ini WAJIB dibangun mengikuti spesifikasi matematis di bawah ini secara presisi.

---

## 1. Executive Summary
Aplikasi berbasis web SPA (Single Page Application) yang bertindak sebagai Sistem Pendukung Keputusan (SPK) untuk rekrutmen Mitra Statistik di BPS Kabupaten Subang. Menggunakan metode **Simple Additive Weighting (SAW)**, sistem ini harus mengkonversi data mentah pelamar menjadi nilai tegas (*crisp*) berskala 1-5 sebelum melakukan proses normalisasi matriks.

## 2. Mathematical Engine Specifications (CRITICAL)

### 2.1 Perhitungan Bobot Kriteria ($W_j$)
Bobot **TIDAK BOLEH** langsung berupa persentase sembarangan. Bobot dihitung dari tingkat kepentingan (skala 1-5) menggunakan rumus:
$$w_j = \frac{\text{Tingkat Kepentingan Kriteria } j}{\sum_{k=1}^n \text{Tingkat Kepentingan}}$$

**Konfigurasi Default Kriteria:**
| Kode | Kriteria | Sifat | Tingkat Kepentingan | Perhitungan ($w_j$) | Bobot Desimal |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **C1** | Nilai Ujian Kompetensi | Benefit | 5 | $5 / 18$ | 0.2778 |
| **C2** | Pengalaman Lapangan | Benefit | 4 | $4 / 18$ | 0.2222 |
| **C3** | Kemahiran CAPI | Benefit | 4 | $4 / 18$ | 0.2222 |
| **C4** | Pendidikan Terakhir | Benefit | 3 | $3 / 18$ | 0.1667 |
| **C5** | Jarak Domisili ke Wilayah | Cost | 2 | $2 / 18$ | 0.1111 |
| **Total** | | | **18** | | **1.0000** |

### 2.2 Konversi Subkriteria (Data Raw ke Data Crisp)
Data mentah pelamar WAJIB dikonversi ke nilai *crisp* (skala 1-5) untuk dimasukkan ke dalam Matriks Keputusan ($X$).

1. **C1 (Nilai Ujian / Benefit):**
   - $\ge 85$ $\rightarrow$ 5
   - $75 - 84.9$ $\rightarrow$ 4
   - $65 - 74.9$ $\rightarrow$ 3
   - $55 - 64.9$ $\rightarrow$ 2
   - $< 55$ $\rightarrow$ 1
2. **C2 (Pengalaman / Benefit):**
   - $\ge 5$ kali $\rightarrow$ 5
   - $3 - 4$ kali $\rightarrow$ 4
   - $1 - 2$ kali $\rightarrow$ 3
   - $0$ kali $\rightarrow$ 1
3. **C3 (Nilai CAPI / Benefit):**
   - $\ge 85$ $\rightarrow$ 5
   - $75 - 84.9$ $\rightarrow$ 4
   - $65 - 74.9$ $\rightarrow$ 3
   - $< 65$ $\rightarrow$ 2
4. **C4 (Pendidikan / Benefit):**
   - S1 / D4 $\rightarrow$ 5
   - D3 $\rightarrow$ 3
   - SMA / SMK $\rightarrow$ 2
5. **C5 (Jarak / Cost):** *(Catatan: Meskipun ini kriteria Cost, saat konversi crisp, nilai kecil (dekat) diberi bobot 1, nilai besar (jauh) diberi bobot 5)*
   - $\le 3$ km $\rightarrow$ 1
   - $3.1 - 7$ km $\rightarrow$ 2
   - $7.1 - 15$ km $\rightarrow$ 3
   - $15.1 - 25$ km $\rightarrow$ 4
   - $> 25$ km $\rightarrow$ 5

### 2.3 Matriks dan Normalisasi SAW ($R$)
- Matriks $X$ diisi dengan **nilai crisp (1-5)** dari aturan 2.2.
- **Kriteria Benefit ($C_1, C_2, C_3, C_4$):** $$r_{ij} = \frac{x_{ij}}{\max_i(x_{ij})}$$
- **Kriteria Cost ($C_5$):** $$r_{ij} = \frac{\min_i(x_{ij})}{x_{ij}}$$ *(Jika pelamar terdekat bernilai crisp 1, maka $r = 1/1 = 1$. Pelamar terjauh bernilai crisp 5, maka $r = 1/5 = 0.2$.)*

### 2.4 Nilai Preferensi ($V_i$) dan Tie-Breaker
- $$V_i = \sum_{j=1}^5 (w_j \times r_{ij})$$ (dibulatkan 4 desimal).
- **Tie-Breaker:** Sort secara descending berdasarkan $V_i$. Jika ada yang sama, bandingkan secara berurutan: Nilai mentah $C_1$, Nilai mentah $C_2$, Jarak mentah $C_5$ (Ascending).

---

## 3. Fitur Utama & Modul UI (React Component Guidelines)

### 3.1 Layout & Tema
- Gunakan Tailwind CSS. Warna primer: `bg-[#0B3C68]` (Navy), aksen `text-[#00A3E0]` (Blue BPS).
- Komponen Sidebar dan Topbar, content dinamis menggunakan React State / Router.

### 3.2 Modul 1: Dashboard (`Dashboard.jsx`)
- Ringkasan 4 Kartu: Total Pendaftar, Kuota Lolos, Kuota Cadangan, Top Skor.
- Grafik/List distribusi asal kecamatan pelamar.

### 3.3 Modul 2: Data Kriteria (`Kriteria.jsx`)
- Form untuk mengubah tingkat kepentingan kriteria (1-5).
- Tampilan otomatis normalisasi bobot ($w_j$).
- Tabel referensi aturan konversi subkriteria (seperti poin 2.2).

### 3.4 Modul 3: Manajemen Pelamar (`Pelamar.jsx`)
- CRUD Data Pelamar (Form menerima data MENTAH: Nilai Ujian 0-100, Pengalaman X kali, dll).
- Validasi: NIK harus 16 digit.
- Tombol **"Generate Sampel Subang"** yang langsung memuat 8 data dummy pelamar dengan alamat valid di Kabupaten Subang.
- Import/Export Excel.

### 3.5 Modul 4: Dapur SAW (`DapurSAW.jsx`)
- Menampilkan 4 Tabel untuk pembuktian dosis:
  1. Tabel Data Mentah
  2. Tabel Matriks X (Data Crisp)
  3. Tabel Matriks R (Normalisasi 4 desimal) + penunjuk Min/Max di header/footer
  4. Tabel Vektor V ($W \times R$)

### 3.6 Modul 5: Hasil Ranking (`Ranking.jsx`)
- Tabel Leaderboard yang terurut.
- Slider / Input kuota lolos dan cadangan.
- Baris tabel diwarnai: Hijau (Lolos), Kuning/Oranye (Cadangan), Abu (Gagal).

### 3.7 Modul 6: Cetak Berita Acara (`Laporan.jsx`)
- Tampilan kertas A4. Kop surat BPS Kabupaten Subang.
- Rekapitulasi Lolos & Cadangan. Kolom tanda tangan di bawah untuk Kepala BPS dan Ketua Panitia (Muhammad Rifki Hermaulana).
- `@media print` untuk hidden UI buttons.

---

## 4. LocalStorage Schema Definitions
1. `spk_kriteria`: Array of object `{ id, nama, sifat, tingkatKepentingan, bobot }`.
2. `spk_pelamar`: Array of object data MENTAH `{ id, nik, nama, jk, kecamatan, c1_mentah, c2_mentah, c3_mentah, c4_mentah, c5_mentah }`.
3. `spk_config`: Object `{ kuotaLolos, kuotaCadangan }`.

## 5. Development Instructions for AI
- Buatkan seluruh struktur proyek menggunakan arsitektur SPA yang bersih.
- Ekstrak *SAW Calculator logic* menjadi service mandiri di `src/utils/sawCalculator.js` agar terpisah dari UI komponen. Kalkulator ini yang akan memproses konversi Raw ke Crisp secara internal sebelum dievaluasi.
- Hasilkan kode yang `copy-paste` *ready* tanpa menggunakan terlalu banyak placeholder (TODOs) yang membuat aplikasi gagal dijalankan.