import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Proof of Payment States
  const [createdPayments, setCreatedPayments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const totalBelanja = getCartTotal();
  const biayaLayanan = 2000;
  const totalBayar = totalBelanja + biayaLayanan;

  const handlePayment = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.kecamatan) {
      alert('Lengkapi kecamatan alamat Anda terlebih dahulu sebelum melakukan transaksi.');
      navigate('/dashboard');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          metode: paymentMethod,
          total_bayar: totalBayar
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedPayments(result.data);
        setShowUploadForm(true);
      } else {
        let errMsg = 'Gagal memproses transaksi.';
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch (parseErr) {
          console.error('Failed to parse error response as JSON:', parseErr);
          try {
            const textData = await response.clone().text();
            console.error('Error response text:', textData);
            errMsg = `Gagal memproses transaksi (${response.status}): ${textData.substring(0, 100)}`;
          } catch (textErr) {
            errMsg = `Gagal memproses transaksi (Status: ${response.status})`;
          }
        }
        alert(errMsg);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Terjadi kesalahan jaringan: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Silakan pilih file bukti transfer terlebih dahulu');
      return;
    }
    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Upload untuk setiap pembayaran
      for (const item of createdPayments) {
        const formData = new FormData();
        formData.append('bukti', selectedFile);

        const response = await fetch(`/api/pembayaran/${item.pembayaran.id}/bukti`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Gagal mengunggah bukti pembayaran');
        }
      }

      setIsSuccess(true);
      const firstPayment = createdPayments[0];
      const orderId = firstPayment ? `RSF-${firstPayment.transaksi.id}` : `RSF-${Math.floor(100000 + Math.random() * 900000)}`;
      const co2Saved = (cart.reduce((acc, item) => acc + item.quantity, 0) * 2.5).toFixed(1);
      const waterSaved = cart.reduce((acc, item) => acc + item.quantity, 0) * 450;
      const items = [...cart];
      
      clearCart();
      setTimeout(() => {
        navigate('/invoice', { 
          state: { 
            orderId, 
            totalBayar, 
            co2Saved, 
            waterSaved, 
            items,
            statusText: 'Menunggu Verifikasi Admin'
          } 
        });
      }, 1500);

    } catch (err) {
      console.error(err);
      alert(err.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-[1200px] mx-auto px-5 md:px-12 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Left Column: Order Details & Payment */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Konfirmasi Pesanan</h2>
            </div>

            {/* Order Cards */}
            <div className="space-y-4">
              {cart.length > 0 ? cart.map(item => (
                <div key={item.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img alt={item.name} className="w-full h-full object-cover" src={item.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80"}/>
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h3>
                        <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-full font-label-md text-label-md">Layak Konsumsi</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-2">{item.seller}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
                        <span className="font-label-md font-bold">Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-md text-headline-md text-primary">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-surface-container-lowest p-8 rounded-xl text-center shadow-sm">
                  <p className="text-on-surface-variant font-body-md">Keranjang Anda kosong. Silakan kembali ke Katalog.</p>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] mt-4">
              <h3 className="font-headline-sm text-headline-sm mb-4">Metode Pembayaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* QRIS */}
                <label className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all group active:scale-95 ${paymentMethod === 'qris' ? 'border-primary' : 'border-outline-variant hover:border-primary'}`}>
                  <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} className="hidden" disabled={showUploadForm}/>
                  <span className="material-symbols-outlined text-primary text-[32px] mb-2">qr_code_2</span>
                  <span className="font-label-lg text-label-lg font-bold">QRIS</span>
                  <div className={`absolute top-2 right-2 transition-opacity ${paymentMethod === 'qris' ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  </div>
                </label>
                
                {/* GoPay */}
                <label className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all group active:scale-95 ${paymentMethod === 'gopay' ? 'border-primary' : 'border-outline-variant hover:border-primary'}`}>
                  <input type="radio" name="payment" value="gopay" checked={paymentMethod === 'gopay'} onChange={() => setPaymentMethod('gopay')} className="hidden" disabled={showUploadForm}/>
                  <span className="material-symbols-outlined text-[#00aede] text-[32px] mb-2">account_balance_wallet</span>
                  <span className="font-label-lg text-label-lg font-bold">GoPay</span>
                  <div className={`absolute top-2 right-2 transition-opacity ${paymentMethod === 'gopay' ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  </div>
                </label>
                
                {/* OVO */}
                <label className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all group active:scale-95 ${paymentMethod === 'ovo' ? 'border-primary' : 'border-outline-variant hover:border-primary'}`}>
                  <input type="radio" name="payment" value="ovo" checked={paymentMethod === 'ovo'} onChange={() => setPaymentMethod('ovo')} className="hidden" disabled={showUploadForm}/>
                  <span className="material-symbols-outlined text-[#4c2a86] text-[32px] mb-2">payments</span>
                  <span className="font-label-lg text-label-lg font-bold">OVO</span>
                  <div className={`absolute top-2 right-2 transition-opacity ${paymentMethod === 'ovo' ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  </div>
                </label>
              </div>

              {/* Dynamic Payment Display Area (QR Mockup) */}
              {paymentMethod === 'qris' && (
                <div className="mt-8 flex flex-col items-center justify-center bg-surface-container p-8 rounded-xl border border-dashed border-outline animate-in fade-in zoom-in duration-300">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <img alt="QRIS Mock" className="w-32 h-32 opacity-80" src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"/>
                  </div>
                  <p className="font-body-md text-body-md text-center max-w-[280px]">Scan QRIS ini dengan aplikasi pembayaran pilihan Anda untuk menyelesaikan transaksi.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary & Impact */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Carbon Impact Card */}
            <div className="bg-primary-container text-on-primary-container p-8 rounded-2xl relative overflow-hidden shadow-lg group">
              {/* Abstract Background Pattern */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-on-primary-container opacity-10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[32px]">eco</span>
                  <h4 className="font-headline-sm text-headline-sm">Dampak Carbon Anda</h4>
                </div>
                <p className="font-body-md text-body-md opacity-90">Dengan menyelamatkan makanan ini, Anda berkontribusi pada:</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-on-primary-container/10 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-label-sm font-label-sm opacity-80 uppercase tracking-wider">CO2 Saved</p>
                    <p className="text-headline-md font-headline-md">{(cart.length * 2.5).toFixed(1)} kg</p>
                  </div>
                  <div className="bg-on-primary-container/10 p-4 rounded-xl backdrop-blur-md">
                    <p className="text-label-sm font-label-sm opacity-80 uppercase tracking-wider">H2O Saved</p>
                    <p className="text-headline-md font-headline-md">{cart.length * 450} L</p>
                  </div>
                </div>
                <p className="text-label-md font-label-md italic mt-1">*Estimasi berdasarkan rata-rata emisi produksi makanan.</p>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
              <h3 className="font-headline-sm text-headline-sm mb-6">Rincian Pembayaran</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between font-body-md text-body-md">
                  <span className="text-on-surface-variant">Harga Item ({cart.length})</span>
                  <span className="text-on-surface">Rp {totalBelanja.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md">
                  <span className="text-on-surface-variant">Biaya Layanan</span>
                  <span className="text-on-surface">Rp {biayaLayanan.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-[1px] bg-outline-variant my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-headline-sm text-headline-sm">Total Bayar</span>
                  <span className="font-headline-md text-headline-md text-primary">Rp {totalBayar.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              {/* CTA / Upload Section */}
              {!showUploadForm ? (
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing || isSuccess || cart.length === 0}
                  className={`w-full mt-8 text-on-primary py-4 rounded-xl font-headline-sm text-headline-sm transition-all transform active:scale-[0.98] shadow-md flex items-center justify-center gap-4 ${isSuccess ? 'bg-secondary' : 'bg-primary hover:bg-[#1b6d24]'} disabled:opacity-80`}
                >
                  {isProcessing ? (
                    <><span className="material-symbols-outlined animate-spin">refresh</span> Memproses...</>
                  ) : isSuccess ? (
                    <><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Pembayaran Berhasil!</>
                  ) : (
                    <>Konfirmasi Pembayaran <span className="material-symbols-outlined">arrow_forward</span></>
                  )}
                </button>
              ) : (
                <div className="mt-6 p-6 bg-surface-container-high rounded-xl border border-primary/20 space-y-4">
                  <h4 className="font-headline-sm text-headline-sm text-primary flex items-center gap-xs font-bold">
                    <span className="material-symbols-outlined">upload_file</span>
                    Upload Bukti Pembayaran
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Silakan transfer sebesar <strong className="text-primary text-sm">Rp {totalBayar.toLocaleString('id-ID')}</strong> menggunakan metode yang dipilih di atas, kemudian upload foto bukti transfer Anda di bawah ini:
                  </p>
                  
                  <form onSubmit={handleUploadProof} className="space-y-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full text-xs text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={isUploading || isSuccess}
                      className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-xs"
                    >
                      {isUploading ? (
                        <><span className="material-symbols-outlined animate-spin">refresh</span> Mengunggah...</>
                      ) : isSuccess ? (
                        'Bukti Terkirim!'
                      ) : (
                        'Kirim Bukti Transfer'
                      )}
                    </button>
                  </form>
                </div>
              )}
              
              <p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-4 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Transaksi Aman & Terenkripsi
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-outline-variant mt-8 mb-20 md:mb-0">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span className="text-headline-md font-headline-md text-on-surface">TurahanSolo</span>
          <p className="font-body-md text-body-md text-on-surface-variant">© 2026 TurahanSolo. Memberdayakan Ekonomi Sirkular.</p>
        </div>
        <div className="flex gap-8">
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all">Tentang Kami</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all">Kebijakan Privasi</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all">Hubungi Kami</Link>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
