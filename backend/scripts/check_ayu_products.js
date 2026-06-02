const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async ()=>{
  try{
    const email = 'ayusaniatuss@student.uns.ac.id';
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user){ console.log('User not found:', email); return }
    console.log('User:', { id: user.id, nama: user.nama, email: user.email });
    const foods = await prisma.makanan.findMany({ where: { penyediaId: user.id } });
    console.log('Makanan count:', foods.length);
    foods.forEach(f => console.log({ id: f.id, nama: f.nama, foto: f.foto, hargaAsli: f.hargaAsli, hargaPlatform: f.hargaPlatform }));
  }catch(e){ console.error(e && e.stack ? e.stack : e) }finally{ await prisma.$disconnect(); }
})();
