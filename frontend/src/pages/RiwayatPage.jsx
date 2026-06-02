import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function RiwayatPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [transaksiSaya, setTransaksiSaya] = useState([]); // Sebagai pembeli
  const [transaksiMasuk, setTransaksiMasuk] = useState([]); // Sebagai penyedia
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua'); // Semua | Pembeli | Penyedia | Pengambilan
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      // 1. Fetch riwayat sebagai pembeli
      const resSaya = await fetch('/api/transaksi/saya', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let dataSaya = [];
      if (resSaya.ok) {
        dataSaya = await resSaya.json();
        setTransaksiSaya(dataSaya);
      }

      // 2. Fetch riwayat sebagai penyedia
      const resMasuk = await fetch('/api/transaksi/penyedia', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMasuk.ok) {
        const dataMasuk = await resMasuk.json();
        setTransaksiMasuk(dataMasuk);
      }
    } catch (error) {
      console.error('Error fetching riwayat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  // Aksi Jalur B & C (terima-ambil dan selesai-ambil)
  const handleTerimaAmbil = async (id) => {
    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/transaksi/${id}/terima-ambil`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Konfirmasi pengambilan berhasil diterima!');
        fetchData();
      } else {
        alert('Gagal konfirmasi: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSelesaiAmbil = async (id) => {
    const confirm = window.confirm('Apakah Anda yakin sudah menerima/mengambil makanan ini?');
    if (!confirm) return;

    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/transaksi/${id}/selesai-ambil`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Pengambilan makanan selesai dikonfirmasi!');
        fetchData();
      } else {
        alert('Gagal menyelesaikan pengambilan: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Gabung & filter data berdasarkan tab
  const getFilteredItems = () => {
    const buyerItems = transaksiSaya.map(t => ({ ...t, roleContext: 'pembeli' }));
    const sellerItems = transaksiMasuk.map(t => ({ ...t, roleContext: 'penyedia' }));

    switch (activeTab) {
      case 'Pembeli':
        return buyerItems.filter(t => t.tipe === 'KONSUMSI');
      case 'Penyedia':
        return sellerItems;
      case 'Pengambilan':
        return buyerItems.filter(t => t.tipe === 'DAUR_ULANG');
      case 'Semua':
      default:
        // Gabungkan seluruh transaksi, urutkan berdasarkan tanggal teranyar
        return [...buyerItems, ...sellerItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredItems = getFilteredItems();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'MENUNGGU':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'AKTIF':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SELESAI':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DIBATALKAN':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau dan kelola seluruh transaksi pembelian dan pengambilan surplus pangan Anda.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto hide-scrollbar">
          {['Semua', 'Pembeli', 'Penyedia', 'Pengambilan'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                activeTab === tab
                  ? 'bg-[#1D9E75] text-white border-[#1D9E75] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'Pembeli'
                ? 'Sebagai Pembeli'
                : tab === 'Penyedia'
                ? 'Sebagai Penyedia'
                : tab === 'Pengambilan'
                ? 'Pengambilan B&C'
                : 'Semua'}
            </button>
          ))}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat riwayat transaksi...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={`${item.roleContext}-${item.id}`}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3"
                >
                  {/* Top Row: Date, Context & Status */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">{formattedDate}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.roleContext === 'penyedia' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.roleContext === 'penyedia' ? 'Sebagai Penyedia' : 'Sebagai Pembeli'}
                      </span>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Food Info */}
                  <div className="flex gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                      <img
                        src={item.makanan?.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                        alt={item.makanan?.nama}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.makanan?.nama}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Jumlah: {item.jumlah} Porsi</p>
                      <p className="text-[10px] text-gray-400 font-medium">Tipe: {item.tipe}</p>
                    </div>
                  </div>

                  {/* Total Payment Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-semibold">Total Pembayaran:</span>
                    <span className="text-xs font-black text-gray-800">
                      {item.totalBayar === 0 ? 'Gratis (Daur Ulang)' : `Rp ${item.totalBayar.toLocaleString('id-ID')}`}
                    </span>
                  </div>

                  {/* Taker Action Buttons for Jalur B & C (DAUR_ULANG) */}
                  {item.roleContext === 'pembeli' && item.tipe === 'DAUR_ULANG' && (
                    <div className="pt-2">
                      {item.status === 'MENUNGGU' && (
                        <button
                          onClick={() => handleTerimaAmbil(item.id)}
                          disabled={actionLoadingId !== null}
                          className="w-full rounded-xl bg-[#1D9E75] text-white py-2.5 text-xs font-bold shadow hover:bg-[#16805E] transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === item.id ? 'Memproses...' : 'Makanan Siap Diambil'}
                        </button>
                      )}
                      {item.status === 'AKTIF' && (
                        <button
                          onClick={() => handleSelesaiAmbil(item.id)}
                          disabled={actionLoadingId !== null}
                          className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-xs font-bold shadow hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === item.id ? 'Memproses...' : 'Konfirmasi Selesai Pengambilan'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-gray-700">Belum ada transaksi</h3>
            <p className="text-xs text-gray-400 mt-1">Anda belum memiliki riwayat transaksi di tab kategori ini.</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
