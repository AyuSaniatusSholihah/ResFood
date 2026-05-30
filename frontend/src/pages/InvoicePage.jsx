import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function InvoicePage() {
  const location = useLocation();
  const invoiceData = location.state || {
    orderId: `RSF-${Math.floor(100000 + Math.random() * 900000)}`,
    totalBayar: 17000,
    co2Saved: '2.5',
    waterSaved: 450,
    items: [{ id: 'mock', name: 'Surplus Salad Organik - Paket Bento', quantity: 1, price: 15000, seller: 'Restoran Pelangi Solo' }],
    statusText: 'Menunggu Verifikasi Admin'
  };

  const statusText = invoiceData.statusText || 'Menunggu Verifikasi Admin';
  const isPending = statusText.toLowerCase().includes('menunggu') || statusText.toLowerCase().includes('pending');

  return (
    <div className="bg-surface text-on-surface min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <div 
        className="bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant overflow-hidden"
        style={{ width: '100%', maxWidth: '480px' }}
      >
        
        {/* Dynamic Header based on verification status */}
        <div className={`p-8 text-center text-white transition-colors duration-300 w-full ${isPending ? 'bg-tertiary' : 'bg-primary'}`}>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            {isPending ? (
              <span className="material-symbols-outlined text-[48px] text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>pending</span>
            ) : (
              <span className="material-symbols-outlined text-[48px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            )}
          </div>
          <h1 className="font-headline-lg text-headline-lg mb-2">
            {isPending ? 'Bukti Transfer Terkirim!' : 'Pembayaran Berhasil!'}
          </h1>
          <p className="font-body-md text-body-md opacity-90">
            {isPending 
              ? 'Bukti transfer Anda telah diterima dan sedang diverifikasi oleh admin.' 
              : 'Terima kasih telah berkontribusi menyelamatkan pangan hari ini.'}
          </p>
        </div>

        {/* Invoice Details */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-outline-variant border-dashed">
            <div>
              <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-headline-sm text-headline-sm">#{invoiceData.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full font-label-md text-label-md font-bold ${
                isPending ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'
              }`}>
                {statusText}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 pb-6 border-b border-outline-variant border-dashed">
            <div>
              <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">Metode</p>
              <p className="font-label-lg text-label-lg font-bold uppercase">QRIS/E-Wallet</p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">Tanggal</p>
              <p className="font-label-lg text-label-lg">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="mb-6 space-y-3">
            <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">Daftar Belanjaan</p>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-bold text-on-surface">{item.name}</p>
                  <p className="text-[12px] text-on-surface-variant">{item.seller} • {item.quantity}x</p>
                </div>
                <span className="font-semibold shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="h-[1px] bg-outline-variant/50 my-2"></div>
            <div className="flex justify-between items-center font-bold">
              <span>Total Pembayaran</span>
              <span className="text-primary text-headline-sm">Rp {invoiceData.totalBayar.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 pt-4 border-t border-outline-variant border-dashed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-bold">Dampak Lingkungan</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Anda menghemat {invoiceData.co2Saved}kg emisi CO2 & {invoiceData.waterSaved}L air dari transaksi ini.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-bold">Kode Pengambilan</p>
                <p className="font-headline-sm text-headline-sm text-tertiary tracking-widest uppercase font-bold">RF-{invoiceData.orderId.split('-')[1] || '8821'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/dashboard" className="flex-1 bg-primary text-white text-center py-4 rounded-xl font-label-lg text-label-lg shadow-md hover:bg-primary/90 transition-all flex items-center justify-center">
              Kembali ke Beranda
            </Link>
            <button onClick={() => window.print()} className="flex-1 border-2 border-outline text-on-surface text-center py-4 rounded-xl font-label-lg text-label-lg hover:bg-surface-container-high transition-all flex items-center justify-center">
              Simpan Bukti
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
