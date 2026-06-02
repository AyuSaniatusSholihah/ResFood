import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/makanan/${id}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          console.error('Gagal memuat detail makanan');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const increaseQty = () => {
    if (item && quantity < item.stok) setQuantity(q => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAmbil = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/transaksi/ambil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ makananId: item.id, jumlah: quantity })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Permohonan pengambilan berhasil diajukan! Menunggu penyedia menyiapkan makanan.');
        navigate('/dashboard');
      } else {
        alert('Gagal mengajukan pengambilan: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePesan = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    // Arahkan ke halaman pesan dengan query parameter makananId dan jumlah
    navigate(`/pesan/${item.id}?jumlah=${quantity}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-800 min-h-screen">
        <Header />
        <main className="max-w-md mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat detail makanan...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-gray-50 text-gray-800 min-h-screen">
        <Header />
        <main className="max-w-md mx-auto px-4 py-8 flex flex-col justify-center items-center h-[50vh] text-center">
          <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-bold mb-4">Makanan tidak ditemukan.</p>
          <Link to="/katalog" className="bg-[#1D9E75] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#16805E]">
            Kembali ke Katalog
          </Link>
        </main>
      </div>
    );
  }

  const isOwner = user && user.id === item.penyediaId;
  const isOutOfStock = item.stok === 0;
  const hasDiscount = item.hargaPlatform < item.hargaAsli;

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

  const getJalurLabel = (jalur) => {
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

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6 md:max-w-4xl md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          
          {/* Sisi Kiri: Foto Besar */}
          <div className="md:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
              <img
                src={item.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                alt={item.nama}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`rounded-xl border px-3 py-1 text-xs font-bold shadow-sm uppercase ${getJalurBadgeClass(item.jalur)}`}>
                  {getJalurLabel(item.jalur)}
                </span>
              </div>
            </div>

            {/* Donor Info */}
            <div className="mt-6 flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center font-bold">
                {item.penyedia?.nama?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Penyedia Terdaftar</p>
                <h4 className="text-sm font-bold text-gray-800">{item.penyedia?.nama || 'Solo'}</h4>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Deskripsi & Aksi */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-extrabold text-gray-800 md:text-2xl">{item.nama}</h1>
                {item.tglExpired && (
                  <p className="text-[10px] text-gray-400 font-medium mt-1">
                    Batas Kadaluarsa: {new Date(item.tglExpired).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* Harga Platform */}
              <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/10 p-4 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Harga Penyelamatan</span>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black text-[#1D9E75]">
                      Rp {item.hargaPlatform.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      Rp {item.hargaAsli.toLocaleString('id-ID')}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-black text-gray-800 block mt-1">
                    {item.hargaPlatform === 0 ? 'Gratis' : `Rp ${item.hargaPlatform.toLocaleString('id-ID')}`}
                  </span>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Deskripsi</span>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  {item.deskripsi || 'Tidak ada deskripsi produk.'}
                </p>
              </div>

              {/* Qty Selector (Hanya jika bukan owner dan stok tersedia) */}
              {!isOwner && !isOutOfStock && (
                <div className="pt-2">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-2">
                    Pilih Jumlah (Tersedia: {item.stok} Porsi)
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                      <button onClick={decreaseQty} className="px-3 py-2 text-gray-500 hover:bg-gray-50">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 font-bold text-sm text-gray-800">{quantity}</span>
                      <button onClick={increaseQty} className="px-3 py-2 text-gray-500 hover:bg-gray-50">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    {item.hargaPlatform > 0 && (
                      <span className="text-xs font-semibold text-gray-500">
                        Subtotal: <span className="font-extrabold text-gray-800">Rp {(item.hargaPlatform * quantity).toLocaleString('id-ID')}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8">
              {isOwner ? (
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center text-xs text-gray-500 font-medium flex flex-col gap-3">
                  <div>Ini adalah makanan yang Anda kelola. Anda tidak dapat melakukan pemesanan.</div>
                  <div className="flex gap-2 justify-center">
                    <Link to={`/edit-produk/${item.id}`} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                      Edit Produk
                    </Link>
                  </div>
                </div>
              ) : isOutOfStock ? (
                <button
                  disabled
                  className="w-full rounded-xl bg-gray-200 p-3.5 text-center text-sm font-bold text-gray-400 cursor-not-allowed"
                >
                  Stok Habis
                </button>
              ) : (
                <>
                  {item.jalur === 'A' ? (
                    <button
                      onClick={handlePesan}
                      className="w-full rounded-xl bg-[#1D9E75] p-3.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-[#16805E] active:scale-[0.98]"
                    >
                      Pesan Sekarang
                    </button>
                  ) : (
                    <button
                      onClick={handleAmbil}
                      disabled={submitting}
                      className="w-full rounded-xl bg-orange-500 p-3.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
                    >
                      {submitting ? 'Memproses...' : 'Ajukan Pengambilan (Gratis)'}
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
