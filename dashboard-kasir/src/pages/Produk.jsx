import React, { useState } from 'react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Ayam Geprek Sambal Korek',
    category: 'Makanan',
    price: 18000,
    baseCost: 7000, // Modal Awal / HPP
    materialCost: 3000, // Harga Bahan Baku tambahan (bumbu, kemasan)
    stock: 24,
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Nasi Goreng Spesial Menyum',
    category: 'Makanan',
    price: 22000,
    baseCost: 8000,
    materialCost: 3500,
    stock: 18,
    status: 'Tersedia',
  },
  {
    id: 3,
    name: 'Mie Nyemek Telur Pedas',
    category: 'Makanan',
    price: 16000,
    baseCost: 6000,
    materialCost: 2500,
    stock: 15,
    status: 'Tersedia',
  },
  {
    id: 4,
    name: 'Es Kopi Susu Aren Menyum',
    category: 'Minuman',
    price: 15000,
    baseCost: 4500,
    materialCost: 2000,
    stock: 40,
    status: 'Tersedia',
  },
  {
    id: 5,
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman',
    price: 5000,
    baseCost: 1000,
    materialCost: 500,
    stock: 60,
    status: 'Tersedia',
  },
  {
    id: 6,
    name: 'Lemon Tea Dingin',
    category: 'Minuman',
    price: 8000,
    baseCost: 2000,
    materialCost: 1000,
    stock: 25,
    status: 'Tersedia',
  },
  {
    id: 7,
    name: 'Pisang Goreng Crispy Keju',
    category: 'Snack',
    price: 12000,
    baseCost: 3500,
    materialCost: 1500,
    stock: 20,
    status: 'Tersedia',
  },
  {
    id: 8,
    name: 'Tahu Walik Crispy Gurih',
    category: 'Snack',
    price: 10000,
    baseCost: 2500,
    materialCost: 1500,
    stock: 0,
    status: 'Habis',
  },
];

export default function Produk() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    baseCost: '',
    materialCost: '',
    stock: '',
  });

  // Profit Calculation helper
  const calculateProfit = (price, base, material) => {
    const profit = Number(price) - (Number(base) + Number(material));
    const margin = Number(price) > 0 ? ((profit / Number(price)) * 100).toFixed(0) : 0;
    return { profit, margin };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      baseCost: Number(formData.baseCost) || 0,
      materialCost: Number(formData.materialCost) || 0,
      stock: Number(formData.stock) || 0,
      status: Number(formData.stock) > 0 ? 'Tersedia' : 'Habis',
    };

    setProducts([newProduct, ...products]);
    setFormData({
      name: '',
      category: 'Makanan',
      price: '',
      baseCost: '',
      materialCost: '',
      stock: '',
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Hapus produk ini dari katalog?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Quick form profit preview
  const livePreview = calculateProfit(
    formData.price || 0,
    formData.baseCost || 0,
    formData.materialCost || 0
  );

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Produk & Bahan Baku
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Katalog barang terhubung langsung ke website pembeli dan penghitungan HPP
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari produk / kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
          >
            <span className="text-base font-bold">+</span> Tambah Produk
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400">Total Item Produk</span>
          <p className="text-xl font-bold text-slate-800 mt-1">{products.length} Menu</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400">Rata-rata Margin Keuntungan</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">~ 48.5%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400">Status Sinkronisasi</span>
          <p className="text-xs font-semibold text-blue-600 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Terhubung ke Katalog Website Utama
          </p>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Produk & Kategori</th>
                <th className="py-3.5 px-4">Harga Jual</th>
                <th className="py-3.5 px-4">Modal Awal</th>
                <th className="py-3.5 px-4">Harga Bahan Baku</th>
                <th className="py-3.5 px-4">Profit Bersih / Porsi</th>
                <th className="py-3.5 px-4">Stok & Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const { profit, margin } = calculateProfit(p.price, p.baseCost, p.materialCost);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{p.name}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-orange-600 uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>

                    {/* Base Capital */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      Rp {p.baseCost.toLocaleString('id-ID')}
                    </td>

                    {/* Raw Material Cost */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      Rp {p.materialCost.toLocaleString('id-ID')}
                    </td>

                    {/* Profit Calculation Formula */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-600 text-xs">
                        + Rp {profit.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Margin: {margin}%
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-700">{p.stock} porsi</div>
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          p.status === 'Tersedia'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`Edit produk: ${p.name}`)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PRODUK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">Tambah Produk Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Menu / Produk
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Contoh: Ayam Bakar Madu"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stok Awal (Porsi)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="20"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="20000"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Modal Awal (Rp)
                  </label>
                  <input
                    type="number"
                    name="baseCost"
                    placeholder="8000"
                    value={formData.baseCost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bahan Baku (Rp)
                  </label>
                  <input
                    type="number"
                    name="materialCost"
                    placeholder="3000"
                    value={formData.materialCost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Real-time Profit Preview Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-semibold block">
                    Kalkulasi Profit per Porsi:
                  </span>
                  <span className="text-[11px] text-emerald-600">
                    Harga Jual - (Modal + Bahan)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-700 block">
                    + Rp {livePreview.profit > 0 ? livePreview.profit.toLocaleString('id-ID') : 0}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Margin: {livePreview.margin}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

