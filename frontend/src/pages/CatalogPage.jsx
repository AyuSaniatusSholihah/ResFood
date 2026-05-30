import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

export default function CatalogPage() {
  const { getCartCount } = useCart();
  const [activeChip, setActiveChip] = useState('Semua');
  const [activeJalur, setActiveJalur] = useState('A'); // 'A' = Bisa Dimakan, 'B' = Sudah Basi
  const [katalogSaya, setKatalogSaya] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchKatalog = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/makanan/saya', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setKatalogSaya(data);
        }
      } catch (error) {
        console.error('Error fetching katalog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchKatalog();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeChip, activeJalur]);

  const handleChipClick = (chipName) => {
    setActiveChip(chipName);
  };

  const filteredKatalog = katalogSaya.filter((item) => {
    // Filter berdasarkan jalur ('A' = Layak Konsumsi, 'B' = Tidak Layak)
    const matchesJalur = item.jalur === activeJalur;

    // Filter berdasarkan chip kategori
    const matchesChip = activeChip === 'Semua' || 
      (item.deskripsi && item.deskripsi.toLowerCase().includes(activeChip.toLowerCase())) ||
      (item.nama && item.nama.toLowerCase().includes(activeChip.toLowerCase()));

    return matchesJalur && matchesChip;
  });

  // Calculate paginated items
  const totalPages = Math.ceil(filteredKatalog.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKatalog.slice(indexOfFirstItem, indexOfLastItem);

  const chips = ['Semua', 'Penelitian', 'Pupuk/Kompos', 'Pakan Ternak', 'Maggot', 'Eco Enzyme', 'Biogas'];

  return (
    <div className="bg-surface text-on-surface">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Dual-Purpose Toggle */}
        <div className="flex justify-center mb-xl">
          <div className="inline-flex p-xs bg-surface-container-high rounded-xl border border-outline-variant shadow-sm">
            <button 
              onClick={() => setActiveJalur('A')}
              className={`px-lg py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ${
                activeJalur === 'A'
                  ? 'bg-white shadow-sm text-on-surface font-bold ring-1 ring-tertiary-container/10'
                  : 'text-on-surface-variant hover:bg-surface/50'
              }`}
            >
              Bisa Dimakan 🟢
            </button>
            <button 
              onClick={() => setActiveJalur('B')}
              className={`px-lg py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ${
                activeJalur === 'B'
                  ? 'bg-white shadow-sm text-on-surface font-bold ring-1 ring-tertiary-container/10'
                  : 'text-on-surface-variant hover:bg-surface/50'
              }`}
            >
              Sudah Basi / Tidak Layak 🟤
            </button>
          </div>
        </div>

        {/* Hero / Banner Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div>
            <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface">Katalog Saya</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Kelola makanan yang Anda bagikan atau jual kepada komunitas. Pantau status dan ketersediaan stok Anda di sini.
            </p>
          </div>
          <Link to="/upload" className="shrink-0 flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg text-label-lg font-bold shadow hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
            Tambah Makanan
          </Link>
        </section>

        {/* Filter Chips */}
        <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-md mb-lg snap-x">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className={`shrink-0 px-md py-xs rounded-full font-label-md text-label-md border transition-all snap-start
                ${activeChip === chip 
                  ? 'bg-secondary text-on-secondary border-secondary' 
                  : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <p className="text-on-surface-variant col-span-2">Memuat katalog...</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-[24px] overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col">
                <div className="relative h-32 md:h-56 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.nama} src={item.foto || 'https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=600&q=80'}/>
                  <div className="absolute top-md left-md">
                    <span className="bg-[#D7CCC8] text-[#795548] px-md py-xs rounded-full text-label-sm font-label-sm shadow-sm">{item.jalur === 'A' ? 'Layak Konsumsi' : 'Tidak Layak'}</span>
                  </div>
                </div>
                <div className="p-lg flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-sm">
                    <h3 className="font-headline-sm text-[14px] md:text-headline-sm leading-tight text-on-surface line-clamp-1">{item.nama}</h3>
                    <span className="text-tertiary font-bold shrink-0">{item.stok} porsi</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-md line-clamp-2">{item.deskripsi}</p>
                  <div className="flex justify-between items-center mt-auto mb-lg">
                    <span className="text-primary font-headline-md">Rp {item.harga_platform}</span>
                    <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded-md text-xs font-semibold">{item.status}</span>
                  </div>
                  <div>
                    <Link to={`/edit-produk/${item.id}`} className="w-full block text-center bg-tertiary-container text-on-tertiary-container py-md rounded-xl font-label-lg text-label-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                      Kelola Item
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-on-surface-variant col-span-2">Belum ada barang di kategori ini.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border transition-all ${
                currentPage === 1
                  ? 'border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined align-middle">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded-full font-label-md text-label-md transition-all ${
                    currentPage === pageNumber
                      ? 'bg-primary text-on-primary font-bold'
                      : 'hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border transition-all ${
                currentPage === totalPages
                  ? 'border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined align-middle">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
