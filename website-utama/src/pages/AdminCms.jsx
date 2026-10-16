import { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Store,
  Star,
  X,
} from 'lucide-react';

export default function AdminCms({
  articles = [],
  onAddArticle,
  onDeleteArticle,
  reviews = [],
  onDeleteReview,
  siteSettings = {},
  onUpdateSiteSettings,
}) {
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'reviews' | 'settings'

  // Article Modal State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [artForm, setArtForm] = useState({
    title: '',
    category: 'Edukasi Gizi',
    readTime: '3 menit baca',
    excerpt: '',
    content: '',
    image: '',
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: siteSettings.whatsapp_number || '6281234567890',
    instagramUrl: siteSettings.instagram_url || 'https://instagram.com/menyum.id',
    tiktokUrl: siteSettings.tiktok_url || 'https://tiktok.com/@menyum.id',
    address:
      siteSettings.address ||
      'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Makasar, Kota Jakarta Timur 13620',
    openingHours: siteSettings.opening_hours || '09.00 - 17.00 WIB',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenAddArticle = () => {
    setArtForm({
      title: '',
      category: 'Edukasi Gizi',
      readTime: '3 menit baca',
      excerpt: '',
      content: '',
      image: '',
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!artForm.title || !artForm.content) return;

    if (onAddArticle) {
      await onAddArticle({
        title: artForm.title.trim(),
        category: artForm.category,
        readTime: artForm.readTime || '3 menit baca',
        excerpt: artForm.excerpt.trim(),
        content: artForm.content.trim(),
        image:
          artForm.image.trim() ||
          'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
      });
    }

    setArticleModalOpen(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (onUpdateSiteSettings) {
      await onUpdateSiteSettings(settingsForm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="py-8 md:py-14 text-left min-h-[70vh]">
      <div className="max-w-[1040px] mx-auto px-5 space-y-6">
        {/* Banner Info Pemisahan Peran Dashboard Kasir vs Web CMS */}
        <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#f1e4da] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e46000]/10 text-[#e46000] flex items-center justify-center shrink-0">
              <Store size={22} />
            </div>
            <div>
              <h4 className="font-bold text-[#3a1409] text-sm">
                Pusat Kontrol Konten & Profil Website
              </h4>
              <p className="text-xs text-[#7a5a4c] leading-snug">
                Kelola artikel gizi, moderasi ulasan testimoni, dan ubah kontak sosial media. Untuk penambahan menu produk & kasir POS dikelola terpusat di <strong>Dashboard Kasir</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Header Title & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold mb-1">
              Panel Web / CMS Mandiri
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3a1409]">
              Kelola Konten Website
            </h1>
            <p className="text-sm text-[#7a5a4c] mt-0.5">
              Kelola artikel edukasi, ulasan pembeli, dan pengaturan kontak WhatsApp / Medsos.
            </p>
          </div>

          {activeTab === 'articles' && (
            <button
              onClick={handleOpenAddArticle}
              className="px-5 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus size={16} />
              <span>Tambah Artikel</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs (3 Tabs) */}
        <div className="flex border-b border-[#f1e4da] gap-2 pt-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'articles'
                ? 'border-[#e46000] text-[#e46000]'
                : 'border-transparent text-[#7a5a4c] hover:text-[#3a1409]'
            }`}
          >
            <FileText size={17} />
            <span>Artikel & Berita ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#e46000] text-[#e46000]'
                : 'border-transparent text-[#7a5a4c] hover:text-[#3a1409]'
            }`}
          >
            <MessageSquare size={17} />
            <span>Moderasi Ulasan ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#e46000] text-[#e46000]'
                : 'border-transparent text-[#7a5a4c] hover:text-[#3a1409]'
            }`}
          >
            <Share2 size={17} />
            <span>Kontak & Medsos</span>
          </button>
        </div>

        {/* TAB 1: ARTIKEL & BERITA */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border-2 border-[#f1e4da] text-[#7a5a4c] space-y-2">
                <FileText size={40} className="mx-auto text-[#f1e4da]" />
                <p className="font-bold">Belum ada artikel yang diterbitkan.</p>
                <p className="text-xs">Klik tombol &quot;+ Tambah Artikel&quot; untuk mulai menulis edukasi gizi atau kabar dapur.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl bg-white border-2 border-[#f1e4da] shadow-xs flex flex-col justify-between hover:border-[#f7b32b] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f7b32b]/20 text-[#3a1409]">
                          {art.category}
                        </span>
                        <span className="text-xs text-[#7a5a4c]">{art.readTime}</span>
                      </div>
                      <h3 className="font-bold text-[#3a1409] text-base leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#7a5a4c] line-clamp-3 leading-relaxed">
                        {art.excerpt || art.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f1e4da] text-xs">
                      <span className="text-[#7a5a4c]">{art.date}</span>
                      <button
                        onClick={() => onDeleteArticle(art.id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODERASI TESTIMONI / ULASAN */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border-2 border-[#f1e4da] text-[#7a5a4c] space-y-2">
                <MessageSquare size={40} className="mx-auto text-[#f1e4da]" />
                <p className="font-bold">Belum ada testimoni pelanggan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white border-2 border-[#f1e4da] shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-[#3a1409] text-sm">
                            {rev.name}
                          </h4>
                          <span className="text-[11px] text-[#7a5a4c]">{rev.role}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#fff8f2] px-2 py-0.5 rounded-lg border border-[#f1e4da]">
                          <Star size={13} className="text-[#f7b32b] fill-[#f7b32b]" />
                          <span className="text-xs font-bold text-[#3a1409]">
                            {rev.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#7a5a4c] leading-relaxed italic bg-[#fff8f2]/50 p-2.5 rounded-xl border border-[#f1e4da]/50">
                        &quot;{rev.comment || rev.text}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f1e4da] text-xs">
                      <span className="text-[#7a5a4c]">{rev.date}</span>
                      <button
                        onClick={() => onDeleteReview(rev.id)}
                        className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Hapus Ulasan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PENGATURAN KONTAK & MEDSOS */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="p-6 md:p-8 rounded-2xl bg-white border-2 border-[#f1e4da] space-y-6 shadow-xs max-w-2xl"
          >
            <div>
              <h3 className="font-bold text-lg text-[#3a1409]">
                Pengaturan Kontak WhatsApp & Media Sosial
              </h3>
              <p className="text-xs text-[#7a5a4c] mt-0.5">
                Informasi di bawah ini otomatis tampil pada Footer dan Tombol Melayang WhatsApp di seluruh halaman website.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Pengaturan kontak berhasil disimpan ke database!</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#3a1409] block mb-1.5">
                  Nomor WhatsApp Pemesanan (Gunakan format 62...) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                  }
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1.5">
                  URL Akun Instagram *
                </label>
                <input
                  type="url"
                  required
                  value={settingsForm.instagramUrl}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                  }
                  placeholder="https://instagram.com/menyum.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1.5">
                  URL Akun TikTok *
                </label>
                <input
                  type="url"
                  required
                  value={settingsForm.tiktokUrl}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })
                  }
                  placeholder="https://tiktok.com/@menyum.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1.5">
                  Alamat Lengkap Outlet *
                </label>
                <textarea
                  rows={2}
                  required
                  value={settingsForm.address}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, address: e.target.value })
                  }
                  placeholder="Alamat fisik toko / kampus"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1.5">
                  Jam Buka Operasional *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.openingHours}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, openingHours: e.target.value })
                  }
                  placeholder="Contoh: 09.00 - 17.00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save size={16} />
                <span>Simpan Perubahan Kontak</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL TAMBAH ARTIKEL */}
      {articleModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setArticleModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-[24px] border-2 border-[#f1e4da] p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setArticleModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#fff8f2] hover:bg-[#f1e4da] text-[#7a5a4c] flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-extrabold text-[#3a1409] mb-4">
              Tulis Artikel & Berita Baru
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Manfaat Saus Mentai Asli Tanpa Pengawet"
                  value={artForm.title}
                  onChange={(e) =>
                    setArtForm({ ...artForm, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Kategori *
                  </label>
                  <select
                    value={artForm.category}
                    onChange={(e) =>
                      setArtForm({ ...artForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                  >
                    <option value="Edukasi Gizi">Edukasi Gizi</option>
                    <option value="Tips Kuliner">Tips Kuliner</option>
                    <option value="Kabar Dapur">Kabar Dapur</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Estimasi Baca
                  </label>
                  <input
                    type="text"
                    value={artForm.readTime}
                    onChange={(e) =>
                      setArtForm({ ...artForm, readTime: e.target.value })
                    }
                    placeholder="3 menit baca"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 1-2 kalimat untuk pratinjau kartu"
                  value={artForm.excerpt}
                  onChange={(e) =>
                    setArtForm({ ...artForm, excerpt: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Isi Konten Artikel Lengkap *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tulis artikel lengkap di sini..."
                  value={artForm.content}
                  onChange={(e) =>
                    setArtForm({ ...artForm, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-[#f1e4da] bg-white text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-5 py-2 rounded-full border-2 border-[#f1e4da] text-[#7a5a4c] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold shadow-md"
                >
                  Terbitkan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
