import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not logged in');
        })
        .then(data => {
          setCurrentUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(err => console.log('Header profile load error:', err));
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-5 md:px-12 py-4 bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-title-lg font-headline-lg text-primary tracking-tight hover:opacity-80">ResFood</Link>
        <nav className="hidden md:flex items-center gap-8 ml-8">
          <Link to="/dashboard" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Dashboard</Link>
          <Link to="/katalog" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/katalog' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Katalog</Link>
          <Link to="/impact" className={`font-label-lg text-label-lg transition-colors ${location.pathname === '/impact' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Impact</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Search Bar - Catalog Style */}
        <div className="hidden md:flex items-center bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-64 outline-none" placeholder="Cari sisa organik..." type="text"/>
        </div>
        
        {/* Mobile Search Icon */}
        <button className="p-2 text-on-surface-variant hover:text-primary md:hidden">
          <span className="material-symbols-outlined">search</span>
        </button>
        
        <button className="p-2 text-on-surface-variant hover:text-primary hidden md:block">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <Link to="/cart" className="relative text-on-surface-variant hover:text-primary p-2">
          <span className="material-symbols-outlined">shopping_cart</span>
          {getCartCount() > 0 && (
            <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>
        
        {currentUser ? (
          <div className="flex items-center gap-3 pl-2 border-l border-outline-variant">
            <span className="hidden md:inline font-label-lg text-label-lg text-on-surface font-semibold">
              Hi, {currentUser.nama}
            </span>
            <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border border-primary hover:opacity-80 transition-all shadow-sm">
              <img alt={currentUser.nama} className="w-full h-full object-cover" src={currentUser.foto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}/>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:opacity-80 transition-opacity">
            <img alt="User Avatar" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>
          </Link>
        )}
      </div>
    </header>
  );
}
