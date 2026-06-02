import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const EMPTY_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 fill=%22%23E5E7EB%22/%3E%3Ccircle cx=%2240%22 cy=%2230%22 r=%2214%22 fill=%22%239CA3AF%22/%3E%3Cpath d=%22M16 72c2-12 12-20 24-20s22 8 24 20%22 fill=%22%239CA3AF%22/%3E%3C/svg%3E';

// Page title map for mobile app-style header
const pageTitles = {
  '/dashboard': 'TurahanSolo',
  '/katalog': 'Katalog Surplus',
  '/dampak': 'Dampak',
  '/impact': 'Impact',
  '/profile': 'Profil Saya',
  '/notifikasi': 'Notifikasi',
  '/riwayat': 'Riwayat Transaksi',
  '/cart': 'Keranjang',
  '/upload': 'Bagikan Makanan',
  '/makanan/tambah': 'Tambah Makanan',
  '/konfirmasi-bukti': 'Konfirmasi Bukti',
  '/peta': 'Peta Distribusi',
  '/gamifikasi': 'Gamifikasi',
  '/flash-sale': 'Flash Sale',
};

const getPageTitle = (pathname) => {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Prefix match
  const match = Object.keys(pageTitles).find(k => pathname.startsWith(k) && k !== '/');
  return match ? pageTitles[match] : 'TurahanSolo';
};

// Pages that show back button instead of logo (sub-pages)
const subPages = ['/makanan/', '/pesan/', '/pembayaran/', '/invoice/', '/pickup/', '/edit-produk/', '/notifikasi', '/riwayat', '/cart', '/konfirmasi-bukti', '/upload', '/peta', '/gamifikasi', '/flash-sale', '/admin'];

export default function Header() {
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch (e) {}
    }
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => { if (res.ok) return res.json(); throw new Error(); })
        .then(data => { setCurrentUser(data); localStorage.setItem('user', JSON.stringify(data)); })
        .catch(() => {});
    }
  }, []);

  const isSubPage = subPages.some(p => location.pathname.startsWith(p));
  const pageTitle = getPageTitle(location.pathname);
  const cartCount = getCartCount();

  return (
    <>
      {/* ─── MOBILE HEADER ─── */}
      <header
        className="md:hidden sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 16px rgba(29,158,117,0.06)',
        }}
      >
        <div className="flex items-center h-14 px-4 gap-3">

          {/* Left: Back button or logo */}
          {isSubPage ? (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90"
              style={{ background: 'rgba(29,158,117,0.08)' }}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ color: '#1D9E75' }}>
                arrow_back
              </span>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1D9E75, #2EC4A0)' }}
              >
                <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </div>
              <span className="font-black text-[17px]" style={{ color: '#1D9E75', letterSpacing: '-0.5px' }}>
                TurahanSolo
              </span>
            </Link>
          )}

          {/* Center: Page title (on sub-pages) */}
          {isSubPage && (
            <h1 className="flex-1 text-sm font-bold text-gray-800 truncate">{pageTitle}</h1>
          )}

          {/* Spacer on main pages */}
          {!isSubPage && <div className="flex-1" />}

          {/* Right: Notif bell + Avatar only */}
          <div className="flex items-center gap-2">
            {/* Notification bell — selalu tampil */}
            <Link
              to="/notifikasi"
              className="w-9 h-9 flex items-center justify-center rounded-xl relative"
              style={{ background: 'rgba(107,114,128,0.08)' }}
            >
              <span className="material-symbols-outlined text-[22px] text-gray-500">
                notifications
              </span>
            </Link>

            {/* Avatar */}
            <Link to="/profile" className="flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl overflow-hidden border-2"
                style={{ borderColor: '#1D9E75' }}
              >
                <img
                  alt={currentUser?.nama || 'User'}
                  className="w-full h-full object-cover"
                  src={currentUser?.foto || EMPTY_AVATAR}
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── DESKTOP HEADER ─── */}
      <header className="hidden md:flex sticky top-0 z-50 justify-between items-center w-full px-12 py-4 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-title-lg font-headline-lg text-primary tracking-tight hover:opacity-80">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1D9E75, #2EC4A0)' }}>
              <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            TurahanSolo
          </Link>
          <nav className="flex items-center gap-8 ml-8">
            <Link to="/dashboard" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Dashboard</Link>
            <Link to="/katalog" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/katalog' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Katalog</Link>
            <Link to="/impact" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/impact' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Impact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-64 outline-none" placeholder="Cari makanan surplus..." type="text"/>
          </div>
          <Link to="/notifikasi" className="p-2 text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <Link to="/cart" className="relative text-on-surface-variant hover:text-primary p-2">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {currentUser ? (
            <div className="flex items-center gap-3 pl-2 border-l border-outline-variant">
              <span className="font-label-lg text-label-lg text-on-surface font-semibold">Hi, {currentUser.nama}</span>
              <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border border-primary hover:opacity-80 transition-all shadow-sm">
                <img alt={currentUser.nama} className="w-full h-full object-cover" src={currentUser.foto || EMPTY_AVATAR}/>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity">
              <img alt="User Avatar" className="w-full h-full object-cover" src={EMPTY_AVATAR}/>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
