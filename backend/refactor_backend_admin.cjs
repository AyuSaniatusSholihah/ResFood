const fs = require('fs');

const backendIndex = 'd:/Nia/lomba/ResFood/backend/index.js';
let content = fs.readFileSync(backendIndex, 'utf8');

// 1. Change default status in POST /api/makanan from 'tersedia' to 'menunggu'
content = content.replace("status: 'tersedia'", "status: 'menunggu'");

// 2. Append new Admin endpoints
const adminRoutes = `

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

`;

// Append before app.listen
content = content.replace("app.listen(port", adminRoutes + "app.listen(port");

fs.writeFileSync(backendIndex, content, 'utf8');
console.log("Admin routes added to backend/index.js");
