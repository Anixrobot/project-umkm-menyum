import React, { useState } from 'react';

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-089',
    customer: 'Farhan Ramadhan',
    phone: '0812-9843-1122',
    channel: 'Website Utama',
    orderType: 'Delivery / Antar',
    address: 'Jl. Melati No. 14, Blok B',
    items: [
      { name: 'Ayam Geprek Sambal Korek', qty: 2, price: 18000 },
      { name: 'Es Teh Manis Jumbo', qty: 2, price: 5000 },
    ],
    totalPrice: 46000,
    paymentMethod: 'QRIS (Lunas)',
    time: '3 menit yang lalu',
    status: 'Pending', // Pending | Diproses | Selesai
  },
  {
    id: 'ORD-2026-088',
    customer: 'Siti Nurhaliza',
    phone: '0857-1122-3344',
    channel: 'Website Utama',
    orderType: 'Take Away (Pick Up)',
    address: 'Ambil di outlet pukul 12:30',
    items: [
      { name: 'Nasi Goreng Spesial Menyum', qty: 1, price: 22000 },
      { name: 'Es Kopi Susu Aren Menyum', qty: 1, price: 15000 },
    ],
    totalPrice: 37000,
    paymentMethod: 'QRIS (Lunas)',
    time: '12 menit yang lalu',
    status: 'Diproses',
  },
  {
    id: 'ORD-2026-087',
    customer: 'Meja 04 (Walk-in Web)',
    phone: '0878-3344-9988',
    channel: 'Website Utama (Dine In QR)',
    orderType: 'Dine In Meja 4',
    address: 'Meja 4 - Area Indoor',
    items: [
      { name: 'Mie Nyemek Telur Pedas', qty: 2, price: 16000 },
      { name: 'Pisang Goreng Crispy Keju', qty: 1, price: 12000 },
      { name: 'Lemon Tea Dingin', qty: 2, price: 8000 },
    ],
    totalPrice: 60000,
    paymentMethod: 'QRIS (Lunas)',
    time: '28 menit yang lalu',
    status: 'Diproses',
  },
  {
    id: 'ORD-2026-086',
    customer: 'Agus Setiawan',
    phone: '0813-2299-4455',
    channel: 'Website Utama',
    orderType: 'Delivery / Antar',
    address: 'Komplek Griya Asri No. 5',
    items: [
      { name: 'Ayam Geprek Sambal Korek', qty: 3, price: 18000 },
      { name: 'Tahu Walik Crispy Gurih', qty: 2, price: 10000 },
    ],
    totalPrice: 74000,
    paymentMethod: 'Transfer Bank (Lunas)',
    time: '1 jam yang lalu',
    status: 'Selesai',
  },
  {
    id: 'ORD-2026-085',
    customer: 'Dina Mariana',
    phone: '0819-0099-8811',
    channel: 'Website Utama',
    orderType: 'Take Away (Pick Up)',
    address: 'Ambil sendiri di outlet',
    items: [
      { name: 'Es Kopi Susu Aren Menyum', qty: 3, price: 15000 },
    ],
    totalPrice: 45000,
    paymentMethod: 'QRIS (Lunas)',
    time: '2 jam yang lalu',
    status: 'Selesai',
  },
];

export default function Pesanan() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status transitions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'Semua') return true;
    return order.status === statusFilter;
  });

  const countPending = orders.filter((o) => o.status === 'Pending').length;
  const countDiproses = orders.filter((o) => o.status === 'Diproses').length;
  const countSelesai = orders.filter((o) => o.status === 'Selesai').length;

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Pesanan Masuk (Real-Time)
            </h2>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Website
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pesanan dari website utama pembeli masuk secara otomatis dan siap diproses
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setStatusFilter('Semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'Semua'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-amber-500 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Pending ({countPending})
          </button>
          <button
            onClick={() => setStatusFilter('Diproses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Diproses'
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            Diproses ({countDiproses})
          </button>
          <button
            onClick={() => setStatusFilter('Selesai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Selesai'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Selesai ({countSelesai})
          </button>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID & Waktu</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Menu Dipesan</th>
                <th className="py-3.5 px-4">Total & Pembayaran</th>
                <th className="py-3.5 px-4">Status Pesanan</th>
                <th className="py-3.5 px-4 text-right">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Tidak ada pesanan dengan status "{statusFilter}"
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Order ID & Time */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 font-mono text-xs">
                          {order.id}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {order.time}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          {order.channel}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-slate-800 text-xs">
                          {order.customer}
                        </div>
                        <div className="text-[11px] text-slate-500">{order.phone}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px] mt-0.5">
                          📍 {order.orderType}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-slate-700 flex items-center justify-between gap-3"
                            >
                              <span>
                                <strong className="text-slate-900 font-bold">{item.qty}x</strong>{' '}
                                {item.name}
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                Rp {(item.price * item.qty).toLocaleString('id-ID')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 text-xs">
                          Rp {order.totalPrice.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {order.paymentMethod}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 align-top">
                        {order.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            Menunggu Konfirmasi
                          </span>
                        )}
                        {order.status === 'Diproses' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Sedang Dimasak / Siap
                          </span>
                        )}
                        {order.status === 'Selesai' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Selesai & Masuk Kas
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Diproses')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                            >
                              Terima Pesanan
                            </button>
                          )}
                          {order.status === 'Diproses' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Selesai')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                            >
                              Tandai Selesai
                            </button>
                          )}
                          {order.status === 'Selesai' && (
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 border border-slate-200"
                            >
                              Detail Struk
                            </button>
                          )}
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

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Rincian Pesanan {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold text-slate-800">{selectedOrder.customer} ({selectedOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alamat / Tipe:</span>
                <span className="font-medium text-slate-800 text-right">{selectedOrder.address}</span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-700 mb-2">Item:</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 text-slate-600">
                    <span>{item.qty}x {item.name}</span>
                    <span>Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Bayar:</span>
                <span className="text-orange-600">Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

