import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState(8100); // 2 jam 15 menit

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 8100));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const dummyFoods = [
    {
      id: 1,
      nama: "Paket Nasi Bento Hemat",
      hargaAsli: 25000,
      hargaPromo: 5000,
      penyedia: "Bento Solo Square",
      stok: 3,
      foto: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      nama: "Roti Manis Aneka Rasa",
      hargaAsli: 15000,
      hargaPromo: 3000,
      penyedia: "BreadLife Solo Grand Mall",
      stok: 5,
      foto: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-4xl md:px-8">
        
        {/* Banner Fitur Dalam Pengembangan */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-2 w-full">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <span>Fitur ini sedang dalam pengembangan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* Sisi Kiri: Flash Sale Header Card */}
          <div className="w-full md:col-span-5">
            <div className="bg-gradient-to-br from-[#1D9E75] to-[#16805E] rounded-3xl p-6 text-white shadow-md relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
                <span className="material-symbols-outlined text-[120px]">bolt</span>
              </div>
              <div>
                <span className="bg-yellow-400 text-gray-900 font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                  FLASH SALE
                </span>
                <h1 className="text-2xl font-black mt-3">Hemat Pangan!</h1>
                <p className="text-xs opacity-90 mt-1">Selamatkan pangan berlebih dengan diskon hingga 80% sebelum kedaluwarsa.</p>
              </div>
              
              <div className="mt-6 flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-yellow-400 text-lg">alarm</span>
                <div>
                  <p className="text-[10px] opacity-80 uppercase font-semibold">Berakhir Dalam</p>
                  <p className="text-lg font-black tracking-widest">{formatTime(timeLeft)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Rencana: Food Items List */}
          <div className="w-full md:col-span-7 flex flex-col gap-4">
            <div className="space-y-4 w-full">
              {dummyFoods.map((food) => (
                <div key={food.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex gap-4 relative overflow-hidden w-full box-sizing-border-box">
                  <div className="absolute top-0 right-0 bg-[#1D9E75] text-white text-[9px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-wider">
                    Sale
                  </div>
                  
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={food.foto} alt={food.nama} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{food.nama}</h3>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{food.penyedia}</p>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-black text-[#1D9E75]">Rp {food.hargaPromo.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] text-gray-400 line-through">Rp {food.hargaAsli.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-50">
                      <span className="text-[9px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">Sisa {food.stok} porsi</span>
                      <button className="bg-gray-200 text-gray-400 text-[10px] font-extrabold px-3 py-1 rounded-xl cursor-not-allowed" disabled>
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <MobileNav />
    </div>
  );
}
