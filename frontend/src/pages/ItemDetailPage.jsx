import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5099); // 1:24:59 in seconds
  const [isScrolled, setIsScrolled] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/makanan/${id}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          console.error('Failed to fetch item details');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (!item || !item.tgl_expired) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(item.tgl_expired) - +new Date();
      return difference > 0 ? Math.floor(difference / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [item]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const increaseQty = () => {
    if (item && quantity < item.stok) setQuantity(q => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    if (!item) return;
    addToCart({
      id: item.id,
      name: item.nama,
      seller: item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo',
      price: item.harga_platform,
      image: item.foto || 'https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=600&q=80',
      quantity
    });
    alert('Berhasil ditambahkan ke keranjang!');
  };

  if (loading) {
    return (
      <div className="bg-background text-on-surface min-h-screen">
        <Header />
        <main className="max-w-container-max mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
          <p className="text-on-surface-variant font-headline-sm">Memuat detail makanan...</p>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-background text-on-surface min-h-screen">
        <Header />
        <main className="max-w-container-max mx-auto px-4 py-8 flex flex-col justify-center items-center h-[50vh]">
          <p className="text-on-surface-variant font-headline-sm mb-md">Makanan tidak ditemukan.</p>
          <Link to="/dashboard" className="bg-primary text-on-primary px-lg py-sm rounded-xl">Kembali ke Beranda</Link>
        </main>
      </div>
    );
  }

  const pricePerItem = item.harga_platform;

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Shell */}
      <Header />

      <main className="max-w-container-max mx-auto px-4 md:px-12 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Left Column: Media & Impact */}
          <div className="lg:col-span-7 space-y-lg">
            {/* Hero Image */}
            <div className="relative w-full aspect-[4/3] md:aspect-video rounded-[32px] overflow-hidden shadow-lg group">
              <img alt={item.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.foto || 'https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=600&q=80'}/>
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md flex items-center gap-2 shadow-md">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  {item.jalur === 'A' ? 'Layak Konsumsi' : 'Sudah Basi'}
                </span>
              </div>
            </div>

            {/* Impact Card */}
            <div className="bg-secondary-container text-on-secondary-container p-6 rounded-[24px] flex items-center gap-6 border border-primary-container/10 mt-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-inner">
                <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm">Dampak Karbon</h3>
                <p className="font-body-md text-body-md opacity-90">Mengambil porsi ini menyelamatkan <span className="font-bold underline">~2.4 kg CO₂</span> dari pelepasan gas metana di TPA.</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-md mt-6">
              <h2 className="font-headline-md text-headline-md">{item.nama}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {item.deskripsi || 'Tidak ada deskripsi produk.'}
              </p>
            </div>
          </div>

          {/* Right Column: Actions & Details */}
          <div className="lg:col-span-5 space-y-lg mt-8 lg:mt-0">
            {/* Pricing & Timer Card */}
            <div className="bg-surface-container-lowest p-8 rounded-[32px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Harga Penyelamatan</span>
                  <div className="flex items-center gap-3">
                    <span className="font-headline-lg text-headline-lg text-primary">Rp {item.harga_platform}</span>
                    <span className="text-on-surface-variant line-through text-body-md">Rp {item.harga_asli}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-tertiary-container/20 text-tertiary font-bold rounded-lg text-label-md mt-2">Hemat 70%</span>
                  {item.tgl_expired && (
                    <p className="text-[12px] text-on-surface-variant mt-2 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      Batas: {new Date(item.tgl_expired).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <div className="bg-error-container text-error px-4 py-3 rounded-2xl text-center min-w-[100px]">
                  <span className="block text-[10px] font-bold uppercase tracking-tighter">Berakhir Dalam</span>
                  <span className="block font-headline-sm text-headline-sm tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <hr className="border-outline-variant/50 my-6"/>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="font-label-lg text-label-lg text-on-surface-variant">Pilih Jumlah (Tersedia: {item.stok} Porsi)</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center border-2 border-outline-variant rounded-2xl overflow-hidden bg-surface w-max">
                    <button onClick={decreaseQty} className="p-4 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">remove</span></button>
                    <span className="px-6 font-headline-sm text-headline-sm w-12 text-center">{quantity}</span>
                    <button onClick={increaseQty} className="p-4 hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">add</span></button>
                  </div>
                  <span className="text-on-surface-variant font-body-md">Total: <span className="font-bold text-on-surface">Rp {(pricePerItem * quantity).toLocaleString('id-ID')}</span></span>
                </div>
              </div>
            </div>

            {/* Donor Card with Mini Map */}
            <div className="bg-surface-container-low p-6 rounded-[24px] space-y-4 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[28px]">store</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm">{item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo'}</h4>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="font-label-md">4.9 (Penyedia Terverifikasi)</span>
                  </div>
                </div>
              </div>
              
              <div className="relative w-full h-32 rounded-2xl overflow-hidden">
                <img alt="Map view" className="w-full h-full object-cover brightness-90" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"/>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <p className="text-body-md">{item.penyedia?.alamat || 'Solo (Lokasi detail akan diberikan setelah pembayaran)'}</p>
              </div>

              {item.penyedia?.no_telp && (
                <div className="pt-2">
                  <a 
                    href={`https://wa.me/${item.penyedia.no_telp.replace(/\+/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-sm bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#20ba5a] transition-all"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Hubungi via WhatsApp ({item.penyedia.nama_toko || item.penyedia.nama})
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar (Mobile & Sticky) */}
      <div className="fixed bottom-0 left-0 w-full z-[60] bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 px-6 py-4 flex items-center justify-between gap-4 md:px-12">
        <div className="hidden md:block">
          <span className="text-on-surface-variant font-label-md">Total Pesanan</span>
          <p className="font-headline-md text-headline-md text-primary">Rp {(pricePerItem * quantity).toLocaleString('id-ID')}</p>
        </div>
        <div className="flex flex-1 md:flex-none gap-2">
          <button onClick={handleAddToCart} className="flex-1 md:w-auto bg-surface-container-high text-on-surface py-4 px-4 md:px-8 rounded-2xl font-headline-sm text-headline-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border border-outline-variant">
            <span className="material-symbols-outlined">add_shopping_cart</span>
            <span className="hidden md:inline">Tambah Keranjang</span>
          </button>
          <Link to="/payment" className="flex-1 md:w-64 bg-primary text-on-primary py-4 px-4 md:px-8 rounded-2xl font-headline-sm text-headline-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">shopping_bag</span>
            Pesan
          </Link>
        </div>
      </div>

      <footer className="w-full py-xl px-4 md:px-12 bg-surface-container-highest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md mb-20 md:mb-0">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-headline-md font-headline-md text-on-surface">ResFood Solo</span>
          <p className="font-body-md text-body-md text-on-surface-variant">© 2024 ResFood Solo. Memberdayakan Ekonomi Sirkular.</p>
        </div>
        <div className="flex gap-6">
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all">Tentang Kami</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all">Hubungi Kami</Link>
        </div>
      </footer>
    </div>
  );
}
