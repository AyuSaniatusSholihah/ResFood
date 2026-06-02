import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Beranda', icon: 'home' },
    { path: '/katalog', label: 'Katalog', icon: 'storefront' },
    { path: '/dampak', label: 'Dampak', icon: 'eco' },
    { path: '/cart', label: 'Keranjang', icon: 'shopping_cart' },
    { path: '/profile', label: 'Profil', icon: 'person' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 md:hidden"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -4px 24px rgba(29,158,117,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-end px-1 pt-2 pb-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 relative"
              style={{ minWidth: 0 }}
            >
              {/* Active pill indicator */}
              {isActive && (
                <span
                  className="absolute -top-1 w-8 h-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #1D9E75, #2EC4A0)' }}
                />
              )}

              {/* Icon container */}
              <span
                className="flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200"
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(29,158,117,0.15), rgba(46,196,160,0.10))',
                } : {}}
              >
                <span
                  className="material-symbols-outlined transition-all duration-200"
                  style={{
                    fontSize: '22px',
                    color: isActive ? '#1D9E75' : '#9CA3AF',
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </span>
              </span>

              {/* Label */}
              <span
                className="text-[9px] font-semibold tracking-wide transition-all duration-200"
                style={{
                  color: isActive ? '#1D9E75' : '#9CA3AF',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
