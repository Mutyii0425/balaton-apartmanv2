'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../app/context/LanguageContext'; 
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { t, setLanguage, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
        scrolled || isMenuOpen 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-gray-200 py-0' 
          : 'bg-white/80 backdrop-blur-md border-transparent py-4'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-8">
          
          {/* LOGÓ - Mindig bal oldalon */}
          <div className="flex-shrink-0 flex items-center -ml-2">
            <Link 
              href="/#booking" 
              className="group flex flex-row items-baseline gap-1.5 font-extrabold text-lg sm:text-2xl tracking-tighter text-blue-900 transition-transform duration-300 hover:scale-105 whitespace-nowrap" 
              onClick={closeMenu}
            >
              <span>Balaton</span>
              <span className="text-blue-600 transition-colors group-hover:text-blue-500">Hegyvidéki Apartman</span>
            </Link>
          </div>

          {/* HAMBURGER MENÜ GOMB - Mindig látható */}
          <div className="flex items-center justify-end">
            <button 
              className="p-3 rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none active:scale-95 group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menü"
            >
              {/* Ikon animált cseréje */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className={`absolute transform transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                  <Menu size={32} className="text-gray-800 group-hover:text-blue-900" />
                </span>
                <span className={`absolute transform transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                  <X size={32} className="text-blue-600" />
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* LENYÍLÓ MENÜ - Teljes szélességű */}
      <div 
        className={`absolute top-full left-0 w-full bg-white/98 backdrop-blur-2xl border-t border-gray-100 shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center justify-center p-8 space-y-6 min-h-[50vh]">
          
          <MenuLink href="/#booking" onClick={closeMenu}>{t.nav.home}</MenuLink>
          <MenuLink href="/info" onClick={closeMenu}>{t.nav.prices}</MenuLink>
          <MenuLink href="/velemenyek" onClick={closeMenu}>{t.nav.guestbook}</MenuLink>
          <MenuLink href="/gyik" onClick={closeMenu}>{t.nav.faq}</MenuLink>

          {/* Díszes elválasztó */}
          <div className="w-16 h-[2px] bg-gray-100 rounded-full my-4"></div>

          {/* Nyelvválasztó */}
          <div className="flex justify-center gap-4">
            <LangBtn active={language === 'hu'} onClick={() => setLanguage('hu')}>Magyar</LangBtn>
            <LangBtn active={language === 'de'} onClick={() => setLanguage('de')}>Deutsch</LangBtn>
            <LangBtn active={language === 'en'} onClick={() => setLanguage('en')}>English</LangBtn>
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- STÍLUS KOMPONENSEK ---

// Menü linkek - Nagyok és elegánsak
function MenuLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className="group relative text-2xl md:text-3xl font-bold text-slate-800 py-2 transition-colors hover:text-blue-600"
    >
      {children}
      {/* Aláhúzás animáció */}
      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-blue-600 transition-all duration-300 ease-out group-hover:w-full opacity-0 group-hover:opacity-100"></span>
    </Link>
  );
}

// Nyelvválasztó gombok
function LangBtn({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 transform hover:scale-105 ${
        active 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600'
      }`}
    >
      {children}
    </button>
  );
}