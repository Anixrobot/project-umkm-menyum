import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Menu from './pages/Menu';
import Testimoni from './pages/Testimoni';
import Artikel from './pages/Artikel';
import AdminCms from './pages/AdminCms';
import AdminLogin from './components/AdminLogin';
import { supabase } from './lib/supabaseClient';
import {
  fetchProductsFromSupabase,
  submitOrderToSupabase,
  fetchArticlesFromSupabase,
  createArticleInSupabase,
  deleteArticleFromSupabase,
  fetchReviewsFromSupabase,
  submitReviewToSupabase,
  deleteReviewFromSupabase,
  fetchSiteSettingsFromSupabase,
  updateSiteSettingsInSupabase,
} from './services/supabaseService';
import { initialProducts, initialReviews, initialArticles } from './data/initialData';

const isBrangkasRoute = () => {
  try {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    return path === '/brangkas' || path.endsWith('/brangkas') || hash === 'brangkas';
  } catch {
    return false;
  }
};

export default function App() {
  const [activePage, setActivePage] = useState(() => (isBrangkasRoute() ? 'cms' : 'home'));

  // Products from Supabase (source of truth is Dashboard Kasir)
  const [products, setProducts] = useState(initialProducts);
  const [articles, setArticles] = useState(initialArticles);
  const [reviews, setReviews] = useState(initialReviews);
  const [siteSettings, setSiteSettings] = useState({
    whatsapp_number: '6281234567890',
    instagram_url: 'https://instagram.com/menyum.id',
    tiktok_url: 'https://tiktok.com/@menyum.id',
    address:
      'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13620',
    opening_hours: '09.00 - 17.00 WIB',
    video_url: '',
    video_aspect: 'portrait',
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('menyum_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      // Menggunakan sessionStorage agar otomatis terhapus saat tab browser ditutup
      const saved = sessionStorage.getItem('menyum_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Listener URL Routing untuk akses tersembunyi /brangkas
  useEffect(() => {
    const checkRoute = () => {
      if (isBrangkasRoute()) {
        setActivePage('cms');
      }
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // 1. Fetch Data dari Supabase saat web pertama kali dibuka
  useEffect(() => {
    async function loadData() {
      try {
        const [dbProds, dbArts, dbRevs, dbSettings] = await Promise.allSettled([
          fetchProductsFromSupabase(),
          fetchArticlesFromSupabase(),
          fetchReviewsFromSupabase(),
          fetchSiteSettingsFromSupabase(),
        ]);

        if (dbProds.status === 'fulfilled' && Array.isArray(dbProds.value)) {
          setProducts(dbProds.value);
        }
        if (dbArts.status === 'fulfilled' && Array.isArray(dbArts.value)) {
          setArticles(dbArts.value);
        }
        if (dbRevs.status === 'fulfilled' && Array.isArray(dbRevs.value)) {
          setReviews(dbRevs.value);
        }
        if (dbSettings.status === 'fulfilled' && dbSettings.value) {
          setSiteSettings(dbSettings.value);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Supabase, menggunakan data default lokal.', err);
      }
    }

    loadData();

    // 2. Real-time Subscriptions (Produk, Artikel, Review, Pengaturan)
    // Sinkronisasi instan saat ada perubahan dari Dashboard Kasir / CMS
    const productsChannel = supabase
      .channel('realtime:web-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          try {
            const updated = await fetchProductsFromSupabase();
            if (Array.isArray(updated)) {
              setProducts(updated);
            }
          } catch (e) {
            console.error('Error refreshing realtime products on web:', e);
          }
        }
      )
      .subscribe();

    const articlesChannel = supabase
      .channel('realtime:web-articles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        async () => {
          try {
            const updated = await fetchArticlesFromSupabase();
            if (Array.isArray(updated)) setArticles(updated);
          } catch (e) {
            console.error('Error refreshing realtime articles on web:', e);
          }
        }
      )
      .subscribe();

    const reviewsChannel = supabase
      .channel('realtime:web-reviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        async () => {
          try {
            const updated = await fetchReviewsFromSupabase();
            if (Array.isArray(updated)) setReviews(updated);
          } catch (e) {
            console.error('Error refreshing realtime reviews on web:', e);
          }
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel('realtime:web-settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        async () => {
          try {
            const updated = await fetchSiteSettingsFromSupabase();
            if (updated) setSiteSettings(updated);
          } catch (e) {
            console.error('Error refreshing realtime settings on web:', e);
          }
        }
      )
      .subscribe();

    const videosChannel = supabase
      .channel('realtime:web-videos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_videos' },
        async () => {
          try {
            const updated = await fetchSiteSettingsFromSupabase();
            if (updated) setSiteSettings(updated);
          } catch (e) {
            console.error('Error refreshing realtime videos on web:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(articlesChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(videosChannel);
    };
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('menyum_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (product, selectedToppings = []) => {
    const toppingsPrice = (selectedToppings || []).reduce((acc, t) => acc + (t.price || 0), 0);
    const itemPrice = (product.price || 0) + toppingsPrice;
    const toppingKey = (selectedToppings || []).map((t) => t.id).sort().join('_');
    const cartItemId = toppingKey ? `${product.id}-${toppingKey}` : `${product.id}`;

    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(cartItemId));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(cartItemId) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          price: itemPrice,
          toppings: selectedToppings || [],
          qty: 1,
        },
      ];
    });
  };

  const handleUpdateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(cartItemId)) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveCartItem = (cartItemId) => {
    setCart((prev) => prev.filter((item) => String(item.id) !== String(cartItemId)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order Confirmation: Mengirim Pesanan Langsung ke Supabase (Terhubung Realtime ke Kasir)
  const handleConfirmOrder = async (newOrder) => {
    try {
      await submitOrderToSupabase(newOrder);
    } catch (e) {
      console.warn('Gagal sinkronisasi pesanan ke Supabase, fallback lokal:', e);
    }
  };

  // Review Handlers
  const handleAddReview = async (newReview) => {
    try {
      const savedReview = await submitReviewToSupabase(newReview);
      setReviews((prev) => [savedReview, ...prev.filter((r) => r.id !== newReview.id && r.id !== savedReview.id)]);
      return savedReview;
    } catch (e) {
      console.error('Gagal simpan ulasan ke Supabase:', e);
      throw e;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    try {
      await deleteReviewFromSupabase(reviewId);
    } catch (e) {
      console.warn('Gagal hapus ulasan di Supabase:', e);
    }
  };

  // Article Handlers
  const handleAddArticle = async (newArt) => {
    try {
      const saved = await createArticleInSupabase(newArt);
      setArticles((prev) => [saved, ...prev]);
    } catch (e) {
      console.warn('Gagal simpan artikel ke Supabase:', e);
      setArticles((prev) => [{ ...newArt, id: Date.now() }, ...prev]);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
    try {
      await deleteArticleFromSupabase(articleId);
    } catch (e) {
      console.warn('Gagal hapus artikel di Supabase:', e);
    }
  };

  // Site Settings Handler
  const handleUpdateSiteSettings = async (newSettings) => {
    try {
      const saved = await updateSiteSettingsInSupabase(newSettings);
      setSiteSettings(saved);
      return saved;
    } catch (e) {
      console.warn('Gagal update site settings di Supabase:', e);
      const fallback = {
        ...siteSettings,
        whatsapp_number: newSettings.whatsappNumber,
        instagram_url: newSettings.instagramUrl,
        tiktok_url: newSettings.tiktokUrl,
        address: newSettings.address,
        opening_hours: newSettings.openingHours,
        video_url: newSettings.videoUrl || '',
        video_aspect: newSettings.videoAspect || 'portrait',
        needsSqlMigration: true,
      };
      setSiteSettings(fallback);
      return fallback;
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('menyum_admin_user');
      localStorage.removeItem('menyum_admin_user');
      window.history.pushState(null, '', '/');
    } catch (e) {
      console.warn('Gagal menghapus sesi login:', e);
    }
    setAdminUser(null);
    setActivePage('home');
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#3a1409]">
      {/* 1. Global Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartTotalItems}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home
            onNavigate={setActivePage}
            articles={articles}
            siteSettings={siteSettings}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              setActivePage('artikel');
            }}
          />
        )}

        {activePage === 'profil' && <Profil onNavigate={setActivePage} />}

        {activePage === 'menu' && (
          <Menu
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onConfirmOrder={handleConfirmOrder}
          />
        )}

        {activePage === 'testimoni' && (
          <Testimoni reviews={reviews} onAddReview={handleAddReview} />
        )}

        {activePage === 'artikel' && (
          <Artikel
            articles={articles}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
            onCloseArticleModal={() => setSelectedArticle(null)}
          />
        )}

        {activePage === 'cms' &&
          (!adminUser ? (
            <AdminLogin
              onLoginSuccess={(user) => setAdminUser(user)}
              onBackToHome={() => {
                try {
                  window.history.pushState(null, '', '/');
                } catch {
                  // ignore
                }
                setActivePage('home');
              }}
            />
          ) : (
            <AdminCms
              key={siteSettings.updated_at || siteSettings.video_url || 'admin-cms'}
              articles={articles}
              onAddArticle={handleAddArticle}
              onDeleteArticle={handleDeleteArticle}
              reviews={reviews}
              onDeleteReview={handleDeleteReview}
              siteSettings={siteSettings}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              adminUser={adminUser}
              onLogout={handleAdminLogout}
            />
          ))}
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={setActivePage} siteSettings={siteSettings} />
    </div>
  );
}
