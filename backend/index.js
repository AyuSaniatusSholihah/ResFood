const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup direktori uploads jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// JWT Secret (Sebaiknya ditaruh di .env nantinya)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_resfood';

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello from the Express backend!');
});

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Nama, Email, dan Password harus diisi!' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database (Default role: 'pembeli', poin: 0, carbon_score: 0)
    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password_hash: hashedPassword,
        role: 'pembeli',
        poin: 0,
        carbon_score: 0.0
      }
    });

    res.status(201).json({
      message: 'Registrasi berhasil!',
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan Password harus diisi!' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email atau Password salah!' });
    }

    // Cek kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau Password salah!' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// Middleware untuk verifikasi token (Autentikasi)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, ... }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

// GET /api/user/profile -> Dapatkan profil user saat ini
app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat: true,
        nama_toko: true,
        role: true,
        poin: true,
        carbon_score: true,
        foto: true
      }
    });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// PUT /api/user/profile -> Update profil user saat ini
app.put('/api/user/profile', authenticate, async (req, res) => {
  try {
    const { nama, no_telp, alamat, nama_toko } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { nama, no_telp, alamat, nama_toko },
      select: {
        id: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat: true,
        nama_toko: true,
        role: true,
        poin: true,
        carbon_score: true,
        foto: true
      }
    });
    res.json({ message: 'Profil berhasil diperbarui', user: updatedUser });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/user/profile/photo -> Upload / Update foto profil user saat ini
app.post('/api/user/profile/photo', authenticate, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File foto tidak ditemukan' });
    }
    const fotoUrl = '/uploads/' + req.file.filename;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { foto: fotoUrl },
      select: {
        id: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat: true,
        nama_toko: true,
        role: true,
        poin: true,
        carbon_score: true,
        foto: true
      }
    });

    res.json({ message: 'Foto profil berhasil diperbarui', user: updatedUser, fotoUrl });
  } catch (error) {
    console.error('Update Profile Photo Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/user/contributions -> Dapatkan kontribusi (makanan yang diupload) dari user saat ini
app.get('/api/user/contributions', authenticate, async (req, res) => {
  try {
    const contributions = await prisma.makanan.findMany({
      where: { penyedia_id: req.user.userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        nama: true,
        stok: true,
        jalur: true,
        created_at: true
      }
    });
    res.json(contributions);
  } catch (error) {
    console.error('Get Contributions Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/leaderboard -> Dapatkan peringkat kontributor teratas berdasarkan carbon_score
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        nama_toko: true,
        carbon_score: true,
        role: true,
        foto: true
      },
      orderBy: {
        carbon_score: 'desc'
      },
      take: 10
    });
    res.json(topUsers);
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// ==========================================
// MAKANAN / KATALOG API
// ==========================================

// GET /api/makanan -> Ambil semua makanan yang masih tersedia
app.get('/api/makanan', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { status: 'tersedia', stok: { gt: 0 } },
      include: {
        penyedia: { select: { nama: true, nama_toko: true, no_telp: true, alamat: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(makanan);
  } catch (error) {
    console.error('Get Makanan Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/makanan/terbaru -> Ambil makanan terbaru untuk Dashboard
app.get('/api/makanan/terbaru', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { status: 'tersedia', stok: { gt: 0 } },
      include: {
        penyedia: { select: { nama: true, nama_toko: true, no_telp: true, alamat: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 4
    });
    res.json(makanan);
  } catch (error) {
    console.error('Get Terbaru Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/makanan/saya -> Ambil makanan milik user yang sedang login
app.get('/api/makanan/saya', authenticate, async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { penyedia_id: req.user.userId },
      orderBy: { created_at: 'desc' }
    });
    res.json(makanan);
  } catch (error) {
    console.error('Get Makanan Saya Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// POST /api/makanan -> Tambah makanan (Butuh Token)
app.post('/api/makanan', authenticate, upload.single('foto'), async (req, res) => {
  try {
    const { nama, deskripsi, harga_asli, jalur, tgl_expired, stok } = req.body;
    let fotoUrl = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    if (req.file) {
      fotoUrl = '/uploads/' + req.file.filename;
    }
    const penyedia_id = req.user.userId;

    // Perhitungan harga platform (misal: diskon 70% dari harga asli)
    const harga_platform = parseFloat(harga_asli) * 0.3;

    const newMakanan = await prisma.makanan.create({
      data: {
        penyedia_id,
        nama,
        deskripsi: deskripsi || '',
        foto: fotoUrl,
        harga_asli: parseFloat(harga_asli) || 0,
        harga_platform: harga_platform || 0,
        jalur: jalur || 'A', // A = Layak Konsumsi, B = Tidak Layak
        tgl_expired: tgl_expired ? new Date(tgl_expired) : new Date(Date.now() + 86400000), // Default besok
        stok: parseInt(stok) || 1,
        status: 'tersedia'
      }
    });

    res.status(201).json({ message: 'Berhasil menambahkan makanan!', makanan: newMakanan });
  } catch (error) {
    console.error('Post Makanan Error:', error);
    res.status(500).json({ message: 'Gagal menyimpan data makanan' });
  }
});



// --- ADMIN ROUTES ---

// GET /api/admin/stats -> Statistik Dashboard
app.get('/api/admin/stats', authenticate, async (req, res) => {
  try {
    // Di sini seharusnya ada cek role admin, tapi karena mockup, kita lewatkan
    const makananDiselamatkan = await prisma.makanan.aggregate({
      _sum: { stok: true },
      where: { status: 'tersedia' }
    });
    
    // Asumsi 1 porsi = 2.5 kg CO2
    const totalKg = makananDiselamatkan._sum.stok || 0;
    const reduksiCO2 = totalKg * 2.5;

    const userAktif = await prisma.user.count();
    
    const listingLayak = await prisma.makanan.count({ where: { status: 'tersedia', jalur: 'A' } });
    const listingTidak = await prisma.makanan.count({ where: { status: 'tersedia', jalur: 'B' } });

    res.json({
      total_pangan: totalKg,
      reduksi_co2: reduksiCO2,
      user_aktif: userAktif,
      listing_layak: listingLayak,
      listing_tidak: listingTidak,
      listing_total: listingLayak + listingTidak
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

// GET /api/admin/makanan-menunggu -> Antrean persetujuan
app.get('/api/admin/makanan-menunggu', authenticate, async (req, res) => {
  try {
    const menunggu = await prisma.makanan.findMany({
      where: { status: 'menunggu' },
      include: {
        penyedia: { select: { nama: true } }
      },
      orderBy: { created_at: 'asc' }
    });
    res.json(menunggu);
  } catch (error) {
    console.error('Get Menunggu Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

// PUT /api/admin/makanan/:id/status -> Approve / Reject
app.put('/api/admin/makanan/:id/status', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // 'tersedia' or 'ditolak'

    if (!['tersedia', 'ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const updated = await prisma.makanan.update({
      where: { id },
      data: { status }
    });
    res.json({ message: 'Status berhasil diupdate', data: updated });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

// GET /api/admin/users -> Manajemen User
app.get('/api/admin/users', authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        poin: true
      },
      orderBy: { created_at: 'desc' },
      take: 20
    });
    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});


// GET /api/makanan/:id -> Ambil detail 1 makanan
app.get('/api/makanan/:id', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { penyedia: { select: { nama: true, nama_toko: true, no_telp: true, alamat: true } } }
    });
    if (!makanan) return res.status(404).json({message: 'Not found'});
    res.json(makanan);
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// PUT /api/makanan/:id -> Update makanan
app.put('/api/makanan/:id', authenticate, upload.single('foto'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nama, deskripsi, harga_asli, jalur, tgl_expired, stok } = req.body;
    
    let updateData = {
      nama,
      deskripsi: deskripsi || '',
      harga_asli: parseFloat(harga_asli) || 0,
      harga_platform: (parseFloat(harga_asli) * 0.3) || 0,
      jalur: jalur || 'A',
      stok: parseInt(stok) || 1,
    };

    if (tgl_expired) {
      updateData.tgl_expired = new Date(tgl_expired);
    }
    
    if (req.file) {
      updateData.foto = '/uploads/' + req.file.filename;
    }

    const updated = await prisma.makanan.update({
      where: { id, penyedia_id: req.user.userId },
      data: updateData
    });
    res.json({ message: 'Berhasil diupdate', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// ==========================================
// TRANSAKSI & PEMBAYARAN API
// ==========================================

// POST /api/transaksi -> Membuat transaksi baru (Menunggu Pembayaran)
app.post('/api/transaksi', authenticate, async (req, res) => {
  try {
    const { items, metode, total_bayar } = req.body;
    const pemesan_id = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Keranjang belanja kosong' });
    }

    const createdTransactions = [];
    
    for (const item of items) {
      const dbMakananId = parseInt(item.id);
      
      const transaksi = await prisma.transaksi.create({
        data: {
          makanan_id: dbMakananId,
          pemesan_id,
          tipe_pemesan: 'pembeli',
          jumlah: parseInt(item.quantity),
          total_bayar: parseFloat(item.price * item.quantity),
          status: 'pending'
        }
      });

      const pembayaran = await prisma.pembayaran.create({
        data: {
          transaksi_id: transaksi.id,
          metode: metode || 'qris',
          jumlah: parseFloat(item.price * item.quantity),
          status: 'pending'
        }
      });

      createdTransactions.push({ transaksi, pembayaran });
    }

    res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      data: createdTransactions
    });
  } catch (error) {
    console.error('Create Transaksi Error:', error);
    res.status(500).json({ message: 'Gagal membuat transaksi' });
  }
});

// POST /api/pembayaran/:id/bukti -> Upload bukti transfer pembayaran
app.post('/api/pembayaran/:id/bukti', authenticate, upload.single('bukti'), async (req, res) => {
  try {
    const pembayaranId = parseInt(req.params.id);
    if (!req.file) {
      return res.status(400).json({ message: 'Bukti transfer tidak ditemukan' });
    }

    const buktiUrl = '/uploads/' + req.file.filename;

    const pembayaran = await prisma.pembayaran.update({
      where: { id: pembayaranId },
      data: {
        bukti_transfer: buktiUrl,
        status: 'menunggu'
      }
    });

    await prisma.transaksi.update({
      where: { id: pembayaran.transaksi_id },
      data: {
        status: 'menunggu'
      }
    });

    res.json({
      message: 'Bukti transfer berhasil diunggah, menunggu verifikasi admin',
      pembayaran
    });
  } catch (error) {
    console.error('Upload Bukti Error:', error);
    res.status(500).json({ message: 'Gagal mengunggah bukti transfer' });
  }
});

// GET /api/admin/pembayaran -> Mendapatkan semua pembayaran yang butuh verifikasi (oleh Admin)
app.get('/api/admin/pembayaran', authenticate, async (req, res) => {
  try {
    const pembayaran = await prisma.pembayaran.findMany({
      where: { status: 'menunggu' },
      include: {
        transaksi: {
          include: {
            pemesan: { select: { nama: true, email: true } },
            makanan: { select: { nama: true } }
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });
    res.json(pembayaran);
  } catch (error) {
    console.error('Get Admin Pembayaran Error:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data pembayaran' });
  }
});

// PUT /api/admin/pembayaran/:id/verifikasi -> Verifikasi pembayaran oleh Admin (Setujui / Tolak)
app.put('/api/admin/pembayaran/:id/verifikasi', authenticate, async (req, res) => {
  try {
    const pembayaranId = parseInt(req.params.id);
    const { status } = req.body; // 'lunas' or 'ditolak'

    if (!['lunas', 'ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const pembayaran = await prisma.pembayaran.update({
      where: { id: pembayaranId },
      data: { status }
    });

    const transaksiStatus = status === 'lunas' ? 'lunas' : 'ditolak';
    const transaksi = await prisma.transaksi.update({
      where: { id: pembayaran.transaksi_id },
      data: { status: transaksiStatus }
    });

    if (status === 'lunas') {
      const makanan = await prisma.makanan.findUnique({
        where: { id: transaksi.makanan_id }
      });
      
      if (makanan) {
        const newStok = Math.max(makanan.stok - transaksi.jumlah, 0);
        await prisma.makanan.update({
          where: { id: makanan.id },
          data: { stok: newStok }
        });

        const totalKg = transaksi.jumlah;
        const co2Saved = totalKg * 2.5;

        const user = await prisma.user.findUnique({
          where: { id: transaksi.pemesan_id }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              carbon_score: (user.carbon_score || 0) + co2Saved,
              poin: (user.poin || 0) + (transaksi.jumlah * 10)
            }
          });
        }
      }
    }

    res.json({ message: `Pembayaran berhasil diverifikasi sebagai: ${status}`, pembayaran });
  } catch (error) {
    console.error('Verify Pembayaran Error:', error);
    res.status(500).json({ message: 'Gagal memverifikasi pembayaran' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
