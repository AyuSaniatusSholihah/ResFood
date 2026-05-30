import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'home' },
    { path: '/katalog', label: 'Katalog', icon: 'storefront' },
    { path: '/impact', label: 'Dampak', icon: 'eco' },
    { path: '/profile', label: 'Profil', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 md:hidden bg-surface shadow-[0px_-4px_12px_rgba(46,125,50,0.08)] rounded-t-2xl pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center justify-center transition-all ${isActive ? 'text-primary transform scale-110' : 'text-on-surface-variant'}`}
          >
            <div className={`flex items-center justify-center px-4 py-1 rounded-full ${isActive ? 'bg-secondary-container' : ''}`}>
              <span className={`material-symbols-outlined ${isActive ? 'text-on-secondary-container' : ''}`} style={{fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"}}>
                {item.icon}
              </span>
            </div>
            <span className={`font-label-sm text-[10px] mt-1 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
