import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-xl px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest border-t border-outline-variant mt-xl">
      <div className="flex flex-col items-center md:items-start gap-xs">
        <span className="text-headline-md font-headline-md text-on-surface">TurahanSolo</span>
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2026 TurahanSolo. Memberdayakan Ekonomi Sirkular.
        </p>
      </div>
      <nav className="flex flex-wrap justify-center gap-lg">
        <Link 
          to="#" 
          className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all"
        >
          Tentang Kami
        </Link>
        <Link 
          to="#" 
          className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all"
        >
          Kebijakan Privasi
        </Link>
        <Link 
          to="#" 
          className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all"
        >
          Hubungi Kami
        </Link>
        <Link 
          to="#" 
          className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:underline transition-all"
        >
          Syarat & Ketentuan
        </Link>
      </nav>
    </footer>
  );
}
