# 🌿 Flowchart Aplikasi ResFood Solo

> **ResFood** adalah platform pengelolaan surplus pangan (makanan berlebih) di Kota Solo. Tujuannya adalah mengurangi limbah makanan, mempercepat distribusi pangan layak konsumsi, dan mendukung ekonomi sirkular.

---

## 1. Alur Utama Pengguna

Flowchart ini menjelaskan alur nyata pengguna di aplikasi ResFood dari registrasi sampai penggunaan fitur utama.

```mermaid
flowchart TD
	A["🏠 Buka Aplikasi ResFood\n(Halaman Utama)"] --> B{"Sudah punya akun?"}

	B -- "Belum" --> C["📝 Daftar Akun Baru\n(Isi: Nama, Email, Password)"]
	C --> D["✅ Akun Berhasil Dibuat"]
	D --> E["🔑 Login Manual\n(Masuk dengan Email & Password)"]

	B -- "Sudah" --> E

	E --> F{"Cek Peran Pengguna"}
	F -- "Admin" --> G["🛡️ Halaman Admin Dashboard"]
	F -- "Pengguna Biasa" --> H["📋 Halaman Dashboard Utama"]

	H --> I{"Login Pertama?"}
	I -- "Ya" --> J["📍 Popup Isi Alamat\n(kecamatan + detail alamat + no hp opsional)"]
	J --> K["📘 Popup Tutorial Penggunaan Aplikasi\n(bisa skip kapan saja)"]
	I -- "Tidak" --> L["Langsung ke Dashboard"]
	K --> L

	L --> M{"Mau ngapain?"}

	M -- "Mau Donasi\nMakanan" --> N["📤 Upload Makanan"]
	M -- "Mau Ambil/Beli\nMakanan" --> O["🛒 Lihat Katalog Surplus"]
	M -- "Lihat Dampak\nLingkungan" --> P["🌍 Halaman Dampak / Impact"]
	M -- "Kelola Profil" --> Q["👤 Halaman Profil"]

	Q --> R["🖼️ Upload Foto Profil\n(foto kosong jika belum diisi)"]
```

---

## 2. Alur Donor / Penyedia Makanan

Ini adalah alur untuk orang yang ingin mendonasikan atau mendaftarkan surplus makanan.

```mermaid
flowchart TD
	A["📤 Buka Halaman Upload"] --> B["📝 Isi Detail Makanan\n- Nama Makanan\n- Deskripsi\n- Harga Asli\n- Stok\n- Tanggal Kadaluarsa\n- Foto Makanan"]
	B --> C{"Data sudah lengkap?"}

	C -- "Belum" --> D["⚠️ Validasi Form\nLengkapi field yang wajib diisi"]
	D --> B

	C -- "Sudah" --> E["🤖 Sistem Hitung Otomatis\nSelisih tanggal expired"]
	E --> F{"Masuk jalur apa?"}

	F -- "Jalur A\n(Layak konsumsi)" --> G["✅ Harga platform dihitung\nNormal / diskon 20% / diskon 50%"]
	F -- "Jalur B\n(Sudah lewat batas aman)" --> H["♻️ Gratis\nDialihkan untuk pakan hewan / non-konsumsi"]
	F -- "Jalur C\n(Lewat lebih lama)" --> I["🌱 Gratis\nDialihkan ke daur ulang / kompos"]

	G --> J["💾 Simpan ke Database"]
	H --> J
	I --> J

	J --> K["📩 Klik Daftarkan Makanan"]
	K --> L["✅ Makanan Berhasil Terdaftar di Katalog"]
```

---

## 3. Alur Penerima / Pembeli Makanan

Ini adalah alur untuk pengguna yang ingin membeli atau mengambil surplus makanan.

```mermaid
flowchart TD
	A["🛒 Buka Katalog / Dashboard"] --> B{"Pilih tab kategori"}

	B -- "Jalur A" --> C["🍽️ Lihat makanan layak konsumsi\n(diskon sesuai waktu kadaluarsa)"]
	B -- "Jalur B" --> D["🐄 Lihat makanan untuk pakan hewan\natau non-konsumsi"]
	B -- "Jalur C" --> E["♻️ Lihat bahan untuk daur ulang\natau kompos"]

	C --> F["👀 Klik makanan yang diinginkan"]
	F --> G["📄 Lihat detail makanan\n- Foto\n- Nama\n- Harga\n- Penyedia\n- Stok\n- Batas waktu"]
	G --> H{"Mau ambil/beli?"}
	H -- "Ya" --> I["🛒 Tambah ke keranjang"]
	H -- "Tidak" --> A

	I --> J["🛍️ Buka keranjang"]
	J --> K["💳 Lanjut ke pembayaran"]
	K --> L["Pilih metode bayar\n(QRIS / GoPay / OVO)"]
	L --> M["📤 Upload bukti pembayaran"]
	M --> N["⏳ Menunggu verifikasi admin"]
	N --> O["✅ Pembayaran diverifikasi"]
	O --> P["🧾 Invoice digital dibuat\n+ info dampak lingkungan"]

	D --> Q["📦 Ajukan pengambilan"]
	Q --> R["Isi form pengambilan\n- Waktu ambil\n- Tujuan penggunaan\n- Catatan"]
	R --> S["📍 Lihat titik temu / lokasi pengambilan"]
	S --> T["📩 Kirim permintaan pengambilan"]
	T --> U["⏳ Menunggu konfirmasi penyedia"]
	U --> V["✅ Pengambilan selesai"]

	E --> W["📦 Ajukan proses daur ulang / kompos"]
	W --> X["⏳ Menunggu konfirmasi dan penjadwalan"]
```

---

## 4. Alur Admin

Ini adalah alur untuk administrator yang mengelola seluruh operasional platform.

```mermaid
flowchart TD
	A["🔑 Login sebagai Admin"] --> B["🛡️ Buka Admin Dashboard"]

	B --> C["📊 Lihat statistik\n- Total pangan terselamatkan\n- Reduksi CO2\n- Jumlah user aktif\n- Listing aktif"]
	B --> D["💳 Verifikasi pembayaran"]
	D --> E["Lihat antrean bukti transfer"]
	E --> F{"Bukti valid?"}
	F -- "Ya ✅" --> G["Setujui pembayaran\n(Status: Lunas)"]
	F -- "Tidak ❌" --> H["Tolak pembayaran\n(Status: Ditolak)"]

	B --> I["👥 Manajemen pengguna\n- Lihat semua user\n- Peran & status\n- Skor dampak"]
	B --> J["🗺️ Peta intensitas limbah\nKota Solo (heatmap)"]
	B --> K["📰 Feed aktivitas terbaru\n- Donasi baru\n- Pengambilan limbah\n- User baru terdaftar\n- Listing kadaluarsa"]
```

---

## 5. Gambaran Besar Ekosistem ResFood

Diagram ini menunjukkan hubungan antar peran dalam ekosistem ResFood.

```mermaid
flowchart LR
	subgraph DONOR["🏪 Penyedia / Donor"]
		D1["Restoran"]
		D2["Rumah Tangga"]
		D3["Pasar Tradisional"]
	end

	subgraph PLATFORM["🌐 Platform ResFood"]
		P1["Upload Makanan"]
		P2["Katalog Surplus"]
		P3["Sistem Pembayaran"]
		P4["Tracking Dampak\nCO2 & Air"]
		P5["Community Challenge"]
	end

	subgraph PENERIMA["🤲 Penerima"]
		R1["Masyarakat Umum\n(Beli Murah)"]
		R2["Peternak\n(Pakan Hewan)"]
		R3["Petani\n(Pupuk Kompos)"]
		R4["Peneliti\n(Riset Limbah)"]
	end

	subgraph ADMIN["🛡️ Admin"]
		A1["Verifikasi\nPembayaran"]
		A2["Monitoring\nStatistik"]
	end

	DONOR -- "Donasi / Upload\nSurplus Makanan" --> P1
	P1 -- "Tersedia di" --> P2
	P2 -- "Pesan / Ambil" --> PENERIMA
	PENERIMA -- "Bayar via\nQRIS / GoPay / OVO" --> P3
	P3 -- "Verifikasi" --> ADMIN
	P1 -- "Catat dampak" --> P4
	P4 -- "Kontribusi ke" --> P5
```

---

## 6. Ringkasan Fitur Utama

| No | Fitur | Penjelasan Singkat |
|----|-------|-------------------|
| 1 | **Registrasi & Login** | Daftar akun baru, lalu login manual setelah registrasi |
| 2 | **Onboarding Awal** | Popup alamat dan tutorial hanya muncul sekali saat login pertama |
| 3 | **Upload Makanan** | Donasi surplus makanan lengkap dengan foto dan klasifikasi jalur otomatis |
| 4 | **Katalog Surplus** | Lihat dan cari makanan surplus yang tersedia |
| 5 | **Keranjang & Pembayaran** | Beli makanan surplus dengan metode pembayaran digital |
| 6 | **Upload Bukti Bayar** | Kirim foto bukti pembayaran untuk diverifikasi admin |
| 7 | **Invoice** | Struk digital otomatis beserta informasi dampak lingkungan |
| 8 | **Pickup / Pengambilan** | Ajukan pengambilan untuk jalur B dan C |
| 9 | **Dashboard Admin** | Monitor statistik, verifikasi pembayaran, dan kelola user |
| 10 | **Halaman Dampak** | Lihat leaderboard, misi komunitas, dan dampak CO2 |
| 11 | **Profil Pengguna** | Kelola data diri, alamat, nomor HP, poin, badge, dan foto profil |

---

> [!TIP]
> **Konsep Dual Jalur adalah inti ResFood:**
> - **Jalur A** = Makanan masih layak konsumsi → dijual murah ke masyarakat
> - **Jalur B** = Makanan sudah tidak layak konsumsi → dialihkan ke pakan hewan / non-konsumsi
> - **Jalur C** = Makanan lewat batas lebih lama → diarahkan ke daur ulang / kompos

Dengan cara ini, makanan tidak terbuang sia-sia dan masih bisa memberi manfaat.
