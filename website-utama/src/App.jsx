import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Menu from './pages/Menu';
import Testimoni from './pages/Testimoni';
import Artikel from './pages/Artikel';
import AdminCms from './pages/AdminCms';
import { initialProducts, initialReviews, initialArticles } from './data/initialData';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // State with LocalStorage Persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('menyum_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('menyum_articles');
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('menyum_reviews');
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('menyum_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('menyum_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('menyum_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('menyum_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('menyum_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('menyum_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (product, selectedToppings = []) => {
    const toppingsPrice = (selectedToppings || []).reduce((acc, t) => acc + t.price, 0);
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

  const handleConfirmOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Review Handlers
  const handleAddReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Product CRUD
  const handleAddProduct = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Article CRUD
  const handleAddArticle = (newArt) => {
    setArticles((prev) => [newArt, ...prev]);
  };

  const handleDeleteArticle = (articleId) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
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

        {activePage === 'cms' && (
          <AdminCms
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            articles={articles}
            onAddArticle={handleAddArticle}
            onDeleteArticle={handleDeleteArticle}
            orders={orders}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={setActivePage} />
    </div>
  );
}
