import { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Banknote,
  Receipt,
  CheckCircle2,
  X,
  ShoppingBag,
  Sparkles,
  Printer,
  AlertCircle,
} from 'lucide-react';

function createPosReceipt({
  cart,
  total,
  totalCapital,
  customerName,
  orderType,
  paymentMethod,
  cashGiven,
  change,
  cashierName = 'Kasir 01 - Shift Siang',
}) {
  return {
    orderId: `POS-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName: customerName.trim() || 'Pelanggan Kasir',
    orderType,
    items: [...cart],
    total,
    totalCapital,
    profit: total - totalCapital,
    paymentMethod,
    cashGiven: paymentMethod === 'Tunai' ? Number(cashGiven) || total : total,
    change: paymentMethod === 'Tunai' ? Math.max(0, Number(change) || 0) : 0,
    cashierName,
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

export default function Kasir({ products, onCompleteTransaction, qrisImageUrl }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Pelanggan Kasir');
  const [orderType, setOrderType] = useState('Dine In');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [cashGiven, setCashGiven] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [showThermalModal, setShowThermalModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const categories = ['Semua', 'Makanan', 'Minuman'];

  const showToast = (message, type = 'error') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = (p.name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Add item to cart with stock validation
  const addToCart = (product) => {
    // Validasi 1: Jika stok produk habis (<= 0)
    if (product.stock <= 0) {
      showToast(`Stok "${product.name}" telah habis! Tidak dapat menambahkan ke pesanan.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        // Validasi 2: Jika qty di keranjang sudah mencapai limit stok tersedia
        if (existing.qty >= product.stock) {
          showToast(
            `Kuantitas "${product.name}" telah mencapai batas stok tersedia (${product.stock} porsi)!`,
            'error'
          );
          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          capitalCost: product.capitalCost || 0,
          stock: product.stock,
          qty: 1,
        },
      ];
    });
  };

  // Update quantity in cart with stock validation
  const updateQty = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (delta > 0 && newQty > item.stock) {
              showToast(
                `Kuantitas "${item.name}" tidak dapat melebihi stok tersedia (${item.stock} porsi)!`,
                'error'
              );
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalCapital = cart.reduce(
    (acc, item) => acc + (item.capitalCost || 0) * item.qty,
    0
  );
  const total = subtotal;

  const cashAmount = parseFloat(cashGiven) || 0;
  const change = cashAmount - total;

  // Process Payment & Trigger Stock Decrease
  const handleProcessPayment = () => {
    const receiptData = createPosReceipt({
      cart,
      total,
      totalCapital,
      customerName,
      orderType,
      paymentMethod,
      cashGiven: paymentMethod === 'Tunai' ? cashAmount : total,
      change: paymentMethod === 'Tunai' ? Math.max(0, change) : 0,
      cashierName: 'Kasir 01 - Shift Siang',
    });

    if (onCompleteTransaction) {
      onCompleteTransaction(receiptData);
    }

    setSuccessReceipt(receiptData);
    setPaymentModalOpen(false);
    setCart([]);
    setCashGiven('');
  };

  // Print Thermal Receipt Trigger
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
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

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Point of Sale (Kasir POS)</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full">
              Daftar Pesanan Cepat
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Pilih menu makanan/minuman, validasi ketersediaan stok, dan proses checkout lunas
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari menu mentai/minuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Product Catalog Grid */}
        <section className="flex-1 p-6 overflow-y-auto flex flex-col">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const inCartItem = cart.find((i) => i.id === product.id);
              const qtyInCart = inCartItem ? inCartItem.qty : 0;
              const isOutOfStock = Number(product.stock || 0) <= 0;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border p-3.5 flex flex-col justify-between transition-all group relative overflow-hidden ${
                    isOutOfStock
                      ? 'border-slate-200 opacity-80'
                      : 'border-slate-200/80 hover:shadow-lg hover:border-orange-300'
                  }`}
                >
                  {/* Badge Qty if in cart */}
                  {qtyInCart > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10">
                      {qtyInCart}
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isOutOfStock ? 'grayscale-40' : 'group-hover:scale-105'
                      }`}
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-medium">
                      {product.category}
                    </span>
                    {isOutOfStock && (
                      <span className="absolute top-2 left-2 text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-md shadow-sm">
                        HABIS
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1 mb-3">
                        <span className="text-orange-600 font-bold text-sm">
                          {formatRupiah(product.price)}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            isOutOfStock
                              ? 'text-rose-600 font-bold'
                              : product.stock < 10
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {isOutOfStock ? 'Stok: 0' : `Stok: ${product.stock}`}
                        </span>
                      </div>
                    </div>

                    {/* Add to cart action with conditional rendering for out-of-stock */}
                    {isOutOfStock ? (
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `Stok "${product.name}" telah habis! Tidak dapat ditambahkan.`,
                            'error'
                          )
                        }
                        className="w-full py-2 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl border border-slate-300 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <span>Stok Habis</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-full py-2 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-xs cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>Tambah</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
              <ShoppingBag size={48} className="stroke-1 mb-2 text-slate-300" />
              <p className="text-sm font-medium">Menu tidak ditemukan</p>
              <p className="text-xs">Coba kata kunci atau kategori lainnya</p>
            </div>
          )}
        </section>

        {/* Right Side: Cart / Order Summary */}
        <aside className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg shrink-0">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Receipt size={20} className="text-orange-600" />
              <h3 className="font-bold text-slate-800 text-base">Detail Pesanan Kasir</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Trash2 size={13} />
                Reset
              </button>
            )}
          </div>

          {/* Customer & Type Options */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderType('Dine In')}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  orderType === 'Dine In'
                    ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dine In (Makan Sini)
              </button>
              <button
                onClick={() => setOrderType('Takeaway')}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  orderType === 'Takeaway'
                    ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Takeaway (Bungkus)
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Nama Pelanggan / No. Meja
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Meja 3 / Mas Dian"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <ShoppingBag size={42} className="stroke-1 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">Keranjang Masih Kosong</p>
                <p className="text-xs text-slate-400 text-center max-w-[200px]">
                  Klik tombol "+ Tambah" pada menu di samping untuk mulai transaksi kasir.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">
                      {formatRupiah(item.price * item.qty)}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Sisa stok: {item.stock}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout Button */}
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Total Item</span>
                <span className="font-semibold text-slate-700">{totalItems} porsi</span>
              </div>
              <div className="flex justify-between text-slate-800 text-sm font-bold pt-1 border-t border-dashed border-slate-200">
                <span>Total Pembayaran</span>
                <span className="text-orange-600 text-base">{formatRupiah(total)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => setPaymentModalOpen(true)}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-orange-600/30 active:scale-98'
              }`}
            >
              <QrCode size={18} />
              <span>Bayar / Checkout (QRIS & Tunai)</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="text-orange-600" size={20} />
                <h3 className="font-bold text-slate-800">Proses Pembayaran</h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Total Display */}
              <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100">
                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                  Total Tagihan
                </span>
                <div className="text-3xl font-extrabold text-orange-600 mt-1">
                  {formatRupiah(total)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {customerName} • {orderType}
                </p>
              </div>

              {/* Payment Method Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'QRIS'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <QrCode size={24} className="text-orange-600" />
                    <span className="text-xs font-bold">QRIS Menyum</span>
                    <span className="text-[10px] text-slate-400">Instan & Dinamis</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('Tunai')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'Tunai'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-700 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Banknote size={24} className="text-emerald-600" />
                    <span className="text-xs font-bold">Tunai / Cash</span>
                    <span className="text-[10px] text-slate-400">Hitung Kembalian</span>
                  </button>
                </div>
              </div>

              {/* Dynamic QRIS Image or Cash Input */}
              {paymentMethod === 'QRIS' ? (
                <div className="flex flex-col items-center p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <div className="w-48 h-48 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
                    {qrisImageUrl ? (
                      <img
                        src={qrisImageUrl}
                        alt="QRIS Toko MenYum"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                        <QrCode size={80} className="text-white relative z-10" />
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 mt-1 font-bold">
                          QRIS MENYUM
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 mt-2.5 flex items-center gap-1 font-medium">
                    <Sparkles size={13} className="text-amber-500" /> Scan via BCA, GoPay, OVO, Dana, ShopeePay
                  </span>
                  {!qrisImageUrl && (
                    <span className="text-[10px] text-slate-400 mt-1">
                      (Unggah gambar QRIS asli toko di menu <strong>Pengaturan</strong>)
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Uang Tunai Diterima (Rp) *
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 50000"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                  </div>

                  {/* Shortcut Nominal Cepat */}
                  <div className="flex flex-wrap gap-1.5">
                    {[total, 20000, 50000, 100000].map((nominal) => (
                      <button
                        key={nominal}
                        type="button"
                        onClick={() => setCashGiven(nominal.toString())}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 text-xs rounded-lg font-semibold border border-slate-200 transition-colors cursor-pointer"
                      >
                        {nominal === total ? 'Uang Pas' : formatRupiah(nominal)}
                      </button>
                    ))}
                  </div>

                  {cashAmount > 0 && (
                    <div
                      className={`p-3 rounded-xl text-xs flex justify-between items-center font-bold ${
                        change >= 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <span>{change >= 0 ? 'Uang Kembalian:' : 'Uang Masih Kurang:'}</span>
                      <span className="text-base font-extrabold">{formatRupiah(Math.abs(change))}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={paymentMethod === 'Tunai' && cashAmount < total}
                  onClick={handleProcessPayment}
                  className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer ${
                    paymentMethod === 'Tunai' && cashAmount < total
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'
                  }`}
                >
                  Konfirmasi Lunas & Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transaksi Berhasil (Menampilkan Uang Kembalian & Tombol Struk Thermal) */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Transaksi Berhasil!</h3>
            <p className="text-xs text-slate-500 mb-4">
              Pembayaran {successReceipt.paymentMethod} sebesar{' '}
              <strong className="text-slate-800">{formatRupiah(successReceipt.total)}</strong> telah
              diterima dan stok produk telah dipotong.
            </p>

            {/* Rincian Finansial Transaksi */}
            <div className="bg-slate-50 p-3.5 rounded-xl text-left text-xs space-y-1.5 border border-slate-200/70 mb-5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>No. Order:</span>
                <span className="font-bold text-slate-800">{successReceipt.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pelanggan:</span>
                <span className="text-slate-800">{successReceipt.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Metode:</span>
                <span className="font-semibold text-slate-800">{successReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Waktu:</span>
                <span className="text-slate-800">{successReceipt.time}</span>
              </div>

              <div className="border-t border-dashed border-slate-300 my-1.5"></div>

              <div className="flex justify-between font-bold text-slate-800">
                <span>Total Tagihan:</span>
                <span>{formatRupiah(successReceipt.total)}</span>
              </div>

              {/* Tampilkan Uang Diterima & Uang Kembalian secara spesifik jika metode Tunai */}
              {successReceipt.paymentMethod === 'Tunai' && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Uang Diterima:</span>
                    <span>{formatRupiah(successReceipt.cashGiven)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    <span>Uang Kembalian:</span>
                    <span>{formatRupiah(successReceipt.change)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between font-medium text-emerald-700 pt-1 text-[11px]">
                <span>Estimasi Profit:</span>
                <span>+{formatRupiah(successReceipt.profit)}</span>
              </div>
            </div>

            {/* Action Buttons: Cetak Struk Thermal & Transaksi Baru */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowThermalModal(true)}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer size={15} />
                <span>Cetak Struk Thermal</span>
              </button>

              <button
                type="button"
                onClick={() => setSuccessReceipt(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Tutup & Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Cetak Struk Thermal 58mm / 80mm */}
      {showThermalModal && successReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-slate-200 animate-in zoom-in-95 max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-orange-600" />
                <h4 className="font-bold text-slate-800 text-sm">Pratinjau Struk Thermal</h4>
              </div>
              <button
                onClick={() => setShowThermalModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Area Kertas Struk Thermal */}
            <div
              id="thermal-receipt-area"
              className="my-4 p-5 bg-amber-50/40 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 space-y-2 overflow-y-auto shadow-inner"
            >
              <div className="text-center space-y-0.5">
                <h3 className="font-black text-sm tracking-wider">🥟 UMKM MENYUM</h3>
                <p className="text-[10px] text-slate-600">Kuliner Mentai Jepang Kampus</p>
                <p className="text-[10px] text-slate-500">Jl. Raya Jatiwaringin No. 2, Jaktim</p>
                <p className="text-[10px] text-slate-500">WA: 0812-3456-7890</p>
              </div>

              <div className="border-t border-dashed border-slate-400 my-2"></div>

              <div className="text-[11px] space-y-0.5">
                <div className="flex justify-between">
                  <span>No. Order:</span>
                  <span className="font-bold">{successReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{successReceipt.date} {successReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>{successReceipt.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{successReceipt.customerName} ({successReceipt.orderType})</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 my-2"></div>

              {/* Rincian Menu */}
              <div className="space-y-1.5 text-[11px]">
                {successReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex-1">
                      <span>{item.qty}x {item.name}</span>
                      <span className="block text-[10px] text-slate-500">
                        @{formatRupiah(item.price)}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-400 my-2"></div>

              {/* Rincian Bayar & Kembalian */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span className="text-xs">{formatRupiah(successReceipt.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Metode:</span>
                  <span>{successReceipt.paymentMethod}</span>
                </div>

                {successReceipt.paymentMethod === 'Tunai' ? (
                  <>
                    <div className="flex justify-between">
                      <span>TUNAI:</span>
                      <span>{formatRupiah(successReceipt.cashGiven)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pt-0.5">
                      <span>KEMBALIAN:</span>
                      <span>{formatRupiah(successReceipt.change)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>STATUS:</span>
                    <span>LUNAS (QRIS)</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-400 my-2"></div>

              <div className="text-center text-[10px] text-slate-500 space-y-0.5 pt-1">
                <p>Terima Kasih Atas Kunjungan Anda!</p>
                <p>Follow IG: @menyum.id</p>
                <p className="font-bold text-slate-700">#MentaiBikinNagih</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowThermalModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer size={14} />
                <span>Cetak Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
