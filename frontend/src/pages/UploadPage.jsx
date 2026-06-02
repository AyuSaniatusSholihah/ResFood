import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function UploadPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null); // File object
  const [hargaAsli, setHargaAsli] = useState('');
  const [tglExpired, setTglExpired] = useState('');
  const [stok, setStok] = useState('1');
  const [loading, setLoading] = useState(false);

  const flowSteps = [
    {
      title: 'Isi Data Makanan',
      description: 'Nama, deskripsi, harga asli, stok, tanggal expired, dan foto diisi lengkap.'
    },
    {
      title: 'Validasi Input',
      description: 'Form dicek dulu sebelum dikirim supaya data yang masuk tetap rapi.'
    },
    {
      title: 'Klasifikasi Otomatis',
      description: 'Sistem menghitung selisih hari dari tanggal expired untuk menentukan Jalur A, B, atau C.'
    },
    {
      title: 'Simpan ke Database',
      description: 'Data makanan, foto, jalur, dan harga platform disimpan ke backend.'
    },
    {
      title: 'Tampilkan Hasil',
      description: 'Setelah berhasil, user diarahkan ke katalog untuk melihat hasil upload.'
    }
  ];

  // Helper untuk melakukan kalkulasi preview di frontend
  const hitungJalurDanHargaPreview = (expiredDateStr, originalPriceStr) => {
    if (!expiredDateStr || isNaN(parseFloat(originalPriceStr))) {
      return null;
    }
    const expiryDate = new Date(expiredDateStr);
    const today = new Date();
    
    expiryDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const hargaAsliNum = parseFloat(originalPriceStr);
    let jalur = 'A';
    let hargaPlatform = hargaAsliNum;
    let label = '';
    
    if (diffDays > 2) {
      jalur = 'A';
      hargaPlatform = hargaAsliNum;
      label = 'Jalur A (Konsumsi Layak, Harga Normal)';
    } else if (diffDays === 2) {
      jalur = 'A';
      hargaPlatform = hargaAsliNum * 0.8;
      label = 'Jalur A (Konsumsi Layak, Diskon 20% - H-2)';
    } else if (diffDays === 1) {
      jalur = 'A';
      hargaPlatform = hargaAsliNum * 0.5;
      label = 'Jalur A (Konsumsi Layak, Diskon 50% - H-1)';
    } else if (diffDays >= -2 && diffDays <= 0) {
      jalur = 'B';
      hargaPlatform = 0;
      label = 'Jalur B (Pakan Hewan / Non-Konsumsi, Gratis)';
    } else {
      jalur = 'C';
      hargaPlatform = 0;
      label = 'Jalur C (Daur Ulang / Kompos, Gratis)';
    }
    
    return { jalur, hargaPlatform, label, diffDays };
  };

  const preview = hitungJalurDanHargaPreview(tglExpired, hargaAsli);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('deskripsi', deskripsi);
      formData.append('hargaAsli', parseFloat(hargaAsli));
      formData.append('tglExpired', new Date(tglExpired).toISOString());
      formData.append('stok', parseInt(stok));
      if (foto) {
        formData.append('foto', foto);
      }

      const res = await fetch('/api/makanan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        alert('Makanan surplus berhasil ditambahkan!');
        navigate('/katalog');
      } else {
        const error = await res.json();
        alert('Gagal menambahkan makanan: ' + error.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl md:px-8">
        {/* Title Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-gray-800 md:text-3xl">Bagikan Makanan Surplus</h1>
          <p className="text-xs text-gray-500 md:text-sm mt-1">
            Bantu kurangi limbah pangan dan salurkan makanan ke pihak yang membutuhkan di Kota Solo.
          </p>
        </div>

        {/* Card Wrapper */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Nama Makanan */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Nama Makanan</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Nasi Kotak Rendang Daging"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Deskripsi Makanan</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Contoh: Masih tersegel rapat, sisa catering pernikahan tanggal 31 Mei siang"
                rows="3"
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
              ></textarea>
            </div>

            {/* Foto Makanan (File Upload) */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Foto Makanan</label>
              <div className="mt-1">
                <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFoto(e.target.files[0]);
                      }
                    }} 
                  />
                  {foto ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={URL.createObjectURL(foto)} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-xl mb-2" 
                      />
                      <p className="text-[11px] text-[#1D9E75] font-bold text-center">{foto.name}</p>
                      <p className="text-[9px] text-gray-400 mt-1">Klik untuk mengganti foto</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-3xl text-[#1D9E75] mb-2 group-hover:scale-110 transition-transform">add_a_photo</span>
                      <p className="text-xs text-gray-500 text-center font-medium">Klik atau Seret Gambar ke Sini</p>
                      <p className="text-[10px] text-gray-400 mt-1">Hanya mendukung format gambar (JPG, PNG, WebP)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Harga Asli */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Harga Asli (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={hargaAsli}
                  onChange={(e) => setHargaAsli(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                />
              </div>

              {/* Stok */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Stok (Porsi)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={stok}
                  onChange={(e) => setStok(e.target.value)}
                  placeholder="1"
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
                />
              </div>
            </div>

            {/* Tanggal & Waktu Kadaluarsa */}
            <div>
              <label className="text-xs font-semibold text-gray-600">Tanggal & Waktu Kadaluarsa</label>
              <input
                type="datetime-local"
                required
                value={tglExpired}
                onChange={(e) => setTglExpired(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
              />
            </div>

            {/* Real-time Preview */}
            {preview && (
              <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-[#1D9E75] uppercase tracking-wider flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Preview Klasifikasi Otomatis
                </h4>
                <div className="mt-3 space-y-1.5 text-xs text-gray-700">
                  <p>
                    Jalur Distribusi: <span className="font-bold text-gray-800">{preview.label}</span>
                  </p>
                  <p>
                    Harga Penyelamatan (Platform):{' '}
                    <span className="font-extrabold text-[#1D9E75]">
                      {preview.hargaPlatform === 0 ? 'Gratis (Rp 0)' : `Rp ${preview.hargaPlatform.toLocaleString('id-ID')}`}
                    </span>
                  </p>
                  <p>
                    Selisih Waktu:{' '}
                    <span className="font-semibold text-gray-500">
                      {preview.diffDays >= 0 ? `${preview.diffDays} hari ke depan` : `Sudah kadaluarsa ${Math.abs(preview.diffDays)} hari`}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Alur Lengkap */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#1D9E75]">route</span>
                    Alur Lengkap Upload
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Diagram singkat dari pengisian form sampai data masuk ke database.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-1 rounded-full whitespace-nowrap">
                  A / B / C
                </span>
              </div>

              <div className="grid gap-3">
                {flowSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="w-8 h-8 rounded-full bg-[#1D9E75] text-white flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{step.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                  <p className="font-bold text-green-800">Jalur A</p>
                  <p className="text-green-700 mt-1">H lebih dari 2 hari. Layak konsumsi dengan harga normal atau diskon.</p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <p className="font-bold text-amber-800">Jalur B</p>
                  <p className="text-amber-700 mt-1">H-2 sampai H+0. Otomatis jadi pakan hewan atau non-konsumsi gratis.</p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                  <p className="font-bold text-purple-800">Jalur C</p>
                  <p className="text-purple-700 mt-1">Lewat lebih dari 2 hari. Dialihkan ke daur ulang / kompos.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#1D9E75] p-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#16805E] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Daftarkan Makanan'}
            </button>

          </form>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
