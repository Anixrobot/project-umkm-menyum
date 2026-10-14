import React, { useState } from 'react';

// Mock Cash Flow Transactions
const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-901',
    date: '14 Okt 2026, 08:30',
    description: 'Penjualan Kasir POS #POS-104 (Walk-in)',
    type: 'IN', // IN = Pemasukan, OUT = Pengeluaran
    category: 'Penjualan Menu',
    amount: 51000,
    costDeduction: 21500, // Modal + Bahan
    balance: 14200000,
  },
  {
    id: 'TXN-900',
    date: '14 Okt 2026, 08:15',
    description: 'Pesanan Website Selesai #ORD-2026-086',
    type: 'IN',
    category: 'Penjualan Website',
    amount: 74000,
    costDeduction: 32000,
    balance: 14149000,
  },
  {
    id: 'TXN-899',
    date: '14 Okt 2026, 07:45',
    description: 'Beli Bahan Baku Segar (Ayam 10kg & Bumbu)',
    type: 'OUT',
    category: 'Belanja Bahan Baku',
    amount: 380000,
    costDeduction: 0,
    balance: 14075000,
  },
  {
    id: 'TXN-898',
    date: '14 Okt 2026, 07:10',
    description: 'Pembelian Gas Elpiji 3kg & Minyak Goreng',
    type: 'OUT',
    category: 'Operasional Dapur',
    amount: 85000,
    costDeduction: 0,
    balance: 14455000,
  },
  {
    id: 'TXN-897',
    date: '13 Okt 2026, 21:00',
    description: 'Pesanan Website Selesai #ORD-2026-085',
    type: 'IN',
    category: 'Penjualan Website',
    amount: 45000,
    costDeduction: 19500,
    balance: 14540000,
  },
  {
    id: 'TXN-896',
    date: '13 Okt 2026, 19:30',
    description: 'Penjualan Kasir POS #POS-103',
    type: 'IN',
    category: 'Penjualan Menu',
    amount: 112000,
    costDeduction: 49000,
    balance: 14495000,
  },
  {
    id: 'TXN-895',
    date: '13 Okt 2026, 17:15',
    description: 'Pesanan Website Selesai #ORD-2026-084',
    type: 'IN',
    category: 'Penjualan Website',
    amount: 68000,
    costDeduction: 28500,
    balance: 14383000,
  },
];

export default function BukuKas() {
  const [period, setPeriod] = useState('Bulan Ini');
  const [transactions] = useState(INITIAL_TRANSACTIONS);

  // Financial Metrics (Calculated as per PRD Formula)
  // Profit Bersih = Total Pendapatan - Total Modal & Bahan
  const totalRevenue = 4850000;
  const totalCapitalAndCost = 2120000;
  const netProfit = totalRevenue - totalCapitalAndCost; // Rp 2.730.000
  const profitMarginPercent = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Buku Kas & Laporan Keuangan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi otomatis saat pesanan 'Selesai' dengan rumus Profit Bersih akurat
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
          {['Hari Ini', 'Minggu Ini', 'Bulan Ini'].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === item
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* TOP SECTION: 3 SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Pendapatan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +14.8%
            </span>
            <span className="text-slate-400">dibanding periode lalu</span>
          </div>
        </div>

        {/* Card 2: Total Modal & Bahan Baku */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Modal & Bahan
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Rp {totalCapitalAndCost.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">HPP + Pembelian Bahan Baku</span>
          </div>
        </div>

        {/* Card 3: Profit Bersih (Highlight) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg shadow-emerald-600/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase text-emerald-100 tracking-wider">
              Profit Bersih (Net Profit)
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            Rp {netProfit.toLocaleString('id-ID')}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-emerald-100">
            <span>Rumus: Pendapatan - (Modal + Bahan)</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Margin {profitMarginPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: CASH FLOW TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Riwayat Arus Kas (Cash Flow)</h3>
            <p className="text-xs text-slate-400">Pencatatan uang masuk dan keluar operasional UMKM</p>
          </div>
          <button
            onClick={() => alert('Download Laporan Keuangan format Excel/PDF')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Laporan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tanggal & Jam</th>
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Nominal Arus Kas</th>
                <th className="py-3 px-4 text-right">Saldo Berjalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono font-bold text-slate-700">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                    {t.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {t.type === 'IN' ? (
                      <span className="font-bold text-xs text-emerald-600">
                        + Rp {t.amount.toLocaleString('id-ID')}
                      </span>
                    ) : (
                      <span className="font-bold text-xs text-rose-600">
                        - Rp {t.amount.toLocaleString('id-ID')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-xs text-slate-700">
                    Rp {t.balance.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

