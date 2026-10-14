# Panduan Schema Database Supabase - UMKM Menyum (Dashboard POS & Keuangan)

Dokumen ini merinci struktur database PostgreSQL di **Supabase** untuk sistem operasional kasir, manajemen produk, pesanan, dan buku kas UMKM Menyum.

---

## Ringkasan Struktur Tabel

Sistem ini membutuhkan **4 tabel utama**:

| Nama Tabel | Fungsi Utama | Keterangan |
| :--- | :--- | :--- |
| **`products`** | Menyimpan katalog menu makanan & minuman, harga jual, dan modal HPP (bahan baku). | Dipakai di Kasir POS, Manajemen Produk, dan Katalog Website Utama. |
| **`orders`** | Menyimpan data transaksi pesanan (dari website online maupun kasir POS). | Menyimpan info pelanggan, status (`Pending`, `Diproses`, `Selesai`), dan total bayar. |
| **`order_items`** | Menyimpan rincian item/menu apa saja yang dibeli pada setiap pesanan. | Terhubung relasi (*Foreign Key*) ke tabel `orders`. |
| **`cash_flow`** | Menyimpan mutasi buku kas (uang masuk dan uang keluar). | Mencatat omset penjualan, belanja bahan baku, operasional, & hitung profit bersih. |

---

## 1. Rincian Kolom Setiap Tabel

### A. Tabel `products` (Katalog Menu & Biaya Modal)
Tabel ini mencatat seluruh menu yang dijual beserta struktur modalnya (HPP).

| Nama Kolom | Tipe Data (Type) | Is Nullable? | Default Value | Deskripsi / Contoh |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `int8` (bigint) / Identity | NO (Primary Key) | Auto Increment | ID unik produk |
| `name` | `text` | NO | - | Nama menu, contoh: `Dimsum Ayam Original` |
| `category` | `text` | NO | `'Makanan'` | Pilihan: `'Makanan'` atau `'Minuman'` |
| `price` | `numeric` | NO | `0` | Harga jual ke pelanggan (Rp) |
| `capital_cost` | `numeric` | NO | `0` | Modal dasar / HPP awal (Rp) |
| `material_cost`| `numeric` | NO | `0` | Estimasi biaya bahan baku per porsi (Rp) |
| `stock` | `int4` (integer) | NO | `0` | Jumlah stok porsi tersedia |
| `image_url` | `text` | YES | `NULL` | Link foto menu produk |
| `is_active` | `bool` (boolean) | NO | `true` | Status aktif/tampil di katalog |
| `created_at` | `timestamptz` | NO | `now()` | Waktu produk dibuat |

---

### B. Tabel `orders` (Daftar Pesanan Kasir & Website)
Tabel ini mencatat transaksi pesanan dari website pelanggan maupun kasir offline.

| Nama Kolom | Tipe Data (Type) | Is Nullable? | Default Value | Deskripsi / Contoh |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | NO (Primary Key) | `gen_random_uuid()` | ID unik pesanan |
| `order_code` | `text` | NO (Unique) | - | Nomor nota/order: `ORD-2026-001` / `POS-10293` |
| `customer_name`| `text` | NO | `'Pelanggan Kasir'`| Nama pemesan / No. meja |
| `source` | `text` | NO | `'website'` | Asal order: `'website'` atau `'pos'` |
| `order_type` | `text` | NO | `'Dine In'` | Pilihan: `'Dine In'` atau `'Takeaway'` |
| `payment_method`| `text` | NO | `'QRIS'` | Metode bayar: `'QRIS'`, `'Tunai'`, `'Transfer'` |
| `total_price` | `numeric` | NO | `0` | Total tagihan pesanan (Rp) |
| `status` | `text` | NO | `'Pending'` | Status: `'Pending'`, `'Diproses'`, `'Selesai'` |
| `notes` | `text` | YES | `NULL` | Catatan khusus (contoh: "sambal dipisah") |
| `created_at` | `timestamptz` | NO | `now()` | Tanggal & jam pesanan dibuat |

---

### C. Tabel `order_items` (Rincian Menu per Pesanan)
Tabel ini memecah menu apa saja yang dipesan dalam satu nota `order`.

| Nama Kolom | Tipe Data (Type) | Is Nullable? | Default Value | Deskripsi / Contoh |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `int8` (bigint) / Identity | NO (Primary Key) | Auto Increment | ID baris item |
| `order_id` | `uuid` (Foreign Key) | NO | - | Menghubungkan ke `orders.id` (Cascade on Delete) |
| `product_id` | `int8` (Foreign Key) | YES | `NULL` | Menghubungkan ke `products.id` |
| `product_name`| `text` | NO | - | Snapshot nama produk saat dibeli |
| `qty` | `int4` (integer) | NO | `1` | Jumlah porsi yang dipesan |
| `price` | `numeric` | NO | `0` | Harga satuan saat dipesan (Rp) |
| `subtotal` | `numeric` | NO | `0` | Hasil kali `qty * price` (Rp) |

---

### D. Tabel `cash_flow` (Buku Kas & Riwayat Mutasi)
Tabel ini mencatat seluruh arus kas masuk (pemasukan) dan keluar (beban/belanja).

| Nama Kolom | Tipe Data (Type) | Is Nullable? | Default Value | Deskripsi / Contoh |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `int8` (bigint) / Identity | NO (Primary Key) | Auto Increment | ID transaksi kas |
| `description` | `text` | NO | - | Keterangan, misal: `Beli Daging Ayam Fillet` |
| `category` | `text` | NO | `'Operasional'` | Kategori: `'Penjualan'`, `'Bahan Baku'`, `'Operasional'`, `'Lain-lain'` |
| `type` | `text` | NO | `'in'` | Jenis mutasi: `'in'` (Uang Masuk) atau `'out'` (Uang Keluar) |
| `amount` | `numeric` | NO | `0` | Jumlah nominal uang (Rp) |
| `order_id` | `uuid` (Foreign Key) | YES | `NULL` | Opsional: referensi ke `orders.id` jika bersumber dari pesanan |
| `created_at` | `timestamptz` | NO | `now()` | Waktu mutasi dicatat |

---

## 2. Cara Cepat Setup (Script SQL)

Di dashboard Supabase kamu:
1. Klik menu **SQL Editor** (icon `>_` di panel kiri bawah).
2. Klik **"New Query"**.
3. Copy-paste seluruh skrip SQL di bawah ini, lalu klik **"Run"**.

```sql
-- ==========================================================
-- 1. TABEL PRODUCTS (KATALOG PRODUK & HPP)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Makanan', 'Minuman')),
  price NUMERIC NOT NULL DEFAULT 0,
  capital_cost NUMERIC NOT NULL DEFAULT 0,
  material_cost NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- 2. TABEL ORDERS (TRANSAKSI PESANAN)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL DEFAULT 'Pelanggan Kasir',
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'pos')),
  order_type TEXT NOT NULL DEFAULT 'Dine In' CHECK (order_type IN ('Dine In', 'Takeaway')),
  payment_method TEXT NOT NULL DEFAULT 'QRIS',
  total_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diproses', 'Selesai')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- 3. TABEL ORDER_ITEMS (RINCIAN MENU PER PESANAN)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0
);

-- ==========================================================
-- 4. TABEL CASH_FLOW (BUKU KAS & MUTASI ARUS KAS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.cash_flow (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Operasional' CHECK (category IN ('Penjualan', 'Bahan Baku', 'Operasional', 'Lain-lain')),
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  amount NUMERIC NOT NULL DEFAULT 0,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================
-- 5. DUMMY DATA AWAL (SEED DATA MENYUM)
-- ==========================================================
INSERT INTO public.products (name, category, price, capital_cost, material_cost, stock, image_url) VALUES
('Dimsum Ayam Original (Isi 4)', 'Makanan', 18000, 5000, 6000, 45, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80'),
('Dimsum Udang Mentai (Isi 4)', 'Makanan', 24000, 7000, 8500, 30, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80'),
('Pangsit Goreng Mayonaise', 'Makanan', 15000, 4000, 5000, 50, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=300&q=80'),
('Siomay Kukus Spesial', 'Makanan', 20000, 6000, 7000, 25, 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=300&q=80'),
('Lumpia Kulit Tahu Goreng', 'Makanan', 18000, 5000, 6000, 35, 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?auto=format&fit=crop&w=300&q=80'),
('Es Lemon Tea Segar', 'Minuman', 8000, 1500, 2000, 100, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80'),
('Es Kopi Susu Menyum', 'Minuman', 15000, 3500, 4500, 60, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&q=80'),
('Air Mineral Dingin', 'Minuman', 4000, 1800, 200, 80, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80');

INSERT INTO public.cash_flow (description, category, type, amount, created_at) VALUES
('Pesanan ORD-2026-004 (Dewi Lestari)', 'Penjualan', 'in', 66000, now() - INTERVAL '2 hours'),
('Pesanan ORD-2026-005 (Rian Pratama)', 'Penjualan', 'in', 38000, now() - INTERVAL '3 hours'),
('Belanja Daging Ayam Fillet & Udang Segar', 'Bahan Baku', 'out', 320000, now() - INTERVAL '5 hours'),
('Beli Kemasan Paper Bowl & Sumpit Bambu', 'Bahan Baku', 'out', 85000, now() - INTERVAL '6 hours'),
('Rekap Omset Penjualan POS & Web Harian', 'Penjualan', 'in', 1450000, now() - INTERVAL '1 day'),
('Pembelian Gas Elpiji 3kg & Es Batu Kristal', 'Operasional', 'out', 55000, now() - INTERVAL '1 day');
```

