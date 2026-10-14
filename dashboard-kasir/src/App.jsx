import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Kasir from './pages/Kasir';
import Pesanan from './pages/Pesanan';
import Produk from './pages/Produk';
import BukuKas from './pages/BukuKas';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('kasir');

  // Badge count for new incoming orders
  const pendingOrdersCount = 2;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* 1. Global Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {activeTab === 'kasir' && <Kasir />}
        {activeTab === 'pesanan' && <Pesanan />}
        {activeTab === 'produk' && <Produk />}
        {activeTab === 'bukukas' && <BukuKas />}
      </main>
    </div>
  );
}
