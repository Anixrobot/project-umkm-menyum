import React, { useState } from 'react';

// Mock Dummy Products Catalog
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Ayam Geprek Sambal Korek',
    category: 'Makanan',
    price: 18000,
    cost: 10000,
    stock: 24,
    image: '🍗',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 2,
    name: 'Nasi Goreng Spesial Menyum',
    category: 'Makanan',
    price: 22000,
    cost: 11500,
    stock: 18,
    image: '🍳',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 3,
    name: 'Mie Nyemek Telur Pedas',
    category: 'Makanan',
    price: 16000,
    cost: 8500,
    stock: 15,
    image: '🍜',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 4,
    name: 'Es Kopi Susu Aren Menyum',
    category: 'Minuman',
    price: 15000,
    cost: 6500,
    stock: 40,
    image: '☕',
    color: 'from-amber-700 to-yellow-900',
  },
  {
    id: 5,
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman',
    price: 5000,
    cost: 1500,
    stock: 60,
    image: '🍹',
    color: 'from-amber-500 to-orange-400',
  },
  {
    id: 6,
    name: 'Lemon Tea Dingin',
    category: 'Minuman',
    price: 8000,
    cost: 3000,
    stock: 25,
    image: '🍋',
    color: 'from-yellow-400 to-lime-500',
  },
  {
    id: 7,
    name: 'Pisang Goreng Crispy Keju',
    category: 'Snack',
    price: 12000,
    cost: 5000,
    stock: 20,
    image: '🍌',
    color: 'from-yellow-300 to-amber-500',
  },
  {
    id: 8,
    name: 'Tahu Walik Crispy Gurih',
    category: 'Snack',
    price: 10000,
    cost: 4000,
    stock: 30,
    image: '🥟',
    color: 'from-orange-300 to-amber-600',
  },
];

export default function Kasir() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([
    { id: 1, name: 'Ayam Geprek Sambal Korek', price: 18000, qty: 2, image: '🍗' },
    { id: 4, name: 'Es Kopi Susu Aren Menyum', price: 15000, qty: 1, image: '☕' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('Pelanggan Walk-In');
  const [orderType, setOrderType] = useState('Dine In');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categories = ['Semua', 'Makanan', 'Minuman', 'Snack'];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = 0; // Bebas pajak atau include
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPaymentModalOpen(true);
    setPaymentSuccess(false);
  };

  const completePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentModalOpen(false);
      setCart([]);
      setPaymentSuccess(false);
    }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
      {/* LEFT SECTION: PRODUCT CATALOG & GRID */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-slate-200">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kasir (POS)</h2>
            <p className="text-xs text-slate-500">Pilih menu dan proses transaksi langsung di outlet</p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari menu makanan/minuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
          {filteredProducts.map((product) => {
            const inCart = cart.find((i) => i.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-3.5 flex flex-col justify-between hover:shadow-md hover:border-orange-200 transition-all group"
              >
                <div>
                  {/* Image Placeholder */}
                  <div
                    className={`h-28 w-full rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center text-4xl shadow-inner mb-3 relative`}
                  >
                    <span>{product.image}</span>
                    <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Stok: {product.stock}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5 mb-1 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Harga</span>
                    <span className="text-sm font-bold text-slate-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white flex items-center justify-center font-bold text-lg transition-all shadow-sm active:scale-95"
                    title="Tambah ke pesanan"
                  >
                    {inCart ? `+` : '+'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SECTION: CART / ORDER SUMMARY */}
      <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg">
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Ringkasan Pesanan
            </h3>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Dine In / Takeaway & Customer Name */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setOrderType('Dine In')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'Dine In'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Dine In (Makan Sini)
              </button>
              <button
                onClick={() => setOrderType('Take Away')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'Take Away'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Take Away (Bungkus)
              </button>
            </div>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Pelanggan / Nomor Meja"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3">
                🛒
              </div>
              <p className="text-sm font-semibold text-slate-600">Keranjang Masih Kosong</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Klik menu di sebelah kiri untuk menambahkan ke daftar kasir
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-lg shrink-0">
                    {item.image}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Checkout Button */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/50">
          <div className="space-y-2 mb-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Item ({cart.reduce((a, b) => a + b.qty, 0)})</span>
              <span className="font-semibold text-slate-800">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan / Pajak</span>
              <span className="font-semibold text-emerald-600">Rp 0 (Gratis)</span>
            </div>
            <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between text-sm">
              <span className="font-bold text-slate-800">Total Pembayaran</span>
              <span className="font-bold text-lg text-orange-600">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              cart.length > 0
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Bayar / Checkout (QRIS)
          </button>
        </div>
      </div>

      {/* MODAL CHECKOUT & QRIS SIMULATION */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {paymentSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-500 mt-1">Struk tercetak & pesanan tersimpan ke Buku Kas.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-base">Pembayaran QRIS UMKM</h4>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center my-4">
                  <p className="text-xs text-slate-500">Scan QRIS Statis / Dinamis Menyum</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    Rp {total.toLocaleString('id-ID')}
                  </p>

                  {/* Dummy QR Code Graphic */}
                  <div className="my-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-orange-300 inline-block">
                    <div className="w-44 h-44 bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center border border-slate-200">
                      <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${
                              (i % 2 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-transparent'
                            } rounded-[2px]`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">NMID: ID1020261998234</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={completePayment}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    Simulasi Pembayaran Selesai (Lunas)
                  </button>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200"
                  >
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

