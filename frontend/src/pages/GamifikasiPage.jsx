import React from 'react';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function GamifikasiPage() {
  const mockLeaderboard = [
    { rank: 1, nama: "Budi Santoso", poin: 2450, badge: "Pahlawan Hijau" },
    { rank: 2, nama: "Siti Rahma", poin: 1980, badge: "Penyelamat Pangan" },
    { rank: 3, nama: "Joko Widodo", poin: 1540, badge: "Donatur Setia" },
    { rank: 4, font: "Plus Jakarta Sans", nama: "Dewi Lestari", poin: 1200, badge: "Relawan Aktif" },
    { rank: 5, nama: "Adi Wijaya", poin: 980, badge: "Eco Warrior" }
  ];

  const badges = [
    { nama: "Penyelamat Pemula", deskripsi: "Menyelamatkan makanan pertama kali", icon: "workspace_premium", unlocked: true },
    { nama: "Pahlawan Hijau", deskripsi: "Mencapai score reduksi 10 kg CO2", icon: "eco", unlocked: false },
    { nama: "Donatur Setia", deskripsi: "Mendonasikan makanan 5 kali berturut-turut", icon: "volunteer_activism", unlocked: false }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-4xl md:px-8">
        
        {/* Development Alert Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-2 w-full">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <span>Fitur ini sedang dalam pengembangan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* Sisi Kiri: Points Summary & Badges */}
          <div className="w-full md:col-span-7 flex flex-col gap-6">
            {/* Points Summary Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center w-full">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Skor Poin Anda</p>
              <div className="flex justify-center items-baseline gap-1 mt-2">
                <span className="text-5xl font-black text-[#1D9E75]">0</span>
                <span className="text-sm font-bold text-gray-400">Poin</span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl inline-flex items-center gap-2 border border-gray-100">
                <span className="material-symbols-outlined text-[#1D9E75]">emoji_events</span>
                <span className="text-xs font-bold text-gray-700">Peringkat Komunitas: #0</span>
              </div>
            </div>

            {/* Badges Placeholder Section */}
            <div className="w-full">
              <h2 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Lencana Pencapaian</h2>
              <div className="grid grid-cols-3 gap-3 w-full">
                {badges.map((b, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between min-h-[110px] ${
                      b.unlocked 
                        ? 'bg-white border-[#1D9E75]/20 shadow-sm' 
                        : 'bg-gray-100/50 border-gray-200/60 opacity-60'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${b.unlocked ? 'text-[#1D9E75]' : 'text-gray-400'}`}>
                      {b.icon}
                    </span>
                    <p className="text-[9px] font-black text-gray-800 leading-tight mt-2">{b.nama}</p>
                    <p className="text-[8px] text-gray-400 font-medium leading-none mt-1 line-clamp-2">{b.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Leaderboard */}
          <div className="w-full md:col-span-5">
            <h2 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Papan Peringkat Solo</h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm w-full">
              <div className="divide-y divide-gray-50">
                {mockLeaderboard.map((u) => (
                  <div key={u.rank} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        u.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                        u.rank === 2 ? 'bg-gray-200 text-gray-800' :
                        u.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {u.rank}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{u.nama}</p>
                        <span className="text-[9px] text-[#1D9E75] font-semibold bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                          {u.badge}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-700">{u.poin.toLocaleString('id-ID')} Poin</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
      <MobileNav />
    </div>
  );
}
