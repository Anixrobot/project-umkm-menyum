import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';

export default function Produk({ products, onAddProduct, onDeleteProduct, onUpdateProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    capitalCost: '',
    materialCost: '',
    stock: '',
    image: '',
  });

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Makanan',
      price: '',
      capitalCost: '',
      materialCost: '',
      stock: '20',
      image: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      capitalCost: product.capitalCost.toString(),
      materialCost: product.materialCost.toString(),
      stock: product.stock.toString(),
      image: product.image,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProd = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      capitalCost: parseFloat(formData.capitalCost) || 0,
      materialCost: parseFloat(formData.materialCost) || 0,
      stock: parseInt(formData.stock) || 0,
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80',
    };

    if (editingProduct && onUpdateProduct) {
      onUpdateProduct(newProd);
    } else if (onAddProduct) {
      onAddProduct(newProd);
    }

    setModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Manajemen Data Produk & Bahan Baku</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full">
              Katalog & Modal HPP
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Atur harga jual, modal dasar, dan estimasi biaya bahan per menu
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Tambah Produk Baru</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {['Semua', 'Makanan', 'Minuman'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Menu & Kategori</th>
                  <th className="py-3.5 px-4">Harga Jual</th>
                  <th className="py-3.5 px-4">Modal Awal</th>
                  <th className="py-3.5 px-4">Biaya Bahan Baku</th>
                  <th className="py-3.5 px-4">Profit Bersih / Porsi</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Package size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const totalCost = p.capitalCost + p.materialCost;
                    const profit = p.price - totalCost;
                    const marginPercent = Math.round((profit / p.price) * 100);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Thumb */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Harga Jual */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                          {formatRupiah(p.price)}
                        </td>

                        {/* Modal Awal */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {formatRupiah(p.capitalCost)}
                        </td>

                        {/* Bahan Baku */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {formatRupiah(p.materialCost)}
                        </td>

                        {/* Profit Bersih / Porsi */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-emerald-600 flex items-center gap-1">
                            <span>+{formatRupiah(profit)}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                              {marginPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Stok */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-semibold ${
                              p.stock < 15
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.stock} porsi
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                              title="Edit Produk"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => onDeleteProduct && onDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form Tambah / Edit Produk */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="text-orange-600" size={20} />
                <h3 className="font-bold text-slate-800">
                  {editingProduct ? 'Edit Menu Produk' : 'Tambah Menu Baru'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nama Produk */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Menu Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dimsum Mentai Bakar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              {/* Kategori & Stok */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Stok Tersedia
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Finansial: Harga Jual, Modal Awal, Bahan Baku */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Perhitungan Keuangan & HPP
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="18000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Modal Awal (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={formData.capitalCost}
                      onChange={(e) => setFormData({ ...formData, capitalCost: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Bahan Baku (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="6000"
                      value={formData.materialCost}
                      onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Live Profit Preview */}
                {formData.price && (
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between text-xs font-bold text-emerald-800">
                    <span>Estimasi Profit Bersih / Porsi:</span>
                    <span>
                      {formatRupiah(
                        (parseFloat(formData.price) || 0) -
                          ((parseFloat(formData.capitalCost) || 0) +
                            (parseFloat(formData.materialCost) || 0))
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* URL Foto (Opsional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  URL Gambar Produk (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/30"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

