import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';

export default function CatalogPage() {
  const [makananList, setMakananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua'); // 'Semua' | 'A' | 'B' | 'C'

  useEffect(() => {
    const fetchMakanan = async () => {
      try {
        const response = await fetch('/api/makanan');
        if (response.ok) {
          const data = await response.json();
          setMakananList(data);
        } else {
          console.error('Gagal mengambil data makanan');
        }
      } catch (error) {
        console.error('Error fetching makanan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMakanan();
  }, []);

  // Filter list makanan berdasarkan tab
  const filteredMakanan = makananList.filter((item) => {
    if (activeTab === 'Semua') return true;
    return item.jalur === activeTab;
  });

  const getJalurBadgeClass = (jalur) => {
    switch (jalur) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'B':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'C':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJalurLabel = (jalur, compact = false) => {
    if (compact) {
      switch (jalur) {
        case 'A':
          return 'Jalur A';
        case 'B':
          return 'Jalur B';
        case 'C':
          return 'Jalur C';
        default:
          return `Jalur ${jalur}`;
      }
    }
    switch (jalur) {
      case 'A':
        return 'Jalur A (Konsumsi)';
      case 'B':
        return 'Jalur B (Pakan Hewan)';
      case 'C':
        return 'Jalur C (Daur Ulang)';
      default:
        return `Jalur ${jalur}`;
    }
  };

  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      {/* Header */}
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-7xl md:px-8">
        {/* Title Section */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 md:text-3xl">Katalog Surplus</h1>
            <p className="text-xs text-gray-500 md:text-sm mt-1">
              Temukan makanan surplus berkualitas dengan harga miring atau gratis.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto hide-scrollbar">
          {['Semua', 'A', 'B', 'C'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                activeTab === tab
                  ? 'bg-[#1D9E75] text-white border-[#1D9E75] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'Semua' ? 'Semua' : getJalurLabel(tab)}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat makanan surplus...</p>
          </div>
        ) : filteredMakanan.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMakanan.map((item) => {
              const hasDiscount = item.hargaPlatform < item.hargaAsli;
              return (
                <div
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all group w-full"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                      alt={item.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Expiry Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`rounded-lg border px-2 py-0.5 text-[8px] md:text-[10px] font-bold shadow-sm uppercase ${getJalurBadgeClass(item.jalur)}`}>
                        {getJalurLabel(item.jalur, true)}
                      </span>
                    </div>
                  </div>

                  {/* Detail Container */}
                  <div className="flex flex-grow flex-col p-3 justify-between">
                    <div>
                      {/* Provider name */}
                      <span className="text-[8px] md:text-[10px] font-medium text-gray-400 uppercase tracking-wider block">
                        Penyedia: {item.penyedia?.nama || 'Solo'}
                      </span>
                      <h3 className="mt-1 font-bold text-gray-800 text-xs md:text-sm line-clamp-1">
                        {item.nama}
                      </h3>
                      {/* Description snippet */}
                      <p className="mt-1 text-[10px] md:text-xs text-gray-500 line-clamp-2">
                        {item.deskripsi || 'Tidak ada deskripsi produk.'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col justify-between gap-1.5">
                      {/* Price Section */}
                      <div>
                        {hasDiscount ? (
                          <div className="flex flex-col">
                            <span className="text-[9px] md:text-xs text-gray-400 line-through">
                              Rp {item.hargaAsli.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs md:text-sm font-extrabold text-[#1D9E75]">
                              Rp {item.hargaPlatform.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs md:text-sm font-extrabold text-gray-800">
                            {item.hargaPlatform === 0 ? 'Gratis' : `Rp ${item.hargaPlatform.toLocaleString('id-ID')}`}
                          </span>
                        )}
                      </div>

                      {/* Stock & Action Link */}
                      <div className="flex items-center justify-between border-t border-gray-50 pt-1.5">
                        <span className="text-[8px] md:text-[10px] text-gray-400 font-medium">Stok: {item.stok}</span>
                        {item.penyedia && user && item.penyedia.id === user.id ? (
                          <Link
                            to={`/edit-produk/${item.id}`}
                            className="text-[10px] md:text-xs font-bold text-[#1D9E75] hover:underline"
                          >
                            Kelola →
                          </Link>
                        ) : (
                          <Link
                            to={`/makanan/${item.id}`}
                            className="text-[10px] md:text-xs font-bold text-[#1D9E75] hover:underline"
                          >
                            Detail →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-gray-700">Tidak ada makanan</h3>
            <p className="text-xs text-gray-400 mt-1">Saat ini belum ada makanan surplus di kategori ini.</p>
          </div>
        )}
      </main>

      <Link
        to="/makanan/tambah"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-[#1D9E75] px-4 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#16805E] active:scale-95 md:bottom-6 md:right-6"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Makanan
      </Link>

      <MobileNav />
    </div>
  );
}
