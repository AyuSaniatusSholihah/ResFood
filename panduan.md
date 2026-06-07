# 📖 Panduan Penggunaan Aplikasi TurahanSolo (ResFood)

> **Dokumen ini merupakan pedoman resmi penggunaan aplikasi TurahanSolo** — platform penyelamatan surplus pangan berbasis ekonomi sirkular di Kota Solo. Panduan ini disusun berdasarkan fitur yang telah tersedia di dalam aplikasi.

---

## Daftar Isi

1. [Tentang Aplikasi](#1-tentang-aplikasi)
2. [Peran Pengguna (User & Admin)](#2-peran-pengguna)
3. [Alur Penggunaan: User](#3-alur-penggunaan-user)
   - 3.1 [Registrasi & Login](#31-registrasi--login)
   - 3.2 [Onboarding (Pertama Kali Masuk)](#32-onboarding-pertama-kali-masuk)
   - 3.3 [Menjelajahi Dashboard Utama](#33-menjelajahi-dashboard-utama)
   - 3.4 [Upload Makanan (Sebagai Penyumbang)](#34-upload-makanan-sebagai-penyumbang)
   - 3.5 [Melihat Katalog Surplus](#35-melihat-katalog-surplus)
   - 3.6 [Membeli Makanan (Sebagai Pembeli)](#36-membeli-makanan-sebagai-pembeli)
   - 3.7 [Proses Pembayaran & Biaya Layanan](#37-proses-pembayaran--biaya-layanan)
   - 3.8 [Invoice & Kode Pengambilan](#38-invoice--kode-pengambilan)
   - 3.9 [Riwayat Transaksi](#39-riwayat-transaksi)
   - 3.10 [Profil & Skor Lingkungan](#310-profil--skor-lingkungan)
   - 3.11 [Gamifikasi & Leaderboard](#311-gamifikasi--leaderboard)
   - 3.12 [Fitur Tambahan (Flash Sale, Peta, Notifikasi, Dampak)](#312-fitur-tambahan)
4. [Alur Penggunaan: Admin](#4-alur-penggunaan-admin)
5. [Sistem Klasifikasi Jalur (A / B / C)](#5-sistem-klasifikasi-jalur)
6. [Skema Biaya Layanan (Monetisasi)](#6-skema-biaya-layanan-monetisasi)
7. [Diagram Alur Lengkap](#7-diagram-alur-lengkap)

---

## 1. Tentang Aplikasi

**TurahanSolo (ResFood)** adalah platform berbasis web yang menghubungkan pemilik surplus makanan dengan masyarakat yang membutuhkan, sekaligus mengurangi limbah pangan (*food waste*) di Kota Solo. Aplikasi ini mendorong ekonomi sirkular: makanan yang masih layak konsumsi dapat dijual dengan harga diskon, sedangkan makanan yang sudah tidak layak dapat disalurkan untuk pakan hewan atau kompos — semuanya gratis.

**Nilai Inti:**
- 🌿 **Keberlanjutan Lingkungan** — Setiap makanan yang diselamatkan mengurangi emisi CO2.
- 🤝 **Gotong Royong Digital** — Semua orang bisa menjadi penyumbang sekaligus pembeli.
- 🏆 **Gamifikasi** — Poin, badge, dan leaderboard untuk memotivasi partisipasi.

---

## 2. Peran Pengguna

Aplikasi ini memiliki **2 role utama**:

| Role | Deskripsi |
|------|-----------|
| **User** | Pengguna umum. **Satu akun bisa melakukan semuanya**: upload makanan (menjadi penyumbang) dan membeli/mengklaim makanan dari pengguna lain (menjadi pembeli). Tidak ada pemisahan akun antara penyumbang dan pembeli. |
| **Admin** | Administrator sistem. Memiliki akses ke Admin Portal untuk memantau statistik platform, mengelola pengguna (ban/aktifkan), dan memverifikasi transaksi. |

---

## 3. Alur Penggunaan: User

### 3.1 Registrasi & Login

1. Buka aplikasi → Anda akan diarahkan ke halaman **Register** (`/register`).
2. Isi data: **Nama**, **Email**, dan **Password**.
3. Klik **Daftar**. Akun Anda akan langsung aktif.
4. Untuk login berikutnya, buka halaman **Login** (`/login`) dan masukkan email serta password.

### 3.2 Onboarding (Pertama Kali Masuk)

Saat pertama kali mengakses Dashboard setelah registrasi, sistem akan menampilkan **Onboarding Flow Modal**:

1. **Isi Alamat Kecamatan** — Pilih kecamatan Anda di Solo (Banjarsari, Jebres, Laweyan, Pasar Kliwon, atau Serengan). Langkah ini **wajib** untuk melakukan transaksi pembelian.
2. **Tour Panduan** — Panduan singkat cara menggunakan aplikasi.
3. Anda juga bisa melewati (*skip*) langkah alamat, namun akan diminta melengkapinya saat checkout.

### 3.3 Menjelajahi Dashboard Utama

Setelah login, Anda masuk ke **Dashboard** (`/dashboard`) yang menampilkan:

- **Sapaan & Statistik Cepat**: Jumlah makanan tersedia, countdown Flash Sale.
- **Tombol "Bagikan Makanan"**: Pintasan cepat untuk mengunggah makanan surplus.
- **Quick Access Icons**: Navigasi ke Katalog, Riwayat, Dampak Lingkungan, dan Notifikasi.
- **Banner Flash Sale**: Informasi diskon spesial yang sedang berlangsung.
- **Tab Jalur Distribusi (A / B / C)**: Filter makanan berdasarkan jalur distribusinya.
- **Daftar Makanan**: Daftar makanan yang bisa ditambahkan ke keranjang.

> ⚠️ **Catatan:** Anda **tidak bisa** memasukkan makanan milik sendiri ke keranjang. Sistem akan otomatis menandai produk Anda sendiri dengan label "Produk Sendiri".

### 3.4 Upload Makanan (Sebagai Penyumbang)

Setiap user dapat menjadi penyumbang dengan mengunggah makanan surplus:

1. Tekan tombol **"Bagikan Makanan"** di Dashboard, atau navigasi ke `/upload` atau `/makanan/tambah`.
2. Isi formulir berikut:
   - **Nama Makanan** — Contoh: "Nasi Kotak Rendang Daging"
   - **Deskripsi Makanan** — Contoh: "Masih tersegel rapat, sisa catering pernikahan"
   - **Foto Makanan** — Upload gambar (JPG, PNG, WebP)
   - **Harga Asli (Rp)** — Harga awal makanan sebelum diskon
   - **Stok (Porsi)** — Jumlah porsi yang tersedia
   - **Tanggal & Waktu Kadaluarsa** — Batas waktu kelayakan makanan
3. Sistem akan otomatis melakukan **Klasifikasi Jalur** (lihat Bagian 5) berdasarkan tanggal kadaluarsa.
4. Anda bisa melihat **Preview Klasifikasi Otomatis** di bawah form sebelum submit:
   - Jalur distribusi (A/B/C)
   - Harga penyelamatan di platform
   - Selisih waktu kadaluarsa
5. Klik **"Daftarkan Makanan"** → Makanan akan langsung tampil di **Katalog Surplus** dan bisa dilihat/dibeli oleh pengguna lain.

### 3.5 Melihat Katalog Surplus

Halaman Katalog (`/katalog`) menampilkan seluruh makanan surplus yang tersedia:

- **Filter berdasarkan Jalur**: Semua, Jalur A (Konsumsi), Jalur B (Pakan Hewan), Jalur C (Daur Ulang).
- Setiap item menampilkan: Foto, Nama, Penyedia, Deskripsi, Harga (coret jika diskon), Stok.
- **Jika makanan milik sendiri**: Tombol berubah menjadi **"Kelola →"** yang mengarahkan ke halaman Edit Produk.
- **Jika makanan milik orang lain**: Tombol **"Detail →"** untuk melihat detail dan bisa menambah ke keranjang.
- **Tombol FAB "Tambah Makanan"**: Shortcut di pojok kanan bawah untuk langsung upload makanan baru.

### 3.6 Membeli Makanan (Sebagai Pembeli)

1. Dari Dashboard atau Katalog, klik makanan yang diinginkan → masuk ke **Detail Makanan** (`/makanan/:id`).
2. Klik tombol **"+ Keranjang"** untuk menambahkan makanan ke keranjang belanja.
3. Buka halaman **Keranjang** (`/cart`) untuk melihat seluruh item yang sudah dipilih.
4. Di Keranjang, Anda bisa melihat:
   - Daftar item beserta kuantitas dan harga per item
   - **Total Harga** (harga semua item)
   - **Biaya Layanan** — Rp 2.000 (lihat Bagian 6)
   - **Total Belanja** (Total Harga + Biaya Layanan)
5. Klik **"Lanjut ke Pembayaran"** untuk melanjutkan ke halaman checkout.

### 3.7 Proses Pembayaran & Biaya Layanan

Halaman Pembayaran (`/payment`) menampilkan:

**Kolom Kiri:**
- **Konfirmasi Pesanan**: Daftar ulang makanan yang akan dibeli.
- **Metode Pembayaran**: Pilih salah satu dari **QRIS**, **GoPay**, atau **OVO**.
- Jika memilih QRIS, akan muncul kode QR mockup untuk di-scan.

**Kolom Kanan:**
- **Dampak Carbon Anda**: Estimasi berapa kg CO2 dan berapa liter air yang Anda hemat dari transaksi ini.
- **Rincian Pembayaran**:
  - Harga Item
  - Biaya Layanan (Rp 2.000)
  - **Total Bayar**

**Langkah-langkah Pembayaran:**
1. Pilih metode pembayaran.
2. Klik **"Konfirmasi Pembayaran"**.
3. Sistem akan membuat record transaksi dan menampilkan form **Upload Bukti Pembayaran**.
4. Transfer ke rekening yang ditampilkan, lalu upload foto bukti transfer.
5. Klik **"Kirim Bukti Transfer"**.
6. Setelah berhasil, Anda akan diarahkan ke halaman Invoice.

> ⚠️ **Penting**: Anda harus sudah mengisi kecamatan di profil sebelum bisa melakukan transaksi. Jika belum, sistem akan mengarahkan Anda kembali ke Dashboard.

### 3.8 Invoice & Kode Pengambilan

Setelah pembayaran berhasil, halaman **Invoice** (`/invoice`) menampilkan:

- **Status Transaksi**: "Menunggu Verifikasi Admin" (berwarna oranye) atau "Pembayaran Berhasil" (berwarna hijau).
- **Order ID**: Nomor referensi unik (contoh: RSF-123456).
- **Daftar Belanjaan**: Nama makanan, penjual, kuantitas, dan harga.
- **Total Pembayaran**.
- **Dampak Lingkungan**: Berapa kg CO2 dan liter air yang Anda hemat.
- **Kode Pengambilan**: Kode unik (contoh: RF-123456) yang perlu Anda tunjukkan saat mengambil makanan ke penyedia.
- Tombol **"Simpan Bukti"** untuk mencetak/menyimpan invoice.

### 3.9 Riwayat Transaksi

Halaman Riwayat (`/riwayat`) menampilkan seluruh transaksi Anda dengan filter:

| Tab | Deskripsi |
|-----|-----------|
| **Semua** | Gabungan seluruh transaksi (diurutkan dari terbaru) |
| **Sebagai Pembeli** | Transaksi di mana Anda membeli makanan (tipe: KONSUMSI) |
| **Sebagai Penyedia** | Transaksi di mana orang lain membeli makanan milik Anda |
| **Pengambilan B&C** | Transaksi makanan jalur B/C (tipe: DAUR_ULANG) |

Untuk transaksi Jalur B & C (Pengambilan gratis), tersedia tombol aksi:
- **"Makanan Siap Diambil"** — Konfirmasi bahwa pengambilan siap dilakukan (status: MENUNGGU).
- **"Konfirmasi Selesai Pengambilan"** — Tandai bahwa makanan sudah diambil (status: AKTIF → SELESAI).

### 3.10 Profil & Skor Lingkungan

Halaman Profil (`/profile`) adalah pusat informasi akun Anda:

**Header Profil:**
- Foto profil (bisa diunggah/diganti)
- Nama, Nama Toko/Warung, Lokasi Kecamatan, Tanggal Bergabung
- **Skor CO2 Diselamatkan** — Angka total kg CO2 yang berhasil Anda cegah (ditampilkan dengan animasi counter).

**Statistik:**
- Makanan Diselamatkan (porsi)
- Total Transaksi (kali)
- Tantangan Selesai (badge)

**Edit Profil:**
- Nama Lengkap
- Nama Toko / Warung
- Kecamatan (Solo)
- Nomor WhatsApp (format +62)
- Alamat Lengkap

**Koleksi Badge:**
- Badge yang sudah diraih: Eco Hero, Donor Jalur A, Solo Lestari, dll.
- Badge yang belum terkunci ditampilkan dengan ikon gembok.

**Linimasa Kontribusi:**
- Riwayat kronologis setiap makanan yang Anda unggah ke katalog, dibedakan berdasarkan Jalur A (donasi) atau Jalur B/C (daur ulang).

**Papan Peringkat (Leaderboard):**
- Peringkat mingguan berdasarkan **Carbon Score** (kg CO2 diselamatkan).
- Posisi Anda ditandai dengan highlight khusus dan label "(Anda)".
- Peringkat #1 ditandai dengan ikon medali.

### 3.11 Gamifikasi & Leaderboard

Halaman Gamifikasi (`/gamifikasi`) menampilkan:

> ⚠️ *Fitur ini masih dalam pengembangan.*

- **Total Skor Poin** dan **Peringkat Komunitas**.
- **Lencana Pencapaian (Badges)**:
  - *Penyelamat Pemula* — Menyelamatkan makanan pertama kali.
  - *Pahlawan Hijau* — Mencapai score reduksi 10 kg CO2.
  - *Donatur Setia* — Mendonasikan makanan 5 kali berturut-turut.
- **Papan Peringkat Solo**: Daftar Top 5 pengguna dengan poin tertinggi beserta badge mereka.

**Cara Mendapat Poin:**
- ✅ Upload/bagikan makanan surplus → Poin bertambah saat makanan berhasil diambil/dibeli orang lain.
- ✅ Beli/selamatkan makanan dari pengguna lain → Poin bertambah saat transaksi selesai.
- Semakin banyak makanan yang dibagikan dan dibeli, semakin tinggi peringkat Anda.

### 3.12 Fitur Tambahan

| Fitur | Halaman | Deskripsi |
|-------|---------|-----------|
| **Flash Sale** | `/flash-sale` | Makanan surplus dengan diskon besar dan countdown timer. |
| **Peta Distribusi** | `/peta` | Peta lokasi distribusi makanan surplus di sekitar Solo. |
| **Notifikasi** | `/notifikasi` | Pusat notifikasi untuk update transaksi dan aktivitas. |
| **Dampak Lingkungan** | `/dampak` | Visualisasi statistik dampak lingkungan dari aktivitas penyelamatan pangan secara keseluruhan. |
| **Impact Page** | `/impact` | Halaman lengkap tentang dampak yang telah dicapai oleh komunitas. |

---

## 4. Alur Penggunaan: Admin

Admin mengakses **Admin Portal** melalui halaman `/admin` (hanya bisa diakses oleh akun dengan role Admin).

**Fitur Admin Portal:**

1. **Statistik Dashboard** — 4 kartu ringkasan:
   - Total Makanan Terdaftar
   - Total Transaksi
   - User Aktif
   - Total Penyedia

2. **Manajemen Pengguna** — Tabel daftar seluruh user (role: USER) yang menampilkan:
   - Nama Pengguna
   - Email
   - Jumlah Makanan Terdaftar
   - Status (Aktif / Banned)
   - Aksi: **Ban User** (nonaktifkan) atau **Aktifkan** (untuk user yang di-ban)

> ℹ️ Tombol aksi akan meminta konfirmasi sebelum mengubah status pengguna.

---

## 5. Sistem Klasifikasi Jalur (A / B / C)

Sistem secara **otomatis** mengklasifikasikan makanan berdasarkan **selisih hari antara tanggal saat ini dan tanggal kadaluarsa**:

| Jalur | Kondisi | Keterangan | Harga Platform |
|-------|---------|------------|----------------|
| **Jalur A** | Lebih dari H-2 (> 2 hari sebelum expired) | **Layak Konsumsi** — Harga Normal | Sama dengan Harga Asli (100%) |
| **Jalur A** | Tepat H-2 (2 hari sebelum expired) | **Layak Konsumsi** — Diskon 20% | 80% dari Harga Asli |
| **Jalur A** | Tepat H-1 (1 hari sebelum expired) | **Layak Konsumsi** — Diskon 50% | 50% dari Harga Asli |
| **Jalur B** | H-0 sampai H+2 (hari expired s/d 2 hari setelah) | **Pakan Hewan / Non-Konsumsi** | Gratis (Rp 0) |
| **Jalur C** | Lebih dari H+2 (> 2 hari setelah expired) | **Daur Ulang / Kompos** | Gratis (Rp 0) |

**Contoh Skenario:**
- Hari ini 7 Juni, makanan expired 12 Juni (selisih +5 hari) → **Jalur A, Harga Normal**
- Hari ini 7 Juni, makanan expired 9 Juni (selisih +2 hari) → **Jalur A, Diskon 20%**
- Hari ini 7 Juni, makanan expired 8 Juni (selisih +1 hari) → **Jalur A, Diskon 50%**
- Hari ini 7 Juni, makanan expired 7 Juni (selisih 0 hari) → **Jalur B, Gratis**
- Hari ini 7 Juni, makanan expired 3 Juni (selisih -4 hari) → **Jalur C, Gratis**

---

## 6. Skema Biaya Layanan (Monetisasi)

Setiap transaksi pembelian di platform dikenakan **Biaya Layanan Aplikasi** sebesar **Rp 2.000** yang dibayarkan oleh **pembeli** saat checkout.

**Rincian Pembayaran saat Checkout:**

```
Harga Makanan (dari Penyumbang)     = Rp X
Biaya Layanan Aplikasi              = Rp 2.000
────────────────────────────────────────────
Total yang dibayar Pembeli          = Rp X + Rp 2.000
```

**Distribusi Dana:**
- **Rp X** (Harga Makanan) → Masuk ke **Penyumbang / Pemilik Makanan**.
- **Rp 2.000** (Biaya Layanan) → Masuk ke **Pengelola Aplikasi / Developer** sebagai biaya operasional platform.

> 💡 Biaya layanan ini memungkinkan penyumbang tetap mendapatkan harga penuh dari makanannya tanpa potongan, sementara platform tetap memiliki sumber pendapatan untuk operasional.

---

## 7. Diagram Alur Lengkap

Berikut adalah diagram alur keseluruhan penggunaan aplikasi:

```
┌─────────────────────────────────────────────────────────┐
│                    REGISTRASI / LOGIN                    │
│                    (User membuat akun)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   ONBOARDING FLOW                        │
│     Isi Kecamatan → Tour Panduan (pertama kali)         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   DASHBOARD UTAMA                        │
│  Statistik │ Quick Access │ Flash Sale │ Daftar Makanan │
└──────┬──────────────────────────────────────┬───────────┘
       │                                      │
       ▼                                      ▼
┌──────────────────┐              ┌────────────────────────┐
│  UPLOAD MAKANAN  │              │   JELAJAHI KATALOG     │
│  (Jadi Penyumbang)│             │   (Jadi Pembeli)       │
│                  │              │                        │
│ Isi Form:        │              │ Filter Jalur A/B/C     │
│ - Nama           │              │ Lihat Detail Makanan   │
│ - Foto           │              │ Tambah ke Keranjang    │
│ - Harga Asli     │              └───────────┬────────────┘
│ - Stok           │                          │
│ - Tgl Expired    │                          ▼
│                  │              ┌────────────────────────┐
│ Klasifikasi      │              │      KERANJANG         │
│ Otomatis:        │              │ Total + Biaya Layanan  │
│ Jalur A/B/C      │              │ = Total Belanja        │
│                  │              └───────────┬────────────┘
│ Tampil di        │                          │
│ Katalog ─────────┼──────────────────────────┘
└──────────────────┘                          │
                                              ▼
                              ┌────────────────────────────┐
                              │       PEMBAYARAN           │
                              │  Pilih Metode: QRIS/GoPay/ │
                              │  OVO → Konfirmasi →        │
                              │  Upload Bukti Transfer     │
                              └───────────┬────────────────┘
                                          │
                                          ▼
                              ┌────────────────────────────┐
                              │         INVOICE            │
                              │  Order ID, Status,         │
                              │  Kode Pengambilan,         │
                              │  Dampak Lingkungan         │
                              └───────────┬────────────────┘
                                          │
                          ┌───────────────┴───────────────┐
                          ▼                               ▼
              ┌──────────────────┐            ┌──────────────────┐
              │ RIWAYAT TRANSAKSI│            │ PROFIL & SKOR    │
              │                  │            │                  │
              │ Tab:             │            │ - CO2 Score      │
              │ - Sebagai Pembeli│            │ - Badge          │
              │ - Sebagai Owner  │            │ - Leaderboard    │
              │ - Pengambilan B&C│            │ - Timeline       │
              └──────────────────┘            │   Kontribusi     │
                                              └──────────────────┘
```

---

## Catatan Penting

1. **Satu Akun, Dua Peran**: Setiap user dapat upload makanan (penyumbang) DAN membeli makanan (pembeli) secara bergantian. Tidak perlu membuat akun terpisah.
2. **Kecamatan Wajib**: Pastikan kecamatan Anda sudah terisi di profil sebelum melakukan pembelian.
3. **Produk Sendiri**: Anda tidak bisa membeli makanan yang Anda upload sendiri.
4. **Verifikasi Admin**: Setelah upload bukti pembayaran, status transaksi akan "Menunggu Verifikasi Admin" sampai admin memverifikasinya.
5. **Jalur B & C Gratis**: Makanan yang sudah melewati tanggal kadaluarsa akan otomatis menjadi gratis dan dialihkan untuk pakan hewan atau daur ulang.

---

*Dokumen ini terakhir diperbarui pada Juni 2026.*
*© 2026 TurahanSolo — Memberdayakan Ekonomi Sirkular Pangan di Kota Solo.*
