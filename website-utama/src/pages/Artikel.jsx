import { useState } from 'react';
import { Clock, ArrowRight, X, Share2 } from 'lucide-react';

export default function Artikel({ articles = [], selectedArticle, onSelectArticle, onCloseArticleModal }) {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Nutrisi', 'Kuliner', 'Minuman', 'Gaya Hidup', 'Kesehatan', 'Dapur MenYum', 'Komitmen'];

  const filteredArticles = articles.filter(
    (a) => activeCategory === 'Semua' || a.category === activeCategory
  );

  return (
    <div className="py-8 md:py-14 text-left">
      <div className="max-w-[1040px] mx-auto px-5 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold">
            Edukasi Gizi & Info Dapur
          </div>
          <h1 className="text-4xl md:text-[52px] font-extrabold text-[#3a1409] leading-tight">
            Artikel & berita
          </h1>
          <p className="text-base md:text-lg text-[#7a5a4c]">
            Info gizi dan kabar terbaru dari dapur kami untuk menemani gaya hidup sehatmu.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#e46000] text-white shadow-xs'
                    : 'bg-white border-2 border-[#f1e4da] text-[#7a5a4c] hover:border-[#f7b32b]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid 3 Kolom Kartu Artikel */}
        {filteredArticles.length === 0 ? (
          <div className="py-14 text-center rounded-2xl bg-[#fff8f2] border-2 border-dashed border-[#f1e4da] p-8 text-[#7a5a4c] space-y-1">
            <p className="font-bold text-[#3a1409] text-base">Belum ada artikel yang tersedia</p>
            <p className="text-sm">Silakan pilih kategori lain atau tambahkan artikel baru melalui menu <strong>Panel Web</strong>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="p-[9px] rounded-[13px] border border-[#f1e4da] bg-white shadow-[0_0_15.3px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.13)] transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Gambar / Ikon Artikel */}
                <div className="h-44 rounded-[18px] bg-[#fff8f2] flex items-center justify-center text-[64px] overflow-hidden relative">
                  {art.image ? (
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span>{art.icon || '🍱'}</span>
                  )}
                  <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-[#3a1409] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#f1e4da]">
                    {art.category}
                  </span>
                </div>

                {/* Konten Artikel */}
                <div className="p-2 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7a5a4c] pt-1">
                      <Clock size={12} />
                      <span>{art.readTime || '3 menit baca'}</span>
                    </div>
                    <h3 className="text-[20px] md:text-[21px] font-bold text-[#3a1409] group-hover:text-[#e46000] transition-colors leading-snug pt-1">
                      {art.title}
                    </h3>
                    <p className="text-[14px] text-[#7a5a4c] line-clamp-2 mt-1 leading-relaxed">
                      {art.caption}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-[#e46000] flex items-center gap-1">
                    <span>Baca selengkapnya</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Baca Artikel Lengkap */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[#3a1409]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-[#f1e4da] flex flex-col animate-in zoom-in-95">
            {/* Header Modal */}
            <div className="p-4 border-b border-[#f1e4da] flex items-center justify-between bg-[#fff8f2] shrink-0">
              <span className="text-xs font-bold text-[#e46000] uppercase tracking-wider">
                {selectedArticle.category} • {selectedArticle.readTime}
              </span>
              <button
                onClick={onCloseArticleModal}
                className="text-[#7a5a4c] hover:text-[#3a1409] p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Isi Artikel */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              {selectedArticle.image && (
                <div className="w-full h-56 rounded-xl overflow-hidden bg-[#fff8f2]">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl md:text-3xl font-extrabold text-[#3a1409] leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-base text-[#e46000] font-semibold leading-relaxed border-l-4 border-[#e46000] pl-3 py-0.5">
                {selectedArticle.caption}
              </p>

              <div className="text-sm md:text-base text-[#7a5a4c] leading-relaxed space-y-3 pt-2">
                <p>{selectedArticle.content}</p>
                <p>
                  Di MenYum, seluruh proses penyiapan makanan kami jaga dengan standar kebersihan tertinggi. Pemilihan bahan baku bermutu dan pengolahan hangat seketika menjamin nutrisi esensial tetap utuh sampai ke meja Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fff8f2] border border-[#f1e4da] flex items-center justify-between mt-4">
                <span className="text-xs text-[#7a5a4c] font-medium">
                  Bagikan artikel sehat ini ke temanmu:
                </span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        text: selectedArticle.caption,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      alert('Tautan artikel disalin!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#f1e4da] text-xs font-bold text-[#3a1409] hover:text-[#e46000] flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-[#f1e4da] bg-white flex justify-end shrink-0">
              <button
                onClick={onCloseArticleModal}
                className="px-6 py-2 rounded-full bg-[#3a1409] hover:bg-[#54180c] text-white text-xs font-bold transition"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
