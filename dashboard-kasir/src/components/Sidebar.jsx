import {
  Store,
  ClipboardList,
  Package,
  Wallet,
  Settings,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  isDbConnected = false,
}) {
  const menuItems = [
    {
      id: 'kasir',
      label: 'Kasir (POS)',
      icon: Store,
      badge: null,
      desc: 'Transaksi & POS',
    },
    {
      id: 'pesanan',
      label: 'Pesanan Masuk',
      icon: ClipboardList,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      desc: 'Order Website Real-time',
    },
    {
      id: 'produk',
      label: 'Data Produk',
      icon: Package,
      badge: null,
      desc: 'Katalog & Modal HPP',
    },
    {
      id: 'bukukas',
      label: 'Buku Kas',
      icon: Wallet,
      badge: null,
      desc: 'Arus Kas & Laba Bersih',
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: Settings,
      badge: null,
      desc: 'Upload QRIS Toko',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 text-lg">
            🥟
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-wide text-white">
              UMKM Menyum
            </h1>
            <p className="text-xs text-slate-400">Dashboard Operasional</p>
          </div>
        </div>
      </div>

      {/* Online indicator */}
      <div className="mx-4 my-3 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDbConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span className="text-slate-300 font-medium text-[11px]">
            {isDbConnected ? 'Supabase Terhubung' : 'Local / Offline'}
          </span>
        </div>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
            isDbConnected
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-amber-400 bg-amber-400/10'
          }`}
        >
          {isDbConnected ? 'LIVE' : 'DEMO'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
          Menu Utama
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={19}
                  className={`transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                <div>
                  <div className="leading-snug">{item.label}</div>
                  <div
                    className={`text-[11px] ${
                      isActive ? 'text-orange-100' : 'text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              </div>

              {item.badge ? (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  size={15}
                  className={`transition-transform opacity-0 group-hover:opacity-100 ${
                    isActive ? 'opacity-100' : 'text-slate-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Cashier Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
            <UserCheck size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Kasir 01 - Shift Siang</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span>●</span> Kasir & Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
