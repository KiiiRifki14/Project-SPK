# SPK Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang (Metode SAW)

Aplikasi Web **Sistem Pendukung Keputusan (SPK)** Seleksi Mitra Statistik Lapangan Badan Pusat Statistik (BPS) Kabupaten Subang berbasis metode **Simple Additive Weighting (SAW)**.

Dikembangkan oleh **Kelompok 8 - D3 Sistem Informasi (Politeknik Negeri Subang)** dalam rangka Praktik Kerja Lapangan (PKL) di BPS Kabupaten Subang dan implementasi materi **Bab 5 Buku Ajar SPK**.

---

## 🌟 Fitur Utama Sistem

1. **Dashboard Eksekutif**: Ringkasan metrik pelamar, kuota lolos/cadangan, kandidat dengan nilai preferensi tertinggi, dan visualisasi diagram persebaran asal kecamatan warga Kabupaten Subang.
2. **Manajemen Kriteria & Bobot**: Pengaturan bobot kriteria $C_1 - C_5$ dengan validasi otomatis $\sum W_j = 1.00$ (100%) dan tombol *Normalisasi Otomatis*.
3. **Manajemen Pelamar (CRUD & Excel)**:
   - Tambah, Edit, Hapus data pelamar.
   - Pencarian instan (nama/NIK) dan filter dropdown kecamatan Kabupaten Subang.
   - Tombol **"Muat Sampel Subang"** (8 kandidat realistis Subang).
   - Tombol **"Export Excel (.xlsx)"** dan **"Import Excel (.xlsx / .csv)"**.
4. **Dapur Hitung SAW (Nilai Jual Akademik)**:
   - **Tabel 1: Matriks Keputusan Awal ($X$)** beserta baris nilai ekstrim $\max(x_j)$ dan $\min(x_j)$.
   - **Tabel 2: Matriks Ternormalisasi ($R$)** dengan rumus Benefit ($x_{ij}/\max$) dan Cost ($\min/x_{ij}$) presisi 4 desimal.
   - **Tabel 3: Matriks Terbobot ($W \times R$)** dan total skor preferensi akhir ($V_i$).
   - Fitur **"Inspeksi Detail"** per pelamar yang menampilkan ekspansi matematis perkalian bobot secara transparan.
5. **Leaderboard Hasil Ranking & Kuota Dinamis**:
   - Peringkat 1 s.d. $N$ terurut otomatis dari skor tertinggi ke terendah.
   - Slider / input dinamis kuota kebutuhan mitra:
     - 🟢 **Lolos Seleksi** (Peringkat 1 s.d. Kuota Lolos)
     - 🟡 **Cadangan** (Peringkat Kuota Lolos + 1 s.d. Cadangan)
     - ⚪ **Tidak Lolos**
   - Aturan **Tie-Breaker** otomatis jika ada kandidat dengan nilai $V$ kembar ($C_1 \rightarrow C_2 \rightarrow C_5$).
6. **Cetak Berita Acara Resmi BPS Subang**:
   - Kop surat resmi Badan Pusat Statistik Kabupaten Subang.
   - Nomor SK rekrutmen dan tanggal dinamis yang dapat disesuaikan.
   - Tabel rekapitulasi daftar mitra Lolos Utama dan Cadangan.
   - Kolom tanda tangan resmi Kepala BPS Kabupaten Subang dan Panitia Seleksi (Muhammad Rifki Hermaulana).
   - Cetak langsung atau simpan sebagai PDF melalui browser print (`Ctrl + P` / tombol cetak).

---

## 📊 Kriteria Penilaian SAW

| Kode | Kriteria | Sifat (*Attribute*) | Bobot ($W_j$) | Keterangan Skala |
| :---: | :--- | :---: | :---: | :--- |
| **C1** | Nilai Ujian Kompetensi | **Benefit** | **0.30** (30%) | Tes tertulis materi statistik (0 – 100) |
| **C2** | Rekam Jejak Pengalaman Survei | **Benefit** | **0.25** (25%) | Frekuensi terlibat survei BPS (0 s.d. 10+ kali) |
| **C3** | Penguasaan Gadget / CAPI | **Benefit** | **0.20** (20%) | Uji praktek kuesioner Android CAPI (0 – 100) |
| **C4** | Jenjang Pendidikan Terakhir | **Benefit** | **0.15** (15%) | Konversi: SMA/SMK = 2, D3 = 3, S1 = 4 |
| **C5** | Jarak Domisili ke Wilayah Tugas | **Cost** | **0.10** (10%) | Jarak dalam Kilometer (KM), minimal 0.1 km |

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Node.js (versi 18 ke atas) sudah terpasang di komputer/laptop Anda.

### 2. Menjalankan Server Pengembangan
Buka terminal di folder proyek ini (`d:\Project SPK\`), lalu jalankan:

```bash
# Menjalankan aplikasi web secara lokal
npm run dev
```

Aplikasi akan langsung aktif dan dapat dibuka di peramban web:
👉 **`http://localhost:5173/`**

### 3. Menjalankan Unit Testing
Untuk menguji keakuratan perhitungan rumus SAW dan persistensi data:
```bash
npm test
```

### 4. Melakukan Build Production
Untuk mengompilasi aplikasi menjadi bundle web siap hosting:
```bash
npm run build
```

---

## 🏛️ Identitas Proyek
- **Instansi**: Badan Pusat Statistik (BPS) Kabupaten Subang
- **Institusi Pendidikan**: Jurusan Teknologi Informasi dan Komputer - Politeknik Negeri Subang
- **Program Studi**: D3 Sistem Informasi
- **Pengembang**: Muhammad Rifki Hermaulana (Kelompok 8)
