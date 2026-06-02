import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function PesanMakananPage() {
  const { makananId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);
  const [orderCreated, setOrderCreated] = useState(false);
  const [transaksiId, setTransaksiId] = useState(null);
  const [buktiBayar, setBuktiBayar] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/makanan/${makananId}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
          // Set initial quantity from search param
          const initialQty = parseInt(searchParams.get('jumlah')) || 1;
          setJumlah(Math.min(initialQty, data.stok));
        } else {
          console.error('Gagal mengambil detail makanan');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [makananId, token, searchParams, navigate]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!item) return;

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.kecamatan) {
      alert('Isi kecamatan alamat Anda terlebih dahulu di dashboard sebelum membuat pesanan.');
      navigate('/dashboard');
      return;
    }

    if (jumlah > item.stok) {
      alert('Jumlah pesanan melebihi stok yang tersedia!');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ makananId: item.id, jumlah })
      });

      const data = await response.json();
      if (response.ok) {
        setOrderCreated(true);
        // data.transaksi.id contains the created transaction id
        setTransaksiId(data.transaksi.id);
      } else {
        alert('Gagal membuat pesanan: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadBukti = async (e) => {
    e.preventDefault();
    if (!buktiBayar.trim()) {
      alert('URL Bukti Transfer wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/transaksi/${transaksiId}/bukti`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ buktiBayar })
      });

      const data = await response.json();
      if (response.ok) {
        setUploaded(true);
      } else {
        alert('Gagal mengunggah bukti: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-800 min-h-screen">
        <Header />
        <main className="max-w-md mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat info pemesanan...</p>
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
          <p className="text-gray-600 font-bold mb-4">Makanan tidak ditemukan.</p>
          <Link to="/katalog" className="bg-[#1D9E75] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#16805E]">
            Kembali ke Katalog
          </Link>
        </main>
      </div>
    );
  }

  const totalBayar = item.hargaPlatform * jumlah;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6">
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Checkout Pesanan</h1>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          {/* Ringkasan Makanan */}
          <div className="flex gap-4 border-b border-gray-100 pb-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
              <img src={item.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'} alt={item.nama} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.nama}</h3>
              <p className="text-xs text-[#1D9E75] font-extrabold mt-0.5">Rp {item.hargaPlatform.toLocaleString('id-ID')} / porsi</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Stok tersedia: {item.stok} porsi</p>
            </div>
          </div>

          {!orderCreated ? (
            // Jika user adalah penyedia produk, jangan tampilkan form pemesanan
            item.penyedia && user && item.penyedia.id === user.id ? (
              <div className="text-center py-6 space-y-4">
                <h3 className="font-extrabold text-gray-800 text-lg">Pemilik Produk</h3>
                <p className="text-xs text-gray-500 mt-1">Anda adalah penyedia makanan ini, tidak bisa melakukan pemesanan terhadap produk sendiri.</p>
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    to="/makanan/tambah"
                    className="w-full rounded-xl bg-[#1D9E75] p-3 text-center text-xs font-bold text-white hover:bg-[#16805E] transition-all"
                  >
                    Kelola Produk
                  </Link>
                  <Link
                    to="/katalog"
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-center text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Kembali ke Katalog
                  </Link>
                </div>
              </div>
            ) : (
            /* STEP 1: Buat Pesanan */
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Tentukan Jumlah Porsi</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setJumlah(j => Math.max(j - 1, 1))}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 font-bold text-sm text-gray-800">{jumlah}</span>
                    <button
                      type="button"
                      onClick={() => setJumlah(j => Math.min(j + 1, item.stok))}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Porsi</span>
                </div>
              </div>

              {/* Total Bayar Preview */}
              <div className="bg-[#1D9E75]/5 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Total Pembayaran</span>
                <span className="text-base font-extrabold text-[#1D9E75]">Rp {totalBayar.toLocaleString('id-ID')}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#1D9E75] p-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-[#16805E] transition-all disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : 'Buat Pesanan'}
              </button>
            </form>
            )
          ) : !uploaded ? (
            /* STEP 2: Unggah Bukti Transfer */
            <div className="space-y-6">
              {/* Petunjuk Pembayaran */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Instruksi Pembayaran Manual
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Silakan lakukan transfer senilai <span className="font-extrabold text-gray-800">Rp {totalBayar.toLocaleString('id-ID')}</span> ke rekening berikut:
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs space-y-1">
                  <p>Bank: <span className="font-bold">Mandiri</span></p>
                  <p>No. Rekening: <span className="font-bold text-amber-900 tracking-wide">138-00-1234567-8</span></p>
                  <p>Atas Nama: <span className="font-semibold">Turahan Solo Admin</span></p>
                </div>
                <p className="text-[10px] text-amber-600">Atau scan QRIS di bawah ini:</p>
                <div className="flex justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TurahanSoloQRIS"
                    alt="QRIS QR Code"
                    className="h-28 w-28 rounded-lg border border-amber-200"
                  />
                </div>
              </div>

              {/* Form Bukti Bayar */}
              <form onSubmit={handleUploadBukti} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block">URL Bukti Transfer / Resi</label>
                  <input
                    type="url"
                    required
                    value={buktiBayar}
                    onChange={(e) => setBuktiBayar(e.target.value)}
                    placeholder="https://imgur.com/bukti-transfer.jpg"
                    className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-orange-500 p-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Unggah Bukti Pembayaran'}
                </button>
              </form>
            </div>
          ) : (
            /* STEP 3: Berhasil di-upload */
            <div className="text-center py-6 space-y-4">
              <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg">Pembayaran Diunggah</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Bukti transfer Anda telah berhasil dikirim ke penyedia makanan.
                </p>
              </div>
              <div className="inline-block bg-green-50 border border-green-200 text-green-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                Menunggu Konfirmasi Penyedia
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/riwayat"
                  className="w-full rounded-xl bg-[#1D9E75] p-3 text-center text-xs font-bold text-white hover:bg-[#16805E] transition-all"
                >
                  Lihat Riwayat Transaksi
                </Link>
                <Link
                  to="/katalog"
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-center text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Kembali ke Katalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
