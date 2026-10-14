import { useState } from 'react';
import {
  Package,
  FileText,
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';

export default function AdminCms({
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  articles = [],
  onAddArticle,
  onDeleteArticle,
  orders = [],
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'articles' | 'orders'

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    description: '',
    image: '',
    isBestseller: false,
  });

  // Article Modal State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [artForm, setArtForm] = useState({
    title: '',
    category: 'Nutrisi',
    icon: '🍱',
    caption: '',
    content: '',
    image: '',
    readTime: '3 menit baca',
  });

  const formatRupiah = (num) => 'Rp' + Number(num || 0).toLocaleString('id-ID');

  // Open Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'Makanan',
      price: '',
      description: '',
      image: '',
      isBestseller: false,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      description: prod.description || '',
      image: prod.image || '',
      isBestseller: Boolean(prod.isBestseller),
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;

    const payload = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: prodForm.name.trim(),
      category: prodForm.category,
      price: parseFloat(prodForm.price) || 0,
      description: prodForm.description.trim(),
      image:
        prodForm.image.trim() ||
        'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
      isBestseller: prodForm.isBestseller,
    };

    if (editingProduct && onUpdateProduct) {
      onUpdateProduct(payload);
    } else if (onAddProduct) {
      onAddProduct(payload);
    }

    setProductModalOpen(false);
  };

  // Open Article Modal
  const handleOpenAddArticle = () => {
    setArtForm({
      title: '',
      category: 'Nutrisi',
      icon: '🍱',
      caption: '',
      content: '',
      image: '',
      readTime: '3 menit baca',
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!artForm.title || !artForm.caption) return;

    const payload = {
      id: Date.now(),
      title: artForm.title.trim(),
      category: artForm.category,
      icon: artForm.icon || '🍱',
      caption: artForm.caption.trim(),
      content: artForm.content.trim() || artForm.caption.trim(),
      image: artForm.image.trim(),
      readTime: artForm.readTime || '3 menit baca',
    };

    if (onAddArticle) {
      onAddArticle(payload);
    }

    setArticleModalOpen(false);
  };

  return (
    <div className="py-8 md:py-14 text-left">
      <div className="max-w-[1040px] mx-auto px-5 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold">
              Panel Web / CMS Mandiri
            </div>
            <h1 className="text-3xl md:text-[44px] font-extrabold text-[#3a1409] leading-tight">
              Kelola Konten Website
            </h1>
            <p className="text-sm md:text-base text-[#7a5a4c]">
              Atur menu produk, artikel gizi, dan pantau log pesanan yang masuk dari website.
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-xs md:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus size={16} />
                <span>Tambah Produk</span>
              </button>
            )}

            {activeTab === 'articles' && (
              <button
                onClick={handleOpenAddArticle}
                className="px-5 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-xs md:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus size={16} />
                <span>Tulis Artikel Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-[#f1e4da] pb-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'products'
                ? 'bg-[#3a1409] text-white shadow-xs'
                : 'text-[#7a5a4c] hover:bg-[#fff8f2]'
            }`}
          >
            <Package size={16} />
            <span>Katalog Menu ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'articles'
                ? 'bg-[#3a1409] text-white shadow-xs'
                : 'text-[#7a5a4c] hover:bg-[#fff8f2]'
            }`}
          >
            <FileText size={16} />
            <span>Artikel & Berita ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'orders'
                ? 'bg-[#3a1409] text-white shadow-xs'
                : 'text-[#7a5a4c] hover:bg-[#fff8f2]'
            }`}
          >
            <ClipboardList size={16} />
            <span>Log Pesanan Web ({orders.length})</span>
          </button>
        </div>

        {/* 1. TAB PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border-2 border-[#f1e4da] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#fff8f2] text-[#3a1409] font-bold uppercase tracking-wider text-[11px] border-b border-[#f1e4da]">
                  <tr>
                    <th className="py-3 px-4">Menu & Foto</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Harga Jual</th>
                    <th className="py-3 px-4">Deskripsi / Topping</th>
                    <th className="py-3 px-4">Status Badge</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1e4da]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#fff8f2]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#f1e4da]"
                          />
                          <span className="font-bold text-[#3a1409] text-sm">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fff8f2] text-[#3a1409] border border-[#f1e4da]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#e46000] text-sm">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3 px-4 text-[#7a5a4c] max-w-xs truncate">
                        {p.description || '-'}
                      </td>
                      <td className="py-3 px-4">
                        {p.isBestseller ? (
                          <span className="bg-[#f7b32b] text-[#3a1409] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ★ Terlaris
                          </span>
                        ) : (
                          <span className="text-[#7a5a4c] text-[11px]">Reguler</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg text-[#7a5a4c] hover:text-[#e46000] hover:bg-[#fff2e5]"
                            title="Edit Produk"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteProduct && onDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-[#7a5a4c] hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus Produk"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. TAB ARTICLES */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border-2 border-[#f1e4da] p-4 flex gap-4 items-start justify-between shadow-xs hover:border-[#f7b32b] transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-[#fff8f2] flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-[#f1e4da]">
                  {art.image ? (
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  ) : (
                    art.icon || '🍱'
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-[#e46000] uppercase tracking-wider">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-[#3a1409] text-sm leading-snug line-clamp-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[#7a5a4c] line-clamp-2">
                    {art.caption}
                  </p>
                </div>

                <button
                  onClick={() => onDeleteArticle && onDeleteArticle(art.id)}
                  className="p-1.5 rounded-lg text-[#7a5a4c] hover:text-rose-600 hover:bg-rose-50 shrink-0"
                  title="Hapus Artikel"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. TAB ORDERS LOG */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border-2 border-[#f1e4da] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#fff8f2] text-[#3a1409] font-bold uppercase tracking-wider text-[11px] border-b border-[#f1e4da]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Waktu</th>
                    <th className="py-3 px-4">Nama Pelanggan</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Catatan</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status QRIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1e4da]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#7a5a4c]">
                        Belum ada pesanan dari website. Coba lakukan checkout di halaman Menu!
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#fff8f2]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#3a1409]">
                          {ord.id}
                          <div className="text-[10px] text-[#7a5a4c] font-normal">{ord.createdAt}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#3a1409]">
                          {ord.customerName}
                        </td>
                        <td className="py-3 px-4">
                          <ul className="space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <li key={idx}>
                                {it.qty}x {it.name}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4 text-[#7a5a4c] max-w-xs truncate">
                          {ord.notes || '-'}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#e46000]">
                          {formatRupiah(ord.totalPrice)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH/EDIT PRODUK */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3a1409]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-[#f1e4da] animate-in zoom-in-95">
            <div className="p-4 border-b border-[#f1e4da] flex items-center justify-between bg-[#fff8f2]">
              <h3 className="font-bold text-[#3a1409] text-base">
                {editingProduct ? 'Edit Menu Produk' : 'Tambah Menu Baru'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-[#7a5a4c] hover:text-[#3a1409] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rice Egg Mentai Sosis"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Kategori
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000] bg-white"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15000"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Deskripsi / Info Topping
                </label>
                <input
                  type="text"
                  placeholder="Contoh: topping add on (sosis, bakso, chili oil)"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  URL Foto Produk
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={prodForm.isBestseller}
                  onChange={(e) => setProdForm({ ...prodForm, isBestseller: e.target.checked })}
                  className="rounded text-[#e46000] focus:ring-[#e46000]"
                />
                <label htmlFor="bestseller" className="text-xs font-bold text-[#3a1409] cursor-pointer">
                  Tandai sebagai Menu "Terlaris"
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-[#7a5a4c] font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TULIS ARTIKEL */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3a1409]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-[#f1e4da] animate-in zoom-in-95">
            <div className="p-4 border-b border-[#f1e4da] flex items-center justify-between bg-[#fff8f2]">
              <h3 className="font-bold text-[#3a1409] text-base">
                Tulis Artikel & Berita Gizi
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-[#7a5a4c] hover:text-[#3a1409] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Khasiat Protein Telur untuk Kuliah"
                  value={artForm.title}
                  onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Kategori
                  </label>
                  <select
                    value={artForm.category}
                    onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000] bg-white"
                  >
                    <option value="Nutrisi">Nutrisi</option>
                    <option value="Kuliner">Kuliner</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Gaya Hidup">Gaya Hidup</option>
                    <option value="Dapur MenYum">Dapur MenYum</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#3a1409] block mb-1">
                    Ikon Emoji
                  </label>
                  <input
                    type="text"
                    placeholder="🍱 / 🥚 / ☕"
                    value={artForm.icon}
                    onChange={(e) => setArtForm({ ...artForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Ringkasan / Caption *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Teks singkat yang muncul pada kartu artikel..."
                  value={artForm.caption}
                  onChange={(e) => setArtForm({ ...artForm, caption: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000] resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#3a1409] block mb-1">
                  Isi Lengkap Artikel
                </label>
                <textarea
                  rows={3}
                  placeholder="Uraian edukasi gizi dan informasi lengkap..."
                  value={artForm.content}
                  onChange={(e) => setArtForm({ ...artForm, content: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-[#f1e4da] rounded-xl outline-none focus:border-[#e46000] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-slate-100 text-[#7a5a4c] font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold"
                >
                  Publikasikan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
