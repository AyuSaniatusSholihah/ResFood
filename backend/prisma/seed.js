const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Bersihkan data lama dengan urutan yang aman (ForeignKey constraints)
  console.log('Cleaning up existing database records...');
  await prisma.transaksi.deleteMany({});
  await prisma.makanan.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial data...');

  // 1 Akun Admin
  const admin = await prisma.user.create({
    data: {
      nama: 'Admin Turahan',
      email: 'admin@turahansolo.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // 2 Akun User Biasa
  const user1 = await prisma.user.create({
    data: {
      nama: 'Budi Santoso',
      email: 'budi@gmail.com',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nama: 'Siti Aminah',
      email: 'siti@gmail.com',
      password: hashedPassword,
      role: 'USER',
      isActive: true,
    },
  });

  console.log('Database seeding completed successfully!');
  console.log({
    admin: { id: admin.id, email: admin.email, role: admin.role },
    user1: { id: user1.id, email: user1.email, role: user1.role },
    user2: { id: user2.id, email: user2.email, role: user2.role },
  });
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
