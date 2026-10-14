import { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'profil', label: 'Profil' },
    { id: 'menu', label: 'Menu' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'artikel', label: 'Artikel' },
    { id: 'cms', label: 'Panel Web' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#f1e4da] h-16 transition-all duration-200">
      <div className="max-w-[1040px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Left Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          {/* Mascot / Bowl SVG Icon */}
          <div className="w-9 h-9 rounded-full bg-[#FFFAF2] border border-[#f1e4da] flex items-center justify-center p-1 shadow-xs group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
              <circle cx="20" cy="20" r="18" fill="#F99718" />
              <path
                d="M8 22C8 28.6274 13.3726 34 20 34C26.6274 34 32 28.6274 32 22H8Z"
                fill="#682D1D"
              />
              <path
                d="M10 21C11.5 17 14 15 20 15C26 15 28.5 17 30 21H10Z"
                fill="#F2690C"
              />
              <circle cx="20" cy="18" r="3.5" fill="#FFFAF2" />
              <circle cx="15" cy="25" r="1.5" fill="#F99718" />
              <circle cx="25" cy="25" r="1.5" fill="#F99718" />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[26px] md:text-[28px] font-bold tracking-tight">
              <span className="text-[#3a1409]">M</span>
              <span className="text-[#e46000]">enYum</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-[#7a5a4c] tracking-[0.2em] -mt-0.5">
              MENTAI YUMMY
            </span>
          </div>
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('menu')}
            className="flex items-center gap-2 px-4 md:px-[26px] py-2 md:py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-sm md:text-base font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag size={17} />
            <span>Pesan sekarang</span>
            {cartCount > 0 && (
              <span className="bg-[#f7b32b] text-[#3a1409] text-xs font-black px-2 py-0.5 rounded-full ml-0.5 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#3a1409] hover:text-[#e46000] rounded-lg border border-[#f1e4da]"
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

