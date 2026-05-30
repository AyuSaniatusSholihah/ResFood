import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

export default function ImpactPage() {
  const [progressWidth, setProgressWidth] = useState('0%');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Micro-interaction for progress bar on load
    const timer = setTimeout(() => {
      setProgressWidth('69%');
    }, 300);

    // Fetch dynamic leaderboard
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data.slice(0, 5)))
      .catch(err => console.error('Error fetching leaderboard:', err));

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-8">
        {/* Hero & Active Challenge Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Active Challenge Main Card (Asymmetric Layout) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1 mb-4">
              <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider">Tantangan Komunitas</span>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg">Selamatkan Solo dari Limbah Organik</h1>
            </div>
            
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_12px_rgba(46,125,50,0.08)] border-l-4 border-l-[#2e7d32] p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="font-headline-md text-headline-md mb-1">Misi: 5,000kg Jalur A</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Redistribusi makanan berlebih ke panti asuhan di seluruh Solo Raya.</p>
                </div>
                <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                  <span className="font-label-lg text-label-lg">12 Hari Lagi</span>
                </div>
              </div>
              
              {/* Progress Bar Section */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface-variant">Terkumpul Saat Ini</span>
                    <span className="font-headline-md text-headline-md text-primary">3,450 kg</span>
                  </div>
                  <span className="font-label-lg text-label-lg font-bold">69%</span>
                </div>
                <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-container transition-all duration-1000 ease-out" 
                    style={{ width: progressWidth }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[12px] text-on-surface-variant">Mulai: 1 Sep</span>
                  <span className="text-[12px] text-on-surface-variant">Target: 5,000 kg</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-primary hover:bg-primary-container text-white font-label-lg text-label-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                  Ikut Berkontribusi
                </button>
                <div className="flex -space-x-3">
                  <img alt="Participant" className="w-8 h-8 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
                  <img alt="Participant" className="w-8 h-8 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
                  <img alt="Participant" className="w-8 h-8 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold">+1.2k</div>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant">Relawan aktif berpartisipasi</span>
              </div>
            </div>
          </div>
          
          {/* Top Contributors (Bento Style) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_12px_rgba(46,125,50,0.08)] flex-1">
              <h3 className="font-title-lg text-title-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
                Kontributor Terbaik
              </h3>
              <div className="flex flex-col gap-4">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => {
                    const avatarUrls = [
                      "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&w=150&q=80",
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    ];
                    
                    let badgeBg = "bg-tertiary text-on-tertiary";
                    if (index === 1) badgeBg = "bg-outline text-on-primary";
                    if (index === 2) badgeBg = "bg-tertiary-container text-on-tertiary-container";
                    if (index > 2) badgeBg = "bg-surface-variant text-on-surface-variant";

                    return (
                      <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-container transition-colors">
                        <div className="relative">
                          <img alt={item.nama} className="w-12 h-12 rounded-full object-cover animate-in fade-in duration-300" src={avatarUrls[index % avatarUrls.length]}/>
                          <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${badgeBg}`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-label-lg text-label-lg font-bold line-clamp-1">{item.nama_toko || item.nama}</p>
                          <p className="text-[12px] text-on-surface-variant">{(item.carbon_score || 0).toLocaleString()} kg CO2 diselamatkan</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-on-surface-variant text-label-sm p-4">Memuat data kontributor...</p>
                )}
              </div>
              <button className="w-full mt-6 py-2 text-primary font-label-lg text-label-lg border border-outline-variant rounded-lg hover:bg-primary-container hover:text-on-primary transition-all">Lihat Semua Peringkat</button>
            </div>
          </div>
        </section>

        {/* Past Challenges Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md">Riwayat Tantangan</h2>
            <button className="text-primary font-label-lg text-label-lg flex items-center gap-1">
              Semua Riwayat
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Success Card */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant group">
              <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=400&q=80"/>
                <span className="absolute top-4 left-4 z-20 bg-primary text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  BERHASIL
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-title-lg text-title-lg mb-1">Agustus Hijau: Jalur C</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4">Target: 2,000kg Kompos Kolektif</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <span className="font-label-lg text-label-lg text-primary">2,150kg Tercapai</span>
                  <span className="text-[12px] text-on-surface-variant">Agustus 2024</span>
                </div>
              </div>
            </div>
            
            {/* Fail/Incomplete Card */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant group">
              <div className="relative h-32 overflow-hidden opacity-80">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80"/>
                <span className="absolute top-4 left-4 z-20 bg-on-surface-variant text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>cancel</span>
                  TIDAK TERCAPAI
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-title-lg text-title-lg mb-1">Solo Zero Waste: Juli</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4">Target: 10,000kg Total Waste</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <span className="font-label-lg text-label-lg text-error">8,400kg Tercapai</span>
                  <span className="text-[12px] text-on-surface-variant">Juli 2024</span>
                </div>
              </div>
            </div>
            
            {/* Featured Success */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant group">
              <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=400&q=80"/>
                <span className="absolute top-4 left-4 z-20 bg-primary text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  BERHASIL
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-title-lg text-title-lg mb-1">Pakan Ternak Berdaya</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4">Target: 3,500kg Jalur B</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                  <span className="font-label-lg text-label-lg text-primary">3,800kg Tercapai</span>
                  <span className="text-[12px] text-on-surface-variant">Juni 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA "Ikut Berkontribusi" */}
        <section className="bg-primary-container rounded-2xl p-8 md:p-10 flex flex-col gap-6 overflow-hidden relative text-white">
          <div className="absolute right-0 top-0 w-64 h-64 bg-on-primary-container opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          <div className="relative z-10 text-on-primary max-w-3xl">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-2">Mulai Dampakmu Sekarang</h2>
            <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">
              Bergabunglah dengan ribuan warga Solo lainnya. Setiap kg sampah organik yang kamu kelola membawa kita lebih dekat ke target komunitas.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-2">
            <button className="bg-surface text-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl shadow-lg hover:bg-surface/90 transition-all text-center">Daftar Warung/Resto</button>
            <button className="border-2 border-surface text-on-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl hover:bg-surface/10 transition-all text-center">Jadi Relawan</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button - Active only on Home/Impact */}
      <Link to="/upload" className="fixed bottom-24 right-6 md:bottom-12 md:right-12 bg-tertiary text-on-tertiary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40">
        <span className="material-symbols-outlined">add</span>
      </Link>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
