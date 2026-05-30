const fs = require('fs');
const file = 'd:/Nia/lomba/ResFood/frontend/src/pages/UploadPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add useNavigate and imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';");

// Update Component start
const compStartRegex = /export default function UploadPage\(\) \{([\s\S]*?)return \(/;

const newLogic = `export default function UploadPage() {
  const navigate = useNavigate();
  const [condition, setCondition] = useState('edible'); // 'edible' or 'inedible'
  const [price, setPrice] = useState('');
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('1');
  const [tglExpired, setTglExpired] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Nasi/Lauk', 'Roti/Snack', 'Buah/Sayur', 'Minuman', 'Sembako'];

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? null : cat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/makanan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({
          nama,
          deskripsi: deskripsi || activeCategory,
          harga_asli: price || 0,
          jalur: condition === 'edible' ? 'A' : 'B',
          tgl_expired: tglExpired,
          stok: parseInt(stok)
        })
      });
      if (res.ok) {
        alert('Makanan berhasil ditambahkan!');
        navigate('/katalog');
      } else {
        const error = await res.json();
        alert('Gagal menambahkan: ' + error.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (`

content = content.replace(compStartRegex, newLogic);

// Replace form onSubmit
content = content.replace('<form className="space-y-8" onSubmit={(e) => e.preventDefault()}>', '<form className="space-y-8" onSubmit={handleSubmit}>');

// Update input values
content = content.replace(
  '<input className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface outline-none transition-all font-body-md" placeholder="Contoh: Nasi Kotak Ayam Bakar" type="text"/>',
  '<input value={nama} onChange={e => setNama(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface outline-none transition-all font-body-md" placeholder="Contoh: Nasi Kotak Ayam Bakar" type="text"/>'
);

content = content.replace(
  '<input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="date"/>',
  '<input value={tglExpired} onChange={e => setTglExpired(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="date"/>'
);

content = content.replace(
  '<input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" placeholder="Misal: Sudah berjamur, sisa piring 2 hari lalu" type="text"/>',
  '<input value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" placeholder="Misal: Sudah berjamur, sisa piring 2 hari lalu" type="text"/>'
);

// We need a Stok input, let's inject it into the first grid
content = content.replace(
  /<div className="space-y-2">\s*<label className="block font-label-md text-label-md text-on-surface">Kecamatan \(Solo\)<\/label>/,
  `<div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Stok (Porsi/Kg)</label>
              <input value={stok} onChange={e => setStok(e.target.value)} type="number" required min="1" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Kecamatan (Solo)</label>`
);

content = content.replace(
  '<button className="w-full py-5 bg-primary text-white rounded-2xl font-headline-sm text-headline-sm shadow-lg hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3" type="submit">',
  '<button disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl font-headline-sm text-headline-sm shadow-lg hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">'
);
content = content.replace(
  '<span className="material-symbols-outlined">cloud_upload</span>\n            Daftarkan Makanan',
  '<span className="material-symbols-outlined">cloud_upload</span>\n            {loading ? "Menyimpan..." : "Daftarkan Makanan"}'
);

fs.writeFileSync(file, content, 'utf8');
console.log('UploadPage updated.');
