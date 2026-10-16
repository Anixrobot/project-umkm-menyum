import { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import logoMenyum from '../assets/beranda/LOGO MENYUM.svg';

export default function Navbar({ activePage, setActivePage, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'profil', label: 'Profil' },
    { id: 'menu', label: 'Menu' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'artikel', label: 'Artikel' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    if (window.location.pathname.includes('/brangkas') || window.location.hash.includes('brangkas')) {
      try {
        window.history.pushState(null, '', '/');
      } catch {
        // ignore in non-browser
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#f1e4da] h-16 transition-all duration-200">
      <div className="max-w-[1040px] mx-auto px-3 sm:px-5 h-full flex items-center justify-between">
        {/* Left Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus:outline-none group cursor-pointer shrink-0"
          aria-label="MenYum Mentai Yummy Home"
        >
          <img
            src={logoMenyum}
            alt="MenYum Mentai Yummy"
            className="h-9 sm:h-10 md:h-[42px] w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Center Desktop Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#e46000] text-white px-4 py-2 rounded-[28px] text-sm font-semibold shadow-xs'
                    : 'text-[#7a5a4c] hover:text-[#e46000] px-3.5 py-2 rounded-lg text-sm font-semibold'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('menu')}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 md:px-[26px] py-1.5 sm:py-2 md:py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-xs sm:text-sm md:text-base font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag size={16} className="shrink-0" />
            <span className="hidden sm:inline">Pesan sekarang</span>
            <span className="sm:hidden">Pesan</span>
            {cartCount > 0 && (
              <span className="bg-[#f7b32b] text-[#3a1409] text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full ml-0.5 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 text-[#3a1409] hover:text-[#e46000] rounded-lg border border-[#f1e4da] transition"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#f1e4da] px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#e46000] text-white'
                    : 'text-[#7a5a4c] hover:bg-[#fff8f2] hover:text-[#e46000]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

