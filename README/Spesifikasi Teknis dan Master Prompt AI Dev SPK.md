# **Dokumen Spesifikasi Arsitektur & Master Prompt AI Dev**

**Topik:** SPK Seleksi Mitra Statistik BPS Kabupaten Subang Menggunakan Metode SAW

**Target Pengembang:** AI Code Generator (Claude, ChatGPT, Cursor, GitHub Copilot, v0, Bolt) / Tim Programmer D3 SI

# **STREAMING\_CHUNK:Menjelaskan hal-hal kritis yang sering salah dipahami AI...**

## **1\. Catatan Krusial untuk AI Developer (Anti-Gagal SAW)**

Banyak AI Developer sering melakukan kesalahan saat membangun SPK metode SAW. Pastikan AI Anda memahami aturan berikut:

1. **Perbedaan Rumus Benefit vs Cost:**  
   * **Benefit (![][image1]):** Nilai pelamar dibagi nilai tertinggi kolom (![][image2]).  
   * **Cost (![][image3] Jarak):** Nilai terendah kolom dibagi nilai pelamar (![][image4]). Jangan sampai terbalik\!  
2. **Penanganan Angka Nol pada Cost:**  
   * Jarak tidak boleh 0 km (agar tidak terjadi *Division by Zero* / pembagian dengan nol). Jika rumah pelamar tepat di samping kantor BPS, beri nilai minimal ![][image5] atau ![][image6] km.  
3. **Validasi Bobot (![][image7]):**  
   * Total bobot ![][image8] wajib sama dengan ![][image6] (atau ![][image9]). Jika admin mengubah bobot kriteria di antarmuka, sistem wajib memvalidasi atau melakukan normalisasi otomatis (![][image10]).  
4. **Tie-Breaker (Jika Nilai Akhir Kembar):**  
   * Jika ada dua pelamar dengan nilai preferensi (![][image11]) yang sama persis, urutkan prioritas berdasarkan nilai ujian kompetensi (![][image12]), kemudian pengalaman survei (![][image13]).

# **STREAMING\_CHUNK:Menyusun rancangan skema database MySQL DDL...**

## **2\. Struktur Database (Database Schema DDL)**

Berikut adalah struktur tabel SQL siap pakai jika AI Anda mengembangkan sistem berbasis backend (MySQL / PostgreSQL):

\-- 1\. Tabel User Admin (Panitia Seleksi BPS)  
CREATE TABLE users (  
&nbsp;&nbsp;&nbsp;&nbsp;id INT AUTO\_INCREMENT PRIMARY KEY,  
&nbsp;&nbsp;&nbsp;&nbsp;name VARCHAR(100) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;email VARCHAR(100) UNIQUE NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;password VARCHAR(255) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;role ENUM('superadmin', 'panitia\_seleksi') DEFAULT 'panitia\_seleksi',  
&nbsp;&nbsp;&nbsp;&nbsp;created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 2\. Tabel Kriteria Penilaian  
CREATE TABLE kriteria (  
&nbsp;&nbsp;&nbsp;&nbsp;id INT AUTO\_INCREMENT PRIMARY KEY,  
&nbsp;&nbsp;&nbsp;&nbsp;kode\_kriteria VARCHAR(10) NOT NULL UNIQUE, \-- C1, C2, C3, C4, C5  
&nbsp;&nbsp;&nbsp;&nbsp;nama\_kriteria VARCHAR(100) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;sifat\_kriteria ENUM('benefit', 'cost') NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;bobot DECIMAL(5,2) NOT NULL, \-- Contoh: 0.30 (30%)  
&nbsp;&nbsp;&nbsp;&nbsp;keterangan TEXT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP ON UPDATE CURRENT\_TIMESTAMP  
);

\-- 3\. Tabel Pelamar / Calon Mitra Statistik  
CREATE TABLE pelamar (  
&nbsp;&nbsp;&nbsp;&nbsp;id INT AUTO\_INCREMENT PRIMARY KEY,  
&nbsp;&nbsp;&nbsp;&nbsp;nik VARCHAR(16) NOT NULL UNIQUE,  
&nbsp;&nbsp;&nbsp;&nbsp;nama\_lengkap VARCHAR(150) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;jenis\_kelamin ENUM('L', 'P') NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;no\_hp VARCHAR(20) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;kecamatan\_domisili VARCHAR(100) NOT NULL, \-- Contoh: Jalancagak, Pagaden, Subang Kota  
&nbsp;&nbsp;&nbsp;&nbsp;pendidikan\_terakhir VARCHAR(20) NOT NULL, \-- SMA/SMK, D3, S1  
&nbsp;&nbsp;&nbsp;&nbsp;nilai\_ujian DECIMAL(5,2) NOT NULL,        \-- Skala 0 \- 100 (C1)  
&nbsp;&nbsp;&nbsp;&nbsp;riwayat\_survei INT NOT NULL,              \-- Berapa kali sensus/survei (C2)  
&nbsp;&nbsp;&nbsp;&nbsp;skor\_uji\_capi DECIMAL(5,2) NOT NULL,      \-- Penguasaan Android CAPI 0 \- 100 (C3)  
&nbsp;&nbsp;&nbsp;&nbsp;skor\_pendidikan INT NOT NULL,             \-- Skala Bobot: SMA=2, D3=3, S1=4 (C4)  
&nbsp;&nbsp;&nbsp;&nbsp;jarak\_wilayah\_km DECIMAL(5,2) NOT NULL,   \-- Jarak ke wilayah tugas dalam KM (C5)  
&nbsp;&nbsp;&nbsp;&nbsp;created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 4\. Tabel Log Hasil Perhitungan SAW (Opsional untuk riwayat / caching)  
CREATE TABLE hasil\_saw (  
&nbsp;&nbsp;&nbsp;&nbsp;id INT AUTO\_INCREMENT PRIMARY KEY,  
&nbsp;&nbsp;&nbsp;&nbsp;pelamar\_id INT NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;skor\_akhir\_v DECIMAL(8,5) NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;ranking INT NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;status\_rekomendasi ENUM('Lolos', 'Cadangan', 'Tidak Lolos') NOT NULL,  
&nbsp;&nbsp;&nbsp;&nbsp;periode\_seleksi VARCHAR(50) NOT NULL, \-- Contoh: "Survei Pertanian BPS 2026"  
&nbsp;&nbsp;&nbsp;&nbsp;calculated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
&nbsp;&nbsp;&nbsp;&nbsp;FOREIGN KEY (pelamar\_id) REFERENCES pelamar(id) ON DELETE CASCADE  
);

# **STREAMING\_CHUNK:Menyusun logika algoritma kalkulasi SAW...**

## **3\. Logika Perhitungan SAW Murni (JavaScript / PHP Logic)**

Berikan fungsi logika ini kepada AI Dev Anda agar ia tidak mengubah rumus:

/\*\*  
&nbsp;\* Logika Inti Perhitungan SAW (Simple Additive Weighting)  
&nbsp;\* @param {Array} applicants \- Array of objects data pelamar  
&nbsp;\* @param {Array} criteria \- Array of objects kriteria \[{kode, sifat, bobot}\]  
&nbsp;\* @returns {Array} Array hasil ranking lengkap dengan matriks R dan nilai V  
&nbsp;\*/  
function calculateSAW(applicants, criteria) {  
&nbsp;&nbsp;if (\!applicants.length || \!criteria.length) return \[\];

&nbsp;&nbsp;// 1\. Cari nilai Max (Benefit) dan Min (Cost) untuk tiap kriteria  
&nbsp;&nbsp;const extremes \= {};  
&nbsp;&nbsp;criteria.forEach(c \=\> {  
&nbsp;&nbsp;&nbsp;&nbsp;const values \= applicants.map(a \=\> Number(a\[c.kode\]));  
&nbsp;&nbsp;&nbsp;&nbsp;extremes\[c.kode\] \= {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max: Math.max(...values),  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;min: Math.min(...values)  
&nbsp;&nbsp;&nbsp;&nbsp;};  
&nbsp;&nbsp;});

&nbsp;&nbsp;// 2\. Normalisasi Matriks R & Hitung Nilai Akhir V  
&nbsp;&nbsp;const calculatedResults \= applicants.map(applicant \=\> {  
&nbsp;&nbsp;&nbsp;&nbsp;let finalV \= 0;  
&nbsp;&nbsp;&nbsp;&nbsp;const normalizedRow \= {};

&nbsp;&nbsp;&nbsp;&nbsp;criteria.forEach(c \=\> {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const val \= Number(applicant\[c.kode\]);  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;let r \= 0;  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (c.sifat \=== 'benefit') {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r \= extremes\[c.kode\].max \=== 0 ? 0 : val / extremes\[c.kode\].max;  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} else { // cost  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r \= val \=== 0 ? 0 : extremes\[c.kode\].min / val;  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;normalizedRow\[c.kode\] \= Number(r.toFixed(4));  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;finalV \+= normalizedRow\[c.kode\] \* Number(c.bobot);  
&nbsp;&nbsp;&nbsp;&nbsp;});

&nbsp;&nbsp;&nbsp;&nbsp;return {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...applicant,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;normalized: normalizedRow,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scoreV: Number(finalV.toFixed(4))  
&nbsp;&nbsp;&nbsp;&nbsp;};  
&nbsp;&nbsp;});

&nbsp;&nbsp;// 3\. Urutkan dari nilai V tertinggi ke terendah (Descending)  
&nbsp;&nbsp;calculatedResults.sort((a, b) \=\> {  
&nbsp;&nbsp;&nbsp;&nbsp;if (b.scoreV \=== a.scoreV) {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Tie breaker 1: Nilai Ujian (C1)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return b.C1 \- a.C1;  
&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;&nbsp;&nbsp;return b.scoreV \- a.scoreV;  
&nbsp;&nbsp;});

&nbsp;&nbsp;// 4\. Beri Ranking dan Status Berdasarkan Kuota  
&nbsp;&nbsp;const kuotaLolos \= 5; // Default kuota contoh  
&nbsp;&nbsp;const kuotaCadangan \= 2; // Default cadangan contoh

&nbsp;&nbsp;return calculatedResults.map((item, index) \=\> {  
&nbsp;&nbsp;&nbsp;&nbsp;const rank \= index \+ 1;  
&nbsp;&nbsp;&nbsp;&nbsp;let status \= 'Tidak Lolos';  
&nbsp;&nbsp;&nbsp;&nbsp;if (rank \<= kuotaLolos) {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status \= 'Lolos';  
&nbsp;&nbsp;&nbsp;&nbsp;} else if (rank \<= kuotaLolos \+ kuotaCadangan) {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status \= 'Cadangan';  
&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;&nbsp;&nbsp;return {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...item,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ranking: rank,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status: status  
&nbsp;&nbsp;&nbsp;&nbsp;};  
&nbsp;&nbsp;});  
}

# **STREAMING\_CHUNK:Menyediakan dataset dummy realistis daerah Subang...**

## **4\. Dataset Dummy Realistis (Kasus BPS Kabupaten Subang)**

AI Anda dapat menyalin data dummy ini langsung ke dalam database seeder atau file JSON agar saat aplikasi pertama kali dijalankan, tabelnya sudah terisi data realistis nama warga dan kecamatan di Subang:

\[  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 1,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213012903980001",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Asep Saepuloh",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Jalancagak",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 88.5,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 4,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 92.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 4,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 3.2  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 2,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213021405990002",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Siti Nurhaliza",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Subang Kota",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 95.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 2,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 85.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 4,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 1.5  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213051010000003",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Dadan Ramdani",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Pagaden",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 74.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 5,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 80.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 8.5  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 4,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213082201970004",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Rina Marlina",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Kalijati",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 82.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 1,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 95.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 12.0  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 5,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213041907010005",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Budi Haryanto",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Cisalak",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 65.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 75.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 2,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 18.0  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 6,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213091102960006",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Dewi Sartika",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Pamanukan",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 91.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 88.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 4,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 35.0  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 7,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213030408990007",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Tatang Suherman",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Purwadadi",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 78.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 82.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 2,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 14.5  
&nbsp;&nbsp;},  
&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;"id": 8,  
&nbsp;&nbsp;&nbsp;&nbsp;"nik": "3213071804000008",  
&nbsp;&nbsp;&nbsp;&nbsp;"nama": "Neng Yulia",  
&nbsp;&nbsp;&nbsp;&nbsp;"kecamatan": "Subang Kota",  
&nbsp;&nbsp;&nbsp;&nbsp;"C1": 89.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C2": 2,  
&nbsp;&nbsp;&nbsp;&nbsp;"C3": 90.0,  
&nbsp;&nbsp;&nbsp;&nbsp;"C4": 3,  
&nbsp;&nbsp;&nbsp;&nbsp;"C5": 2.1  
&nbsp;&nbsp;}  
\]

*Keterangan Skala Nilai:*

* **C1 (Ujian Kompetensi):** 0 \- 100 (*Benefit*)  
* **C2 (Pengalaman Survei BPS):** Frekuensi kali terlibat (0 s.d 5+) (*Benefit*)  
* **C3 (Penguasaan CAPI/Gadget):** 0 \- 100 (*Benefit*)  
* **C4 (Pendidikan):** SMA/SMK \= 2, D3 \= 3, S1 \= 4 (*Benefit*)  
* **C5 (Jarak Domisili ke Target Tugas):** Nilai dalam satuan Kilometer (KM) (*Cost*)

# **STREAMING\_CHUNK:Menyusun master prompt komprehensif untuk disalin ke AI...**

## **5\. Master Prompt Siap Salin untuk AI Dev Anda**

Salin (copy) teks prompt di dalam kotak di bawah ini, lalu tempelkan (paste) langsung ke chat AI pengembang Anda (seperti Cursor, Claude 3.5 Sonnet, ChatGPT, atau v0):

Halo AI Dev\! Saya adalah mahasiswa D3 Sistem Informasi yang sedang PKL di BPS Kabupaten Subang.  
Tolong buatkan aplikasi web lengkap Sistem Pendukung Keputusan (SPK) Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang menggunakan Metode Simple Additive Weighting (SAW).

SPESIFIKASI SISTEM:  
1\. Tema & Nuansa UI:  
&nbsp;&nbsp;&nbsp;\- Modern Dashboard Admin internal BPS.  
&nbsp;&nbsp;&nbsp;\- Gunakan warna resmi BPS (Navy Blue: \#0B3C68, Biru Muda: \#00A3E0, Aksen Hijau/Oranye statistik).  
&nbsp;&nbsp;&nbsp;\- Menggunakan Tailwind CSS yang bersih, responsif, dan elegan.

2\. Kriteria yang Digunakan:  
&nbsp;&nbsp;&nbsp;\- C1: Nilai Ujian Kompetensi (Benefit, Bobot 0.30)  
&nbsp;&nbsp;&nbsp;\- C2: Rekam Jejak Pengalaman Survei (Benefit, Bobot 0.25)  
&nbsp;&nbsp;&nbsp;\- C3: Penguasaan Gadget / CAPI (Benefit, Bobot 0.20)  
&nbsp;&nbsp;&nbsp;\- C4: Jenjang Pendidikan Terakhir (Benefit, Bobot 0.15 \- Skala SMA=2, D3=3, S1=4)  
&nbsp;&nbsp;&nbsp;\- C5: Jarak Domisili ke Wilayah Tugas (Cost, Bobot 0.10, dalam km)

3\. Fitur yang Wajib Ada di Aplikasi:  
&nbsp;&nbsp;&nbsp;\- Halaman Dashboard: Tampilkan ringkasan statistik (Total Pelamar, Kuota Dibutuhkan, Pelamar Tertinggi).  
&nbsp;&nbsp;&nbsp;\- Halaman Manajemen Kriteria & Bobot: Form untuk mengatur bobot kriteria secara fleksibel dengan validasi total bobot \= 1.0 (100%).  
&nbsp;&nbsp;&nbsp;\- Halaman Data Pelamar: Tabel data kandidat pelamar, bisa Tambah, Edit, Hapus (CRUD). Sertakan tombol "Load Sample Data" dengan data pelamar daerah Subang.  
&nbsp;&nbsp;&nbsp;\- Halaman Dapur Perhitungan SAW (Transparan untuk Dosen):  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Tabel 1: Matriks Keputusan Awal (X)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Tabel 2: Matriks Ternormalisasi (R) dengan logika Benefit (x / max) dan Cost (min / x)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Tabel 3: Perkalian Bobot (W \* R)  
&nbsp;&nbsp;&nbsp;\- Halaman Hasil Ranking & Rekomendasi:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Leaderboard ranking dari urutan 1 sampai terakhir berdasarkan nilai preferensi (V).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Filter / Input "Kuota Kebutuhan Mitra" (misal diinput 5 orang, maka ranking 1-5 otomatis bertanda hijau 'Lolos', ranking 6-7 bertanda kuning 'Cadangan', sisanya 'Tidak Lolos').  
&nbsp;&nbsp;&nbsp;\- Fitur Export / Cetak: Tombol untuk mencetak pengumuman hasil seleksi dalam format print/PDF resmi dengan kop surat BPS Subang.

Buatkan kode program ini secara utuh, bersih, rapi, dan langsung bisa dijalankan (tanpa error).  


[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAAdCAYAAABCBvnuAAAHH0lEQVR4XuVaW4hVVRg+B0easqs1c5zL2WvvmdFRKKKmexM+6GSSE+RUD2oZiA4RBSolWlJighTzYjWjMhEFSmZREUGZRKUUXV566EIvSRRBYA9BTz3Y9+299jlrr73W3mufc2Yc6MN/1lr/Zf1r//9et7MtlRpBWWckkSPOQFHLIvqqrsnOxCuCyL5wL4UNikI6KOonpZ9imOGoVsrWtMsqnZUFvu/vFMI7jnIVyheFEHt7e3sv1HUbhuY+0bQPLR/FbXULvZ0FVddu56ZVGG1IznhPT8+VSM6tqH+Nci3oDGiZrjz7aMmTKp003V/BDmzqNr4FnDVBEAjWmTDP814dGBi4APyFJdkbeA+SYhu9HaOga3fMWMczjdrAW/oEZSYJs2i9LtBh9GpkFoWpExPPhoSug6GDig1ZplkyEyL9bCsseb1IzjtI0u0ov6xWqzdylqG+nSX4I8ITr1NvaGhoPtr3Q3Y4kLNwziL7sYsg3ZPL+2BhNwwEfBCBf8vD4cH3gxOoP00C/1q5BA6gfaCvr+8ytDuwPC5CewL8Hr0vdzTxFMVNi1ucP2SPFcFvJ7E+ODh4CYp5sQwzaBiJ2dbf39/JNhOE9suxfqJvmxsb3wKjOt6SS+F4NQZSZZslBrcGb1iXrpuAsTfCJHB4mIaR0WGGyBWIxQYkZSsStFi2h0GP6XomuLh30Sl1dHRcjEEcAu1Bsn7jFMcgpkA7kKgf0A50mxgpBynG7MLsvpzmF3pn6hqVSmUBk8WkIT4rFaV85DsyQDGC07t4JA2wHiMpf/PUA7oC9ZO49J3FJtqSewSPuuj3Q9CvJBGWIqzbCGPYrfdDhMPPevAsWSlXbIWM0ZsY25ah64fm6/IZBZL0iBwAL3j/YhDDYPOYuoZJZJ3/wtOO8Dbz5KPaR6cj71GRt0zOAqIEyDQo2awlptEMtRBFhmDU5ZIH+r67u/sqXUbII+y0nhATnw6MThyRtq1z0rJw7OdC8mTZamppv56BJ87pz2QETznYj05hQEdKhlhkh8kZZfkTTRf8dIVlDmFGX653UghNDXcOAkFZBjrrB/64LiOwlwwjaO9BZ7XC5vI4Ct7bQRDcqfCNkBfFFaD7XAk+b9b7cY5+2UFPU0k2rS0+94r4BFgUeKZb5PZSHCK5PyXAuwP4GyAfg5NjJXm/4P4lAz8K+ghL5kWaaR25a6FBaGC1FmYH1vRI4FlXeo5HcwvKiOV2vNw36YJcIOjPwvg7Lk26jKc1yBd52m9gPm7znCXg7QLtU22ckY5DSzBD3Zb4ywTjgCBXdFkRIF4B+pmqqp9QXAbtB34771M6PwY7Bp3GRhiofCSwHfz3q9XqPSq/jrr3uOYynoSWzcDGn0FwFeFLrfNV2GdkQtKGuL2CZA2pzKbhy5/+RfStZjmd0q38KeUUZH0Jg1QQUwwrDNdTJ2AcmzCOd0EPyRXiYxyQxlDexiWbgYmvFvy9Dgea58B7HjSNmbJEvnRPgA6jvt+PsJ9tIfdmlPtAa9Xn4V7FPkAT8L0G5XG80PfWFCyA3jbGlXV7ck1tHYpcBuENdLxT/eLJ9Rq8E1mzsQ7ZoeY3bxhmGK249h8BHeWSHER3w9+jwIbPwCX6AOt+NDN+hk4Fq8HV4J/s6ekOl30R7cUnwO9GfRI6g3H/OFRN8Zd12Q6vJtDdGMm8Z6D/kh/9wvMBEx8axcoa0BcPYuF4dNhs0lA1ZV3/oZLA4HaIQvtTucgoNOQbIjivcUysi+h4/3k8i8inPNZlMhH0G8DfDN1vqB/zwTtIW8pjfb6McsbWlisetOQeXtsCqKe+uNiHFkI2Tb2YR6CfUXU8CTQTphh8w+D4R05z0GeoX6frpKG4bXoEduiJAn0aJ0BNlEzQV6AReWGv6cl+lqP9lye8EYXHZBxVExXDugVkwJ6oFgWos1JZACdPCv7Hj2q1X5dnIncMuQqZyE9UEAZG1WNwofMFaAwBvwYvoqDMiz4ing4Cv/Zx0Iv26dpdEvW7QdNetDd9sgSrDpdStB+gHH6Wgr8L5dbYRrFdT5nOd4DcxvmnHAUsK2x2mV0yk0AwxvHgf4C+Ba1D+xA29X+iUqyT/F9Am0BrOaMg24j6U4IHDyxr0H8B9T9F9FFwMQ4cZ1D/iTaxD5Li82HYHYR8Uvaxhf3xGC/lS5G4OzzDvQt6ewWTbgqXiRfBLlFR01LU3SybRyN+6jZpa+5Fct9ICy3gbGHiUW2LecrePU/WE+Bs8rRPIq73sXDO6MzzgTkxiCLAooPA7/EM+5QFvC9N9FaTn+zRxyrsf4+HjVYEIa8PkzzkmQQOsJpZBS2Eow/OBgR/d7i81WzSxlw6eT8TiU/24WFM0F695vwPIAOUjlMuGjCpgYFXg28AZxL3oEkmSxXwK7HbR0fnEVLRWbkOZxNnRSOas24cjfrNssuSxfgPpxOfLy46X+YAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAaCAYAAABctMd+AAACvElEQVR4Xp1UO4gUQRCd5VQ8PBDx1nVvZ/ozI8KtBuKC4A9ELtDg4EATUTAQ5AITjVREBDERDBTEREQvMzAUwUgUNDBX0EgQzUUMFDxfdc/09KeGA9/QdHdVvdfV1d2TZb0sQmLIjI0zM4jC/KkVIYu1Rr6YatAz39qo+W0okzG3RjPnfIQ4R0K/35/RSh0RQpyUUs7DNEXOwWCwaTQa5UFwBGPmfBAbQ+ydFPInxJ9ifAltRWn1Er5dGL9AvxDsMckuUp5MJutBvCak/A3Ry3meTxtHHVwUxWH4fwghv47m5vIkscRAgHGyF8JCPAD5D9qJOISglNoI33NqNHaORDQw9EDUyyCtgnQl8NLIzUzcE+zsqvNHiGSzDNvfIaT4hhp/rqqqSDNpgQQeIm4htDKEpu7I9gZlLaW4FcfExLKsNtPZ+D5G2hrpukH4FdpfewP4YHsbIk9Ug4QH0SHaF7TvuAWlDYnD6rm3gNJqDzjnlNZSK70P49Pj8XiDoxA8cWrDlu6jFlRqGYd5gMY4o0XUfpUa7K/LstzZRtZAtlsg+h7X0Ilz8rjXW+F/VFbVNvKjhIvUglA39owg3aGaI4NjjNtMpX2l9v73zCsm8TPUI7FDsE41VXPVp06jbhD+pLE99Nt94TwvpiFwHb6LhlcTjaiU92b7szPgnEIF7re3KAA9DqVwFd+C8Av1fIzHchaCd1HjN7AdbYTtrWlYFvQTQ9wHxO1P9uwALkRpnSX0S/iXVBn9CcMYwjoI3Ub252nSXAo6ZCfuZxHCOrrcyvxjxAoEj9Mc/TzaRySzm+U0h+B6WrkjkoCsD0Lwpj1Y+QzjC87Zhq0FimpaayHQ60ath30cqnV4ipx4Z0GCjaT+2OJ0zIBdNKZ4psDlM5h/zP+jQ6rDbOC2ldi8GbsLD6ydKREb56NZy/Q2+h+9Mm1d8VK9NwAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAC80lEQVR4XpVVPYsUQRCdQQ4UxeOUdeFupnt6dlEMhMPRwECjQ7hgRVBBPFNTzRQuPUz8A4LZBgfmogiCGh4cCAYqCIdyKEZmbqDJ+qo/pqu7ZxctqJ3uqlfvVfV8bJZleWbcml26CMv4fRzsMA9p+f+hyhmHdpTlbSzHOqffuMaNkU4WWBxr8ZxwRjdJrS6aAQ5CJs6nCI32QcxsiqI4JKW8BX8Cf6SUOsVRiVmOoijPCCFuDOrBCYr2er0jZVlcBMdGgCer63oRiVfwLQJWVbWK9Uf4NX4kcc8Uqyp1U0oxFUJOgZ8KciH3FThidIaOHkghd3FdcjEUb8A/YbI+V4jFQDoC+R7q9yC0A457w+HwqMEyNIBLAO6qSo19NMvKsjyPwl+4XvFRWxjUixE16iMzDCKnQfgTxzXmRChuEJ/AHwYF0UgkJEkomjqeXBNCbGKEwjiOTsdNUVKqTUgxwv0YA/9S0hFK+QXrO4Af8CjU4mxHdBPdRJqOTaSF8lTG4HJX/7ooi2MUwtM7xP4b6u9rmKvFNOtGyN0jMzgXYtSJIX+Q3Ox0bY66bRKDqxaI0RmhJ0uFyEze/9rPTJDV4mNqHr7eJkFYI/AjJmQPw2bXMCSA9+8k8t/hz+iFd1J0OloID0pbSy8ogm/hz/UR2AQmXcP5/wF4zU1ALzYe92W9IYxrRjghA8Sejm5CeRszhsBt+L45U81B57wFsZ16UC9SYGVl+Tju53vEf+N6gWJ1PaAvyjYarBwXrfULjE9Z0zQL/LCz5myzAKHHSL4B7iqJwD9U7WckN5ML+QKxz0op6cox4Tlg38E3wXEX16+4PqUm0iO3snTmAF0H0SXqJoWYe8Nj5P1+/3Cl1GVq0k7XgvJEjNm8nLEOhO9kjrnWOsxMkKd533O7jiHzeDNNzUk6lno7myA0h+vC69cwTswbym3y+D8rvqMzO7ebWEEbDzI61yHv1DYRmevCJTSKrVMLODj8f8zLhvJ6HQv4i134Bv8COrmOt8Wnz2oAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAACg0lEQVR4XpVUPYsUQRCd5k5QEC+QDc6d654eN7nAxAVBMTS5QBAxEIxFMBFMLjIS/4ChiGAgohiLkZGB6RlepHBgZKaByHm+6q7urv7YOXxQ2z2vPl5Vze52HUMp+ggPgZVoko4tPdlz6fRExbZRxjavVQuN4nG8uoKMdmH/Ax+flRB3gRbd4LIW837DTXWDx23JBp88JBaLxRmt9QNjzDPYI9hm8GXhcGzD7sM+GqMPIfRS+lsi7ooPay3SzJ42+i7yTuLcGazdh12qeiIhOww3cF6B0IEXqsK6BreOnOewd3QPpNHmCSb80Pf9KRGbQCPDvjmhqqYA+1BsRPx3nLuSB3fTaP0L/JIzckQha8VEhaJ4RLFr2MDfKMTA83VtzBF8dwSdMjHyJsxPxC4pUw5JBdHYUT6RSryRDYhsTUJhdQUozIeyunJCu5kQA81CSDs+lZercKvTWF0tVILSUPAhTEzki2ESrM4LiZQEJyRX14k++CL/DarVcZAhnhrIVpcFrFgdr6oECl5F/B/ZOTUSGqBvX5VIAfFbx0IhRPFtHMeNra3+XHDhdzJH/FfYU8/4OOTfA/cDts0lkpMQVofzFTlkL/P5/Cz4Pdhv2GVHogPcH8M+j+fHDSIuLpcn8PwW9hqP69k82v0ezAFEDo0fmewnOvuCri9QzGw2Ow3u/WCHfYu/HdZxUzp+GN4gfwf3F7BPaKyXGhHhNYgNiAufWXsSag3NLmG36ASxVkYwwlvIUelVSI7YZAsrHQGV0kRG9kanQIFZWyrmqmOKtLwtTmBiAStognfJ9XPTOZpkgtNeFRBHlk9M1ZzHxDAJEwGF69jIqvmKYDg6rCuPiUsU9D/hHHmexmA17gAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAACbElEQVR4Xo1ULWwUURDel7SCtAZyexuuu/P2dgkJaYLgNI5KTJOq4jEIXENDQEACQYEgGEKCAotvGhJERUU9CaIKhayoafvN+9md9/bdHXM3t2/mm/nm57WbZZnCJxRrS28c8Z+iVE+epljkTWOBn4/zwlg8UTJGLc6dD84FvLi2fNxkMhmR1kda60uhfzXRbLKxUeJ8ool9ZLC6rn83TXOb84nokcwD9qMYF2tBEyDas8n0hO0A03rfJtO2cJuY6XR6F9hhXU9riTlRnLzLxOhiL0bhd8R6ty9pnopIP0fOVnpTyoz10CXvO5cRjFfD94cSRUG6CezdbDZbHV6Cs5H0AJ1dYKKv3s9f7P81uN9zUZB3xMBWgL3BCje9z3MFJfiykHwGEkvM64EP9lv4t3lNPZZlVVXdx16fmUDzk/ozxD8IOWLoQVEUazweuv9QleUtjzExJ+f5aB2+T03bVjFVIByMxJvQU+jPPM/X0e0WiJ8yboipL8qXiCKPwxbjftmGEhOTPsXzuESXOH9p22bsit6B/uOiWEGL58cRiqd4Ynru6joSji05vYS9w/5+GuJpfgF7wdNE6UbslqMxeG/cEfQCid/R9TUfI9Z0Cf3G+x905jkN4H74MTa7owOs4pxvXMabnduiZ7zvDvCVoyYHwreO5M84rkh/PuqIX2UhpaBJEHrhbvillAoB6b2qKm+E3lSkkySk4hFjOxYBxDHSjrG54huIiY2KZro4d15WIMZ7e0mbCddS6XLkMLZj6wkCvEr/wAi5+kOqPUHY2anzQlulMakDwDxE4jAofJeG58R7NmhCvCHE7V8BanV52rXr8rQAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAaCAYAAADxNd/XAAAEMklEQVR4Xq1XPWgUQRS+IxEUo0GT8/Ryt7N7OThU8C8SsBELLVJoEQWVqIUIFnZCFFNpYWEh+JcgMSGkEDFqIWijAQstRBsDVmIRgiAWYqVFQOP35ud2dn5276IfvMzO+5s3782bueRyhDz/m4DO4t/xnyQcLA6fvoWkTjMW6bA8SEZysODjLx/5JnwKjXxPT08XY2xTNgWJeSDHMAxXxv4cyzpYMVKF2SgUCh0I4AUCWQqCYIEF7B6+x32EoCcxfgAtko2kOzktkuyQZHZ9ij6+DwhgJ+gHURRF/aYHz2Jt2PAB2HxGZebL5XKPqWBCd2G7S4N+nFyW4KEKRxHMH9DH3t7eDQlhChD4etjMwv6YKTOR7smGnjhr86azvr6+FfKY4EgE4zRXMqeBYuEPKrEVdmOYtRsqHjictQqXiyoyTxWgSlBFTLnbiiPPgmAdxG18YklNRgYc+r4kWojCqF/1A/WGKc+GvQqOZAVVHaDbTucXi8XVqtK1Wm1tFEV7cSRX6ToJpO+iIcjjSFwQR4nNVqvVzlicNPa50lXhYxDVnAZdw/ec2gQ1PebzoPNS75Zcc8h2bDEMGHLZDzO4Upew8CVbw4Qujr/l+zIhxxHQF3yXSYYk7cd8kUaaI/uq8kMNB5lICQsOGYL/BIe/K5XKIcWPs5tiLFGplHfDx/Fqb7UTft6CHuRko+M9uSo2VOIbAqjyU2pDCjhaBeido/fKkydzEjNgeJg2wMRDxRvUB8uFBlRyD3z8iuRVSy835s+J1CsueMFo/J4Ij0jkdlqfb0DCzp9jZzREoqwzjT7QhS0AWb0IP18xVsmWjhFlHzSidPCN/YU3c1QhO8IWIO0iOkJR+JTG5bpSzuBnGgG+rtfra2iOjfRh/hPjQaVF17Z+dcs+PA16jBi2KX5ToIxT5qkCpqwZmBtm4oZ5H9BbkeMbOMHUjQOURJOPoR+6lG0QsFMUOFUPdJczTcdJhpjQzunK481kGfiQpwak4Jx9QlUE5qgKoEegUdB1Jo7RJBr6GdbcQbpyyXbY1DG2QX4fvdHczbRLBH8DRoM6P2sfaLwabMZVQ3JYRnn+s12+A1xa6C50INCi/rNFR6lU6obfN3TkTFkSYrE8MjGMG2M45uhiDRqDXk4sMoHgz8bcnMNIR3P/rDDRKy9xnPjRSwUTV+ZtlQ2+gL6KYzPIzBYE/g4l/g7bzZpIIjtMgqUlGZQUehvAsFQSiMR1OYcKnIHBESImR5Pg9AroIYL+xhr/0ATiPndsuDUkjOgH4hSTje52By5dbVB6guAWmiZGI9O+g5Omay/ckTT4URjuC/kvgGAACX2lfnpY8PkR8Ev9kpwUOjQkK5Y4SiUHBL8RdBlJHaEmTgjT4VCy1nHo6LDEFiPpJ9Vnkm+F8r8RO3W4d7Cy4d+kg6XBK2gW/+zAAb/Pv3Vm33OkhRGCAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAZCAYAAAB3oa15AAAEeElEQVR4Xr1Wz6tVVRQ+B56QZJj6bpfuPXfvs8+tHg1E6RaCZDTwSQ0MsR9I9ReooyIDcSCY4GsgkoglThxIoQiFOIikHjiR3kAIsoGDKF44ahI6CUS/b5+9z91n/3j3auQH+55z1vrW2uvbe519bpZnk9Bm6KcgKA9NKUxNdBHJHxg8xP1xKzH2pDljpDnxBYrkj3AScAMmRBnOBFZm85Rl+XS/39/QGCIYjUarut3uk0lCCm69gfpp4FLD+1xK+TEEfIfr56osv2KRDkujKIrVUshTg8HgLd+XRKmh9vh2C6XUHCfFOCOkfL8YFKt9jp4YPinFGV0gYmi3OoQQI8TexLWClWKOYPyFsQ9c2e/1C/jeBecGrqcRMqMDw4WogcAXMfZi/IhxDwrOOe4G8L2NcRP+zZ3O7Boz8Q9VVa21+apquJY2+jqdzhpyGcNYJ89HGNfm5uaeYiUo8lU8f8I6wN+D6wewvSeF+BYtVtg4i3F3mFlN4C5ct2LLlmMChsPhAP5bTG5tmGAdnpcw9jur+ylWbgnXdZyAdsZg/IbV7dKAHT6H50UKNDEjPJ90ljVHDQtF0zrucrto2XNO9CzGH74Ap4i7nMx1wXaexcyiGBaNtlny49HDr4Bzx/Yy7g+6Aoz/M8sXUswjx4nMto5FSkeNtAAC9i8iAjJyYb/NfpZ1K/7tx5sVvotxtN6B8nXc32Kvm3n3WnHVcPgMni/EWsciqSMQoJk1vS5UhAKUFqDtWDldaEqAtfNo5MuJdr2InPtw/01nlruRz3DlazGmzPYlhOsIBGjkGbca9sVGgBNkdqAWIMROcO5PEmCQK6U2wTfPU4sGFk4BmW6dPFdluQVxx2F7g3y7oEkxcQFZxjMa9qssQvoC9A7UwuB/EyMpQNGeKIItA84l2zqyPvGuQtzzuB7C2O2F+Ii8A4mVHlvb9rpQ4ax0nSCxA25+p3V4FFc4isV1aU48pcoucnxpX/qWePdBCxDhDhjf0RUELPf6+uPDF/m2H2+F4Xg9GCx91m4dulWpNiHPP2xJQ8mxe8dYXxNkdrKFYAcccBL47iHpdmsD7wkIvgL7Fd7X74pYtM+WxxjY/nVjLdqt094xRwDnOoZ3RjaBMVgBGOczTx6OvA1I8jPGYWtDfz7H1Xf/emDSDzH+hF3ZZZL1F/s6W8PyDHTrgD/vGo2oZWkE8KsPzulerzfr8hqYFVrmCmPcN+MOkv9SFIONloddeBn238E/gPEO7vnRWuCxaHe0OSKl/Kmsv+4s/leI3DyescmH1lELOSNNArNqM4g5y9w0grdN1h+6SAM2ML4Uxdh5ImErd7A4/r1I8PNqWL1AkeC+NnpptMpPzL/RLNL8nQ6A3V0P/9fI8T2ul/mO+ZwV4B5z8QrbiHAmrIdGe9U9tK1TcNyHOD0tLDLZ+Kdt9+6mu/effBhvipSyPxZEJg9NKQHpBXkE/OcEK+Bhc0f4gekhxE9wPxpWTKqdqZdvmtiUwdwHnDbM9M7D/4EgcWBoMPakOQEM9QF4ghbvD9cQFwAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,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>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAACMklEQVR4XoVTMU8UQRSeiWBiJCHGWy/s7c7M7knhFQTZECCGzhYTrSioMcaOQhMrDLGwt4MCcgk0JpYUUJjof7CioLKyxIJC+N7uzu6bm9n4JXOz+733vvne2zkhCLL8rVA/B6gJNoRAMUeYl4EDyt314BUHCIcKxNvNC3bzIo7jnlb6h9b6pl3qWin13OaMRqO74E/ANzmIv+M6DRDYoASTmaNgm1LcgdCx0vpDsVRMs7ALCBUQusL6iugUj1GuMWYFsXGSJPe84oaQpVCO034j+XsURTM8l4qVVodw9NSb0aRolpk+RC6wLrHmeAyHbMHRR1RVZZ4QI8gFucHg/2B/YpOMyQzevw3z4aM2OwAmOEXzwfqbpulyzUsIfU7S9IXNDptx+pMCMzqAI/q0G8RAcB1z+VIU+EpWWdAYsgW0utkqSFcVAu/re7KT5/ks9pMkSR/bXAuIvFFKbzs+StQMCl+RI+yf4G4HBa/dxBq+ggu6zRD5h/ULaxz1ohnibV2/37+f4eshtp/nw1lWylG2VsARXcorFKxY3gqBfwmXi8g5xfNaU9qgzkQ7c7q6R3t2fDwHF3MeQquIn2FGD5xgO2whlvB1cIOfUQttEocUcLprMrPLqOqHC7UWXDMWcTzowc3PypV6m9L/rkQ4v8XEAYPB4CHaP6fW6Y5xExX4ix91QO07rfupPlOhi+dnSncu3jN316XX2Rqn/qNRgic6CHENXOUOM4HWmjf74xKcugWRyltHLoLNgQAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAaCAYAAABctMd+AAACc0lEQVR4XoVUO2hUQRTdhwQiCiq6bpK3bz67NmojLGkEQUQkZSBWNra2pvGDiI1gY2Flo6J29opgJQpaWAdEq4DEXsRCIXrum8+7c2feesjNzNzPuZ+Zt4OBQEVC/wro1BXbd+Bax1Hw4iTZjqIKMSl6HAp0Kby67TDq3C6J6IxlqiPD4X5jzFml9EWt9XE47SH9aDTat1LX4+gYu2GZ+6CUOgGyj1qrn9aYF1g3Ic+R6A1sJ2F7jfW8qD9Bpp3NZgta6VsI/g2i6+PxeG/0wto0zRnYfkC+1fWKq1zefnL2yR2xeogK/yB4g3lEIOEibK9IjDWLrTKQyRz8gMArCPqL9Ya0hSPxYEzP4Hczf4wsCTeh/WMI2IF8nU6nDVmlT9jD55Gbd1ZBUUNV36GqIXelLcLHTSaTAzTCRMm3nH+I5wbSt5BdpVFRNBaqKKGSnqxnXOAyZBvk39HuJNoTyCFFVHhBq9baC9LQAqQg19t4KZRgmUhaGtEmLf7ST/u4S5CXkC0Udc17p4DhEBw+4X2n5IO01rquD6PDJ7jwozyjxespkodgpfV9yC4qW+OUcRjIB/smCtiQ4zGBPFGzdq21Gk5fIO8gS9ylwVeKi74N/dUq5ursLbnWonJGToCTQWUfMJpfqOQpjpeNNQ8wiveQc5LYofKVB3K0WPHUYeP/KIm1Zh3LOl7CFKr2l7DzdEFdUTadeZI9LUWAjEyELx3Tyr0y289NkgOkpzDCx/R9QD7jfM8ac9BZ81+e7NeziKKP+DZ6MW9mYUISJV0OMdc+MoH/uOQsfQEyt9sUOkx3hUsgFJSSi6MnzZyIgDmupdL+AW6hYmyeTNJNAAAAAElFTkSuQmCC>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAaCAYAAABctMd+AAACt0lEQVR4XqVWO4sUQRCeYREUD0XPdV2nXzOzySmCuGggCiIXaCacqRhqqokPRExEEAyMBDlEDQQjo0O46FDRwH+gkXCsuYiBgutX3TP9mh4R/Nie7np9XdXVM3dZRsj18x8ROhspt3MIkrWuNRhHq25hBadNEXZjog27ujYzs3bP/8BwOFxQpTolhDgvpVyCakD60Wi0vSgKFrmnN8z9M8AMsgMg+yCF/K6Ueon1VYznpVLrsB3E+jXmZRefpDVoC51Op1uElLcQ/BOk1xlj23wvzvhJ2L5JKTYp8/ioHCL5CBEL8QjBv5Dxim9rC8OGW2Ffk0Ks0doaPb8k4HwZGc0x38j6QnLt9wwb3AxN/rk6jQbKnyBgBvLPdV1z34ng3xVUtSqEXO7NMkap1B2QzzHuprLQMv0wqqraSb1pVM7uwUp03UC6gfHbvwEGUbgm7KP00VhAOsYN+YL5KxpVxS6ujg7VADErGI+pB5PJZIdRe94gHktDTmNsQxMwTZfHaV0qdQmVngALbULX912xv1gMAuCwC4aPHXKdsssW93oRzXyChu8dDvcsIKkNjFWygaPCZZih0WfbUAuQPqAzV6o8E56zPmT9k+Yt1fefPBhnh8qylE38EsZM98z4O5ATSv6EUt9g3ufb6C1F0G3or2SJgyfAfg32dbocsU1HwKhQ5ntk8APOT1WpLqKSh5DfYpxu3Mxp2Sid2DHYX3DGdvfsbZGDENuU52hwzmvoBumQnBI6jETu0VeSyCv0I/JtRJdSgIRKg44SDb5fVxX6KMZ4XGCcHw2c+oJt6foXeinzAXsF8rk0bzaNTVxF8433bhlJvmDkWNVR+HL6MCIXkmzOCaS1Bi42dNNlxIGx3G4eavph04+dwnpS1dg/balkk4rMp+qi778TjSDBzo7tKhlq8BdTCn8AHSRttYjaf2YAAAAASUVORK5CYII=>