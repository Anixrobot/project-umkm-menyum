import { supabase } from '../lib/supabaseClient';

// ==========================================
// 1. MANAJEMEN PRODUK & BAHAN BAKU (HPP)
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
    materialCost: Number(item.material_cost || 0),
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
    material_cost: product.materialCost,
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
    materialCost: Number(data.material_cost || 0),
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
    material_cost: product.materialCost,
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
    materialCost: Number(data.material_cost || 0),
    stock: Number(data.stock || 0),
    image: data.image_url,
    isActive: data.is_active,
  };
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

  return data.map((order) => ({
    id: order.order_code || order.id,
    dbId: order.id,
    customerName: order.customer_name,
    source: order.source,
    orderType: order.order_type,
    paymentMethod: order.payment_method,
    totalPrice: Number(order.total_price),
    status: order.status,
    notes: order.notes || '-',
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
    })),
  }));
}

export async function updateOrderStatusInSupabase(orderIdOrCode, newStatus) {
  // Update berdasarkan order_code atau id UUID
  let query = supabase.from('orders').update({ status: newStatus });
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
        notes: `Kasir POS (${receipt.orderType})`,
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

  // 3. Catat Otomatis ke Buku Kas
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

