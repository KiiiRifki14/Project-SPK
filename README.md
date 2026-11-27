# SPK Seleksi Mitra Statistik BPS Kabupaten Subang (Laravel 13 + MySQL)

Aplikasi Sistem Pendukung Keputusan (SPK) berbasis metode **Simple Additive Weighting (SAW)** hasil migrasi penuh ke **Laravel 13 (Full MVC Blade + Tailwind CSS v4 + MySQL + PhpSpreadsheet)** sesuai spesifikasi **PRD Final v2.0** dan **Bab 5 Buku Ajar SPK Politeknik Negeri Subang**.

## Fitur Utama
- **Autentikasi & RBAC Aktif** (`Superadmin BPS` vs `Panitia Seleksi`)
- **6 Modul Lengkap**:
  1. `Dashboard` — Ringkasan KPI, alur 5 tahap, persebaran kecamatan Subang, Top 3 kandidat
  2. `Data Kriteria & Bobot` — Skala Tingkat Kepentingan 1–5 (`w_j = k_j / Σk`), acuan konversi subkriteria C1–C5 (Edit & Reset khusus Superadmin)
  3. `Data Pelamar` — CRUD kandidat Subang, filter kecamatan & pencarian, **Import & Export Excel (`.xlsx`)**
  4. `Dapur Hitung SAW` — Pembuktian ilmiah 4 tabel (`Data Mentah` → `Matriks Crisp X` → `Matriks R` → `Matriks W×R & Skor V_i`) + panel Audit per kandidat
  5. `Hasil Ranking` — Leaderboard SAW dengan **Tie-Breaker berlapis** (`C1 → C2 → C5`), kontrol kuota Lolos & Cadangan dinamis, Export Excel `.xlsx`
  6. `Cetak SK Berita Acara BPS` — Format surat dinas resmi berkop BPS Kabupaten Subang siap cetak A4 / PDF (Edit No. SK & Kop khusus Superadmin)

## Akun Bawaan (Setelah Seeding)
| Peran | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Superadmin BPS** | `superadmin@bpssubang.go.id` | `password` | Penuh (Ubah bobot, edit No. SK & Kop, reset sistem) |
| **Panitia Seleksi** | `panitia@bpssubang.go.id` | `password` | Kelola pelamar, audit SAW, atur kuota, cetak SK (Bobot & SK terkunci) |

## Cara Menjalankan di XAMPP (MySQL)
1. Buka **XAMPP Control Panel** lalu klik **Start** pada **MySQL**.
2. Buka phpMyAdmin (`http://localhost/phpmyadmin`) dan buat database baru bernama `spk_bps_subang` (atau jalankan `php artisan migrate --seed` — Laravel otomatis menawarkan/membuat tabel di `spk_bps_subang`).
3. Jalankan perintah berikut di terminal dalam folder `d:\Project SPK`:
   ```bash
   php artisan migrate:fresh --seed
   php artisan serve
   ```
4. Buka browser ke `http://127.0.0.1:8000` dan login menggunakan salah satu akun di atas.

## Pengujian Otomatis
```bash
php artisan test
```
