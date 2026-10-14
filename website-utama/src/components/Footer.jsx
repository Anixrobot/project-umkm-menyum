import { MessageCircle, ExternalLink, MapPin, Clock } from 'lucide-react';

export default function Footer({ onNavigate, siteSettings = {} }) {
  const whatsappNumber = siteSettings.whatsapp_number || '6281234567890';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20MenYum,%20saya%20mau%20pesan%20nasi%20mentai!`;
  const instagramUrl = siteSettings.instagram_url || 'https://instagram.com/menyum.id';
  const tiktokUrl = siteSettings.tiktok_url || 'https://tiktok.com/@menyum.id';
  const address =
    siteSettings.address ||
    'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13620';
  const openingHours = siteSettings.opening_hours || '09.00 - 17.00 WIB';

  return (
    <>
      <footer className="w-full bg-[#54180c] text-[#fff3ea] py-14 mt-20 relative border-t-4 border-[#e46000]">
        <div className="max-w-[1040px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Kolom 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FFFAF2] flex items-center justify-center p-1 shadow-xs">
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
                </svg>
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-[28px] font-bold tracking-tight">
                  <span className="text-white">M</span>
                  <span className="text-[#f7b32b]">enYum</span>
                </span>
                <span className="text-[10px] font-bold text-[#f6d55c] tracking-[0.2em] -mt-0.5">
                  MENTAI YUMMY
                </span>
              </div>
            </div>

            <p className="text-[15px] text-[#fff3ea]/90 leading-relaxed pt-1">
              Mentai enak untuk kalangan usia. Gurih, creamy, dan dibuat hangat saat dipesan.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => onNavigate && onNavigate('profil')}
                className="hover:text-[#f7b32b] underline decoration-dotted"
              >
                Tentang Kami
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate && onNavigate('menu')}
                className="hover:text-[#f7b32b] underline decoration-dotted"
              >
                Katalog Menu
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate && onNavigate('testimoni')}
                className="hover:text-[#f7b32b] underline decoration-dotted"
              >
                Ulasan Pembeli
              </button>
            </div>
          </div>

          {/* Kolom 2: Lokasi & Jam Buka */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#f7b32b]">Lokasi & jam buka</h3>

            <div className="flex items-start gap-2.5 text-[15px] text-[#fff3ea]/90">
              <MapPin size={18} className="shrink-0 text-[#f7b32b] mt-0.5" />
              <p className="leading-relaxed">
                {address}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-[15px] text-[#fff3ea]/90 pt-1">
              <Clock size={18} className="shrink-0 text-[#f7b32b]" />
              <p className="font-semibold text-white">Jam Buka : {openingHours}</p>
            </div>
          </div>

          {/* Kolom 3: Ikuti kami */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#f7b32b]">Ikuti kami</h3>
            <p className="text-[15px] text-[#fff3ea]/90">
              Dapatkan update promo harian dan menu spesial lewat media sosial kami:
            </p>

            <div className="flex flex-wrap gap-4 text-[15px] pt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#fff3ea] hover:text-[#f7b32b] transition font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#fff3ea] hover:text-[#f7b32b] transition font-medium"
              >
                <ExternalLink size={16} />
                <span>TikTok</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[#25d366] hover:underline transition font-bold"
              >
                <MessageCircle size={17} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="max-w-[1040px] mx-auto px-5 mt-12 pt-6 border-t border-[#fff3ea]/10 text-center text-[15px] text-[#fff3ea]/80">
          Copyrights © 2026 Rootbrother, All Rights Reserved
        </div>
      </footer>

      {/* Floating WhatsApp CTA Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 px-[18px] py-3 rounded-full bg-[#25d366] text-[#06301a] text-[15px] font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
        aria-label="Chat WhatsApp MenYum"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#06301a]"></span>
        </span>
        <MessageCircle size={20} className="fill-[#06301a]" />
        <span>Chat WhatsApp</span>
      </a>
    </>
  );
}
