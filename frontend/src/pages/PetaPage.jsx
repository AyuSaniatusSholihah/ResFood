import React from 'react';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function PetaPage() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-4xl md:px-8">
        
        {/* Development Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-2 w-full">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <span>Fitur ini sedang dalam pengembangan</span>
        </div>

        {/* Map Header */}
        <div className="mb-4 w-full">
          <h1 className="text-lg font-black text-gray-800">Peta Distribusi</h1>
          <p className="text-[11px] text-gray-400">Lokasi surplus pangan layak dan tempat daur ulang di Solo.</p>
        </div>

        {/* Map Placeholder Graphic */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm relative aspect-[4/3] md:aspect-[16/9] flex flex-col justify-center items-center text-center p-6 w-full box-sizing-border-box">
          
          {/* Aesthetic Mock Map Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')"}}>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Pin Marker Icon */}
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-[#1D9E75] mb-4 shadow-inner border border-[#1D9E75]/10 animate-bounce">
              <span className="material-symbols-outlined text-2xl font-bold">distance</span>
            </div>
            
            <h3 className="text-sm font-bold text-gray-800">Peta distribusi akan tersedia segera</h3>
            <p className="text-[10px] text-gray-400 max-w-[200px] mt-1.5 leading-relaxed">
              Kami sedang menyiapkan visualisasi titik koordinat warung, panti asuhan, dan peternakan mitra.
            </p>
          </div>
        </div>

      </main>
      <MobileNav />
    </div>
  );
}
