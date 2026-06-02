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

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_resfood';

// Helper to calculate Jalur and Harga Platform based on Expiry Date
function hitungJalurDanHarga(tglExpired, hargaAsli) {
  const expiryDate = new Date(tglExpired);
  const today = new Date();
  
  // Set to midnight to calculate pure date differences
  expiryDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  let jalur = 'A';
  let hargaPlatform = hargaAsli;
  
  if (diffDays > 2) {
    jalur = 'A';
    hargaPlatform = hargaAsli; // harga normal
  } else if (diffDays === 2) {
    jalur = 'A';
    hargaPlatform = hargaAsli * 0.8; // diskon 20%
  } else if (diffDays === 1) {
    jalur = 'A';
    hargaPlatform = hargaAsli * 0.5; // diskon 50%
  } else if (diffDays >= -2 && diffDays <= 0) {
    jalur = 'B';
    hargaPlatform = 0; // Jalur B (pakan hewan / non-konsumsi, gratis)
  } else {
    jalur = 'C';
    hargaPlatform = 0; // Jalur C (daur ulang, gratis)
  }
  
  return { jalur, hargaPlatform };
}

// Middleware untuk verifikasi token (Autentikasi)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, userId, email, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

// Middleware khusus Admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Akses ditolak. Khusus Admin.' });
  }
  next();
};

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello from the Express backend!');
});

const userProfileSelect = {
  id: true,
  nama: true,
  email: true,
  role: true,
  isActive: true,
  noTelp: true,
  kecamatan: true,
  alamatDetail: true,
  namaToko: true,
  foto: true,
  onboardingTourSeen: true,
  onboardingPromptSeen: true,
  createdAt: true
};

function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return null;
  const digits = String(rawPhone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('0')) return `+62${digits.slice(1)}`;
  return `+62${digits}`;
}

function toUserProfileCompat(user) {
  const alamatParts = [user.kecamatan, user.alamatDetail].filter(Boolean);
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    no_telp: user.noTelp || '',
    kecamatan: user.kecamatan || '',
    alamat_detail: user.alamatDetail || '',
    alamat: alamatParts.join(', '),
    nama_toko: user.namaToko || `${user.nama} Store`,
    foto: user.foto || null,
    onboarding_tour_seen: Boolean(user.onboardingTourSeen),
    onboarding_prompt_seen: Boolean(user.onboardingPromptSeen),
    poin: 100,
    carbon_score: 25.5,
    createdAt: user.createdAt
  };
}

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nama, email, password, no_telp } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Nama, Email, dan Password harus diisi!' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal harus 8 karakter!' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Enkripsi password (salt 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database (Default role: USER, isActive: true)
    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        noTelp: normalizePhoneNumber(no_telp)
      },
      select: userProfileSelect
    });

    // Buat JWT Token
    const token = jwt.sign(
      { id: newUser.id, userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil!',
      token,
      user: toUserProfileCompat(newUser)
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
      where: { email },
      select: {
        ...userProfileSelect,
        password: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email atau Password salah!' });
    }

    // Cek isActive
    if (!user.isActive) {
      return res.status(403).json({ message: 'Akun Anda dinonaktifkan' });
    }

    // Cek kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau Password salah!' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { id: user.id, userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: toUserProfileCompat(user)
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/user/profile -> Dapatkan profil user saat ini
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: userProfileSelect
    });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    res.json(toUserProfileCompat(user));
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// PUT /api/user/profile -> Update profil user saat ini
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const {
      nama,
      no_telp,
      kecamatan,
      alamat_detail,
      nama_toko,
      onboarding_tour_seen,
      onboarding_prompt_seen
    } = req.body;

    const updateData = {};
    if (typeof nama === 'string' && nama.trim()) updateData.nama = nama.trim();
    if (typeof no_telp !== 'undefined') updateData.noTelp = normalizePhoneNumber(no_telp);
    if (typeof kecamatan !== 'undefined') updateData.kecamatan = kecamatan ? String(kecamatan).trim() : null;
    if (typeof alamat_detail !== 'undefined') updateData.alamatDetail = alamat_detail ? String(alamat_detail).trim() : null;
    if (typeof nama_toko !== 'undefined') updateData.namaToko = nama_toko ? String(nama_toko).trim() : null;
    if (typeof onboarding_tour_seen === 'boolean') updateData.onboardingTourSeen = onboarding_tour_seen;
    if (typeof onboarding_prompt_seen === 'boolean') updateData.onboardingPromptSeen = onboarding_prompt_seen;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Tidak ada data profil yang dikirim untuk diupdate.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: userProfileSelect
    });

    res.json({ message: 'Profil berhasil diperbarui', user: toUserProfileCompat(updatedUser) });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/user/profile/photo -> Upload / Update foto profil user saat ini
app.post('/api/user/profile/photo', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const fotoUrl = req.file ? '/uploads/' + req.file.filename : null;
    if (!fotoUrl) {
      return res.status(400).json({ message: 'File foto wajib diunggah.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { foto: fotoUrl },
      select: userProfileSelect
    });

    res.json({ message: 'Foto profil berhasil diperbarui', user: toUserProfileCompat(updatedUser), fotoUrl });
  } catch (error) {
    console.error('Update Profile Photo Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/user/contributions -> Dapatkan kontribusi (makanan yang diupload) dari user saat ini
app.get('/api/user/contributions', authMiddleware, async (req, res) => {
  try {
    const contributions = await prisma.makanan.findMany({
      where: { penyediaId: req.user.id, NOT: { status: 'DIHAPUS' } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nama: true,
        stok: true,
        jalur: true,
        createdAt: true,
        tglExpired: true,
        hargaAsli: true
      }
    });

    // Hitung ulang secara dinamis untuk response
    const mapped = contributions.map(c => {
      const { jalur } = hitungJalurDanHarga(c.tglExpired, c.hargaAsli);
      return {
        id: c.id,
        nama: c.nama,
        stok: c.stok,
        jalur: jalur,
        createdAt: c.createdAt
      };
    });

    res.json(mapped);
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
        role: true
      },
      take: 10
    });

    // Mock data leaderboard untuk compatibility frontend
    const mapped = topUsers.map((u, i) => ({
      id: u.id,
      nama: u.nama,
      nama_toko: u.nama + " Store",
      carbon_score: 100 - i * 10,
      role: u.role,
      foto: null
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// ==========================================
// MAKANAN / KATALOG API (CRUD MAKANAN)
// ==========================================

// GET /api/makanan -> Ambil semua makanan yang AKTIF (publik)
app.get('/api/makanan', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { status: 'AKTIF', stok: { gt: 0 } },
      include: {
        penyedia: { select: { id: true, nama: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Hitung ulang jalur & hargaPlatform dinamis saat response
    const mapped = makanan.map(m => {
      const { jalur, hargaPlatform } = hitungJalurDanHarga(m.tglExpired, m.hargaAsli);
      return {
        ...m,
        jalur: jalur,
        hargaPlatform: hargaPlatform,
        harga_asli: m.hargaAsli,
        harga_platform: hargaPlatform,
        tgl_expired: m.tglExpired,
        created_at: m.createdAt,
        penyedia: {
          nama: m.penyedia.nama,
          nama_toko: m.penyedia.nama + " Store",
          no_telp: "08123456789",
          alamat: "Solo, Jawa Tengah"
        }
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Get Makanan Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/makanan/terbaru -> Ambil makanan terbaru untuk Dashboard
app.get('/api/makanan/terbaru', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { status: 'AKTIF', stok: { gt: 0 } },
      include: {
        penyedia: { select: { id: true, nama: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 4
    });

    // Hitung ulang jalur & hargaPlatform dinamis saat response
    const mapped = makanan.map(m => {
      const { jalur, hargaPlatform } = hitungJalurDanHarga(m.tglExpired, m.hargaAsli);
      return {
        ...m,
        jalur: jalur,
        hargaPlatform: hargaPlatform,
        harga_asli: m.hargaAsli,
        harga_platform: hargaPlatform,
        tgl_expired: m.tglExpired,
        created_at: m.createdAt,
        penyedia: {
          nama: m.penyedia.nama,
          nama_toko: m.penyedia.nama + " Store",
          no_telp: "08123456789",
          alamat: "Solo, Jawa Tengah"
        }
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Get Terbaru Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// GET /api/makanan/saya -> Ambil makanan milik user yang sedang login
app.get('/api/makanan/saya', authMiddleware, async (req, res) => {
  try {
    const makanan = await prisma.makanan.findMany({
      where: { penyediaId: req.user.id, NOT: { status: 'DIHAPUS' } },
      orderBy: { createdAt: 'desc' }
    });

    // Hitung ulang jalur & hargaPlatform dinamis saat response
    const mapped = makanan.map(m => {
      const { jalur, hargaPlatform } = hitungJalurDanHarga(m.tglExpired, m.hargaAsli);
      return {
        ...m,
        jalur: jalur,
        hargaPlatform: hargaPlatform,
        harga_asli: m.hargaAsli,
        harga_platform: hargaPlatform,
        tgl_expired: m.tglExpired,
        created_at: m.createdAt
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Get Makanan Saya Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// POST /api/makanan -> Tambah makanan (Butuh Token)
app.post('/api/makanan', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { nama, deskripsi, foto, hargaAsli, harga_asli, tglExpired, tgl_expired, stok } = req.body;
    
    const hargaAsliVal = parseFloat(hargaAsli || harga_asli);
    const tglExpiredVal = tglExpired || tgl_expired;
    const stokVal = parseInt(stok) || 1;

    if (!nama || isNaN(hargaAsliVal) || !tglExpiredVal) {
      return res.status(400).json({ message: 'Nama, Harga Asli, dan Tanggal Kadaluarsa harus diisi!' });
    }

    let fotoUrl = foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80';
    if (req.file) {
      fotoUrl = '/uploads/' + req.file.filename;
    }
    const penyediaId = req.user.id;

    // Hitung otomatis jalur & hargaPlatform menggunakan helper
    const { jalur, hargaPlatform } = hitungJalurDanHarga(tglExpiredVal, hargaAsliVal);

    const newMakanan = await prisma.makanan.create({
      data: {
        penyediaId,
        nama,
        deskripsi: deskripsi || '',
        foto: fotoUrl,
        hargaAsli: hargaAsliVal,
        hargaPlatform: hargaPlatform,
        jalur: jalur,
        tglExpired: new Date(tglExpiredVal),
        stok: stokVal,
        status: 'AKTIF' // Status langsung AKTIF (tanpa approval admin)
      }
    });

    const compat = {
      ...newMakanan,
      harga_asli: newMakanan.hargaAsli,
      harga_platform: newMakanan.hargaPlatform,
      tgl_expired: newMakanan.tglExpired,
      created_at: newMakanan.createdAt
    };

    res.status(201).json({ message: 'Berhasil menambahkan makanan!', makanan: compat });
  } catch (error) {
    console.error('Post Makanan Error:', error && error.stack ? error.stack : error);
    res.status(500).json({ message: (error && error.message) ? error.message : 'Gagal menyimpan data makanan' });
  }
});

// GET /api/makanan/:id -> Ambil detail 1 makanan
app.get('/api/makanan/:id', async (req, res) => {
  try {
    const makanan = await prisma.makanan.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { penyedia: { select: { id: true, nama: true } } }
    });
    if (!makanan || makanan.status === 'DIHAPUS') return res.status(404).json({message: 'Not found'});

    // Hitung ulang jalur & hargaPlatform dinamis saat response
    const { jalur, hargaPlatform } = hitungJalurDanHarga(makanan.tglExpired, makanan.hargaAsli);

    const compat = {
      ...makanan,
      jalur: jalur,
      hargaPlatform: hargaPlatform,
      harga_asli: makanan.hargaAsli,
      harga_platform: hargaPlatform,
      tgl_expired: makanan.tglExpired,
      created_at: makanan.createdAt,
      penyedia: {
        nama: makanan.penyedia.nama,
        nama_toko: makanan.penyedia.nama + " Store",
        no_telp: "08123456789",
        alamat: "Solo, Jawa Tengah"
      }
    };

    res.json(compat);
  } catch (error) {
    res.status(500).json({ message: 'Error server' });
  }
});

// PUT /api/makanan/:id -> Update makanan (Hanya penyedia pemilik)
app.put('/api/makanan/:id', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    console.log('--- Update Makanan Request ---');
    try { console.log('User:', req.user); } catch(e){}
    try { console.log('Body keys:', Object.keys(req.body)); } catch(e){}
    try { console.log('Body sample:', { nama: req.body.nama, harga_asli: req.body.harga_asli, harga_platform: req.body.harga_platform }); } catch(e){}
    try { console.log('File:', req.file ? req.file.filename : null); } catch(e){}
    console.log('-----------------------------');
    const id = parseInt(req.params.id);
    const { nama, deskripsi, foto, hargaAsli, harga_asli, hargaPlatform, harga_platform, tglExpired, tgl_expired, stok } = req.body;
    const makanan = await prisma.makanan.findUnique({
      where: { id }
    });

    if (!makanan || makanan.status === 'DIHAPUS') {
      return res.status(404).json({ message: 'Makanan tidak ditemukan' });
    }

    // Hanya penyedia pemilik yang boleh update
    if (makanan.penyediaId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik makanan ini.' });
    }
    
    // Siapkan data update
    const hargaAsliVal = hargaAsli || harga_asli ? parseFloat(hargaAsli || harga_asli) : makanan.hargaAsli;
    const tglExpiredVal = tglExpired || tgl_expired ? new Date(tglExpired || tgl_expired) : makanan.tglExpired;
    const stokVal = stok ? parseInt(stok) : makanan.stok;

    // Determine hargaPlatform: allow manual override via hargaPlatform/harga_platform
    let hargaPlatformVal;
    if (typeof hargaPlatform !== 'undefined' && !isNaN(parseFloat(hargaPlatform))) {
      hargaPlatformVal = parseFloat(hargaPlatform);
    } else if (typeof harga_platform !== 'undefined' && !isNaN(parseFloat(harga_platform))) {
      hargaPlatformVal = parseFloat(harga_platform);
    } else {
      const calc = hitungJalurDanHarga(tglExpiredVal, hargaAsliVal);
      hargaPlatformVal = calc.hargaPlatform;
    }
    const { jalur } = hitungJalurDanHarga(tglExpiredVal, hargaAsliVal);
    let updateData = {
      nama: nama || makanan.nama,
      deskripsi: deskripsi !== undefined ? deskripsi : makanan.deskripsi,
      hargaAsli: hargaAsliVal,
      hargaPlatform: hargaPlatformVal,
      jalur: jalur,
      tglExpired: tglExpiredVal,
      stok: stokVal,
    };

    if (req.file) {
      updateData.foto = '/uploads/' + req.file.filename;
    } else if (foto) {
      updateData.foto = foto;
    }

    const updated = await prisma.makanan.update({
      where: { id },
      data: updateData
    });

    const compat = {
      ...updated,
      harga_asli: updated.hargaAsli,
      harga_platform: updated.hargaPlatform,
      tgl_expired: updated.tglExpired,
      created_at: updated.createdAt
    };

    res.json({ message: 'Berhasil diupdate', data: compat });
  } catch (error) {
    console.error('Update Makanan Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

// DELETE /api/makanan/:id -> Ubah status jadi DIHAPUS (soft delete) (Hanya penyedia pemilik)
app.delete('/api/makanan/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const makanan = await prisma.makanan.findUnique({
      where: { id }
    });

    if (!makanan || makanan.status === 'DIHAPUS') {
      return res.status(404).json({ message: 'Makanan tidak ditemukan' });
    }

    // Hanya penyedia pemilik yang boleh soft delete
    if (makanan.penyediaId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik makanan ini.' });
    }

    const deleted = await prisma.makanan.update({
      where: { id },
      data: { status: 'DIHAPUS' }
    });

    res.json({ message: 'Makanan berhasil dihapus', data: deleted });
  } catch (error) {
    console.error('Delete Makanan Error:', error);
    res.status(500).json({ message: 'Error server' });
  }
});

// ==========================================
// TRANSAKSI & PEMBAYARAN API (Model Baru Jalur A)
// ==========================================

// POST /api/transaksi -> Membuat transaksi baru Jalur A (Menunggu Pembayaran)
app.post('/api/transaksi', authMiddleware, async (req, res) => {
  try {
    const { makananId, makanan_id, jumlah } = req.body;
    const targetMakananId = parseInt(makananId || makanan_id);
    const targetJumlah = parseInt(jumlah);
    const pemesanId = req.user.id;

    if (!targetMakananId || isNaN(targetJumlah) || targetJumlah <= 0) {
      return res.status(400).json({ message: 'Makanan ID dan jumlah yang valid wajib diisi!' });
    }

    // 1. Cari makanan
    const makanan = await prisma.makanan.findUnique({
      where: { id: targetMakananId }
    });

    if (!makanan || makanan.status === 'DIHAPUS') {
      return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
    }

    // 2. Validasi stok mencukupi
    if (makanan.stok < targetJumlah) {
      return res.status(400).json({ message: 'Stok makanan tidak mencukupi!' });
    }

    // 3. Validasi makanan Jalur A
    const { jalur, hargaPlatform } = hitungJalurDanHarga(makanan.tglExpired, makanan.hargaAsli);
    if (jalur !== 'A') {
      return res.status(400).json({ message: 'Transaksi ini hanya diperuntukkan untuk makanan Jalur A!' });
    }

    // 4. Validasi pemesan bukan penyedia makanan itu sendiri
    if (makanan.penyediaId === pemesanId) {
      return res.status(400).json({ message: 'Anda tidak dapat memesan makanan Anda sendiri!' });
    }

    // 5. Buat transaksi (Tipe: KONSUMSI, Status: MENUNGGU, totalBayar = hargaPlatform * jumlah)
    // Catatan: Stok BELUM berkurang di tahap ini
    const totalBayar = hargaPlatform * targetJumlah;

    const transaksi = await prisma.transaksi.create({
      data: {
        makananId: targetMakananId,
        pemesanId,
        jumlah: targetJumlah,
        totalBayar: totalBayar,
        tipe: 'KONSUMSI',
        status: 'MENUNGGU',
        buktiBayar: null
      },
      include: {
        makanan: true
      }
    });

    // Mock Pembayaran object response untuk kompatibilitas frontend lama
    const mockPembayaran = {
      id: transaksi.id,
      transaksi_id: transaksi.id,
      metode: transaksi.metode,
      jumlah: transaksi.totalBayar,
      status: 'pending'
    };

    res.status(201).json({
      message: 'Transaksi berhasil dibuat, silakan upload bukti transfer!',
      transaksi,
      pembayaran: mockPembayaran // Untuk kompatibilitas frontend
    });
  } catch (error) {
    console.error('Create Transaksi Error:', error);
    res.status(500).json({ message: 'Gagal membuat transaksi' });
  }
});

// PATCH /api/transaksi/:id/bukti -> Upload bukti transfer pembayaran (mengisi Transaksi.buktiBayar)
app.patch('/api/transaksi/:id/bukti', authMiddleware, upload.single('bukti'), async (req, res) => {
  try {
    const transaksiId = parseInt(req.params.id);
    let buktiUrl = req.body.buktiBayar || req.body.bukti;
    
    if (req.file) {
      buktiUrl = '/uploads/' + req.file.filename;
    }

    if (!buktiUrl) {
      return res.status(400).json({ message: 'Bukti transfer berupa URL atau file wajib dilampirkan!' });
    }

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan!' });
    }

    // Validasi: harus pemesan
    if (transaksi.pemesanId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemesan transaksi ini.' });
    }

    // Update field buktiBayar, status tetap MENUNGGU
    const updatedTransaksi = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: {
        buktiBayar: buktiUrl
      },
      include: {
        makanan: true
      }
    });

    // Mock Pembayaran object response untuk kompatibilitas frontend lama
    const mockPembayaran = {
      id: updatedTransaksi.id,
      transaksi_id: updatedTransaksi.id,
      bukti_transfer: updatedTransaksi.buktiBayar,
      status: 'menunggu'
    };

    res.json({
      message: 'Bukti transfer berhasil diunggah, menunggu konfirmasi penyedia makanan!',
      transaksi: updatedTransaksi,
      pembayaran: mockPembayaran
    });
  } catch (error) {
    console.error('Upload Bukti Error:', error);
    res.status(500).json({ message: 'Gagal mengunggah bukti transfer' });
  }
});

// PATCH /api/transaksi/:id/konfirmasi -> Terima / Tolak transaksi (oleh Penyedia Makanan)
app.patch('/api/transaksi/:id/konfirmasi', authMiddleware, async (req, res) => {
  try {
    const transaksiId = parseInt(req.params.id);
    const { aksi } = req.body; // "terima" | "tolak"

    if (!['terima', 'tolak'].includes(aksi)) {
      return res.status(400).json({ message: 'Aksi tidak valid! Gunakan "terima" atau "tolak".' });
    }

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId },
      include: {
        makanan: true
      }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan!' });
    }

    // Validasi: harus penyedia makanan bersangkutan
    if (transaksi.makanan.penyediaId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pemilik/penyedia makanan ini.' });
    }

    if (transaksi.status !== 'MENUNGGU') {
      return res.status(400).json({ message: `Transaksi ini sudah diproses dengan status: ${transaksi.status}` });
    }

    if (aksi === 'terima') {
      // Validasi stok ulang sebelum approve (cegah double order)
      const freshMakanan = await prisma.makanan.findUnique({
        where: { id: transaksi.makananId }
      });

      if (!freshMakanan || freshMakanan.status === 'DIHAPUS') {
        return res.status(400).json({ message: 'Makanan sudah tidak tersedia lagi!' });
      }

      if (freshMakanan.stok < transaksi.jumlah) {
        return res.status(400).json({ message: 'Gagal menerima transaksi. Stok makanan tidak mencukupi!' });
      }

      // Kurangi stok makanan
      const newStok = freshMakanan.stok - transaksi.jumlah;
      const nextStatus = newStok === 0 ? 'SELESAI' : 'AKTIF';

      await prisma.makanan.update({
        where: { id: freshMakanan.id },
        data: {
          stok: newStok,
          status: nextStatus
        }
      });

      // Update transaksi status jadi AKTIF
      const updatedTransaksi = await prisma.transaksi.update({
        where: { id: transaksiId },
        data: {
          status: 'AKTIF'
        },
        include: {
          makanan: true
        }
      });

      return res.json({
        message: 'Transaksi berhasil diterima dan dikonfirmasi!',
        transaksi: updatedTransaksi
      });

    } else if (aksi === 'tolak') {
      // Update transaksi status jadi DIBATALKAN
      const updatedTransaksi = await prisma.transaksi.update({
        where: { id: transaksiId },
        data: {
          status: 'DIBATALKAN'
        },
        include: {
          makanan: true
        }
      });

      return res.json({
        message: 'Transaksi berhasil ditolak dan dibatalkan.',
        transaksi: updatedTransaksi
      });
    }

  } catch (error) {
    console.error('Konfirmasi Transaksi Error:', error);
    res.status(500).json({ message: 'Gagal memproses konfirmasi transaksi' });
  }
});

// GET /api/transaksi/masuk -> Daftar bukti bayar masuk untuk penyedia (status MENUNGGU)
app.get('/api/transaksi/masuk', authMiddleware, async (req, res) => {
  try {
    const transaksiMasuk = await prisma.transaksi.findMany({
      where: {
        status: 'MENUNGGU',
        makanan: {
          penyediaId: req.user.id
        }
      },
      include: {
        pemesan: { select: { id: true, nama: true, email: true } },
        makanan: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transaksiMasuk);
  } catch (error) {
    console.error('Get Transaksi Masuk Error:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data transaksi masuk.' });
  }
});

// GET /api/transaksi/penyedia -> Semua riwayat transaksi masuk (sebagai penyedia)
app.get('/api/transaksi/penyedia', authMiddleware, async (req, res) => {
  try {
    const transaksiPenyedia = await prisma.transaksi.findMany({
      where: {
        makanan: {
          penyediaId: req.user.id
        }
      },
      include: {
        pemesan: { select: { id: true, nama: true, email: true } },
        makanan: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(transaksiPenyedia);
  } catch (error) {
    console.error('Get Transaksi Penyedia Error:', error);
    res.status(500).json({ message: 'Gagal mendapatkan data transaksi masuk.' });
  }
});

// GET /api/transaksi/saya -> Riwayat transaksi milik user yang login (termasuk KONSUMSI & DAUR_ULANG)
app.get('/api/transaksi/saya', authMiddleware, async (req, res) => {
  try {
    const transaksiSaya = await prisma.transaksi.findMany({
      where: {
        pemesanId: req.user.id
      },
      include: {
        makanan: {
          include: {
            penyedia: { select: { id: true, nama: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(transaksiSaya);
  } catch (error) {
    console.error('Get Transaksi Saya Error:', error);
    res.status(500).json({ message: 'Gagal mendapatkan riwayat transaksi.' });
  }
});

// ==========================================
// PENGAMBILAN JALUR B & C (DAUR_ULANG)
// ==========================================

// POST /api/transaksi/ambil -> Mengajukan pengambilan makanan Jalur B & C
app.post('/api/transaksi/ambil', authMiddleware, async (req, res) => {
  try {
    const { makananId, makanan_id, jumlah } = req.body;
    const targetMakananId = parseInt(makananId || makanan_id);
    const targetJumlah = parseInt(jumlah);
    const pengambilId = req.user.id;

    if (!targetMakananId || isNaN(targetJumlah) || targetJumlah <= 0) {
      return res.status(400).json({ message: 'Makanan ID dan jumlah yang valid wajib diisi!' });
    }

    // 1. Cari makanan
    const makanan = await prisma.makanan.findUnique({
      where: { id: targetMakananId }
    });

    if (!makanan || makanan.status === 'DIHAPUS') {
      return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
    }

    // 2. Validasi stok mencukupi
    if (makanan.stok < targetJumlah) {
      return res.status(400).json({ message: 'Stok makanan tidak mencukupi!' });
    }

    // 3. Validasi makanan Jalur B atau C
    const { jalur } = hitungJalurDanHarga(makanan.tglExpired, makanan.hargaAsli);
    if (jalur !== 'B' && jalur !== 'C') {
      return res.status(400).json({ message: 'Pengambilan gratis ini hanya diperuntukkan untuk makanan Jalur B atau C!' });
    }

    // 4. Validasi pengambil bukan penyedia makanan itu sendiri
    if (makanan.penyediaId === pengambilId) {
      return res.status(400).json({ message: 'Anda tidak dapat mengambil makanan Anda sendiri!' });
    }

    // 5. Buat transaksi (Tipe: DAUR_ULANG, status: MENUNGGU, totalBayar: 0, buktiBayar: null)
    // Catatan: Stok BELUM berkurang di tahap ini
    const transaksi = await prisma.transaksi.create({
      data: {
        makananId: targetMakananId,
        pemesanId: pengambilId,
        jumlah: targetJumlah,
        totalBayar: 0,
        tipe: 'DAUR_ULANG',
        status: 'MENUNGGU',
        buktiBayar: null,
        metode: 'GRATIS'
      },
      include: {
        makanan: true
      }
    });

    res.status(201).json({
      message: 'Permohonan pengambilan berhasil diajukan! Menunggu penyedia menyiapkan makanan.',
      transaksi
    });
  } catch (error) {
    console.error('Create Ambil Error:', error);
    res.status(500).json({ message: 'Gagal mengajukan permohonan pengambilan makanan' });
  }
});

// PATCH /api/transaksi/:id/terima-ambil -> Konfirmasi penerimaan pengambilan (oleh Pengambil/Pemesan)
app.patch('/api/transaksi/:id/terima-ambil', authMiddleware, async (req, res) => {
  try {
    const transaksiId = parseInt(req.params.id);
    const pengambilId = req.user.id;

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan!' });
    }

    // Validasi: harus pengambil / pemesan
    if (transaksi.pemesanId !== pengambilId) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pengambil transaksi ini.' });
    }

    if (transaksi.tipe !== 'DAUR_ULANG') {
      return res.status(400).json({ message: 'Endpoint ini hanya digunakan untuk transaksi tipe DAUR_ULANG!' });
    }

    if (transaksi.status !== 'MENUNGGU') {
      return res.status(400).json({ message: `Status transaksi saat ini adalah ${transaksi.status}, tidak dapat diubah ke AKTIF.` });
    }

    // Update status -> AKTIF (Penyedia sudah siapkan makanan, siap diambil)
    const updated = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: {
        status: 'AKTIF'
      },
      include: {
        makanan: true
      }
    });

    res.json({
      message: 'Makanan siap diambil! Status transaksi kini AKTIF.',
      transaksi: updated
    });
  } catch (error) {
    console.error('Terima Ambil Error:', error);
    res.status(500).json({ message: 'Gagal mengonfirmasi penerimaan pengambilan makanan.' });
  }
});

// PATCH /api/transaksi/:id/selesai-ambil -> Konfirmasi selesai pengambilan (oleh Pengambil)
app.patch('/api/transaksi/:id/selesai-ambil', authMiddleware, async (req, res) => {
  try {
    const transaksiId = parseInt(req.params.id);
    const pengambilId = req.user.id;

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: transaksiId },
      include: {
        makanan: true
      }
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan!' });
    }

    // Validasi: harus pengambil
    if (transaksi.pemesanId !== pengambilId) {
      return res.status(403).json({ message: 'Akses ditolak. Anda bukan pengambil transaksi ini.' });
    }

    if (transaksi.tipe !== 'DAUR_ULANG') {
      return res.status(400).json({ message: 'Endpoint ini hanya digunakan untuk transaksi tipe DAUR_ULANG!' });
    }

    if (transaksi.status !== 'AKTIF') {
      return res.status(400).json({ message: 'Pengambilan makanan belum dimulai atau sudah diproses sebelumnya.' });
    }

    // Validasi stok ulang sebelum dipotong (Double order check)
    const freshMakanan = await prisma.makanan.findUnique({
      where: { id: transaksi.makananId }
    });

    if (!freshMakanan || freshMakanan.status === 'DIHAPUS') {
      return res.status(400).json({ message: 'Makanan sudah tidak tersedia!' });
    }

    if (freshMakanan.stok < transaksi.jumlah) {
      return res.status(400).json({ message: 'Stok makanan tidak mencukupi untuk memenuhi pengambilan ini.' });
    }

    // Kurangi stok makanan
    const newStok = freshMakanan.stok - transaksi.jumlah;
    const nextStatus = newStok === 0 ? 'SELESAI' : 'AKTIF';

    await prisma.makanan.update({
      where: { id: freshMakanan.id },
      data: {
        stok: newStok,
        status: nextStatus
      }
    });

    // Update status -> SELESAI
    const updated = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: {
        status: 'SELESAI'
      },
      include: {
        makanan: true
      }
    });

    res.json({
      message: 'Makanan berhasil diambil! Status transaksi kini SELESAI.',
      transaksi: updated
    });
  } catch (error) {
    console.error('Selesai Ambil Error:', error);
    res.status(500).json({ message: 'Gagal mengonfirmasi penyelesaian pengambilan makanan.' });
  }
});

// ==========================================
// ADMIN PORTAL & ENDPOINTS
// ==========================================

// GET /api/admin/dashboard -> Dashboard Statistik Admin
app.get('/api/admin/dashboard', authMiddleware, adminOnly, async (req, res) => {
  try {
    // 1. Total makanan terdaftar (status AKTIF)
    const totalMakananTerdaftar = await prisma.makanan.count({
      where: { status: 'AKTIF' }
    });

    // 2. Total transaksi (semua status)
    const totalTransaksi = await prisma.transaksi.count();

    // 3. Total user aktif (isActive true, role USER)
    const totalUserAktif = await prisma.user.count({
      where: {
        isActive: true,
        role: 'USER'
      }
    });

    // 4. Total penyedia (user yang punya minimal 1 makanan)
    const totalPenyedia = await prisma.user.count({
      where: {
        makanan: {
          some: {}
        }
      }
    });

    res.json({
      totalMakananTerdaftar,
      totalTransaksi,
      totalUserAktif,
      totalPenyedia
    });
  } catch (error) {
    console.error('Admin Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Error server saat memuat statistik dashboard.' });
  }
});

// GET /api/admin/users -> Daftar semua user dengan role USER
app.get('/api/admin/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        nama: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { makanan: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = users.map(u => ({
      id: u.id,
      nama: u.nama,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt,
      jumlahMakananTerdaftar: u._count.makanan
    }));

    res.json(result);
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ message: 'Error server saat memuat data user.' });
  }
});

// PATCH /api/admin/users/:id/toggle -> Toggle isActive user (banned / aktif)
app.patch('/api/admin/users/:id/toggle', authMiddleware, adminOnly, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);

    const targetUser = await prisma.user.findUnique({
      where: { id: targetId }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Validasi: Tidak bisa menonaktifkan akun admin lain
    if (targetUser.role === 'ADMIN') {
      return res.status(400).json({ message: 'Tidak dapat mengubah status keaktifan akun admin lain!' });
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: {
        isActive: !targetUser.isActive
      }
    });

    res.json({
      message: `Status keaktifan user ${updated.nama} berhasil diubah menjadi ${updated.isActive ? 'AKTIF' : 'NONAKTIF'}.`,
      user: {
        id: updated.id,
        nama: updated.nama,
        isActive: updated.isActive
      }
    });
  } catch (error) {
    console.error('Admin Toggle User Status Error:', error);
    res.status(500).json({ message: 'Error server saat mengubah status keaktifan user.' });
  }
});

// GET /api/admin/makanan -> Dapatkan semua makanan dari semua penyedia beserta info penyedia
app.get('/api/admin/makanan', authMiddleware, adminOnly, async (req, res) => {
  try {
    const allMakanan = await prisma.makanan.findMany({
      include: {
        penyedia: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Hitung ulang secara dinamis untuk response
    const mapped = allMakanan.map(m => {
      const { jalur, hargaPlatform } = hitungJalurDanHarga(m.tglExpired, m.hargaAsli);
      return {
        ...m,
        jalur: jalur,
        hargaPlatform: hargaPlatform,
        harga_asli: m.hargaAsli,
        harga_platform: hargaPlatform,
        tgl_expired: m.tglExpired,
        created_at: m.createdAt
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Admin Get Makanan Error:', error);
    res.status(500).json({ message: 'Error server saat memuat data semua makanan.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
