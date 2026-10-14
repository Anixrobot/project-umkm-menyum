import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export default function BukuKas({
  cashFlow,
  onAddCashFlow,
  onDeleteCashFlow,
  onClearCashFlow,
}) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    description: '',
    category: 'Operasional',
    type: 'out',
    amount: '',
  });

  const formatRupiah = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  // Kalkulasi Keuangan
  const totalPendapatan = cashFlow
    .filter((item) => item.type === 'in')
    .reduce((acc, item) => acc + item.amount, 0);

  const totalPengeluaran = cashFlow
    .filter((item) => item.type === 'out')
    .reduce((acc, item) => acc + item.amount, 0);

  // Profit Bersih = Pendapatan - (Modal & Biaya Pengeluaran)
  const profitBersih = totalPendapatan - totalPengeluaran;

  const filteredFlow = cashFlow.filter((item) => {
    if (activeFilter === 'in') return item.type === 'in';
    if (activeFilter === 'out') return item.type === 'out';
    return true;
  });

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newEntry.description || !newEntry.amount) return;

    const entry = {
      id: `CF-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: newEntry.description,
      category: newEntry.category,
      type: newEntry.type,
      amount: parseFloat(newEntry.amount) || 0,
    };

    if (onAddCashFlow) {
      onAddCashFlow(entry);
    }

    setModalOpen(false);
    setNewEntry({
      description: '',
      category: 'Operasional',
      type: 'out',
      amount: '',
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Buku Kas & Laporan Keuangan</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full">
              Otomatis Real-time
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Rekap pendapatan, beban modal & bahan baku, serta kalkulasi profit bersih
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Catat Kas Masuk/Keluar</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top Section: 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Pendapatan Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Pendapatan (Omset)
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-slate-900">
                {formatRupiah(totalPendapatan)}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <ArrowUpRight size={13} /> Dari POS Kasir & Pesanan Website Selesai
              </p>
            </div>
          </div>

          {/* Total Modal & Beban Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Modal & Bahan Baku
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-slate-900">
                {formatRupiah(totalPengeluaran)}
              </div>
              <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                <ArrowDownLeft size={13} /> Belanja Daging, Kulit Dimsum & Ops
              </p>
            </div>
          </div>

          {/* Profit Bersih Card (Highlight) */}
          <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-5 rounded-2xl shadow-lg shadow-orange-600/20 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                Profit Bersih (Net Profit)
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-white">
                {formatRupiah(profitBersih)}
              </div>
              <p className="text-[11px] text-orange-100 font-medium mt-1">
                Rumus: Total Pendapatan − Total Pengeluaran
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Cash Flow History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Table Header Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Riwayat Arus Kas (Cash Flow)
              </h3>
              <p className="text-xs text-slate-500">
                Mencatat mutasi uang masuk (penjualan) & uang keluar secara transparan
              </p>
            </div>

            <div className="flex items-center gap-3">
              {cashFlow.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Yakin ingin menghapus seluruh riwayat buku kas?')) {
                      onClearCashFlow && onClearCashFlow();
                    }
                  }}
                  className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
                  title="Hapus semua riwayat kas"
                >
                  <Trash2 size={13} />
                  <span>Hapus Semua</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveFilter('Semua')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === 'Semua'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveFilter('in')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === 'in'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pemasukan (+)
                </button>
                <button
                  onClick={() => setActiveFilter('out')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === 'out'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pengeluaran (-)
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Tanggal & Waktu</th>
                  <th className="py-3.5 px-4">Keterangan Transaksi</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Tipe Mutasi</th>
                  <th className="py-3.5 px-4 text-right">Nominal</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlow.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Wallet size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
                      Tidak ada riwayat mutasi kas
                    </td>
                  </tr>
                ) : (
                  filteredFlow.map((cf) => {
                    const isIn = cf.type === 'in';
                    return (
                      <tr key={cf.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Tanggal */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          {cf.date}
                        </td>

                        {/* Keterangan */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {cf.description}
                        </td>

                        {/* Kategori */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {cf.category}
                          </span>
                        </td>

                        {/* Tipe */}
                        <td className="py-3.5 px-4">
                          {isIn ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                              <ArrowUpRight size={13} />
                              Uang Masuk
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 text-xs">
                              <ArrowDownLeft size={13} />
                              Uang Keluar
                            </span>
                          )}
                        </td>

                        {/* Nominal */}
                        <td
                          className={`py-3.5 px-4 text-right font-bold text-sm ${
                            isIn ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIn ? `+ ${formatRupiah(cf.amount)}` : `- ${formatRupiah(cf.amount)}`}
                        </td>

                        {/* Aksi Hapus */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onDeleteCashFlow && onDeleteCashFlow(cf.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus riwayat ini"
                          >
                            <Trash2 size={15} />
                          </button>
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

      {/* Modal Catat Kas Manual */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Wallet className="text-orange-600" size={18} />
                Catat Mutasi Arus Kas
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="py-4 space-y-4">
              {/* Tipe: In / Out */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewEntry({ ...newEntry, type: 'in', category: 'Penjualan' })}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      newEntry.type === 'in'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowUpRight size={14} /> Pemasukan (Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEntry({ ...newEntry, type: 'out', category: 'Bahan Baku' })}
                    className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      newEntry.type === 'out'
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <ArrowDownLeft size={14} /> Pengeluaran (Keluar)
                  </button>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Keterangan Transaksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Ayam Fillet 5kg / Isi Ulang Galon"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              {/* Kategori & Nominal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="Bahan Baku">Bahan Baku</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Penjualan">Penjualan</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nominal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Simpan ke Buku Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

