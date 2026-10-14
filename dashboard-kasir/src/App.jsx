import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Kasir from './pages/Kasir';
import Pesanan from './pages/Pesanan';
import Produk from './pages/Produk';
import BukuKas from './pages/BukuKas';
import { supabase } from './lib/supabaseClient';
import {
  fetchProductsFromSupabase,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  processPosTransactionInSupabase,
  fetchCashFlowFromSupabase,
  addCashFlowToSupabase,
  deleteCashFlowFromSupabase,
  clearAllCashFlowInSupabase,
} from './services/supabaseService';
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
  const [isDbConnected, setIsDbConnected] = useState(false);

  // 1. Fetch data dari Supabase saat aplikasi pertama kali dimuat
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [dbProducts, dbOrders, dbCashFlow] = await Promise.all([
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase(),
          fetchCashFlowFromSupabase(),
        ]);

        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
        if (dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }
        if (dbCashFlow && dbCashFlow.length > 0) {
          setCashFlow(dbCashFlow);
        }

        setIsDbConnected(true);
      } catch (err) {
        console.warn('Supabase belum aktif atau tabel kosong, menggunakan data lokal awal.', err);
        setIsDbConnected(false);
      }
    }

    loadInitialData();

    // 2. Real-time Subscription untuk Pesanan Masuk (Live Sync dengan Website Utama)
    const ordersChannel = supabase
      .channel('realtime:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          try {
            const updatedOrders = await fetchOrdersFromSupabase();
            setOrders(updatedOrders);
          } catch (e) {
            console.error('Error refreshing realtime orders:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  // Hitung berapa pesanan website yang masih Pending
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  // 1. Aksi Selesai Transaksi Kasir POS
  const handleCompletePosTransaction = async (receipt) => {
    // Optimistic UI update
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

    setCashFlow((prev) => [newCashFlowEntry, ...prev]);
    setOrders((prev) => [newOrderRecord, ...prev]);

    // Simpan ke Supabase jika terhubung
    try {
      await processPosTransactionInSupabase(receipt);
    } catch (err) {
      console.warn('Gagal sinkron POS ke Supabase:', err);
    }
  };

  // 2. Aksi Update Status Pesanan Masuk (Pending -> Diproses -> Selesai)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
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

            // Sync cash flow ke Supabase
            addCashFlowToSupabase(autoCashFlow).catch((e) =>
              console.warn('Sync cash flow to Supabase error:', e)
            );
          }
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );

    // Sync status ke Supabase
    try {
      await updateOrderStatusInSupabase(orderId, newStatus);
    } catch (err) {
      console.warn('Gagal update status pesanan di Supabase:', err);
    }
  };

  // 3. Aksi Hapus Pesanan
  const handleDeleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    try {
      await deleteOrderFromSupabase(orderId);
    } catch (err) {
      console.warn('Gagal hapus order di Supabase:', err);
    }
  };

  // 4. Aksi CRUD Produk
  const handleAddProduct = async (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    try {
      const saved = await addProductToSupabase(newProduct);
      // Update ID dari DB jika ada
      setProducts((prev) =>
        prev.map((p) => (p.name === newProduct.name ? saved : p))
      );
    } catch (err) {
      console.warn('Gagal tambah produk ke Supabase:', err);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    try {
      await updateProductInSupabase(updatedProduct);
    } catch (err) {
      console.warn('Gagal update produk di Supabase:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteProductFromSupabase(productId);
    } catch (err) {
      console.warn('Gagal hapus produk di Supabase:', err);
    }
  };

  // 5. Aksi Buku Kas (Tambah, Hapus Satuan, Hapus Semua)
  const handleAddCashFlow = async (entry) => {
    setCashFlow((prev) => [entry, ...prev]);
    try {
      const saved = await addCashFlowToSupabase(entry);
      setCashFlow((prev) =>
        prev.map((cf) => (cf.id === entry.id ? saved : cf))
      );
    } catch (err) {
      console.warn('Gagal catat kas ke Supabase:', err);
    }
  };

  const handleDeleteCashFlow = async (id) => {
    setCashFlow((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteCashFlowFromSupabase(id);
    } catch (err) {
      console.warn('Gagal hapus kas di Supabase:', err);
    }
  };

  const handleClearAllCashFlow = async () => {
    setCashFlow([]);
    try {
      await clearAllCashFlowInSupabase();
    } catch (err) {
      console.warn('Gagal bersihkan kas di Supabase:', err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased">
      {/* 1. Global Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        isDbConnected={isDbConnected}
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
