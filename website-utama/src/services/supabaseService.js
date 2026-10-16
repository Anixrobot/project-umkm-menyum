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
// 2. PESANAN ONLINE (NOMOR ANTRIAN & KIRIM KE KASIR)
// ==========================================

export async function getNextQueueNumber() {
  try {
    // Tentukan awal hari ini (jam 00:00:00 waktu lokal)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();

    const { data, error } = await supabase
      .from('orders')
      .select('queue_number, notes, created_at')
      .gte('created_at', todayStart)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      // Cari angka antrian tertinggi hari ini
      let maxNum = 0;
      for (const row of data) {
        if (row.queue_number) {
          const match = String(row.queue_number).match(/A-(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
        if (row.notes) {
          const matchNotes = String(row.notes).match(/\[Antrian:\s*A-(\d+)\]/i);
          if (matchNotes) {
            const num = parseInt(matchNotes[1], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      }
      const nextNum = maxNum + 1;
      return `A-${String(nextNum).padStart(3, '0')}`;
    }
  } catch (err) {
    console.warn('Gagal membaca nomor antrian dari Supabase, menggunakan fallback lokal:', err);
  }

  // Fallback lokal berdasarkan tanggal hari ini jika offline / error
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem('menyum_queue_tracker') || '{}');
    let nextCount = 1;
    if (stored.date === todayStr) {
      nextCount = (Number(stored.count) || 0) + 1;
    }
    localStorage.setItem(
      'menyum_queue_tracker',
      JSON.stringify({ date: todayStr, count: nextCount })
    );
    return `A-${String(nextCount).padStart(3, '0')}`;
  } catch {
    return 'A-001';
  }
}

export async function submitOrderToSupabase(order) {
  // Format catatan dengan tag [Antrian: ...] sebagai cadangan jika kolom queue_number belum dieksekusi di Supabase
  const notesWithQueue = order.queueNumber
    ? `[Antrian: ${order.queueNumber}] ${order.notes || '-'}`
    : (order.notes || '-');

  const basePayload = {
    order_code: order.id,
    customer_name: order.customerName,
    source: 'website',
    order_type: 'Takeaway',
    payment_method: order.paymentMethod || 'Belum Bayar (Kasir)',
    total_price: order.totalPrice,
    status: 'Pending',
    notes: notesWithQueue,
  };

  let orderData;
  let orderError;

  // 1. Coba simpan dengan kolom queue_number
  try {
    const res = await supabase
      .from('orders')
      .insert([{ ...basePayload, queue_number: order.queueNumber }])
      .select()
      .single();
    orderData = res.data;
    orderError = res.error;
  } catch (e) {
    orderError = e;
  }

  // Jika kolom queue_number belum ada di Supabase, fallback simpan tanpa kolom tersebut (sudah ada tag di notes)
  if (orderError && (orderError.code === '42703' || String(orderError.message).includes('queue_number'))) {
    console.warn('Kolom queue_number belum dibuat di tabel orders, menyimpan dengan tag notes...');
    const retry = await supabase
      .from('orders')
      .insert([basePayload])
      .select()
      .single();
    if (retry.error) {
      console.error('Error submitting order on retry:', retry.error);
      throw retry.error;
    }
    orderData = retry.data;
  } else if (orderError) {
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

  return { ...orderData, queue_number: order.queueNumber };
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
    comment: rev.comment || '',
    text: rev.comment || '',
    isApproved: rev.is_approved,
    date: rev.created_at
      ? new Date(rev.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Baru saja',
  }));
}

export async function submitReviewToSupabase(rev) {
  const commentText = (rev.comment || rev.text || '').trim();
  if (!commentText) {
    throw new Error('Komentar ulasan tidak boleh kosong');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        name: rev.name.trim(),
        role: (rev.role || 'Pelanggan MenYum').trim(),
        rating: Number(rev.rating) || 5,
        comment: commentText,
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
    role: data.role || 'Pelanggan MenYum',
    rating: Number(data.rating) || 5,
    comment: data.comment,
    text: data.comment,
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

  if (data) {
    let fallbackVideo = '';
    try {
      fallbackVideo = localStorage.getItem('menyum_video_url') || '';
    } catch (e) {
      console.warn('Gagal membaca cache video lokal:', e);
    }

    return {
      ...data,
      video_url: data.video_url || fallbackVideo,
    };
  }

  return data;
}

export async function updateSiteSettingsInSupabase(settings) {
  const basePayload = {
    id: 'general',
    whatsapp_number: settings.whatsappNumber,
    instagram_url: settings.instagramUrl,
    tiktok_url: settings.tiktokUrl,
    address: settings.address,
    opening_hours: settings.openingHours,
    updated_at: new Date().toISOString(),
  };

  const payloadWithVideo = {
    ...basePayload,
    video_url: settings.videoUrl || '',
  };

  let resultData;
  let resultError;

  // 1. Coba simpan langsung dengan kolom video_url
  try {
    const res = await supabase
      .from('site_settings')
      .upsert(payloadWithVideo)
      .select()
      .single();
    resultData = res.data;
    resultError = res.error;
  } catch (err) {
    resultError = err;
  }

  // 2. Fallback jika kolom video_url belum dieksekusi di database Supabase
  if (
    resultError &&
    (resultError.code === 'PGRST204' ||
      resultError.code === '42703' ||
      String(resultError.message).includes('video_url'))
  ) {
    console.warn(
      'Kolom video_url belum ada di Supabase. Menyimpan data kontak & mengamankan video_url di cache...'
    );

    try {
      localStorage.setItem('menyum_video_url', settings.videoUrl || '');
    } catch (e) {
      console.warn('Gagal menyimpan cache video lokal:', e);
    }

    const retry = await supabase
      .from('site_settings')
      .upsert(basePayload)
      .select()
      .single();

    if (retry.error) {
      console.error('Error updating site settings on retry:', retry.error);
      throw retry.error;
    }
    resultData = { ...retry.data, video_url: settings.videoUrl || '' };
  } else if (resultError) {
    console.error('Error updating site settings in Supabase:', resultError);
    throw resultError;
  }

  // Simpan juga ke cache lokal agar langsung aktif
  try {
    if (settings.videoUrl !== undefined) {
      localStorage.setItem('menyum_video_url', settings.videoUrl || '');
    }
  } catch (e) {
    console.warn('Gagal menyimpan cache video lokal:', e);
  }

  return resultData;
}

