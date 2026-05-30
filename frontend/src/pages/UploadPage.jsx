import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function UploadPage() {
  const navigate = useNavigate();
  const [condition, setCondition] = useState('edible'); // 'edible' or 'inedible'
  const [price, setPrice] = useState('');
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('1');
  const [tglExpired, setTglExpired] = useState('');
  const [jamExpired, setJamExpired] = useState('18:00');
  const [deskripsi, setDeskripsi] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);

  const categories = ['Nasi/Lauk', 'Roti/Snack', 'Buah/Sayur', 'Minuman', 'Sembako'];

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? null : cat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const combinedDateTime = tglExpired ? `${tglExpired}T${jamExpired || '18:00'}` : '';

      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('deskripsi', deskripsi || activeCategory || '');
      formData.append('harga_asli', price || 0);
      formData.append('jalur', condition === 'edible' ? 'A' : 'B');
      formData.append('tgl_expired', combinedDateTime);
      formData.append('stok', stok);
      if (foto) {
        formData.append('foto', foto);
      }

      const res = await fetch('/api/makanan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
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

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-4xl mx-auto px-5 md:px-0 py-10">
        {/* Title Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Donasikan Makananmu</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Bantu kurangi limbah makanan dan berikan dampak nyata bagi warga Solo.</p>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant">
            <label className="block font-label-md text-label-md mb-4 text-on-surface">Foto Makanan</label>
            <label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group relative overflow-hidden">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFoto(e.target.files[0])} />
              {foto ? (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
                  <p className="font-body-md text-primary font-bold text-center">{foto.name}</p>
                  <p className="font-label-sm text-label-sm text-outline mt-1">Klik untuk mengganti foto</p>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform">add_a_photo</span>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center">Tarik dan lepas foto atau <span className="text-primary font-bold">Pilih File</span></p>
                  <p className="font-label-sm text-label-sm text-outline mt-2">Format JPG, PNG (Maks. 5MB)</p>
                </>
              )}
            </label>
          </section>

          {/* Basic Info Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Nama Makanan</label>
              <input value={nama} onChange={e => setNama(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface outline-none transition-all font-body-md" placeholder="Contoh: Nasi Kotak Ayam Bakar" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Stok (Porsi/Kg)</label>
              <input value={stok} onChange={e => setStok(e.target.value)} type="number" required min="1" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Kecamatan (Solo)</label>
              <select className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface outline-none transition-all font-body-md">
                <option>Banjarsari</option>
                <option>Jebres</option>
                <option>Laweyan</option>
                <option>Pasar Kliwon</option>
                <option>Serengan</option>
              </select>
            </div>
          </section>

          {/* Category Chips */}
          <section className="space-y-3">
            <label className="block font-label-md text-label-md text-on-surface">Kategori</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-full border transition-all font-label-md text-label-md ${
                    activeCategory === cat 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-outline-variant hover:border-primary hover:text-primary bg-surface'
                  }`} 
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Condition Selector (CRITICAL) */}
          <section className="space-y-4">
            <label className="block font-label-md text-label-md text-on-surface">Kondisi Makanan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Edible */}
              <label className="relative cursor-pointer group">
                <input 
                  checked={condition === 'edible'} 
                  onChange={() => setCondition('edible')}
                  className="peer sr-only" 
                  name="condition" 
                  type="radio" 
                  value="edible"
                />
                <div className={`p-5 border-2 rounded-2xl transition-all flex flex-col gap-3 ${condition === 'edible' ? 'border-primary bg-secondary-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${condition === 'edible' ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                      {condition === 'edible' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Masih Layak Konsumsi</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Untuk konsumsi manusia (Restoran/Rumah Tangga)</p>
                  </div>
                </div>
              </label>

              {/* Option 2: Inedible */}
              <label className="relative cursor-pointer group">
                <input 
                  checked={condition === 'inedible'}
                  onChange={() => setCondition('inedible')}
                  className="peer sr-only" 
                  name="condition" 
                  type="radio" 
                  value="inedible"
                />
                <div className={`p-5 border-2 rounded-2xl transition-all flex flex-col gap-3 ${condition === 'inedible' ? 'border-tertiary-container bg-on-tertiary-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-tertiary text-3xl">recycling</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${condition === 'inedible' ? 'border-tertiary bg-tertiary' : 'border-outline-variant'}`}>
                      {condition === 'inedible' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Sudah Basi / Tidak Layak</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Untuk riset, pakan ternak, atau pupuk organik</p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Dynamic Fields Container */}
          <div className="space-y-6" id="dynamic-fields">
            {condition === 'edible' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <div className="space-y-2 col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Tanggal Kadaluarsa</label>
                  <input value={tglExpired} onChange={e => setTglExpired(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="date"/>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Jam Kadaluarsa</label>
                  <input value={jamExpired} onChange={e => setJamExpired(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="time"/>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold">Harga Asli (Estimasi Rp)</label>
                  <div className="relative">
                    <input 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" 
                      placeholder="0" 
                      type="number"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold transition-opacity" style={{ opacity: price > 0 ? 1 : 0 }}>
                        -80%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface">Kondisi / Usia Makanan</label>
                  <input value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" placeholder="Misal: Sudah berjamur, sisa piring 2 hari lalu" type="text"/>
                </div>
                <div className="space-y-3">
                  <label className="block font-label-md text-label-md text-on-surface">Saran Penggunaan Kembali</label>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 rounded-full bg-[#D7CCC8] text-[#795548] font-label-md text-label-md hover:brightness-95 transition-all" type="button">Research</button>
                    <button className="px-4 py-2 rounded-full bg-[#D7CCC8] text-[#795548] font-label-md text-label-md hover:brightness-95 transition-all" type="button">Fertilizer</button>
                    <button className="px-4 py-2 rounded-full bg-[#D7CCC8] text-[#795548] font-label-md text-label-md hover:brightness-95 transition-all" type="button">Feed</button>
                    <button className="px-4 py-2 rounded-full bg-[#D7CCC8] text-[#795548] font-label-md text-label-md hover:brightness-95 transition-all" type="button">Biogas</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auto-classification Preview */}
          <section className="bg-surface-container-high p-6 rounded-2xl flex items-start gap-4 border border-outline-variant">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">Klasifikasi Otomatis AI</h4>
              {condition === 'edible' ? (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Berdasarkan pilihan Anda, makanan ini akan ditampilkan di <span className="font-bold text-primary">Katalog Konsumsi Umum</span>. Hal ini memastikan makanan sampai ke penerima yang tepat secara efisien.
                </p>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Berdasarkan pilihan Anda, item ini akan dialihkan ke <span className="font-bold text-tertiary">Pusat Pengolahan Limbah</span> untuk dijadikan pakan atau pupuk. Terima kasih telah menjaga lingkungan Solo.
                </p>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <button disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl font-headline-sm text-headline-sm shadow-lg hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
            <span className="material-symbols-outlined">cloud_upload</span>
            {loading ? "Menyimpan..." : "Daftarkan Makanan"}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-headline-md font-headline-md text-on-surface mb-2">ResFood</span>
          <p className="font-body-md text-body-md text-on-surface-variant">© 2024 ResFood Solo. Memberdayakan Ekonomi Sirkular.</p>
        </div>
        <nav className="flex gap-6">
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Tentang Kami</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Kebijakan Privasi</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Hubungi Kami</Link>
        </nav>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
