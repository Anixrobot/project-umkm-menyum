import { supabase } from '../lib/supabaseClient';

// ==========================================
// 1. PRODUK (DIBACA DARI DASHBOARD KASIR)
// ==========================================

export async function fetchProductsFromSupabase() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }

  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category || 'Makanan',
    description: item.description || '',
    price: Number(item.price || 0),
    isBestseller: Boolean(item.is_bestseller),
    image:
      item.image_url ||
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    stock: Number(item.stock || 0),
  }));
}

// ==========================================
// 2. PESANAN ONLINE (KIRIM KE DASHBOARD KASIR)
// ==========================================

export async function submitOrderToSupabase(order) {
  // 1. Simpan Header Pesanan ke tabel orders
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        order_code: order.id,
        customer_name: order.customerName,
        source: 'website',
        order_type: 'Takeaway',
        payment_method: order.paymentMethod || 'QRIS',
        total_price: order.totalPrice,
        status: 'Pending',
        notes: order.notes || '-',
      },
    ])
    .select()
    .single();

  if (orderError) {
    console.error('Error submitting order to Supabase:', orderError);
    throw orderError;
  }

  // 2. Simpan Rincian Items & Topping ke order_items
  if (order.items && order.items.length > 0) {
    const itemsPayload = order.items.map((item) => ({
      order_id: orderData.id,
      product_name: item.name,
      qty: item.qty,
      price: item.price,
      toppings:
        item.toppings && item.toppings.length > 0
          ? item.toppings.map((t) => t.name).join(', ')
          : null,
      subtotal: item.price * item.qty,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) {
      console.warn('Warning inserting order items:', itemsError);
    }
  }

  return orderData;
}

// ==========================================
// 3. ARTIKEL & BERITA (CMS WEBSITE)
// ==========================================

export async function fetchArticlesFromSupabase() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles from Supabase:', error);
    throw error;
  }

  return (data || []).map((art) => ({
    id: art.id,
    title: art.title,
    category: art.category || 'Edukasi Gizi',
    readTime: art.read_time || '3 menit baca',
    excerpt: art.excerpt || '',
    content: art.content || '',
    image: art.image_url,
    date: art.published_date || 'Hari ini',
  }));
}

export async function createArticleInSupabase(art) {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title: art.title,
        category: art.category,
        read_time: art.readTime,
        excerpt: art.excerpt,
        content: art.content,
        image_url: art.image,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating article in Supabase:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    readTime: data.read_time,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image_url,
    date: data.published_date,
  };
}

export async function deleteArticleFromSupabase(artId) {
  const { error } = await supabase.from('articles').delete().eq('id', artId);
  if (error) {
    console.error('Error deleting article in Supabase:', error);
    throw error;
  }
}

// ==========================================
// 4. TESTIMONI & ULASAN (CMS WEBSITE)
// ==========================================

export async function fetchReviewsFromSupabase() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews from Supabase:', error);
    throw error;
  }

  return (data || []).map((rev) => ({
    id: rev.id,
    name: rev.name,
    role: rev.role || 'Pelanggan MenYum',
    rating: Number(rev.rating || 5),
    comment: rev.comment,
    isApproved: rev.is_approved,
    date: new Date(rev.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));
}

export async function submitReviewToSupabase(rev) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        name: rev.name,
        role: rev.role || 'Pelanggan MenYum',
        rating: rev.rating || 5,
        comment: rev.comment,
        is_approved: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error submitting review to Supabase:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    rating: data.rating,
    comment: data.comment,
    isApproved: data.is_approved,
    date: 'Baru saja',
  };
}

export async function deleteReviewFromSupabase(revId) {
  const { error } = await supabase.from('reviews').delete().eq('id', revId);
  if (error) {
    console.error('Error deleting review in Supabase:', error);
    throw error;
  }
}

// ==========================================
// 5. SITE SETTINGS (KONTAK & SOSMED)
// ==========================================

export async function fetchSiteSettingsFromSupabase() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'general')
    .maybeSingle();

  if (error) {
    console.error('Error fetching site settings from Supabase:', error);
    throw error;
  }

  return data;
}

export async function updateSiteSettingsInSupabase(settings) {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({
      id: 'general',
      whatsapp_number: settings.whatsappNumber,
      instagram_url: settings.instagramUrl,
      tiktok_url: settings.tiktokUrl,
      address: settings.address,
      opening_hours: settings.openingHours,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating site settings in Supabase:', error);
    throw error;
  }

  return data;
}

