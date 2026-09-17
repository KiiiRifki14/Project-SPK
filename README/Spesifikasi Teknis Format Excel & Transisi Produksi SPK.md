# **Spesifikasi Teknis: Format Data Excel/CSV & Rencana Transisi Produksi SPK**

**Dokumen Teknis:** Integrasi Data & Arsitektur Produksi

**Target Pembaca:** AI Developer / Tim Pengembang Sistem Informasi

**Sistem:** SPK Seleksi Mitra Statistik Lapangan BPS Kabupaten Subang

**Metode:** Simple Additive Weighting (SAW)

## **1\. Spesifikasi Format Baku Spreadsheet (Import & Export)**

Sistem menggunakan modul xlsx (SheetJS) untuk memproses berkas spreadsheet (.xlsx dan .csv). Format header dan struktur kolom diatur secara ketat agar parser data pada sisi klien dapat memetakan baris secara deterministik ke dalam skema kriteria ![][image1].

### **1.1 Struktur Kolom & Skema Validasi Data**

| Kolom | Nama Header (Case-Sensitive) | Tipe Data | Skala / Batasan Nilai | Keterangan Atribut |
| :---- | :---- | :---- | :---- | :---- |
| **A** | NIK | String (Teks) | 16 Digit numerik unik | Identitas Kependudukan Pelamar |
| **B** | Nama | String (Teks) | Maksimal 150 karakter | Nama Lengkap Calon Mitra |
| **C** | Kelamin | Enum String | L atau P | Jenis Kelamin |
| **D** | No\_HP | String (Teks) | 10 – 15 Digit | Kontak WhatsApp / Telepon |
| **E** | Kecamatan | String (Teks) | Nama Kecamatan di Subang | Wilayah Penugasan Target |
| **F** | Pendidikan | Enum String | SMA/SMK, D3, S1 | Jenjang Pendidikan Formal |
| **G** | C1 | Float / Integer | ![][image2] | Nilai Ujian Kompetensi (*Benefit*) |
| **H** | C2 | Integer | ![][image3] | Riwayat Keikutsertaan Survei (*Benefit*) |
| **I** | C3 | Float / Integer | ![][image2] | Skor Uji Aplikasi CAPI Android (*Benefit*) |
| **J** | C4 | Integer | ![][image4] | Bobot Pendidikan Formal (*Benefit*): • SMA/SMK \= 2 • D3 \= 3 • S1 \= 4 |
| **K** | C5 | Float (Desimal) | Nilai ![][image5] | Jarak Domisili ke Target Tugas (*Cost*). *Proteksi batas bawah otomatis jika bernilai 0\.* |

### **1.2 Aturan Parser & Error Handling Import**

1. **Pemeriksaan Header Baris Pertama:**  
   * Parser wajib membaca baris 1 sebagai nama atribut kunci.  
   * Jika kolom C1 s.d. C5 atau NIK tidak ditemukan, sistem menampilkan pesan galat: *"Format header Excel tidak sesuai standar template."*  
2. **Sanitasi Data:**  
   * Sel kosong pada nilai kriteria otomatis diisi nilai standar (![][image6] untuk *Benefit*, ![][image7] untuk *Cost*).  
   * Nilai teks pada kolom numerik dikonversi dengan parseFloat() atau Number().  
3. **Pemberian Template Otomatis:**  
   * Fitur **Export Excel** berfungsi ganda: mengekspor data terdaftar sekaligus menjadi acuan template kosong yang valid bagi pengguna.

## **2\. Status Fitur "Muat Sampel" (Prototipe vs Produksi)**

### **2.1 Peran pada Fase Prototipe (Development / Demo)**

* **Fungsi:** Bertindak sebagai *Data Seeder* instan pada lingkungan pengembangan lokal.  
* **Tujuan:** Memungkinkan pengujian logika matematis SAW, validasi matriks ![][image8], serta simulasi kuota tanpa mengharuskan pengguna melakukan input manual baris per baris.

### **2.2 Transisi pada Fase Produksi (Production / Real-World)**

Ketika sistem diimplementasikan secara resmi di BPS Kabupaten Subang:

1. **Mode Lingkungan (Environment Flag):**  
   * Tombol "Muat Sampel" disembunyikan jika process.env.NODE\_ENV \=== 'production' atau melalui konfigurasi hak akses (hanya terlihat pada akun pengembang/admin penguji).  
2. **Substitusi dengan Fitur Sinkronisasi Data Riil:**  
   * Tombol digantikan oleh fungsi **"Tarik Data Pendaftaran"** yang terhubung langsung ke:  
     * Endpoint API Rekrutmen Mitra Resmi BPS (Sobat BPS / SIMETRA).  
     * Google Forms / Database pendaftaran daring via *webhook* atau integrasi tabel staging.

## **3\. Desain Arsitektur untuk Penerapan Dunia Nyata**

Aplikasi dirancang dengan pemisahan dependensi (*Separation of Concerns*):

┌────────────────────────────────────────────────────────┐  
│               Komponen Antarmuka (UI)                  │  
│       Dashboard, Kriteria, Pelamar, Ranking, Dapur     │  
└──────────────────────────┬─────────────────────────────┘  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ Memanggil  
┌──────────────────────────▼─────────────────────────────┐  
│          sawCalculator.js (Deterministic Engine)       │  
│    Rumus SAW, Normalisasi R, Skor V, Tie-Breaker       │  
└──────────────────────────┬─────────────────────────────┘  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ Mengambil Data  
┌──────────────────────────▼─────────────────────────────┐  
│          storageService.js (Repository Layer)          │  
│   Saat ini: LocalStorage (Browser Persistence)          │  
│   Produksi : REST API Adapter (MySQL / PostgreSQL BPS)  │  
└────────────────────────────────────────────────────────┘

1. **Logika Matematis SAW Bebas Dependensi:**  
   * Berkas sawCalculator.js tidak terikat dengan media penyimpanan. Data array apa pun yang masuk dengan atribut ![][image1] akan diproses secara identik.  
2. **Kesiapan Migrasi Backend:**  
   * Pengembang instansi nantinya cukup mengganti fungsi baca/tulis di storageService.js dari localStorage.getItem() / localStorage.setItem() menjadi panggilan fetch() atau axios ke server basis data BPS, tanpa perlu mengubah komponen UI maupun rumus kalkulasi SPK.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAaCAYAAADloEE2AAAFAklEQVR4Xr1XS4gdRRTtRgKKvwk6jsO819X93sgQFRQfKopCCBoFEUQDggousjCICz8kfggSCUFBRR0EQVQcYRa6UjAIroYEdCG4E0RXgpqFiCAiGHHGc7q7qqtvfbrfG8cDl+66595bt299O0lKpNWjC8ZMvwT8SrXgAqYNUq+JTxfCNLYNZvPyoxWrHVh2I9subIu0j0ONjsEhHMpRtBBndxDxEobQ166B6+FqgjCmnYWviPn5+QvyPN+bZdkBpdQeqM4ht7CwcP7S0tKg7aMRDOphbI1kZVuCvPshk+smu5DvVcyZuUPO1UaDwWA5qb9BwtUEgMBXZkp9iYL8geAf4vmkUtkHeP+cHaP9GZ639Y+481heXr5IZWoVeZ9FfhvI9QU8T0C+htylsuwIdK/rMjhl7fqWyWSyC4GOQs4i0DOo9Hk2PxgObwX3O+TH4MypO+nqy4t0Nj/ksw+F+QU5fyLzQvsS8F9AtiD32lwDexZqjdVmYTAb3kKAvyH3NUwDTlFwJynWdK0xy2cRcb/UodsKfjAHE8V5m9/gWpR5PwKbX1W1NUwPBDjE6uL5bOLGr1RpabcGu+eMrvVsmp4ALUjeRCpfJGvBUCmXP5c4Z8yp0Wh0sTAwLdjdDbvTKysrF8rIrrUANyo4/wz5fjweDyVvkJYj9U6msN9sE0yjXQejCcJm6y3gI8gmZ49FOUC+LM5qMHxITwaVP8ZZAzkhWQmOUGj6zgIdw38F1BBcNUg3Qf6CfIXNdnfboA1uAZfi5LV1sd4MeFyjgw2s2c3yBOqJPsGb/cJj7VFpRKiaK5fU0/WArgoTD5rSa/9ewNG3CPkBnZxBhyPJdyAdDofXF0WxXxI+YATn0M+iK5mj46BJfxv13reFQX1Qcg7KWpQrZC7Pi8eR89XYSq7A9z40HnEbCRSrTobFoSwawmOfV5v2zXzH8wHIpyjsNxzFlqHPtyhPusM8VfAUklVCruEPyhg2dHG42UrORlHk1yDHp/hufesW5CfEuN+aVC4QfLfiupXFsUDv6r6QvYcN+zKbY5JlcWgU7mZGhAOq6oIXKI7xS2FzFDa3s1EX53jbREIQGK1X4bSJD73Ta1B1gluye/8xxdkurC6d3j1Av3uRzz+QNxPPbYiAzY3gX9EHCIuDXF+E3MKi8lZd9hbruygKhUDfQU5hTV5uc7wlI9Dz4J5ItK8VwS2OE75EavL380SYcVEf5VyGvyn3IEmR1x3g18fm/mOK8zH3GwraJ/ntll8NkQmC5aq6Zv+JAO+j+TDkDbRPQ/a5HhXyAmvfFKdtIivpDdCJ2osPEYADh9xermfQBuRR5H4EBWPOh+Xvj0AKu3V84zFJONApsEjAPRTs6uOk/Iv1oHbATFvDhtfMnB4V6GEyFXj3wgzYj8IcKIr8htz5tamg+AOKS6w+CWG3RpF2ArOny+Cz7Dl2j+a9Zxo9zRygMAeR70tckiwglxXkMWkX6SDCWDMcwa9F4HchZyDfslPIXMuhA+Ge/JjWXkP78cTFQL7GVYGcj0PWm3+yKHSIWVOIIR4zznZhOm/OmqIoFlioJOYsGdmWaPiYZT+rEGu0fjrhnc1LUekl+sJ2rt+rR92hN7i26EK3xX+D/6ufGFo5RBLyFNxFQwRNtoFqYFuj7YVDOYqp4UZwNR70MpoOfcdLcrrp+DsxHEWFttpv5Nf2Q5dvjI9xOwZ0+i8jpuGFnFCGQAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAAAWCAYAAADD9rIuAAAEbUlEQVR4XtVYPWgUQRTeRQUFfxATxdzdzG0uGuyEQ0WIVhaKKKIWYgQrFWwECwXBSmzsTKEgoliIKGkVwUIlFoJVChUE0YggCulMoYL6vd2Z29ndmZ2Zu72EfPBud9773pu99+3P7AYBIYx/e0dcR1NM47LDI6lAzTrUkYVagCXsB0sxSziBE6kSeMzkQnXhVIB0ml4mNJ9AetgZgZVUGvY9oIWC75H58vuEag5DrWKp6EHVo6ukDvTZeu/8QjmGer2+gnF+nHN+C3YtiqJRDU2LkZFNqxlj50TuZdjGPAcIm83mDsQmYDdg++Fbkic5w3JQaTi0UQvw5RfgUkDDiV0af4zh4eE1aNoz2JXBwcGVaOZW7L+DHTFnJYCYoPFpiHQKecuxvw/bD/BvV2ghY/wCOC8Rj2q12jps75Oo7XZ7mcLLoHxmBc5EC9Q6VdU0wbc+mncRDXuD7Vrpw3gc9j6Kmhtih77oUnBuwyZpXzoxvopaT+nqpDH22/B9x3ZMcrA/zBmfgaB7pW/eoP8vHRTCwlGqYcFRFVCYQxgSqNmM7qmhRqOxDf6f2B5Mvdkj4dRozr+RyBk/54dhcySOGF+FzXDlNjg6OroK4ylw7gb5wqXIUl0SXThVwT6XRnEb0KgtsFmc0RmRxNk/Rw1O62Urg7MHV8NfEkmNYHwAef9g4+IW+DgvEt1WMX7B5RWsOXaf/6HFwhfQwu8/hqkYJpHyfhVSjPyVpPoHUjEMIrHE73fkAv1W1lwsjVgWJqVBR8iG5sUwiaTOSSJIMWK/CKoikQCJQGyGdUQKE5FYUbxq4NaZAsvu6Br2SiUnBxq0z0kkzSyIn5dipN4wI1IURRuw/zEvhnqFpeIJiLlo5SfySeiOET/va7Va6wNlSa853PmDZnKNyx0mMQp+AXUyl9ud8uwx3O7MV5J4FaB3L4Oxzj6412HNfA2CqUG+/hilwT6BiRVafnUnRUIjLqn+FCGt7sbA+WMSCXY4SJbpk9ws0hSt9BKvuL+bGmHyx9AENS49skR15FyiK1iqy7DSrMe0EpNRRis3zn/TVubQSy+W5EMyHe9BNXA+wyYkh4A6Z+CbhW2hMYmojim9NjQ0gPHbfG6pSAU4E7PoMs2EisvpgSaegH1BwyLhCrF/BfaahCGH+EowDfsF25nntQSPniMYP4I9CMQLLsQcwRX5FeIdE3lBvdHYBc4PpZYfRGd6bpCpgMnvjJ4LZEGNZYzfRMOeo5GHqPF4OL+lZ4LkiCvuSTP55MOlP/mkxMj/kCeLkDvIfQVR65JD4MkL7iecDKfBPcmTz05nEQqd/071RAGVn80trVQatIbdkRYKQzR8M5p4FCLsVr+pOUy2hJ5hlEtbGucJBLoa6XlFRvtJYYfqEuZelsCNaGfZGYsWi+OvWY7SEjbBJc2F0zs0sxRcBUd/oJ/G8kVAhTNRgzjXUsAS1qOrpMCSpzYl26DSNIFSTmlQA1++MzSFNS4TPKgKNFkuJ8bigO9p0m/4H8N/wfrw4X1LVjUAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAWCAYAAACL6W/rAAACbUlEQVR4XrWWP4sVMRTF5xWCwoIrOojue8nMCIqd8LC1srFwEbRSv4dguwjiFxDs9kNYWWgpWKu9jZWd29joSSYzSebemz9v1x9kd97JuTc5ybD7mqaA1VKowNfGXYhOFpF0ButZFVkp0jpEJ46ZcIa4iMBKedJF6VkOd2j8syPUk5yVZ4J4mc3lYYqKE4WuMr/IVL5ery8orZ9qrd9hvOn7/lZkDDnNmrW15IAYJH0YhosI8wHjqL3S7nVddwchv2mlHy+9Uo+zgbltCWJlipRWLxDqi1Lq0jSPz88wvuPmrlrJ/5ghrYjgSJ46ETIU+k0YE6rr+uNQ32w2d3Fjv/H7MNQJZNOZ8DvhujDNGGkEoW5j/MLrdxyaEHiLYCeYexXI1TBZk3hrRRGHDaD1iQlWohcjH3Ix/lB26IIAD3Ezf82ryN3YrO+4QEkF7+HVYnArD6Zgoe6DyTeGufOovzYPFTwvxsHB9ctN5W69OVPGHbr0yoW6dGP2UMb/e9FQ87OaNRzca/TaHysrvtc5Y+iXniMQYMDCP+dgzjkFw+ZeBvaAcHNie4FavxxG7NS27R4CfMJ4b16tSUew+9D+mN+h/39TsukSjwWbf66U/oEgvZNWeJ2O8Pmz+VYyKt5/KjJ97HTSUxyrabbb7TmEe4swH7u+e6THUF/NV6ulN9MqT6YBmXYC0S2Mykk3huEmAj7p++6eCRvPRp+8UHyAkpEpYiSL1aVJkdqCWn+Mr3Z/hEi7WOA9EgsjXyedrnuWVmSkEkiZ1D9Jrb9hoyUIw8eSf2YOKNmYmSQSESbi1Xkbr8rEfp9DCkMEBtnzDyL3WWa/DmXzAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAWCAYAAAC40nDiAAACjUlEQVR4XtWYz24TMRDGN6oQQpW4IBFVibxZJWeEyKFSb3BG4tozPEBfAPECiBsn3oIn4MCFA6r6EH2Qjh03ttffeMa7Ln9+kpP0m5nP3llnd9Ou+xMsRCFFCGMWh7JJtQLAM5HkieOg/wykWAieWbCCVrWpj8ZVk5NQXWCZVKQDW3ONANng5HH5WbUsQImdoI64Fvh4CUTaIyxFDTgZGUL4/2LSwYAzO8nH05v+dd/3vzabzeV+v380jjvmTFCk3liu4DIadKxUtl6vn1Aj31NDb+j9w3K5PB3nzCXMD3YBFhoAPIGkpnweDordiXZHUiN/0/i42+2ejhL5HtTS1KDVonQw02TyCTXxDY2fND6vVqtnx6zwUo+6DDRIjX/M4oj7zSVyeoyUE8UXtDPPqZE/aHylcRZCNUgzjtHkC836J4hWSF/rx8aYT9TEW7p+7kJkCnMOPt2h4S/BUQgH0sTYX20xJr7hGNNfhRsOsARSU5r668xwFlYzbLNo511RA68H++jzyj76aIo1ORV4O42ry/EvcT5XG/IzVZAyIcXeje1d2T83viPpZJxzD15oOoEwnQMfTC3eoOgDgkDSAMvsDcPfOOwN5KIrNO8AtHFkkUxoRYUxPuMlqeNUCH1t39Ku+z4Mw4surqzwkIuEo1DD+3CunK6maLDQHHwD+OMOqPVMSHFhobkgx+GlLJIJLHwmH7kHLDqWuM8xnF4EzKtGk83nZBH7U28YhqW/LtIwZ+b4OR3b7fZ5566X3GnT8ID/hY4p+s85AQC6Hr6kBn0LwxzeTawd9S+ku18tmg02iQqzB1vDNMASgKQG1AZpxtP/3yBbbCYECiEA1wjN1wSr8+A8NetJcTmaRM8dNEM1JE57KAUAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAABjklEQVR4Xo1SsUoDQRC9KwSFQAh42Fxmdi6g2IUctlZpLJSAVup/CLbBxh8Q7PIRVhZaCqnV3sbKzjQ2+nZ29rIXUjjJ3t6+ee/N3N1kGSLHz//Dve25R8Mpj2A7TKTLqPEc75u9ZZFkYok0ZUWTq0VZllvEfM7E90x0K072QiapW1VVl5kfsaZFsd1xIkOQ37BOA1fLZhkRXTHTnIh7sQ2ILuD+LiI7CoDUAzgX52ZBHXru98sD4N/YT1QK1T7Wl3MyC27higo1iAv0fWNluQZx4YlqaC9acQ64OdIxgF9npRXMtSU1EDPwTR9BrcTmo+Wpo8e1tO+FmtLRUnv0LQkqhR7/S2SqUOKz1WM0IPJPfa1oURQdEJ+hfgB503gw4DHwH5DHOiP+AtdLOHwAFOPlEE5BfhlUg25AsEb1aAOkOySfRNzESK+oMDRhEngzGI5duJ+JyGENcew37kmsS61Oq0Lr9yZak5+k9WGX5+VnC9DST5GEp6tR6jkS4uCtCT9mjXol1QLVLDYd3RF/FDpN6K01mpgAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAACiElEQVR4XqVWu4oUQRTtDhYUBFlkFJyeul0zoJit24iYbLQICoqgkfoBfoGC6WDiDwhmfoQmBgomwkYbqLChgUYauYEm47lVdatvPWZVPNBdVfeee0695tE0Dq1vYivDbOxiujPmK8yIkMspWbhmVhhUJhplKrnSNAV7psJjn98i6t4lZZ38OJdqUQWJnnPOHdB2XXfcEN0loud4nlprz4dsyj0CROYi6q4mQV03n89PkqHXMFhOJpMTve230P+I57aiebiZSqdp+t5eNsY8hMkeJrpC/1HC1eAkSHtoN2OM6B6MPmGGZzTXIyi0bNSz0Q0YXQf/0BAb5Q6NM9lkExS80OnZbHYJ8R/drLupwh7F3judwRkZqq8IYhdA+GajkX9zIXKHyD1R9AKiNRr5rSvWhBk4QlxROANXaHx8ZBflEWJE+owivCD2l1b51knhaKTXWyJfUcLkLpLXMAtnpOOydb21akX/YqTAZyqCfEY657fUZFu3HmuN5OJAcA7C196yIAd9Iu450eOxKqZHAdGhYETh1qmlOyp/QHHob0F6CbNjQoLRLmK/sK27UsUfbFz7s6mMh1weuQwpoY3bdx/PZwjbwGixbUuM37M4x6bT6SmM9yH2E+0VLcbfilhJ2AGT7sCIthm2tzdg9AzENziTWxBbovAD+lsi51ZO9ApfOQfWWpI4LssDxL/gWcFkxS1qv6N9t1gsTouHRovZn4PhHQjtDMOwIYTyrTv/CX/WSpy3WXKh/XscMT2OlGn1G6XiZXUNBUumHqxUXhvrMrnppZaHDycVSVMW1kwLUonit7r0zOJ5xzV/NnIUeXRPkIzWDxQq8eQbpM0puWl2CQq02b+yjI3hb2ddexQ5ZIMTAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,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>