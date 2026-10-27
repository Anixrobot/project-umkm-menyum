import { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { uploadImageToSupabaseStorage } from '../services/supabaseService';

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
    stock: '',
    image: '',
  });

  // File Upload State (Supabase Storage)
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = (p.name || '')
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
      stock: '20',
      image: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: (product.price || 0).toString(),
      capitalCost: (product.capitalCost || 0).toString(),
      stock: (product.stock || 0).toString(),
      image: product.image || '',
    });
    setSelectedFile(null);
    setPreviewUrl(product.image || '');
    setModalOpen(true);
  };

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectedFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP)!', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5 MB!', 'error');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler dengan Upload ke Supabase Storage (bucket: products)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Nama produk dan harga jual wajib diisi!', 'error');
      return;
    }

    let finalImageUrl = formData.image || '';

    // Jika ada file gambar baru yang dipilih, unggah ke Supabase Storage
    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadedPublicUrl = await uploadImageToSupabaseStorage(
          'products',
          selectedFile,
          'product-images'
        );

        if (uploadedPublicUrl) {
          finalImageUrl = uploadedPublicUrl;
        }
      } catch (err) {
        console.warn('Gagal upload ke Supabase Storage, menggunakan fallback gambar:', err);
        showToast(
          'Upload ke Storage gagal (cek policy bucket products). Gambar tetap disimpan lokal.',
          'error'
        );
        // Fallback: gunakan previewUrl atau default
        if (!finalImageUrl && previewUrl) {
          finalImageUrl = previewUrl;
        }
      } finally {
        setIsUploading(false);
      }
    }

    // Default image jika tidak ada
    if (!finalImageUrl) {
      finalImageUrl =
        'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80';
    }

    const priceNum = parseFloat(formData.price) || 0;
    const capitalCostNum = parseFloat(formData.capitalCost) || 0;

    const newProd = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      price: priceNum,
      capitalCost: capitalCostNum,
      materialCost: 0, // Dihapus dari form UI, diset 0
      stock: parseInt(formData.stock, 10) || 0,
      image: finalImageUrl,
    };

    if (editingProduct && onUpdateProduct) {
      await onUpdateProduct(newProd);
      showToast('Menu produk berhasil diperbarui!', 'success');
    } else if (onAddProduct) {
      await onAddProduct(newProd);
      showToast('Menu baru berhasil ditambahkan!', 'success');
    }

    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Estimasi Profit di Modal
  const inputPrice = parseFloat(formData.price) || 0;
  const inputCapital = parseFloat(formData.capitalCost) || 0;
  const liveProfit = inputPrice - inputCapital;
  const liveMargin = inputPrice > 0 ? Math.round((liveProfit / inputPrice) * 100) : 0;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Manajemen Data Produk & Modal HPP</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full">
              Katalog & HPP Bersih
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Atur harga jual, modal/HPP menu, kelola foto produk (Supabase Storage), dan pantau profit bersih
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                  <th className="py-3.5 px-4">Modal / HPP</th>
                  <th className="py-3.5 px-4">Profit Bersih / Porsi</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Package size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const capital = p.capitalCost || 0;
                    const profit = p.price - capital;
                    const marginPercent = p.price > 0 ? Math.round((profit / p.price) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Thumb */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shadow-2xs shrink-0"
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

                        {/* Modal / HPP */}
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {formatRupiah(capital)}
                        </td>

                        {/* Profit Bersih / Porsi */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                            <span>+{formatRupiah(profit)}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                              {marginPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Stok */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              p.stock <= 0
                                ? 'bg-rose-100 text-rose-700 border border-rose-200 font-bold'
                                : p.stock < 15
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.stock <= 0 ? 'Habis (0)' : `${p.stock} porsi`}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                              title="Edit Produk"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => onDeleteProduct && onDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {editingProduct ? 'Edit Menu Produk' : 'Tambah Menu Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Form input produk & HPP dengan upload file foto produk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Stok Tersedia (Porsi) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Finansial: Harga Jual & Modal / HPP (Bahan Baku dihapus) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Perhitungan Keuangan & Modal HPP
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="18000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Modal / HPP (Rp) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="10000"
                      value={formData.capitalCost}
                      onChange={(e) => setFormData({ ...formData, capitalCost: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Live Profit Preview: Harga Jual - Modal/HPP */}
                {formData.price && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <span>Estimasi Profit Bersih / Porsi:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{formatRupiah(liveProfit)}</span>
                      <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded text-emerald-900 font-bold">
                        {liveMargin}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Foto Produk Drag-and-Drop (Supabase Storage bucket: products) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Foto Produk (Supabase Storage)
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Preview Produk"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-slate-800 truncate">
                        {selectedFile ? selectedFile.name : 'Foto Tersimpan'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB (Siap diunggah)`
                          : 'URL publik Supabase Storage'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer"
                        >
                          Ganti Foto
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-orange-500 bg-orange-50/70 scale-102'
                        : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                      <UploadCloud size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Tarik & lepas file gambar di sini, atau{' '}
                      <span className="text-orange-600 underline">pilih dari folder</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Format: PNG, JPG, WebP (Maksimal 5 MB) • Otomatis tersimpan ke Storage
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Mengunggah Foto...</span>
                    </>
                  ) : editingProduct ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambahkan ke Menu'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
