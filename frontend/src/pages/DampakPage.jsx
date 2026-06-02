import React from 'react';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function DampakPage() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-4xl md:px-8">
        
        {/* Development Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-2 w-full">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <span>Fitur ini sedang dalam pengembangan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* Sisi Kiri: Eco Stats Header Card */}
          <div className="w-full md:col-span-6 flex flex-col justify-center">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center w-full h-full justify-center">
              {/* Gorgeous Leaf SVG Illustration */}
              <div className="w-32 h-32 flex items-center justify-center bg-green-50 rounded-full mb-6">
                <svg 
                  className="w-20 h-20 text-[#1D9E75] animate-bounce" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
                  <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                </svg>
              </div>

              <h1 className="text-lg font-black text-gray-800">Dampak Lingkungan Anda</h1>
              <p className="text-xs text-gray-400 mt-1">Kontribusi Anda dalam menekan emisi gas rumah kaca di Kota Solo.</p>
            </div>
          </div>

          {/* Sisi Kanan: Stat Boxes & Info Box */}
          <div className="w-full md:col-span-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Carbon Saving Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-[#1D9E75] text-xl">temp_preferences_eco</span>
                <div className="mt-4">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Carbon Saving Score</p>
                  <p className="text-2xl font-black text-gray-800 mt-0.5">0 kg</p>
                </div>
              </div>

              {/* CO2 Saving Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
                <span className="material-symbols-outlined text-[#1D9E75] text-xl">co2</span>
                <div className="mt-4">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Limbah CO2 Ditekan</p>
                  <p className="text-2xl font-black text-gray-800 mt-0.5">0 kg</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50/50 border border-[#1D9E75]/10 rounded-3xl p-5 w-full">
              <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#1D9E75] text-sm">tips_and_updates</span>
                Tahukah Anda?
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-2">
                Setiap porsi makanan yang terselamatkan dari pembuangan akhir mengurangi pembentukan gas metana (CH4) yang memiliki efek pemanasan global 25 kali lebih kuat dari karbon dioksida.
              </p>
            </div>
          </div>
        </div>

      </main>
      <MobileNav />
    </div>
  );
}
