import { supabase } from '../lib/supabaseClient';

// ==========================================
// 1. MANAJEMEN PRODUK & MODAL / HPP
// ==========================================

export async function fetchProductsFromSupabase() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  // Format field dari snake_case (DB) ke camelCase (UI)
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price),
    capitalCost: Number(item.capital_cost || 0),
    materialCost: 0,
    stock: Number(item.stock || 0),
    image: item.image_url || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80',
    isActive: item.is_active,
  }));
}

export async function addProductToSupabase(product) {
  const payload = {
    name: product.name,
    category: product.category,
    price: product.price,
    capital_cost: product.capitalCost,
    material_cost: 0,
    stock: product.stock,
    image_url: product.image,
    is_active: true,
  };

  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    capitalCost: Number(data.capital_cost || 0),
    materialCost: 0,
    stock: Number(data.stock || 0),
    image: data.image_url,
    isActive: data.is_active,
  };
}

export async function updateProductInSupabase(product) {
  const payload = {
    name: product.name,
    category: product.category,
    price: product.price,
    capital_cost: product.capitalCost,
    material_cost: 0,
    stock: product.stock,
    image_url: product.image,
  };

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', product.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    capitalCost: Number(data.capital_cost || 0),
    materialCost: 0,
    stock: Number(data.stock || 0),
    image: data.image_url,
    isActive: data.is_active,
  };
}

// Pengurangan stok otomatis saat transaksi berhasil
export async function decreaseProductStockInSupabase(items) {
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    try {
      let productQuery = supabase.from('products').select('id, name, stock');
      if (item.id && typeof item.id === 'number') {
        productQuery = productQuery.eq('id', item.id);
      } else {
        productQuery = productQuery.eq('name', item.name);
      }

      const { data: currentProduct, error: fetchErr } = await productQuery.maybeSingle();
      if (fetchErr || !currentProduct) {
        console.warn(`Produk untuk pemotongan stok tidak ditemukan: ${item.name}`, fetchErr);
        continue;
      }

      const currentStock = Number(currentProduct.stock) || 0;
      const qtyToDeduct = Number(item.qty) || 1;
      const newStock = Math.max(0, currentStock - qtyToDeduct);

      const { error: updateErr } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', currentProduct.id);

      if (updateErr) {
        console.error(`Gagal update stok di Supabase untuk ${item.name}:`, updateErr);
      }
    } catch (e) {
      console.warn(`Exception saat potong stok untuk ${item.name}:`, e);
    }
  }
}

// Upload file gambar ke Supabase Storage (bucket: products / settings)
export async function uploadImageToSupabaseStorage(bucket, file, pathPrefix = 'catalog') {
  if (!file) return null;

  const fileExt = file.name.split('.').pop() || 'png';
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${pathPrefix}/${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error(`Error uploading image to Supabase Storage (${bucket}):`, uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteProductFromSupabase(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ==========================================
// 2. MANAJEMEN PESANAN (ORDERS & ITEMS)
// ==========================================

export async function fetchOrdersFromSupabase() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data.map((order) => {
    // Ekstrak queue_number dari kolom atau dari tag di notes [Antrian: A-xxx]
    let queueNum = order.queue_number;
    let cleanNotes = order.notes || '-';
    if (!queueNum && cleanNotes.includes('[Antrian:')) {
      const match = cleanNotes.match(/\[Antrian:\s*([^\]]+)\]/);
      if (match) {
        queueNum = match[1].trim();
        cleanNotes = cleanNotes.replace(/\[Antrian:\s*[^\]]+\]\s*/, '').trim() || '-';
      }
    }

    return {
      id: order.order_code || order.id,
      dbId: order.id,
      queueNumber: queueNum || '-',
      customerName: order.customer_name,
      source: order.source,
      orderType: order.order_type,
      paymentMethod: order.payment_method || 'Belum Bayar',
      totalPrice: Number(order.total_price),
      status: order.status,
      notes: cleanNotes,
      createdAt: new Date(order.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      }),
      items: (order.order_items || []).map((item) => ({
        id: item.id,
        name: item.product_name,
        qty: item.qty,
        price: Number(item.price),
        toppings: item.toppings || null,
      })),
    };
  });
}

export async function updateOrderStatusInSupabase(orderIdOrCode, newStatus, paymentMethod = null) {
  // Update berdasarkan order_code atau id UUID
  const payload = { status: newStatus };
  if (paymentMethod) {
    payload.payment_method = paymentMethod;
  }

  let query = supabase.from('orders').update(payload);
  if (orderIdOrCode.includes('-') && orderIdOrCode.length > 20) {
    query = query.eq('id', orderIdOrCode);
  } else {
    query = query.eq('order_code', orderIdOrCode);
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
  return data;
}

export async function updateOrderItemsInSupabase(
  orderIdOrCode,
  updatedItems,
  newTotalPrice,
  newNotes,
  orderDbId = null
) {
  let dbId = orderDbId;
  if (!dbId) {
    const { data: ord } = await supabase
      .from('orders')
      .select('id')
      .or(`id.eq.${orderIdOrCode},order_code.eq.${orderIdOrCode}`)
      .maybeSingle();
    if (ord) dbId = ord.id;
  }

  // 1. Update header di tabel orders
  const updatePayload = {
    total_price: newTotalPrice,
  };
  if (newNotes !== undefined) {
    updatePayload.notes = newNotes;
  }

  let query = supabase.from('orders').update(updatePayload);
  if (dbId) {
    query = query.eq('id', dbId);
  } else {
    query = query.eq('order_code', orderIdOrCode);
  }
  const { error: orderErr } = await query;
  if (orderErr) {
    console.error('Error updating order header in Supabase:', orderErr);
    throw orderErr;
  }

  // 2. Update order_items jika dbId tersedia
  if (dbId && Array.isArray(updatedItems)) {
    // Hapus item sebelumnya
    await supabase.from('order_items').delete().eq('order_id', dbId);

    // Masukkan item yang telah diperbarui
    if (updatedItems.length > 0) {
      const itemsPayload = updatedItems.map((item) => ({
        order_id: dbId,
        product_name: item.name,
        qty: item.qty,
        price: item.price,
        toppings: item.toppings || null,
        subtotal: item.price * item.qty,
      }));
      const { error: insertErr } = await supabase.from('order_items').insert(itemsPayload);
      if (insertErr) {
        console.warn('Warning inserting updated items:', insertErr);
      }
    }
  }
}

export async function deleteOrderFromSupabase(orderIdOrCode) {
  let query = supabase.from('orders').delete();
  if (orderIdOrCode.includes('-') && orderIdOrCode.length > 20) {
    query = query.eq('id', orderIdOrCode);
  } else {
    query = query.eq('order_code', orderIdOrCode);
  }

  const { error } = await query;
  if (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

// ==========================================
// 3. TRANSAKSI CHECKOUT KASIR POS
// ==========================================

export async function processPosTransactionInSupabase(receipt) {
  const notesText = receipt.paymentMethod === 'Tunai'
    ? `Kasir POS (${receipt.orderType || 'Dine In'}) | Tunai: Rp ${Number(receipt.cashGiven || receipt.total).toLocaleString('id-ID')} | Kembali: Rp ${Number(receipt.change || 0).toLocaleString('id-ID')} | Kasir: ${receipt.cashierName || 'Kasir 01'}`
    : `Kasir POS (${receipt.orderType || 'Dine In'}) | Kasir: ${receipt.cashierName || 'Kasir 01'}`;

  // 1. Simpan Header Pesanan ke tabel orders
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        order_code: receipt.orderId,
        customer_name: receipt.customerName,
        source: 'pos',
        order_type: receipt.orderType,
        payment_method: receipt.paymentMethod,
        total_price: receipt.total,
        status: 'Selesai',
        notes: notesText,
      },
    ])
    .select()
    .single();

  if (orderError) {
    console.error('Error creating POS order:', orderError);
    throw orderError;
  }

  // 2. Simpan Rincian Items ke order_items
  if (receipt.items && receipt.items.length > 0) {
    const itemsPayload = receipt.items.map((item) => ({
      order_id: orderData.id,
      product_id: typeof item.id === 'number' ? item.id : null,
      product_name: item.name,
      qty: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) {
      console.warn('Warning inserting order items:', itemsError);
    }
  }

  // 3. Potong stok otomatis di database Supabase
  try {
    await decreaseProductStockInSupabase(receipt.items);
  } catch (stockErr) {
    console.warn('Warning decreasing product stock:', stockErr);
  }

  // 4. Catat Otomatis ke Buku Kas
  const { data: cashData, error: cashError } = await supabase
    .from('cash_flow')
    .insert([
      {
        description: `Penjualan Kasir POS (${receipt.orderId}) - ${receipt.customerName}`,
        category: 'Penjualan',
        type: 'in',
        amount: receipt.total,
        order_id: orderData.id,
      },
    ])
    .select()
    .single();

  if (cashError) {
    console.warn('Warning recording POS to cash flow:', cashError);
  }

  return {
    order: orderData,
    cashFlow: cashData,
  };
}

// ==========================================
// 4. BUKU KAS & ARUS KAS (CASH FLOW)
// ==========================================

export async function fetchCashFlowFromSupabase() {
  const { data, error } = await supabase
    .from('cash_flow')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cash flow:', error);
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    date: new Date(item.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    description: item.description,
    category: item.category,
    type: item.type,
    amount: Number(item.amount),
  }));
}

export async function addCashFlowToSupabase(entry) {
  const { data, error } = await supabase
    .from('cash_flow')
    .insert([
      {
        description: entry.description,
        category: entry.category,
        type: entry.type,
        amount: entry.amount,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding cash flow entry:', error);
    throw error;
  }

  return {
    id: data.id,
    date: new Date(data.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    description: data.description,
    category: data.category,
    type: data.type,
    amount: Number(data.amount),
  };
}

export async function deleteCashFlowFromSupabase(id) {
  const { error } = await supabase
    .from('cash_flow')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting cash flow:', error);
    throw error;
  }
}

export async function clearAllCashFlowInSupabase() {
  const { error } = await supabase
    .from('cash_flow')
    .delete()
    .gte('id', 0);

  if (error) {
    console.error('Error clearing cash flow:', error);
    throw error;
  }
}

// ==========================================
// 5. PENGATURAN QRIS TOKO DINAMIS
// ==========================================

export async function fetchQrisImageFromSupabase() {
  let dbUrl = '';
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('qris_image_url')
      .eq('id', 'general')
      .maybeSingle();

    if (!error && data?.qris_image_url) {
      dbUrl = data.qris_image_url;
    }
  } catch (err) {
    console.warn('Gagal ambil qris_image_url dari Supabase:', err);
  }

  let localUrl = '';
  try {
    localUrl = localStorage.getItem('menyum_qris_image_url') || '';
  } catch (e) {
    console.warn('Gagal membaca localStorage QRIS:', e);
  }

  return dbUrl || localUrl || '';
}

export async function updateQrisImageInSupabase(qrisUrl) {
  // 1. Simpan ke localStorage terlebih dahulu sebagai fail-safe
  try {
    localStorage.setItem('menyum_qris_image_url', qrisUrl);
  } catch (e) {
    console.warn('Gagal simpan QRIS ke localStorage:', e);
  }

  // 2. Simpan ke database site_settings
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 'general',
          qris_image_url: qrisUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Peringatan saat update qris_image_url di site_settings:', error);
    }
    return data;
  } catch (err) {
    console.warn('Exception saat update QRIS di Supabase:', err);
  }
}


