import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, pendingOrdersCount = 3 }) {
  const menuItems = [
    {
      id: 'kasir',
      label: 'Kasir (POS)',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: null,
    },
    {
      id: 'pesanan',
      label: 'Pesanan Masuk',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      id: 'produk',
      label: 'Data Produk',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      badge: null,
    },
    {
      id: 'bukukas',
      label: 'Buku Kas & Keuangan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight tracking-wide">
                UMKM Menyum
              </h1>
              <p className="text-xs text-slate-400 font-medium">Dashboard POS & Kasir</p>
            </div>
          </div>
          
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Sync Website
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              ONLINE
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Operasional
          </p>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    isActive ? 'bg-white text-orange-600' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operator Info Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin Kasir Menyum</p>
            <p className="text-[11px] text-slate-400">Shift Pagi • Terminal #1</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </aside>
  );
}

