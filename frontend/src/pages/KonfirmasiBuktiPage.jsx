import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function KonfirmasiBuktiPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [transaksiMasuk, setTransaksiMasuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchTransaksiMasuk = async () => {
    try {
      const response = await fetch('/api/transaksi/masuk', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransaksiMasuk(data);
      } else {
        console.error('Gagal mengambil data transaksi masuk');
      }
    } catch (error) {
      console.error('Error fetching incoming transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTransaksiMasuk();
  }, [token, navigate]);

  const handleKonfirmasi = async (id, aksi) => {
    const confirmation = window.confirm(`Apakah Anda yakin ingin ${aksi === 'terima' ? 'menerima' : 'menolak'} transaksi ini?`);
    if (!confirmation) return;

    setProcessingId(id);
    try {
      const response = await fetch(`/api/transaksi/${id}/konfirmasi`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ aksi })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Transaksi berhasil dikonfirmasi!');
        // Refresh data
        fetchTransaksiMasuk();
      } else {
        alert('Gagal memproses transaksi: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">Konfirmasi Pembayaran</h1>
          <p className="text-xs text-gray-500 mt-1">
            Verifikasi bukti transfer pembayaran dari pembeli untuk makanan surplus yang Anda bagikan.
          </p>
        </div>

        {/* List content */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat transaksi masuk...</p>
          </div>
        ) : transaksiMasuk.length > 0 ? (
          <div className="space-y-4">
            {transaksiMasuk.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4"
              >
                {/* Header card info */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">ID Transaksi: #{item.id}</span>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">Pembeli: {item.pemesan?.nama}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.status}
                  </span>
                </div>

                {/* Detail Makanan */}
                <div className="flex gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                    <img
                      src={item.makanan?.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                      alt={item.makanan?.nama}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.makanan?.nama}</h4>
                    <p className="text-[10px] text-gray-500">Jumlah: {item.jumlah} Porsi</p>
                    <p className="text-xs text-[#1D9E75] font-extrabold">Total Bayar: Rp {item.totalBayar.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Bukti Bayar Preview */}
                {item.buktiBayar ? (
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-2">Pratinjau Bukti Transfer</span>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-200 shadow-inner">
                      <img
                        src={item.buktiBayar}
                        alt="Bukti Transfer"
                        className="h-full w-full object-contain"
                      />
                      <a
                        href={item.buktiBayar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 bg-black/60 text-white rounded-lg px-2 py-1 text-[10px] font-semibold hover:bg-black/80 transition-colors"
                      >
                        Buka Foto Asli ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold p-3 text-center">
                    Pembeli belum mengunggah bukti pembayaran.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleKonfirmasi(item.id, 'tolak')}
                    disabled={processingId !== null}
                    className="flex-1 rounded-xl bg-red-50 text-red-600 border border-red-200 py-3 text-xs font-bold transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => handleKonfirmasi(item.id, 'terima')}
                    disabled={processingId !== null || !item.buktiBayar}
                    className="flex-1 rounded-xl bg-[#1D9E75] text-white py-3 text-xs font-bold shadow-md transition-all hover:bg-[#16805E] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Terima & Kurangi Stok
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="font-bold text-gray-700">Tidak ada transaksi masuk</h3>
            <p className="text-xs text-gray-400 mt-1">Saat ini belum ada bukti transfer pembayaran yang perlu dikonfirmasi.</p>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
