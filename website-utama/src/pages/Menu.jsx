import { useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  QrCode,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  Search,
} from 'lucide-react';
import ToppingModal from '../components/ToppingModal';

function generateOrderId() {
  return `ORD-${Date.now().toString().slice(-6)}`;
}

export default function Menu({
  products = [],
  cart = [],
  onAddToCart,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
  onConfirmOrder,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [toppingModalProduct, setToppingModalProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paidSuccess, setPaidSuccess] = useState(false);

  // Handle product click: if Makanan, open popup; if Minuman, add directly
  const handleProductClick = (prod) => {
    if (prod.category === 'Makanan') {
      setToppingModalProduct(prod);
    } else {
      onAddToCart(prod, []);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Calculate pricing
  const grandTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const formatRupiah = (num) => 'Rp' + Number(num || 0).toLocaleString('id-ID');

  // Handle Checkout Confirmation
  const handleConfirmOrderClick = () => {
    if (cart.length === 0) return;

    const orderId = generateOrderId();
    const newOrder = {
      id: orderId,
      customerName: customerName.trim() || 'Pelanggan Web',
      items: cart.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        toppings: i.toppings || [],
      })),
      totalPrice: grandTotal,
      status: 'Pending',
      createdAt: 'Baru saja',
      paymentMethod: 'QRIS',
      notes:
        orderNotes ||
        (cart.some((i) => i.toppings?.length)
          ? cart
              .filter((i) => i.toppings?.length)
              .map((i) => `${i.name}: ${i.toppings.map((t) => t.name).join(', ')}`)
              .join(' | ')
          : '-'),
    };

    // Save to localStorage (`menyum_orders`)
    try {
      const existing = JSON.parse(localStorage.getItem('menyum_orders') || '[]');
      localStorage.setItem('menyum_orders', JSON.stringify([newOrder, ...existing]));
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage:', e);
    }

    if (onConfirmOrder) {
      onConfirmOrder(newOrder);
    }

    setConfirmedOrder(newOrder);
    setPaidSuccess(false);
  };

  const handleMarkAsPaid = () => {
    if (!confirmedOrder) return;

    // Update status to Diproses in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('menyum_orders') || '[]');
      const updated = existing.map((o) =>
        o.id === confirmedOrder.id ? { ...o, status: 'Diproses' } : o
      );
      localStorage.setItem('menyum_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('Gagal update status di localStorage:', e);
    }

    setPaidSuccess(true);
    if (onClearCart) onClearCart();
  };

  return (
    <div className="py-8 md:py-14 text-left">
      <div className="max-w-[1040px] mx-auto px-5 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold">
            Pilihan Kuliner Khas MenYum
          </div>
          <h1 className="text-4xl md:text-[52px] font-extrabold text-[#3a1409] leading-tight">
            Menu & daftar harga
          </h1>
          <p className="text-base md:text-lg text-[#7a5a4c]">
            Pilih kategori, tambahkan ke keranjang, lalu bayar instan lewat QRIS.
          </p>
        </div>

        {/* Filter Kategori & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            {['Semua', 'Makanan', 'Minuman'].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-[18px] py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#e46000] border-2 border-[#e46000] text-white shadow-xs'
                      : 'bg-white border-2 border-[#f1e4da] text-[#3a1409] hover:border-[#f7b32b]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a5a4c]"
            />
            <input
              type="text"
              placeholder="Cari nasi mentai/minuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-sm bg-white border-2 border-[#f1e4da] rounded-full focus:outline-none focus:border-[#e46000] text-[#3a1409]"
            />
          </div>
        </div>

        {/* Katalog Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const inCartItems = cart.filter(
              (item) => String(item.productId || item.id) === String(prod.id)
            );
            const qty = inCartItems.reduce((acc, item) => acc + item.qty, 0);

            return (
              <div
                key={prod.id}
                onClick={() => handleProductClick(prod)}
                className="rounded-[18px] bg-white border-2 border-[#f1e4da] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#f7b32b] hover:shadow-md transition-all group cursor-pointer"
              >
                {/* Gambar Produk */}
                <div className="h-[140px] bg-[#fff8f2] relative flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Badge Terlaris */}
                  {prod.isBestseller && (
                    <span className="bg-[#f7b32b] text-[11px] font-bold text-[#3a1409] px-2.5 py-0.5 rounded-full absolute left-2.5 top-2.5 shadow-xs flex items-center gap-1">
                      <Sparkles size={11} /> Terlaris
                    </span>
                  )}

                  {qty > 0 && (
                    <span className="bg-[#e46000] text-white text-xs font-bold px-2 py-0.5 rounded-full absolute right-2.5 top-2.5 shadow-md">
                      {qty} di keranjang
                    </span>
                  )}
                </div>

                {/* Konten Bawah */}
                <div className="p-4 flex flex-col flex-grow justify-between text-left">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#3a1409] text-base leading-snug group-hover:text-[#e46000] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#7a5a4c] line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="text-lg font-black text-[#e46000]">
                      {formatRupiah(prod.price)}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(prod);
                      }}
                      className="w-full p-[9px] rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-sm font-bold shadow-xs hover:shadow transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel Keranjang & Checkout QRIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Kolom Kiri: Card "Pesananmu" */}
          <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1e4da] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-[#e46000]" size={20} />
                  <h2 className="text-[18.7px] font-bold text-[#3a1409]">
                    Pesananmu
                  </h2>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>

              {/* Daftar Item di Keranjang */}
              {cart.length === 0 ? (
                <div className="py-8 text-center text-[#7a5a4c] space-y-1">
                  <ShoppingBag size={36} className="mx-auto text-[#f1e4da] stroke-1 mb-1" />
                  <p className="text-sm font-medium">Keranjang masih kosong.</p>
                  <p className="text-xs text-[#7a5a4c]/80">
                    Pilih menu di atas dan tekan "+ Tambah" untuk mulai memesan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff8f2] border border-[#f1e4da]/70 text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-bold text-[#3a1409] block truncate">
                          {item.name}
                        </span>
                        {item.toppings && item.toppings.length > 0 && (
                          <span className="text-[11px] text-[#7a5a4c] font-medium block truncate mt-0.5">
                            + {item.toppings.map((t) => t.name).join(', ')}
                          </span>
                        )}
                        <span className="text-[#e46000] font-semibold">
                          {formatRupiah(item.price * item.qty)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-[#f1e4da] rounded-lg p-1">
                        <button
                          onClick={() => onUpdateCartQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#7a5a4c] hover:bg-[#fff8f2] rounded cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-bold text-[#3a1409]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateCartQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#7a5a4c] hover:bg-[#fff8f2] rounded cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveCartItem(item.id)}
                        className="text-[#7a5a4c] hover:text-rose-600 p-1 ml-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Nama & Catatan */}
              {cart.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#3a1409] block mb-1">
                      Nama Pemesan / Meja *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rian / Meja 3 Kampus"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-[#f1e4da] rounded-xl focus:border-[#e46000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#3a1409] block mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Saus mentai jangan terlalu pedas"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-[#f1e4da] rounded-xl focus:border-[#e46000] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total & Tombol Konfirmasi */}
            <div className="pt-4 border-t border-[#f1e4da] mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-[#7a5a4c]">Total Tagihan:</span>
                <span className="text-xl font-black text-[#e46000]">
                  {formatRupiah(grandTotal)}
                </span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleConfirmOrderClick}
                className={`w-full py-3 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  cart.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-[#e46000] hover:bg-[#c85300] text-white active:scale-98'
                }`}
              >
                <QrCode size={18} />
                <span>Konfirmasi pesanan & Buat QRIS</span>
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Card "Bayar dengan QRIS" */}
          <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-6 shadow-xs flex flex-col justify-between text-center">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1e4da] pb-3 text-left">
                <div className="flex items-center gap-2">
                  <QrCode className="text-[#e46000]" size={20} />
                  <h2 className="text-[18.7px] font-bold text-[#3a1409]">
                    Bayar dengan QRIS
                  </h2>
                </div>
                {confirmedOrder && (
                  <span className="text-xs font-mono font-bold bg-[#fff2e5] text-[#e46000] px-2 py-0.5 rounded-md border border-[#f1e4da]">
                    {confirmedOrder.id}
                  </span>
                )}
              </div>

              {/* QR Code Container */}
              <div className="min-h-[220px] rounded-[14px] border-2 border-[#f1e4da] border-dashed flex flex-col items-center justify-center p-4 my-4 bg-[#fff8f2]/50">
                {!confirmedOrder ? (
                  <div className="text-center space-y-2 p-4">
                    <QrCode size={48} className="mx-auto text-[#f1e4da] stroke-1" />
                    <p className="text-[13px] text-[#7a5a4c] max-w-[200px]">
                      Kode QR muncul di sini setelah pesanan dikonfirmasi
                    </p>
                  </div>
                ) : paidSuccess ? (
                  <div className="space-y-3 py-4 animate-in zoom-in-95">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-bold text-[#3a1409] text-base">
                      Pembayaran Diterima!
                    </h3>
                    <p className="text-xs text-[#7a5a4c] max-w-xs leading-relaxed">
                      Pesananmu <strong>{confirmedOrder.id}</strong> sedang disiapkan oleh tim dapur MenYum. Terima kasih!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    {/* Simulated Clean QR Canvas */}
                    <div className="w-40 h-40 bg-white p-2.5 rounded-xl border border-[#f1e4da] shadow-sm flex flex-col items-center justify-center mx-auto relative overflow-hidden">
                      <div className="w-full h-full bg-[#3a1409] rounded-lg flex flex-col items-center justify-center text-white relative">
                        <QrCode size={90} className="text-white" />
                        <span className="text-[9px] font-mono tracking-widest text-[#f7b32b] font-bold mt-1">
                          QRIS MENYUM
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs text-[#7a5a4c]">Nominal Pembayaran:</span>
                      <div className="text-2xl font-black text-[#e46000]">
                        {formatRupiah(confirmedOrder.totalPrice)}
                      </div>
                      <p className="text-[11px] text-[#7a5a4c]">
                        Bisa scan via BCA, GoPay, OVO, Dana, ShopeePay
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Aksi QRIS */}
            <div className="pt-2">
              {confirmedOrder && !paidSuccess && (
                <button
                  onClick={handleMarkAsPaid}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={18} />
                  <span>Tandai Sudah Bayar</span>
                </button>
              )}

              {paidSuccess && (
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setPaidSuccess(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#3a1409] text-white font-bold text-xs hover:bg-[#54180c] transition"
                >
                  Buat Pesanan Baru
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Pilih Topping */}
      {toppingModalProduct && (
        <ToppingModal
          key={toppingModalProduct.id}
          isOpen={Boolean(toppingModalProduct)}
          product={toppingModalProduct}
          onClose={() => setToppingModalProduct(null)}
          onAddToCartWithToppings={(product, selectedToppings) => {
            onAddToCart(product, selectedToppings);
            setToppingModalProduct(null);
          }}
        />
      )}
    </div>
  );
}

