import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-4xl mx-auto px-5 md:px-0 py-8">
        <h2 className="font-headline-lg text-headline-lg mb-6">Ringkasan Keranjang</h2>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">shopping_cart</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Keranjang Anda Kosong</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Ayo temukan makanan lezat dengan harga hemat!</p>
            <Link to="/dashboard" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg hover:brightness-110 transition-all">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-variant">
                    <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-error hover:bg-error-container p-2 rounded-full transition-colors flex items-center justify-center -mt-2 -mr-2"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{item.seller || 'Mitra ResFood'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-label-sm bg-surface-container px-2 py-1 rounded-md text-on-surface-variant font-bold">Qty: {item.quantity}</span>
                      </div>
                      <p className="font-headline-md text-headline-md text-primary">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm sticky top-24">
                <h3 className="font-headline-sm text-headline-sm mb-4">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>Total Harga ({cart.length} barang)</span>
                    <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>Biaya Layanan</span>
                    <span>Rp 2.000</span>
                  </div>
                  <div className="border-t border-outline-variant pt-3 flex justify-between font-headline-sm text-headline-sm">
                    <span>Total Belanja</span>
                    <span className="text-primary">Rp {(getCartTotal() + 2000).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Link 
                  to="/payment"
                  className="w-full py-4 bg-primary text-white rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Lanjut ke Pembayaran
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Space for mobile */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
