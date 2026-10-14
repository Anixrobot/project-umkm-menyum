import { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  ChefHat,
  Search,
  Eye,
  Trash2,
} from 'lucide-react';

export default function Pesanan({ orders, onUpdateStatus, onDeleteOrder }) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const filteredOrders = orders.filter((order) => {
    const matchFilter =
      activeFilter === 'Semua' || order.status === activeFilter;
    const matchSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
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
            Pantau dan kelola pesanan online dari website utama pelanggan
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari ID pesanan / pelanggan..."
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
                <span>{status}</span>
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
                  <th className="py-3.5 px-4">Order ID & Waktu</th>
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Item Menu</th>
                  <th className="py-3.5 px-4">Total Bayar</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi Operasional</th>
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
                      {/* Order ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-800">{order.id}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {order.createdAt}
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-sm">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {order.paymentMethod}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <ul className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-slate-700">
                              <span className="font-bold text-slate-900">{item.qty}x</span>{' '}
                              {item.name}
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
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'Diproses')}
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-orange-600/30 transition-all flex items-center gap-1"
                            >
                              <ChefHat size={13} />
                              <span>Terima & Proses</span>
                            </button>
                          )}

                          {order.status === 'Diproses' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'Selesai')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs hover:shadow-emerald-600/30 transition-all flex items-center gap-1"
                            >
                              <CheckCircle size={13} />
                              <span>Selesaikan Pesanan</span>
                            </button>
                          )}

                          {order.status === 'Selesai' && (
                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                              ✓ Masuk Buku Kas
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Rincian {selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-500">{selectedOrder.createdAt}</p>
              </div>
              <div>{getStatusBadge(selectedOrder.status)}</div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Pelanggan</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedOrder.customerName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Daftar Menu</span>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-700">
                        {item.qty}x {item.name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatRupiah(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Catatan Khusus</span>
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
                    {selectedOrder.notes}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                <span>Total Pembayaran</span>
                <span className="text-orange-600 text-base">
                  {formatRupiah(selectedOrder.totalPrice)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onDeleteOrder && onDeleteOrder(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Hapus Pesanan</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

