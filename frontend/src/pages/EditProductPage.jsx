import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState('edible');
  const [price, setPrice] = useState('');
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('1');
  const [tglExpired, setTglExpired] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);
  const [currentFotoUrl, setCurrentFotoUrl] = useState(null);

  const categories = ['Nasi/Lauk', 'Roti/Snack', 'Buah/Sayur', 'Minuman', 'Sembako'];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/makanan/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNama(data.nama);
          setStok(data.stok.toString());
          setPrice(data.harga_asli);
          setCondition(data.jalur === 'A' ? 'edible' : 'inedible');
          setDeskripsi(data.deskripsi || '');
          setCurrentFotoUrl(data.foto);
          if (data.tgl_expired) {
            setTglExpired(data.tgl_expired.split('T')[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load item');
      }
    };
    fetchItem();
  }, [id]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? null : cat);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('deskripsi', deskripsi || activeCategory || '');
      formData.append('harga_asli', price || 0);
      formData.append('jalur', condition === 'edible' ? 'A' : 'B');
      formData.append('tgl_expired', tglExpired);
      formData.append('stok', stok);
      if (foto) {
        formData.append('foto', foto);
      }

      const res = await fetch(`/api/makanan/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Item berhasil diupdate!');
        navigate('/katalog');
      } else {
        alert('Gagal update');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="max-w-4xl mx-auto px-5 md:px-0 py-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Edit Item Anda</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Perbarui detail makanan atau produk organik yang Anda tawarkan.</p>
        </div>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant">
            <label className="block font-label-md text-label-md mb-4 text-on-surface">Foto Makanan</label>
            <label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group relative overflow-hidden">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFoto(e.target.files[0])} />
              {foto ? (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
                  <p className="font-body-md text-primary font-bold text-center">{foto.name}</p>
                </div>
              ) : currentFotoUrl ? (
                <div className="flex flex-col items-center">
                  <img src={currentFotoUrl} alt="Current" className="w-32 h-32 object-cover rounded-lg mb-2" />
                  <p className="font-label-sm text-label-sm text-outline mt-1">Klik untuk mengganti foto</p>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform">add_a_photo</span>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center">Tarik dan lepas foto atau <span className="text-primary font-bold">Pilih File</span></p>
                </>
              )}
            </label>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Nama Makanan</label>
              <input value={nama} onChange={e => setNama(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface outline-none transition-all font-body-md" placeholder="Contoh: Nasi Kotak Ayam Bakar" type="text"/>
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface">Stok (Porsi/Kg)</label>
              <input value={stok} onChange={e => setStok(e.target.value)} type="number" required min="1" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none transition-all" />
            </div>
          </section>

          <section className="space-y-4">
            <label className="block font-label-md text-label-md text-on-surface">Kondisi Makanan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input checked={condition === 'edible'} onChange={() => setCondition('edible')} className="peer sr-only" name="condition" type="radio" value="edible" />
                <div className={`p-5 border-2 rounded-2xl transition-all flex flex-col gap-3 ${condition === 'edible' ? 'border-primary bg-secondary-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Masih Layak Konsumsi</h3>
                </div>
              </label>
              <label className="relative cursor-pointer group">
                <input checked={condition === 'inedible'} onChange={() => setCondition('inedible')} className="peer sr-only" name="condition" type="radio" value="inedible" />
                <div className={`p-5 border-2 rounded-2xl transition-all flex flex-col gap-3 ${condition === 'inedible' ? 'border-tertiary-container bg-on-tertiary-container' : 'border-outline-variant bg-surface-container-lowest'}`}>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Sudah Basi / Tidak Layak</h3>
                </div>
              </label>
            </div>
          </section>

          <div className="space-y-6" id="dynamic-fields">
            {condition === 'edible' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface">Tanggal Kadaluarsa</label>
                  <input value={tglExpired} onChange={e => setTglExpired(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="date"/>
                </div>
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface">Harga Asli (Estimasi Rp)</label>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="number" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface">Kondisi / Usia Makanan</label>
                  <input value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none font-body-md" type="text"/>
                </div>
              </div>
            )}
          </div>

          <button disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl font-headline-sm text-headline-sm shadow-lg hover:brightness-110 flex items-center justify-center gap-3 disabled:opacity-50" type="submit">
            <span className="material-symbols-outlined">cloud_upload</span>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </main>
      <MobileNav />
    </div>
  );
}