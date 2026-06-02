import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function HomePage() {
  const [foodSaved, setFoodSaved] = useState(0);
  const [co2Reduced, setCo2Reduced] = useState(0);
  const [peopleHelped, setPeopleHelped] = useState(0);
  const [latestFoods, setLatestFoods] = useState([]);

  useEffect(() => {
    // Animasi angka
    const animateValue = (setFunction, target, duration) => {
      let start = 0;
      const increment = target / (duration / 20);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          clearInterval(timer);
          setFunction(target);
        } else {
          setFunction(Math.ceil(start));
        }
      }, 20);
    };

    animateValue(setFoodSaved, 12450, 1500);
    animateValue(setCo2Reduced, 8200, 1500);
    animateValue(setPeopleHelped, 4120, 1500);

    // Ambil makanan terbaru dari katalog
    fetch('/api/makanan/terbaru')
      .then(res => res.json())
      .then(data => setLatestFoods(data.slice(0, 4)))
      .catch(err => console.error('Error fetching latest foods:', err));
  }, []);

  const handleShare = () => {
    const shareData = {
      title: 'TurahanSolo',
      text: 'Ayo bergabung dengan TurahanSolo untuk menyelamatkan surplus pangan dan menjaga kelestarian lingkungan!',
      url: window.location.origin
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.origin)
        .then(() => alert('Link TurahanSolo berhasil disalin! Bagikan ke temanmu.'))
        .catch(() => alert('Gagal menyalin link.'));
    }
  };

  return (
    <div className="bg-background text-on-surface">
      {/* TopAppBar */}
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex items-center justify-center px-8 md:px-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover brightness-[0.85]" 
              alt="Green environment sustainability" 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-container-max w-full">
            <div className="max-w-2xl">
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-md">
                Selamatkan Makanan,<br/><span className="text-primary">Ciptakan Nilai</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl leading-relaxed">
                Ubah surplus pangan menjadi sumber daya berharga. Baik layak konsumsi maupun sisa organik, setiap butir makanan memiliki peran dalam ekonomi sirkular kita.
              </p>
              <div className="flex flex-col sm:flex-row gap-md">
                <Link to="/login" className="bg-primary text-on-primary px-xl py-md rounded-xl font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-sm">
                  Mulai Sekarang — Gratis
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="bg-surface-container-lowest text-primary border-2 border-primary px-xl py-md rounded-xl font-label-md text-label-md hover:bg-primary-container/10 transition-all">
                  Pelajari Dampak
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Stats Bar */}
        <section className="bg-primary-container py-xl">
          <div className="max-w-container-max mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-on-primary-container text-[48px] mb-sm" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
              <h3 className="font-headline-md text-headline-md text-on-primary-container">{foodSaved.toLocaleString()} kg</h3>
              <p className="font-label-md text-label-md text-on-primary-container opacity-80 uppercase tracking-widest">Food Saved</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-on-primary-container text-[48px] mb-sm" style={{fontVariationSettings: "'FILL' 1"}}>cloud_done</span>
              <h3 className="font-headline-md text-headline-md text-on-primary-container">{co2Reduced.toLocaleString()} kg</h3>
              <p className="font-label-md text-label-md text-on-primary-container opacity-80 uppercase tracking-widest">CO2 Reduced</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-on-primary-container text-[48px] mb-sm" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
              <h3 className="font-headline-md text-headline-md text-on-primary-container">{peopleHelped.toLocaleString()}</h3>
              <p className="font-label-md text-label-md text-on-primary-container opacity-80 uppercase tracking-widest">People Helped</p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-32 px-8 md:px-16 max-w-container-max mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">Bagaimana TurahanSolo Bekerja?</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-outline-variant -z-10"></div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-lg border-2 border-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[32px]">upload_file</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-sm">1. Upload Makananmu</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Ambil foto surplus makananmu, baik sisa piring atau stok yang akan kadaluwarsa.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-lg border-2 border-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[32px]">fact_check</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-sm">2. Pilih Kondisi</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Tentukan apakah layak dimakan (donasi) atau tidak layak (pakan/kompos/riset).</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-lg border-2 border-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[32px]">handshake</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-sm">3. Salurkan</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Relawan atau mitra kami akan menjemput dan menyalurkan ke tangan yang tepat.</p>
            </div>
          </div>
        </section>

        {/* Penyelamatan Terbaru Section */}
        {latestFoods.length > 0 && (
          <section className="py-16 px-8 md:px-16 max-w-container-max mx-auto border-t border-outline-variant/30">
            <div className="flex justify-between items-end mb-lg">
              <div>
                <span className="text-primary font-bold font-label-md text-label-md uppercase tracking-widest">Penyelamatan Aktif</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mt-xs">Penyelamatan Terbaru Terdekat</h2>
              </div>
              <Link to="/dashboard" className="text-primary font-label-lg text-label-lg hover:underline flex items-center gap-xs">
                Lihat Semua
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-lg">
              {latestFoods.map((item) => (
                <div key={item.id} className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="relative h-32 md:h-48 shrink-0">
                    <img alt={item.nama} className="w-full h-full object-cover" src={item.foto || 'https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=400&q=80'}/>
                    <span className={`absolute top-sm right-sm text-label-sm font-label-sm px-md py-xs rounded-full ${
                      item.jalur === 'A' ? 'bg-primary-container text-on-primary-container' : 'bg-[#D7CCC8] text-[#795548]'
                    }`}>
                      {item.jalur === 'A' ? 'Layak Konsumsi' : 'Sudah Basi'}
                    </span>
                  </div>
                  <div className="p-3 md:p-md flex flex-col flex-grow">
                    <h4 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight mb-xs line-clamp-1">{item.nama}</h4>
                    <div className="flex items-center gap-xs text-on-surface-variant mb-md">
                      <span className="material-symbols-outlined text-[16px]">store</span>
                      <span className="text-label-sm font-label-sm line-clamp-1 font-semibold">{item.penyedia?.nama_toko || item.penyedia?.nama || 'Solo'}</span>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="text-primary font-headline-md text-[16px] md:text-headline-md">Rp {item.harga_platform}</p>
                      <Link to={`/detail/${item.id}`} className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:opacity-95 transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}



        {/* Community Challenge */}
        <section className="py-24 px-8 md:px-16 max-w-container-max mx-auto">
          <div className="glass-card p-lg md:p-xl rounded-[32px] border border-outline-variant relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
                <div>
                  <span className="text-primary font-bold font-label-md text-label-md uppercase tracking-widest">Community Challenge</span>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mt-xs">Misi Solo Hijau 2026</h2>
                </div>
                <div className="text-left md:text-right">
                  <span className="font-headline-md text-headline-md text-primary">72%</span>
                  <p className="font-label-md text-label-md text-on-surface-variant">Tercapai dari target 20 ton</p>
                </div>
              </div>
              <div className="w-full h-6 bg-surface-container-highest rounded-full overflow-hidden mb-xl">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[72%] rounded-full relative">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-md items-start w-full">
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">Ayo ajak 5 temanmu hari ini! Jika target tercapai, TurahanSolo akan memberikan subsidi 500 paket pupuk organik gratis untuk petani lokal.</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                  <button className="bg-primary text-on-primary px-xl py-md rounded-xl font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-105 transition-transform shrink-0 text-center w-full sm:w-auto">
                    Kontribusi Sekarang
                  </button>
                  <button 
                    onClick={handleShare}
                    type="button"
                    className="bg-surface-container-lowest text-primary border-2 border-primary px-xl py-md rounded-xl font-label-md text-label-md hover:bg-primary-container/10 transition-all shrink-0 text-center w-full sm:w-auto flex items-center justify-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    Ajak Teman / Bagikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
