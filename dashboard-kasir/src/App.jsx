import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Kasir from './pages/Kasir';
import Pesanan from './pages/Pesanan';
import Produk from './pages/Produk';
import BukuKas from './pages/BukuKas';
import {
  initialProducts,
  initialOrders,
  initialCashFlow,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [cashFlow, setCashFlow] = useState(initialCashFlow);

  // Hitung berapa pesanan website yang masih Pending
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  // 1. Aksi Selesai Transaksi Kasir POS (Masuk otomatis ke Kas)
  const handleCompletePosTransaction = (receipt) => {
    // Tambah mutasi kas masuk
    const newCashFlowEntry = {
      id: `CF-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: `Penjualan Kasir POS (${receipt.orderId}) - ${receipt.customerName}`,
      category: 'Penjualan',
      type: 'in',
      amount: receipt.total,
    };

    setCashFlow((prev) => [newCashFlowEntry, ...prev]);

    // Masukkan juga ke riwayat pesanan dengan status 'Selesai'
    const newOrderRecord = {
      id: receipt.orderId,
      customerName: receipt.customerName,
      items: receipt.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      totalPrice: receipt.total,
      status: 'Selesai',
      createdAt: `Baru saja (${receipt.time})`,
      paymentMethod: receipt.paymentMethod,
      notes: receipt.orderType,
    };

    setOrders((prev) => [newOrderRecord, ...prev]);
  };

  // 2. Aksi Update Status Pesanan Masuk (Pending -> Diproses -> Selesai)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          // PRD Requirement: Kalkulasi otomatis saat pesanan berstatus 'Selesai'
          if (newStatus === 'Selesai' && ord.status !== 'Selesai') {
            const autoCashFlow = {
              id: `CF-${Date.now().toString().slice(-4)}`,
              date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              description: `Pesanan Web Selesai (${ord.id}) - ${ord.customerName}`,
              category: 'Penjualan',
              type: 'in',
              amount: ord.totalPrice,
            };
            setCashFlow((prevFlow) => [autoCashFlow, ...prevFlow]);
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
  };

  // 3. Aksi Hapus Pesanan
  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // 4. Aksi CRUD Produk
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // 5. Aksi Buku Kas (Tambah, Hapus Satuan, Hapus Semua)
  const handleAddCashFlow = (entry) => {
    setCashFlow((prev) => [entry, ...prev]);
  };

  const handleDeleteCashFlow = (id) => {
    setCashFlow((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllCashFlow = () => {
    setCashFlow([]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased">
      {/* 1. Global Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col">
        {activeTab === 'kasir' && (
          <Kasir
            products={products}
            onCompleteTransaction={handleCompletePosTransaction}
          />
        )}

        {activeTab === 'pesanan' && (
          <Pesanan
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {activeTab === 'produk' && (
          <Produk
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'bukukas' && (
          <BukuKas
            cashFlow={cashFlow}
            onAddCashFlow={handleAddCashFlow}
            onDeleteCashFlow={handleDeleteCashFlow}
            onClearCashFlow={handleClearAllCashFlow}
          />
        )}
      </main>
    </div>
  );
}
