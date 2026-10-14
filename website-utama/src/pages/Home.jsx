import { useState } from 'react';
import { Flame, QrCode, Bike, ArrowRight, Play, X, Sparkles } from 'lucide-react';
import mentaiHero2 from '../assets/beranda/menyum nasi mentai 2.png';
import mentaiCombo1 from '../assets/beranda/menyum nasi mentai 1.png';

export default function Home({ onNavigate, articles = [], onSelectArticle }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Take the first 3 articles for preview
  const previewArticles = articles.slice(0, 3);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="py-6 md:py-12">
        <div className="max-w-[1040px] mx-auto px-5">
          <div className="bg-linear-to-br from-[#fff8f2] via-white to-[#fff2e5] border-2 border-[#f1e4da] rounded-3xl p-6 md:p-12 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Kolom Kiri: Teks & CTA */}
              <div className="md:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold tracking-wide">
                  <Sparkles size={14} className="text-[#e46000]" />
                  <span>UMKM Kuliner Jepang Kampus</span>
                </div>

                <h1 className="text-4xl md:text-[60px] lg:text-[66px] font-extrabold leading-[1.1] text-[#3a1409]">
                  Mentai yang <span className="text-[#e46000]">bikin nagih</span>, harga pelajar.
                </h1>

                <p className="text-base md:text-lg text-[#7a5a4c] leading-relaxed max-w-xl">
                  Saus mentai creamy, dibakar sebentar sampai wangi. Dibuat saat dipesan untuk sarapan atau makan siang kamu.
                </p>

                <div className="flex flex-wrap gap-3 pt-3">
                  <button
                    onClick={() => onNavigate('profil')}
                    className="px-[26px] py-3 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Tentang MenYum
                  </button>

                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="px-[26px] py-3 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Play size={18} className="fill-white" />
                    <span>Lihat Video</span>
                  </button>
                </div>
              </div>

              {/* Kolom Kanan: Foto Produk Lingkaran Kuning */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative group">
                  {/* Lingkaran Frame Kuning #f7b32b */}
                  <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] rounded-full bg-[#f7b32b] flex items-center justify-center mx-auto shadow-2xl shadow-[#f7b32b]/30 p-3 sm:p-4 transition-transform group-hover:scale-105 duration-300">
                    <img
                      src={mentaiHero2}
                      alt="Nasi Mentai MenYum"
                      className="w-full h-full rounded-full object-cover shadow-inner"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Floating Price Tag Badge */}
                  <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-2 bg-white/95 backdrop-blur-xs border-2 border-[#f1e4da] px-4 py-2 rounded-2xl shadow-lg">
                    <span className="text-[11px] font-bold text-[#7a5a4c] block">Mulai dari</span>
                    <span className="text-lg font-black text-[#e46000]">Rp15.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Value Highlights Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#f1e4da]">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#fff2e5] text-[#e46000] flex items-center justify-center shrink-0 border border-[#f1e4da]">
                  <Flame size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#3a1409] text-[17px]">Dibakar saat dipesan</h4>
                  <p className="text-sm text-[#7a5a4c] mt-0.5 leading-snug">
                    Mentai selalu hangat, smokey, dan creamy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#fff8f2] text-[#f7b32b] flex items-center justify-center shrink-0 border border-[#f1e4da]">
                  <QrCode size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#3a1409] text-[17px]">Bayar pakai QRIS</h4>
                  <p className="text-sm text-[#7a5a4c] mt-0.5 leading-snug">
                    Semua e-wallet dan mobile banking praktis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#fff2e5] text-[#e46000] flex items-center justify-center shrink-0 border border-[#f1e4da]">
                  <Bike size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#3a1409] text-[17px]">Antar area kampus</h4>
                  <p className="text-sm text-[#7a5a4c] mt-0.5 leading-snug">
                    Gratis ongkir pesan banyak mulai Rp40.000.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Preview Section */}
      <section className="my-10 md:my-16">
        <div className="max-w-[1040px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Konten Teks */}
            <div className="space-y-4 text-left">
              <h2 className="text-3xl md:text-[42px] font-bold text-[#3a1409] leading-tight">
                Nikmati makanan <span className="text-[#e46000]">Jepang khas</span> MenYum
              </h2>

              <p className="text-base text-[#7a5a4c] leading-relaxed">
                MenYum merupakan UMKM yang bergerak di bidang kuliner dengan menawarkan produk makanan dan minuman yang lezat, praktis, dan terjangkau.
              </p>

              <p className="text-base text-[#7a5a4c] leading-relaxed">
                MenYum menyediakan nasi mentai telur sebagai pilihan sarapan atau makan siang serta dalgona coffee sebagai teman beraktivitas. Kami berkomitmen untuk menjaga kualitas dan cita rasa produk dengan harga yang terjangkau bagi mahasiswa maupun pekerja.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-[26px] py-3 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Lihat menu</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            {/* Foto Makanan Mentai & Dalgona (menyum nasi mentai 1.png) */}
            <div className="flex justify-center md:justify-end items-center">
              <div className="relative group max-w-[500px]">
                <img
                  src={mentaiCombo1}
                  alt="Kelezatan Nasi Mentai dan Dalgona Coffee Khas MenYum"
                  className="w-full max-h-[380px] md:max-h-[440px] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Artikel & Berita Preview Section */}
      <section className="my-12 md:my-16">
        <div className="max-w-[1040px] mx-auto px-5 text-left">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-[40px] font-bold text-[#3a1409] leading-tight">
                Artikel & berita
              </h2>
              <p className="text-base text-[#7a5a4c] mt-1">
                Info gizi dan kabar terbaru dari dapur kami.
              </p>
            </div>

            <button
              onClick={() => onNavigate('artikel')}
              className="px-[26px] py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm md:text-base shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Lihat selengkapnya
            </button>
          </div>

          {/* Grid 3 Kartu Artikel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {previewArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  if (onSelectArticle) onSelectArticle(art);
                  else onNavigate('artikel');
                }}
                className="p-[9px] rounded-[13px] border border-[#f1e4da] bg-white shadow-[0_0_15.3px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Gambar / Ikon Artikel */}
                <div className="h-40 rounded-[18px] bg-[#fff8f2] flex items-center justify-center text-[60px] overflow-hidden relative">
                  {art.image ? (
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span>{art.icon || '🍱'}</span>
                  )}
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#3a1409] text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {art.category}
                  </span>
                </div>

                {/* Konten Artikel */}
                <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[19px] md:text-[21px] font-bold text-[#3a1409] group-hover:text-[#e46000] transition-colors leading-snug pt-1">
                      {art.title}
                    </h3>
                    <p className="text-[14px] text-[#7a5a4c] line-clamp-2 mt-1 leading-relaxed">
                      {art.caption}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-[#e46000] flex items-center gap-1">
                    <span>Baca selengkapnya</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Promo */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3a1409]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border-2 border-[#f1e4da] animate-in zoom-in-95">
            <div className="p-4 border-b border-[#f1e4da] flex items-center justify-between bg-[#fff8f2]">
              <div className="flex items-center gap-2">
                <Flame className="text-[#e46000]" size={20} />
                <h3 className="font-bold text-[#3a1409] text-base">
                  Video Proses Bakar Saus Mentai Khas MenYum
                </h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-[#7a5a4c] hover:text-[#3a1409] p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="aspect-video bg-[#3a1409] rounded-xl overflow-hidden flex flex-col items-center justify-center text-white relative">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Torching Mentai"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-[#e46000] flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                  <p className="mt-3 font-bold text-white text-sm">
                    Simulasi: Proses Torch Saus Mentai Meleleh
                  </p>
                  <p className="text-xs text-amber-200 mt-1">
                    Setiap porsi dibakar langsung dengan api presisi sebelum disajikan
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#7a5a4c] max-w-md mx-auto">
                Ingin merasakan kenikmatan hangatnya secara langsung? Silakan pesan menu favoritmu sekarang.
              </p>

              <button
                onClick={() => {
                  setVideoModalOpen(false);
                  onNavigate('menu');
                }}
                className="px-6 py-2.5 bg-[#e46000] hover:bg-[#c85300] text-white font-bold rounded-full text-sm transition"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

