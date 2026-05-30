import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { addToCart, getCartCount } = useCart();
  const [activeTab, setActiveTab] = useState('edible'); // 'edible' or 'inedible'
  const [makananTerbaru, setMakananTerbaru] = useState([]);
  
  useEffect(() => {
    fetch('/api/makanan/terbaru')
      .then(res => res.json())
      .then(data => setMakananTerbaru(data))
      .catch(err => console.error(err));
  }, []);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(54 * 60 + 12); // 54 minutes 12 seconds in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1;
        return 59 * 60 + 59; // loop back to 59:59 if it hits 0 for demo purposes
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.nama,
      seller: item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo',
      price: item.harga_platform,
      image: item.foto || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      quantity: 1
    });
    alert('Berhasil ditambahkan ke keranjang!');
  };

  const handleClaimNow = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.nama,
      seller: item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo',
      price: item.harga_platform,
      image: item.foto || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      quantity: 1
    });
    navigate('/cart');
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="bg-surface text-on-surface">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-32">
        {/* Purpose Filter Chips */}
        <section className="mb-xl overflow-x-auto hide-scrollbar">
          <div className="flex gap-sm whitespace-nowrap pb-xs">
            {['Layak Konsumsi', 'Sudah Basi'].map(chip => {
              const isEdible = chip === 'Layak Konsumsi';
              const isActive = (activeTab === 'edible' && isEdible) || (activeTab === 'inedible' && !isEdible);
              return (
                <button 
                  key={chip}
                  onClick={() => setActiveTab(isEdible ? 'edible' : 'inedible')}
                  className={`px-lg py-sm rounded-full font-label-md text-label-md transition-colors ${
                    isActive 
                      ? isEdible ? 'bg-primary-container text-on-primary-container shadow-sm border border-primary' : 'bg-tertiary-container text-on-tertiary-container shadow-sm border border-tertiary'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-tertiary-fixed-dim'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </section>

        {activeTab === 'edible' ? (
          <>
            {/* Emergency Food Banner */}
            <section className="mb-xl">
              <div className="relative overflow-hidden rounded-xl bg-error-container p-lg flex flex-col md:flex-row items-center gap-lg border border-error">
                <div className="absolute -right-10 -top-10 opacity-10">
                  <span className="material-symbols-outlined text-[200px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-sm mb-xs">
                    <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>timer</span>
                    <h3 className="font-headline-md text-[16px] md:text-headline-md text-on-error-container">Emergency Surplus!</h3>
                  </div>
                  <p className="font-body-md text-body-md text-on-error-container opacity-90">Bantu selamatkan makanan ini sebelum berakhir di TPA dalam kurun waktu kurang dari 2 jam.</p>
                </div>
                <div className="flex items-center gap-md relative z-10">
                  <div className="bg-surface p-md rounded-lg text-center min-w-[70px] shadow-sm">
                    <span className="block font-headline-md text-[16px] md:text-headline-md text-error">{minutes}</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">MENIT</span>
                  </div>
                  <div className="bg-surface p-md rounded-lg text-center min-w-[70px] shadow-sm">
                    <span className="block font-headline-md text-[16px] md:text-headline-md text-error">{seconds}</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">DETIK</span>
                  </div>
                  <Link to="/cart" className="bg-error text-on-error px-xl py-md rounded-xl font-label-lg text-label-lg shadow-md hover:scale-105 transition-transform flex items-center justify-center">Ambil Sekarang</Link>
                </div>
              </div>
            </section>

            {/* Flash Sale Horizontal Scroll */}
            <section className="mb-xl">
              <div className="flex justify-between items-end mb-md">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Flash Sale Surplus</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Diskon hingga 80% untuk penyelamatan cepat.</p>
                </div>
                <button className="text-primary font-label-lg text-label-lg hover:underline">Lihat Semua</button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-lg">
                {makananTerbaru.length > 0 ? makananTerbaru.map((item) => (
                  <Link to={`/detail/${item.id}`} key={item.id} className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                    <div className="relative h-28 md:h-40">
                      <img alt={item.nama} className="w-full h-full object-cover" src={item.foto || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'}/>
                      <div className="absolute top-sm left-sm bg-error text-on-error text-label-sm font-label-sm px-sm py-xs rounded-lg">-70%</div>
                    </div>
                    <div className="p-3 md:p-md flex-1 flex flex-col">
                      <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs line-clamp-1">{item.nama}</h4>
                      <div className="flex flex-col gap-1 text-on-surface-variant mb-2">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">store</span>
                          <span className="text-label-sm font-label-sm line-clamp-1 font-semibold">{item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-xs mt-0.5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-xs text-[12px] opacity-75">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              <span>Solo</span>
                            </div>
                            {item.tgl_expired && (
                              <div className="flex items-center gap-xs text-[11px] text-error font-semibold mt-1">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>Batas: {new Date(item.tgl_expired).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}, {new Date(item.tgl_expired).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                          {item.penyedia?.no_telp && (
                            <a 
                              href={`https://wa.me/${item.penyedia.no_telp.replace(/\+/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-xs text-[11px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50 hover:bg-green-100 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[12px] text-green-500">chat</span>
                              WA
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 mb-3">
                        <div className="flex flex-col gap-0.5">
                          {item.harga_asli > 0 && (
                            <span className="text-[11px] line-through text-on-surface-variant opacity-60 leading-none">Rp {item.harga_asli}</span>
                          )}
                          <p className="text-primary font-headline-md text-[16px] md:text-headline-md font-bold leading-none mt-0.5">Rp {item.harga_platform}</p>
                        </div>
                        <span className="text-label-sm font-label-sm bg-secondary-container text-on-secondary-container px-sm py-xs rounded whitespace-nowrap">Sisa {item.stok}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-auto pt-3 border-t border-outline-variant/30">
                        <button 
                          onClick={(e) => handleAddToCart(item, e)}
                          className="p-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface flex items-center justify-center transition-colors"
                          title="Tambah ke Keranjang"
                        >
                          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                        <button 
                          onClick={(e) => handleClaimNow(item, e)}
                          className="flex-1 bg-primary text-on-primary py-2 px-3 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all text-center"
                        >
                          Ambil Sekarang
                        </button>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-on-surface-variant p-4">Memuat data dari database...</p>
                )}
              </div>
            </section>
 
            {/* Grid of "Layak Konsumsi" food cards */}
            <section>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Katalog Surplus Terdekat</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-lg">
                {makananTerbaru.length > 0 ? makananTerbaru.map((item) => (
                  <Link to={`/detail/${item.id}`} key={'dekat-' + item.id} className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                    <div className="relative h-32 md:h-48">
                      <img alt={item.nama} className="w-full h-full object-cover" src={item.foto || 'https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=400&q=80'}/>
                      <span className="absolute top-sm right-sm bg-primary-container text-on-primary-container text-label-sm font-label-sm px-md py-xs rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">Layak Konsumsi</span>
                    </div>
                    <div className="p-3 md:p-md flex-1 flex flex-col">
                      <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs line-clamp-1">{item.nama}</h4>
                      <div className="flex flex-col gap-1 text-on-surface-variant mb-2">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">store</span>
                          <span className="text-label-sm font-label-sm line-clamp-1 font-semibold">{item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-xs mt-0.5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-xs text-[12px] opacity-75">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              <span>Solo • 1.2km</span>
                            </div>
                            {item.tgl_expired && (
                              <div className="flex items-center gap-xs text-[11px] text-error font-semibold mt-1">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                <span>Batas: {new Date(item.tgl_expired).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}, {new Date(item.tgl_expired).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                          {item.penyedia?.no_telp && (
                            <a 
                              href={`https://wa.me/${item.penyedia.no_telp.replace(/\+/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-xs text-[11px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50 hover:bg-green-100 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[12px] text-green-500">chat</span>
                              WA
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 mb-3">
                        <div className="flex flex-col gap-0.5">
                          {item.harga_asli > 0 && (
                            <span className="text-[11px] line-through text-on-surface-variant opacity-60 leading-none">Rp {item.harga_asli}</span>
                          )}
                          <p className="text-primary font-headline-md text-[16px] md:text-headline-md font-bold leading-none mt-0.5">Rp {item.harga_platform}</p>
                        </div>
                        <span className="text-label-sm font-label-sm bg-secondary-container text-on-secondary-container px-sm py-xs rounded whitespace-nowrap">Sisa {item.stok}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-auto pt-3 border-t border-outline-variant/30">
                        <button 
                          onClick={(e) => handleAddToCart(item, e)}
                          className="p-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface flex items-center justify-center transition-colors"
                          title="Tambah ke Keranjang"
                        >
                          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                        <button 
                          onClick={(e) => handleClaimNow(item, e)}
                          className="flex-1 bg-primary text-on-primary py-2 px-3 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all text-center"
                        >
                          Ambil Sekarang
                        </button>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-on-surface-variant p-4">Memuat data...</p>
                )}
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Katalog Untuk Riset & Kompos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-lg">
              <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-32 md:h-48">
                      <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80" alt="Spoiled Fruit" className="w-full h-full object-cover grayscale" />
                      <span className="absolute top-sm right-sm bg-[#D7CCC8] text-[#795548] text-label-sm font-label-sm px-md py-xs rounded-full">Sudah Basi</span>
                  </div>
                  <div className="p-3 md:p-md">
                      <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs">Limbah Kulit Buah</h4>
                      <div className="flex gap-xs mb-md">
                          <span className="px-md py-xs bg-[#D7CCC8] text-[#795548] rounded-full text-[10px] font-bold">Research</span>
                          <span className="px-md py-xs bg-[#D7CCC8] text-[#795548] rounded-full text-[10px] font-bold">Fertilizer</span>
                      </div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant mb-md">Banjarsari • 25kg Tersedia</p>
                      <button className="w-full bg-tertiary text-on-tertiary py-md rounded-xl font-label-lg hover:opacity-90 transition-opacity">Ambil Untuk Riset</button>
                  </div>
              </div>
              <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-32 md:h-48">
                      <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80" alt="Coffee Grounds" className="w-full h-full object-cover grayscale" />
                      <span className="absolute top-sm right-sm bg-[#D7CCC8] text-[#795548] text-label-sm font-label-sm px-md py-xs rounded-full">Sudah Basi</span>
                  </div>
                  <div className="p-3 md:p-md">
                      <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs">Ampas Kopi Murni</h4>
                      <div className="flex gap-xs mb-md">
                          <span className="px-md py-xs bg-[#D7CCC8] text-[#795548] rounded-full text-[10px] font-bold">Fertilizer</span>
                          <span className="px-md py-xs bg-[#D7CCC8] text-[#795548] rounded-full text-[10px] font-bold">Biogas</span>
                      </div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant mb-md">Laweyan • 5kg Harian</p>
                      <button className="w-full bg-tertiary text-on-tertiary py-md rounded-xl font-label-lg hover:opacity-90 transition-opacity">Ambil Untuk Pupuk</button>
                  </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />

      {/* Footer */}
      <Footer />
    </div>
  );
}
