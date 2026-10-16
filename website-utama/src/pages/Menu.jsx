import { useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Search,
  Ticket,
  Printer,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import ToppingModal from '../components/ToppingModal';
import { getNextQueueNumber } from '../services/supabaseService';

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
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toppingModalProduct, setToppingModalProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

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

  // Handle Checkout Confirmation & Penerbitan Nomor Antrian
  const handleConfirmOrderClick = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      setNameError(true);
      return;
    }

    setIsSubmitting(true);
    setNameError(false);

    try {
      const orderId = generateOrderId();
      const queueNumber = await getNextQueueNumber();

      const newOrder = {
        id: orderId,
        queueNumber: queueNumber,
        customerName: customerName.trim(),
        items: cart.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: i.price,
          toppings: i.toppings || [],
        })),
        totalPrice: grandTotal,
        status: 'Pending',
        createdAt: 'Baru saja',
        paymentMethod: 'Belum Bayar (Kasir)',
        notes:
          orderNotes.trim() ||
          (cart.some((i) => i.toppings?.length)
            ? cart
                .filter((i) => i.toppings?.length)
                .map((i) => `${i.name}: ${i.toppings.map((t) => t.name).join(', ')}`)
                .join(' | ')
            : '-'),
      };

      // Simpan ke localStorage (`menyum_orders`)
      try {
        const existing = JSON.parse(localStorage.getItem('menyum_orders') || '[]');
        localStorage.setItem('menyum_orders', JSON.stringify([newOrder, ...existing]));
      } catch (e) {
        console.warn('Gagal menyimpan ke localStorage:', e);
      }

      // Kirim realtime ke Supabase
      if (onConfirmOrder) {
        await onConfirmOrder(newOrder);
      }

      setConfirmedOrder(newOrder);
      if (onClearCart) onClearCart();
    } catch (err) {
      console.error('Error saat konfirmasi pesanan:', err);
    } finally {
      setIsSubmitting(false);
    }
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
            Pilih kategori, tambahkan ke keranjang, lalu ambil nomor antrian untuk bayar di kasir.
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
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[#fff8f2] border-2 border-dashed border-[#f1e4da] p-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-white border border-[#f1e4da] flex items-center justify-center mx-auto text-[#7a5a4c] shadow-xs">
              <ShoppingBag size={26} className="text-[#e46000]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl text-[#3a1409]">
                Menu Belum Tersedia
              </h3>
              <p className="text-sm text-[#7a5a4c] max-w-md mx-auto leading-relaxed">
                Database produk saat ini sedang kosong atau belum aktif. Tambahkan produk baru melalui <strong>Dashboard Kasir POS</strong> untuk menampilkannya di sini secara otomatis.
              </p>
            </div>
          </div>
        ) : (
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
                  <div className="p-4 flex flex-col grow justify-between text-left">
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
        )}

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
                <div className="space-y-2.5 pt-2">
                  <div>
                    <label className="text-xs font-bold text-[#3a1409] block mb-1">
                      Nama Pemesan / Meja <span className="text-[#e46000]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rian / Meja 3 Kampus"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (nameError) setNameError(false);
                      }}
                      className={`w-full px-3 py-2 text-xs bg-white border-2 rounded-xl focus:border-[#e46000] outline-none transition-colors ${
                        nameError ? 'border-rose-500 bg-rose-50/40 text-rose-900' : 'border-[#f1e4da] text-[#3a1409]'
                      }`}
                    />
                    {nameError && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                        <AlertCircle size={12} />
                        <span>Nama Pemesan / Meja wajib diisi sebelum konfirmasi!</span>
                      </p>
                    )}
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
                      className="w-full px-3 py-2 text-xs bg-white border-2 border-[#f1e4da] rounded-xl focus:border-[#e46000] outline-none text-[#3a1409]"
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
                disabled={cart.length === 0 || isSubmitting}
                onClick={handleConfirmOrderClick}
                className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  cart.length === 0 || isSubmitting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-[#e46000] hover:bg-[#c85300] text-white active:scale-98 shadow-orange-500/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>Menerbitkan Nomor Antrian...</span>
                  </>
                ) : (
                  <>
                    <Ticket size={18} />
                    <span>Konfirmasi Pesanan & Ambil Nomor Antrian</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Card "Tiket Nomor Antrian" */}
          <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-6 shadow-xs flex flex-col justify-between text-center relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-[#f1e4da] pb-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#fff2e5] text-[#e46000] flex items-center justify-center border border-[#f1e4da]">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <h2 className="text-[18.7px] font-bold text-[#3a1409]">
                      Tiket Nomor Antrian
                    </h2>
                    <span className="text-[11px] text-[#7a5a4c]">Pay at Cashier MenYum</span>
                  </div>
                </div>
                {confirmedOrder && (
                  <span className="text-xs font-mono font-bold bg-[#fff2e5] text-[#e46000] px-2.5 py-1 rounded-md border border-[#f1e4da]">
                    {confirmedOrder.id}
                  </span>
                )}
              </div>

              {/* Tampilan Tiket Nomor Antrian */}
              <div className="min-h-[250px] rounded-[16px] border-2 border-[#f1e4da] border-dashed flex flex-col items-center justify-center p-5 my-4 bg-gradient-to-b from-[#fff8f2] to-white relative">
                {!confirmedOrder ? (
                  <div className="text-center space-y-2 p-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#fff2e5] border border-[#f1e4da] flex items-center justify-center mx-auto text-[#e46000]">
                      <Ticket size={32} />
                    </div>
                    <h4 className="font-bold text-[#3a1409] text-sm">Nomor Antrian Belum Terbit</h4>
                    <p className="text-[12px] text-[#7a5a4c] max-w-[220px] mx-auto leading-relaxed">
                      Pilih menu dan klik "Konfirmasi Pesanan & Ambil Nomor Antrian" di sebelah kiri untuk mendapatkan tiket.
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-3.5 py-2 animate-in zoom-in-95">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                      <Clock size={12} className="animate-pulse" />
                      <span>Menunggu Pembayaran di Kasir</span>
                    </div>

                    {/* BIG Queue Number */}
                    <div className="py-2">
                      <span className="text-[11px] font-bold tracking-widest text-[#7a5a4c] uppercase block">
                        Nomor Antrian Anda
                      </span>
                      <div className="text-5xl md:text-6xl font-black text-[#e46000] tracking-wider my-1 drop-shadow-xs">
                        {confirmedOrder.queueNumber || 'A-001'}
                      </div>
                      <span className="text-xs font-medium text-[#7a5a4c]">
                        Atas Nama: <strong className="text-[#3a1409] font-bold">{confirmedOrder.customerName}</strong>
                      </span>
                    </div>

                    {/* Rincian Singkat Pesanan */}
                    <div className="bg-white rounded-xl border border-[#f1e4da] p-3 text-left space-y-1.5 text-xs">
                      <div className="text-[11px] font-bold text-[#7a5a4c] uppercase tracking-wider border-b border-[#f1e4da]/60 pb-1 flex justify-between">
                        <span>Rincian Menu</span>
                        <span>{confirmedOrder.items?.length || 0} Item</span>
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {confirmedOrder.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span className="line-clamp-1">
                              {it.qty}x {it.name}
                              {it.toppings && it.toppings.length > 0 && (
                                <span className="text-[10px] text-[#e46000] ml-1 font-semibold">
                                  (+{it.toppings.map((t) => t.name).join(', ')})
                                </span>
                              )}
                            </span>
                            <span className="font-semibold text-slate-900 shrink-0 ml-2">
                              {formatRupiah(it.price * it.qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nominal Pembayaran */}
                    <div className="pt-1">
                      <span className="text-xs text-[#7a5a4c]">Total Tagihan (Bayar di Kasir):</span>
                      <div className="text-2xl md:text-3xl font-black text-[#e46000]">
                        {formatRupiah(confirmedOrder.totalPrice)}
                      </div>
                    </div>

                    {/* Instruksi Tegas ke Kasir */}
                    <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5 shadow-xs">
                      <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold text-[#3a1409] leading-snug">
                          Silakan menuju kasir dan sebutkan Nomor Antrian Anda untuk melakukan pembayaran.
                        </p>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Kasir kami dapat memproses pembayaran via <strong>Tunai</strong> atau <strong>QRIS</strong> serta memverifikasi pesanan Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="pt-2">
              {confirmedOrder && (
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#fff2e5] border-2 border-[#f1e4da] text-[#3a1409] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Cetak Tiket</span>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      setCustomerName('');
                      setOrderNotes('');
                    }}
                    className="flex-1 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-xs transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
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

