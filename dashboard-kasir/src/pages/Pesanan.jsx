import { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  ChefHat,
  Search,
  Eye,
  Trash2,
  Ticket,
  Pencil,
  Plus,
  Minus,
  Banknote,
  QrCode,
  X,
  CreditCard,
  Sparkles,
  UserCheck,
  Printer,
} from 'lucide-react';

export default function Pesanan({
  orders,
  availableProducts = [],
  onUpdateStatus,
  onUpdateItems,
  onDeleteOrder,
  qrisImageUrl,
}) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State Modal Pembayaran (Terima & Proses)
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tunai');

  // State Modal Edit Item Pesanan (Ada Ubah Pesanan?)
  const [editingOrder, setEditingOrder] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [editNotes, setEditNotes] = useState('');
  const [selectedAddProductId, setSelectedAddProductId] = useState('');

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  const filteredOrders = orders.filter((order) => {
    const matchFilter =
      activeFilter === 'Semua' || order.status === activeFilter;
    const matchSearch =
      (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.queueNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Konfirmasi
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <ChefHat size={13} className="text-blue-600 animate-bounce" />
            Sedang Dimasak
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle size={13} className="text-emerald-600" />
            Selesai (Lunas)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // 1. Handlers untuk Modal Pembayaran di Kasir (Terima & Proses)
  const handleOpenPaymentModal = (order) => {
    setPaymentModalOrder(order);
    setSelectedPaymentMethod('Tunai');
  };

  const handleConfirmProcessOrder = () => {
    if (!paymentModalOrder) return;
    onUpdateStatus(paymentModalOrder.id, 'Diproses', selectedPaymentMethod);
    setPaymentModalOrder(null);
  };

  // 2. Handlers untuk Modal Edit Item Pesanan
  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    setEditItems(
      (order.items || []).map((it) => ({
        id: it.id || it.name,
        name: it.name,
        qty: it.qty,
        price: it.price,
        toppings: it.toppings || null,
      }))
    );
    setEditNotes(order.notes && order.notes !== '-' ? order.notes : '');
    setSelectedAddProductId('');
  };

  const handleEditQty = (index, delta) => {
    setEditItems((prev) =>
      prev
        .map((it, idx) => {
          if (idx === index) {
            const nextQty = it.qty + delta;
            return nextQty > 0 ? { ...it, qty: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveEditItem = (index) => {
    setEditItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddProductToEdit = () => {
    if (!selectedAddProductId) return;
    const prod = availableProducts.find((p) => String(p.id) === String(selectedAddProductId));
    if (!prod) return;

    setEditItems((prev) => {
      const existing = prev.find((it) => it.name === prod.name && !it.toppings);
      if (existing) {
        return prev.map((it) =>
          it === existing ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [
        ...prev,
        {
          id: `new-${Date.now()}-${prod.id}`,
          name: prod.name,
          qty: 1,
          price: prod.price,
          toppings: null,
        },
      ];
    });
    setSelectedAddProductId('');
  };

  const editTotal = editItems.reduce((acc, it) => acc + it.price * it.qty, 0);

  const handleSaveEditedOrder = () => {
    if (!editingOrder || editItems.length === 0) return;
    if (onUpdateItems) {
      onUpdateItems(editingOrder.id, editItems, editTotal, editNotes.trim() || '-');
    }
    setEditingOrder(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Manajemen Pesanan Masuk</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync Website
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Verifikasi nomor antrian pembeli, sesuaikan pesanan, dan terima pembayaran di kasir
          </p>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari Antrian (A-001) / ID / Nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mb-4">
          {['Semua', 'Pending', 'Diproses', 'Selesai'].map((status) => {
            const count =
              status === 'Semua'
                ? orders.length
                : orders.filter((o) => o.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeFilter === status
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{status === 'Pending' ? 'Menunggu Konfirmasi' : status === 'Diproses' ? 'Sedang Dimasak' : status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === status
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Nomor Antrian & ID</th>
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Item Menu</th>
                  <th className="py-3.5 px-4">Total Bayar</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Operasional Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <ClipboardList size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
                      Tidak ada pesanan dengan filter ini
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Nomor Antrian & Order ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-[#e46000] border border-orange-200 shadow-xs">
                            <Ticket size={12} className="stroke-[2.5]" />
                            <span>
                              {order.queueNumber && order.queueNumber !== '-'
                                ? `Antrian: ${order.queueNumber}`
                                : 'Tanpa Antrian'}
                            </span>
                          </span>
                        </div>
                        <div className="font-bold text-slate-800 text-xs">{order.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-sans">
                          <Clock size={11} /> {order.createdAt}
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-sm">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'Selesai'
                                ? 'bg-emerald-500'
                                : order.paymentMethod === 'Belum Bayar' || order.paymentMethod === 'Belum Bayar (Kasir)'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          ></span>
                          <span>{order.paymentMethod || 'Belum Bayar (Kasir)'}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <ul className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-slate-700">
                              <span className="font-bold text-slate-900">{item.qty}x</span>{' '}
                              {item.name}
                              {item.toppings && (
                                <span className="text-[10px] text-orange-600 block pl-4">
                                  + {item.toppings}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                        {order.notes && order.notes !== '-' && (
                          <p className="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1 italic">
                            Catatan: "{order.notes}"
                          </p>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {formatRupiah(order.totalPrice)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Pending: Bisa Edit Item & Terima Pembayaran */}
                          {order.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(order)}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Edit / Revisi Item Pesanan Pelanggan"
                              >
                                <Pencil size={12} className="text-slate-600" />
                                <span>Edit Item</span>
                              </button>

                              <button
                                onClick={() => handleOpenPaymentModal(order)}
                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-orange-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <ChefHat size={13} />
                                <span>Terima & Proses</span>
                              </button>
                            </>
                          )}

                          {/* Diproses: Selesaikan Pesanan */}
                          {order.status === 'Diproses' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'Selesai')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-emerald-600/30 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={13} />
                              <span>Selesaikan Pesanan</span>
                            </button>
                          )}

                          {/* Selesai: Indikator Masuk Buku Kas */}
                          {order.status === 'Selesai' && (
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                              <CheckCircle size={12} />
                              <span>Masuk Buku Kas</span>
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Pesanan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: Input Pembayaran di Kasir (Tunai / QRIS) -> Terima & Proses */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Pembayaran Kasir
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih metode bayar pelanggan sebelum pesanan dimasak
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Badge Nomor Antrian */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                    Nomor Antrian
                  </span>
                  <div className="text-2xl font-black text-orange-600">
                    {paymentModalOrder.queueNumber && paymentModalOrder.queueNumber !== '-'
                      ? paymentModalOrder.queueNumber
                      : 'Tanpa Antrian'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Pelanggan:</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {paymentModalOrder.customerName}
                  </span>
                </div>
              </div>

              {/* Total Tagihan */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Total yang Harus Dibayar:</span>
                <span className="text-xl font-black text-slate-900">
                  {formatRupiah(paymentModalOrder.totalPrice)}
                </span>
              </div>

              {/* Pilihan Metode Bayar (Tunai / QRIS) */}
              <div>
                <label className="font-bold text-slate-700 block mb-2 text-xs">
                  Pilih Metode Pembayaran Pelanggan:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('Tunai')}
                    className={`p-3.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'Tunai'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={24} className={selectedPaymentMethod === 'Tunai' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span>Tunai (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('QRIS')}
                    className={`p-3.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'QRIS'
                        ? 'border-orange-600 bg-orange-50 text-orange-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode size={24} className={selectedPaymentMethod === 'QRIS' ? 'text-orange-600' : 'text-slate-400'} />
                    <span>QRIS Dinamis</span>
                  </button>
                </div>
              </div>

              {/* Tampilan Gambar Mockup QRIS atau Info Tunai */}
              {selectedPaymentMethod === 'QRIS' ? (
                <div className="flex flex-col items-center p-3.5 border border-dashed border-orange-300 rounded-xl bg-orange-50/50 animate-in fade-in">
                  <div className="w-40 h-40 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
                    {qrisImageUrl ? (
                      <img
                        src={qrisImageUrl}
                        alt="QRIS Toko MenYum"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                        <QrCode size={70} className="text-white relative z-10" />
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 mt-1 font-bold">
                          QRIS MENYUM
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 mt-2 flex items-center gap-1 font-medium">
                    <Sparkles size={13} className="text-amber-500 shrink-0" />
                    Scan via BCA, GoPay, OVO, Dana, ShopeePay
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Banknote size={18} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold block text-emerald-950">Terima Uang Tunai di Kasir</span>
                    <span className="text-[11px] text-emerald-700">
                      Pelanggan membayar secara langsung di meja kasir.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmProcessOrder}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChefHat size={14} />
                <span>Terima & Mulai Masak</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Item Pesanan (Kondisi "Ada Ubah Pesanan?") */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base">
                    Edit Item Pesanan
                  </h3>
                  <span className="text-xs font-black bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {editingOrder.queueNumber || editingOrder.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pelanggan: <strong>{editingOrder.customerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-3 space-y-3 flex-1 overflow-y-auto text-xs">
              {/* Tambah Item Baru dari Katalog */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">
                  Tambah Menu Tambahan ke Pesanan:
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedAddProductId}
                    onChange={(e) => setSelectedAddProductId(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-orange-500"
                  >
                    <option value="">-- Pilih Menu dari Katalog --</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatRupiah(p.price)})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddProductToEdit}
                    disabled={!selectedAddProductId}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={13} />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Daftar Item Pesanan Saat Ini */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Daftar Item Pesanan:
                </label>
                {editItems.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada item dalam pesanan ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-sm">
                            {item.name}
                          </h4>
                          {item.toppings && (
                            <span className="text-[10px] text-orange-600 block">
                              + {item.toppings}
                            </span>
                          )}
                          <span className="text-xs text-slate-500 font-medium">
                            {formatRupiah(item.price)} x {item.qty} ={' '}
                            <strong className="text-slate-800">
                              {formatRupiah(item.price * item.qty)}
                            </strong>
                          </span>
                        </div>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleEditQty(idx, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-700 cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-bold text-slate-800 text-xs">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleEditQty(idx, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-700 cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveEditItem(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catatan Pelanggan */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Khusus Pesanan:
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Saus mentai dipisah, pedas sedang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-orange-500 text-slate-800 resize-none"
                />
              </div>

              {/* Total Baru */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-700">Total Baru yang Dihitung:</span>
                <span className="text-xl font-black text-orange-600">
                  {formatRupiah(editTotal)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditedOrder}
                disabled={editItems.length === 0}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Order Detail Modal / Drawer (Tugas B: Detail Lengkap Transaksi) */}
      {selectedOrder && (() => {
        // Ekstraksi info Kasir & Uang Kembalian
        let cashierName = selectedOrder.cashierName || 'Kasir 01 - Shift Siang';
        let cashGiven = selectedOrder.cashGiven || null;
        let change = selectedOrder.change !== undefined ? selectedOrder.change : null;

        if (selectedOrder.notes && typeof selectedOrder.notes === 'string') {
          const kasirMatch = selectedOrder.notes.match(/Kasir:\s*([^|]+)/i);
          if (kasirMatch) {
            cashierName = kasirMatch[1].trim();
          }
          const cashMatch = selectedOrder.notes.match(/Tunai:\s*(?:Rp\s*)?([0-9.,]+)/i);
          if (cashMatch && !cashGiven) {
            cashGiven = Number(cashMatch[1].replace(/[.,]/g, '')) || null;
          }
          const changeMatch = selectedOrder.notes.match(/Kembali:\s*(?:Rp\s*)?([0-9.,]+)/i);
          if (changeMatch && change === null) {
            change = Number(changeMatch[1].replace(/[.,]/g, '')) || 0;
          }
        }

        if (selectedOrder.paymentMethod === 'Tunai' && cashGiven === null) {
          cashGiven = selectedOrder.totalPrice;
          change = 0;
        }

        const itemsSubtotal = (selectedOrder.items || []).reduce(
          (acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 1),
          0
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
              {/* Header Rincian */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Detail Transaksi Pesanan
                    </h3>
                    {selectedOrder.queueNumber && selectedOrder.queueNumber !== '-' && (
                      <span className="text-xs font-black bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full border border-orange-200">
                        {selectedOrder.queueNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    ID: {selectedOrder.id} • {selectedOrder.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedOrder.status)}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body Rincian */}
              <div className="py-4 space-y-4 text-xs overflow-y-auto flex-1">
                {/* Info Kasir & Pelanggan */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Nama Pelanggan
                    </span>
                    <span className="font-bold text-slate-800 text-sm block">
                      {selectedOrder.customerName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Tipe: {selectedOrder.orderType || 'Dine In (Makan Sini)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Petugas Kasir
                    </span>
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <UserCheck size={14} className="text-orange-600 shrink-0" />
                      <span>{cashierName}</span>
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Outlet Jatiwaringin
                    </span>
                  </div>
                </div>

                {/* Daftar Item Menu yang Dibeli Beserta Kuantitas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Item Menu yang Dibeli
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {selectedOrder.items?.length || 0} jenis menu
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start py-1.5 border-b border-slate-200/50 last:border-0"
                        >
                          <div className="flex-1 pr-2">
                            <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                              <span className="px-1.5 py-0.2 bg-orange-100 text-orange-700 rounded font-bold text-[11px]">
                                {item.qty}x
                              </span>
                              <span>{item.name}</span>
                            </div>
                            {item.toppings && (
                              <span className="text-[10px] text-orange-600 block pl-6 mt-0.5">
                                + Topping: {item.toppings}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 block pl-6">
                              @{formatRupiah(item.price)}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 text-xs">
                            {formatRupiah(item.price * item.qty)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-center py-2">
                        Tidak ada data rincian item
                      </p>
                    )}
                  </div>
                </div>

                {/* Rincian Finansial: Subtotal, Total, Metode Bayar, Uang Kembalian */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Menu:</span>
                    <span className="font-semibold">{formatRupiah(itemsSubtotal || selectedOrder.totalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-slate-800 font-bold text-sm pt-1 border-t border-slate-200">
                    <span>Total Pembayaran:</span>
                    <span className="text-orange-600 font-extrabold text-base">
                      {formatRupiah(selectedOrder.totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 pt-1">
                    <span>Metode Pembayaran:</span>
                    <span className="font-bold text-slate-800 inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {selectedOrder.paymentMethod === 'QRIS' ? (
                        <>
                          <QrCode size={14} className="text-orange-600" />
                          <span>QRIS MenYum (Dinamis)</span>
                        </>
                      ) : selectedOrder.paymentMethod === 'Tunai' ? (
                        <>
                          <Banknote size={14} className="text-emerald-600" />
                          <span>Tunai (Cash di Kasir)</span>
                        </>
                      ) : (
                        <span>{selectedOrder.paymentMethod || 'Belum Bayar'}</span>
                      )}
                    </span>
                  </div>

                  {/* Nominal Kembalian jika Pembayaran Tunai */}
                  {selectedOrder.paymentMethod === 'Tunai' && (
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Uang Tunai Diterima:</span>
                        <span className="font-bold text-slate-800">
                          {formatRupiah(cashGiven || selectedOrder.totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold">
                        <span>Uang Kembalian:</span>
                        <span className="text-sm">
                          {formatRupiah(change || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Catatan Khusus */}
                {selectedOrder.notes && (
                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold text-[11px]">
                      Catatan Transaksi / Pesanan
                    </span>
                    <div className="p-2.5 rounded-xl bg-amber-50/70 text-amber-900 border border-amber-200 font-mono text-[11px]">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteOrder && onDeleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/20"
                >
                  <Printer size={14} />
                  <span>Cetak Struk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
