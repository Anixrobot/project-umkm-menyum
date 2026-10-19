# 🍱 MenYum - Sistem Informasi Kuliner & Dashboard Kasir POS Terintegrasi

![MenYum Banner](website-utama/src/assets/beranda/home%20keseluruhan%20full.png)

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployment-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **MenYum (Mentai Yummy)** adalah platform digital kuliner terintegrasi untuk UMKM Nasi Mentai dan Minuman Kekinian. Sistem ini menggabungkan **Website Profil & Katalog Pemesanan Pelanggan (Self-Order)** dengan **Dashboard Kasir POS (Point of Sale) & Manajemen Dapur Real-time** yang tersinkronisasi instan via database PostgreSQL Supabase dan di-hosting di jaringan global Cloudflare Pages.

---

## 📑 Daftar Isi

- [1. Ringkasan Arsitektur Sistem](#1-ringkasan-arsitektur-sistem)
- [2. Teknologi, Bahasa Pemrograman, & Framework](#2-teknologi-bahasa-pemrograman--framework)
  - [Bahasa Pemrograman](#bahasa-pemrograman)
  - [Framework & Build Tool](#framework--build-tool)
  - [Database & Backend (Supabase)](#database--backend-supabase)
  - [Hosting & Infrastruktur (Cloudflare Pages)](#hosting--infrastruktur-cloudflare-pages)
  - [Library Pendukung](#library-pendukung)
- [3. Struktur Direktori & Penjelasan Setiap File](#3-struktur-direktori--penjelasan-setiap-file)
  - [Struktur Root Proyek](#struktur-root-proyek)
  - [Aplikasi 1: `website-utama`](#aplikasi-1-website-utama)
  - [Aplikasi 2: `dashboard-kasir`](#aplikasi-2-dashboard-kasir)
- [4. Penjelasan Mendalam Fitur & Section](#4-penjelasan-mendalam-fitur--section)
  - [Fitur Website Utama (`website-utama`)](#fitur-website-utama-website-utama)
  - [Fitur Dashboard Kasir (`dashboard-kasir`)](#fitur-dashboard-kasir-dashboard-kasir)
- [5. Skema & Konfigurasi Database Supabase](#5-skema--konfigurasi-database-supabase)
  - [Tabel Utama](#tabel-utama)
  - [Skrip SQL Supabase Siap Eksekusi](#skrip-sql-supabase-siap-eksekusi)
- [6. Panduan Koding: Mengganti Gambar, Heading, & Teks Manual](#6-panduan-koding-mengganti-gambar-heading--teks-manual)
  - [1. Cara Mengganti Logo Brand Navbar](#1-cara-mengganti-logo-brand-navbar)
  - [2. Cara Mengubah Slogan, Heading, & Subheading Hero](#2-cara-mengubah-slogan-heading--subheading-hero)
  - [3. Cara Mengganti Foto Banner Menu Utama](#3-cara-mengganti-foto-banner-menu-utama)
  - [4. Cara Mengubah Teks Profil, Visi, & Misi](#4-cara-mengubah-teks-profil-visi--misi)
  - [5. Cara Mengubah Kontak WhatsApp, Alamat, & Jam Operasional Manual](#5-cara-mengubah-kontak-whatsapp-alamat--jam-operasional-manual)
  - [6. Cara Menyesuaikan Warna Brand / Palet Tema Tailwind](#6-cara-menyesuaikan-warna-brand--palet-tema-tailwind)
- [7. Panduan Instalasi & Menjalankan Proyek di Lokal](#7-panduan-instalasi--menjalankan-proyek-di-lokal)
- [8. Panduan Deployment ke Cloudflare Pages](#8-panduan-deployment-ke-cloudflare-pages)

---

## 1. Ringkasan Arsitektur Sistem

Proyek ini dibangun dengan konsep **Multi-Package Workspace (Monorepo)** yang terdiri dari 2 aplikasi web independen yang terhubung ke satu sumber data terpusat (Single Source of Truth):

```mermaid
flowchart TD
    subgraph Klien["Pelanggan (Publik)"]
        Web["website-utama<br/>(Katalog, Keranjang, QRIS, CMS /brangkas)"]
    end

    subgraph Internal["Operasional UMKM (Privat)"]
        POS["dashboard-kasir<br/>(Kasir POS, Pesanan Real-time, Stok, Buku Kas)"]
    end

    subgraph Backend["Cloud Backend-as-a-Service"]
        Supa[("Supabase PostgreSQL Database")]
        Realtime["Supabase Realtime Engine<br/>(WebSocket Pub/Sub)"]
    end

    subgraph Hosting["Edge Hosting"]
        CF1["Cloudflare Pages<br/>(project-webmenyum.pages.dev)"]
        CF2["Cloudflare Pages / Local Server<br/>(Dashboard Kasir POS)"]
    end

    Web -->|Kirim Pesanan Baru| Supa
    Web -->|Baca Menu & Setting| Supa
    Supa -->|Trigger Update| Realtime
    Realtime -->|Notifikasi Pesanan Masuk (Detik Itu Juga)| POS
    POS -->|Update Status Pesanan / Edit Stok / Input Kas| Supa
    Web -.-> CF1
    POS -.-> CF2
```

---

## 2. Teknologi, Bahasa Pemrograman, & Framework

### Bahasa Pemrograman
1. **JavaScript (ECMAScript 2022+ / JSX):**
   - Sintaks modern: *Async/Await, Destructuring, Optional Chaining (`?.`), Nullish Coalescing (`??`), Arrow Functions, ES Modules (`import/export`)*.
   - Penulisan antarmuka deklaratif berbasis komponen React (`.jsx`).
2. **HTML5:**
   - Struktur semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`, `<form>`).
   - Integrasi grafik vektor SVG (*Scalable Vector Graphics*) langsung ke DOM.
3. **CSS3:**
   - Layout modern (*CSS Flexbox*, *CSS Grid*, *Subgrid*).
   - Animasi CSS (*Keyframe animations*, *smooth hover transitions*, *backdrop blur*).
4. **SQL (PostgreSQL):**
   - Bahasa query relasional untuk definisi skema tabel (*DDL*), manipulasi data (*DML*), constraint integritas referensial, *Row-Level Security (RLS)*, dan *Replication Publication*.

---

### Framework & Build Tool
- **React 19 (`react` & `react-dom` v19.2.8):**
  - Menggunakan paradigma fungsional murni (*Functional Components*).
  - Manajemen state reaktif melalui React Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, dan `useRef`.
  - Rendering dinamis tanpa refresh halaman (*Single Page Application*).
- **Vite 8 (`vite` v8.3.0 & `@vitejs/plugin-react`):**
  - Engine bundler ultra-cepat berbasis *Rollup* dan *Native ES Modules*.
  - *Hot Module Replacement (HMR)* instan saat proses development.
  - Tree-shaking dan kompresi bundle CSS/JS otomatis untuk produksi.
- **Tailwind CSS v4 (`@tailwindcss/vite` v4.3.3):**
  - Menggunakan engine Tailwind CSS generasi ke-4 yang langsung terintegrasi sebagai plugin Vite tanpa memerlukan file konfigurasi legacy yang berat.
  - Konsep *Utility-First*: styling langsung pada atribut `className`.

---

### Database & Backend (Supabase)
- **Supabase BaaS (Backend-as-a-Service):**
  - **Engine:** PostgreSQL 15 cloud database.
  - **Supabase Realtime (WebSocket):** Menggunakan fitur PostgreSQL Logical Replication (`supabase_realtime`) sehingga setiap kali ada baris pesanan baru di tabel `orders`, Dashboard Kasir langsung menerima payload secara otomatis tanpa perlu me-refresh halaman (polling-free).
  - **Security (RLS):** Konfigurasi kebijakan akses baca/tulis aman untuk klien publik (`anon`) dan authenticated user.

---

### Hosting & Infrastruktur (Cloudflare Pages)
- **Cloudflare Pages:**
  - Deployment otomatis terintegrasi dengan Git repository (*Continuous Integration / Continuous Deployment*).
  - Terdistribusi di ribuan edge server Cloudflare di seluruh dunia (*Anycast Global CDN*).
  - **SPA Rewrite Support:** Menggunakan file `public/_redirects` dengan isi `/* /index.html 200` agar URL rute seperti `/brangkas`, `/menu`, atau rute langsung tidak menghasilkan error 404 saat di-refresh oleh pengunjung.

---

### Library Pendukung
- **`@supabase/supabase-js` (v2.117.3):** SDK resmi JavaScript untuk query PostgreSQL, autentikasi, dan subscription channel WebSocket.
- **`lucide-react` (v1.57.0):** Koleksi ratusan ikon visual modern berbasis SVG, ringan, dan konsisten (*ShoppingBag, QrCode, Play, Trash2, Printer, Store, CheckCircle, dll.*).

---

## 3. Struktur Direktori & Penjelasan Setiap File

### Struktur Root Proyek

```text
umkm-menyum/
├── .git/                      # Direktori version control Git
├── .vscode/                   # Konfigurasi workspace editor VS Code
├── dashboard-kasir/           # [Aplikasi 1] Dashboard Kasir POS & Manajemen Dapur
├── website-utama/             # [Aplikasi 2] Website Profil & Panel CMS Publik/Admin
├── node_modules/              # Dependensi global (jika ada)
├── package.json               # Manifest workspace root
├── package-lock.json          # Dependency lockfile
├── SUPABASE_SCHEMA.md         # Dokumentasi DDL skema database terpusat Supabase
└── README.md                  # Dokumentasi master proyek (file ini)
```

---

### Aplikasi 1: `website-utama`

```text
website-utama/
├── public/
│   ├── _redirects             # Konfigurasi routing Cloudflare Pages (SPA fallback ke index.html)
│   └── vite.svg               # Favicon default Vite
├── src/
│   ├── assets/                # Folder aset multimedia & gambar
│   │   ├── beranda/           # Banner hero, mockup, logo vektor SVG MenYum
│   │   ├── profil/            # Ilustrasi halaman profil & visi misi
│   │   ├── menu/              # Foto produk nasi mentai dan dalgona
│   │   ├── testimoni/         # Aset dekoratif halaman testimoni
│   │   └── artikel/           # Aset visual kartu berita & edukasi
│   ├── components/            # Komponen UI reusable (Modular)
│   │   ├── Navbar.jsx         # Navigasi atas, logo responsif, cart badge, drawer mobile
│   │   ├── Footer.jsx         # Bagian kaki web, kontak dinamis, medsos, alamat, peta
│   │   ├── ToppingModal.jsx   # Pop-up kustomisasi topping mentai (Sosis, Bakso, Chili Oil)
│   │   └── AdminLogin.jsx     # Form login otentikasi admin panel CMS (/brangkas)
│   ├── data/
│   │   └── initialData.js     # Data cadangan (fallback offline jika Supabase belum terisi)
│   ├── lib/
│   │   └── supabaseClient.js  # Inisialisasi SDK Supabase Client dengan environment variable
│   ├── pages/                 # Halaman utama aplikasi (Views)
│   │   ├── Home.jsx           # Beranda, Hero banner, Modal pemutar video gdrive, fitur
│   │   ├── Profil.jsx         # Profil UMKM, kisah pendirian, nilai keunggulan, visi & misi
│   │   ├── Menu.jsx           # Katalog menu, filter, keranjang, checkout QRIS, unduh antrian
│   │   ├── Testimoni.jsx      # Daftar review pelanggan, rating bintang, formulir submit ulasan
│   │   ├── Artikel.jsx        # Kabar dapur & edukasi gizi mentai, modal baca artikel lengkap
│   │   └── AdminCms.jsx       # Panel kontrol CMS (/brangkas): kelola artikel, review, kontak, video
│   ├── services/
│   │   └── supabaseService.js # Lapisan API komunikasi Supabase (Fetch/Insert/Update/Delete)
│   ├── utils/
│   │   └── videoUtils.js      # Parser URL video Google Drive & YouTube menjadi format iframe embed
│   ├── App.css                # CSS custom tambahan & styling animasi khusus
│   ├── App.jsx                # Komponen induk: state global, routing manual, listener realtime
│   ├── index.css              # Entrypoint styling Tailwind CSS v4 (@import "tailwindcss")
│   └── main.jsx               # Titik awal mount React DOM ke elemen HTML #root
├── index.html                 # Template HTML dasar dengan viewport mobile responsif
├── package.json               # Konfigurasi package, scripts, dan dependensi website
├── tailwind.config.js         # Konfigurasi Tailwind utility
└── vite.config.js             # Konfigurasi Vite build & React plugin
```

---

### Aplikasi 2: `dashboard-kasir`

```text
dashboard-kasir/
├── src/
│   ├── assets/                # Gambar ikon & aset visual kasir
│   ├── components/
│   │   └── Sidebar.jsx        # Navigasi samping: Kasir POS, Pesanan Masuk, Produk, Buku Kas
│   ├── data/
│   │   └── mockData.js        # Data mock awal untuk pengujian lokal
│   ├── lib/
│   │   └── supabaseClient.js  # Koneksi Supabase client instance
│   ├── pages/
│   │   ├── Kasir.jsx          # Mesin POS: input pesanan langsung, hitung total, QRIS, cetak struk
│   │   ├── Pesanan.jsx        # Monitor pesanan online real-time, validasi QRIS, update status masak
│   │   ├── Produk.jsx         # Manajemen katalog: tambah/edit menu, harga, HPP/modal, stok
│   │   └── BukuKas.jsx        # Laporan keuangan: kas masuk otomatis, kas keluar, profit bersih
│   ├── services/
│   │   └── supabaseService.js # Fungsi sinkronisasi pesanan, stok, dan kasir ke database
│   ├── App.css                # Styling spesifik dashboard
│   ├── App.jsx                # Router internal dashboard kasir & state shared
│   ├── index.css              # Setup Tailwind CSS
│   └── main.jsx               # Mount dashboard ke DOM
├── package.json               # Dependensi & skrip dashboard
└── vite.config.js             # Konfigurasi Vite
```

---

## 4. Penjelasan Mendalam Fitur & Section

### Fitur Website Utama (`website-utama`)

#### 1. Navbar ([`Navbar.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/Navbar.jsx))
- **Logo Brand SVG Presisi:** Menggunakan file vektor [`LOGO MENYUM.svg`](file:///d:/Documents/umkm-menyum/website-utama/src/assets/beranda/LOGO%20MENYUM.svg) dengan `viewBox` rapat (`192 x 72`) sehingga teks tagline `"MENTAI YUMMY"` dan ikon api tajam tanpa terpotong di desktop maupun mobile.
- **Pills Navigation Dinamis:** Indikator halaman aktif berlatar oranye (`#e46000`) dengan animasi transisi halus.
- **Cart Counter Badge:** Tombol *"Pesan sekarang"* menampilkan jumlah item di keranjang dengan badge menyala (*pulse animation*).
- **Mobile Drawer Menu:** Hamburger toggle responsif untuk layar handphone (< 768px).

#### 2. Beranda & Hero Section ([`Home.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Home.jsx))
- **Headline & Tagline:** Typografi tebal bernuansa hangat kuliner (`#3a1409`) dengan highlight oranye khas mentai bakar.
- **Visual Hero Lingkaran:** Bingkai produk lingkaran kuning (`#f7b32b`) dengan badge harga mengambang (*Floating badge "Mulai dari Rp15.000"*).
- **3 Kartu Keunggulan:**
  1. *Dibakar saat dipesan* (Fresh & smokey).
  2. *Bayar pakai QRIS* (Praktis cashless).
  3. *Antar area kampus* (Free ongkir syarat tertentu).
- **Preview Kuliner & Artikel:** Menampilkan 3 artikel terbaru dan cuplikan menu favorit secara otomatis dari database.

#### 3. Pemutar Video Interaktif ([`Home.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Home.jsx) & [`videoUtils.js`](file:///d:/Documents/umkm-menyum/website-utama/src/utils/videoUtils.js))
- **Tombol "Lihat Video":** Membuka modal pemutar video proses torching/pembakaran saus mentai.
- **Dukungan Link Fleksibel:** Otomatis mengubah link Google Drive sharing biasa (`/view?usp=sharing`) atau link YouTube menjadi iframe embed siap tonton.
- **Aspect Ratio Switcher:** Pengunjung dapat beralih antara **Mode Tegak (HP / 9:16)** yang cocok untuk video vertikal kamera smartphone dan **Mode Lebar (16:9)**.

#### 4. Halaman Profil ([`Profil.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Profil.jsx))
- **Kisah UMKM:** Menceritakan latar belakang lahirnya MenYum dari proyek kuliah menjadi usaha kuliner berdaya saing.
- **Visi & Misi:** Disajikan dalam bentuk kartu modern dengan ikon *Heart*, *Target*, dan *Compass*.
- **Nilai-Nilai Utama:** 100% dimasak saat dipesan, bahan terjamin halal, dan harga pas di kantong pelajar.

#### 5. Katalog Menu & Pemesanan ([`Menu.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Menu.jsx))
- **Filter Kategori:** Tab *Semua*, *Makanan*, *Minuman*, dan *Paket Hemat*.
- **Pencarian Realtime:** Filter nama menu instan melalui search bar.
- **Modal Topping Kustomisasi ([`ToppingModal.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/ToppingModal.jsx)):** Pelanggan dapat memilih topping ekstra (Sosis Sapi, Bakso Goreng, Chili Oil Gurih) dengan kalkulasi harga dinamis.
- **Sidebar Keranjang Belanja:** Menghitung subtotal, kuantitas item, catatan pesanan (*order notes*), dan nama pemesan.

#### 6. Pembayaran QRIS & Tiket Antrian ([`Menu.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Menu.jsx))
- **Tampilan Kode QRIS Statis/Dinamis:** Pelanggan memindai QRIS menggunakan aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay, BCA/Mandiri).
- **Nomor Antrian Otomatis (`queue_number`):** Dihitung otomatis per hari (`getNextQueueNumber`) dari tabel Supabase.
- **Download Bukti Antrian:** Pelanggan dapat mengunduh atau mencetak kartu nomor antrian sebagai bukti verifikasi ke kasir.

#### 7. Testimoni Pembeli ([`Testimoni.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Testimoni.jsx))
- **Ulasan Terkoneksi Supabase:** Mengambil data review dari tabel `reviews`.
- **Formulir Ulasan Baru:** Pelanggan dapat menginput nama, rating bintang (1-5), dan ulasan. Data langsung tersimpan di Supabase secara instan.

#### 8. Edukasi Gizi & Kabar Dapur ([`Artikel.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Artikel.jsx))
- **Grid Kartu Berita:** Artikel gizi dan resep mentai dengan kategori dan estimasi waktu baca.
- **Modal Pembaca Penuh:** Membaca isi konten artikel lengkap tanpa berpindah halaman.

#### 9. Footer Dinamis ([`Footer.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/Footer.jsx))
- **Informasi Kontak Terpusat:** Menampilkan nomor WhatsApp, akun Instagram, TikTok, alamat fisik, dan jam operasional yang tersinkronisasi otomatis dari database `site_settings`.
- **Floating WhatsApp Button:** Tombol pintas cepat di pojok kanan bawah yang langsung membuka percakapan WhatsApp ke admin MenYum.

#### 10. Panel Rahasia CMS / Brangkas ([`AdminCms.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/AdminCms.jsx) & [`AdminLogin.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/AdminLogin.jsx))
- **Akses Aman:** Rute tersembunyi yang diakses melalui URL `/brangkas`.
- **Otentikasi Akun:** Terkoneksi ke tabel `admin_users` dengan verifikasi username & password.
- **Kelola Artikel:** Menulis, menerbitkan, dan menghapus artikel gizi/berita.
- **Moderasi Ulasan:** Menghapus atau menyetujui review pelanggan yang masuk.
- **Kontak & Video Beranda:** Mengubah nomor WhatsApp, tautan sosmed, dan link video Google Drive dengan indikator status sinkronisasi Supabase serta tombol salin query SQL.

---

### Fitur Dashboard Kasir (`dashboard-kasir`)

#### 1. Mesin Kasir POS ([`Kasir.jsx`](file:///d:/Documents/umkm-menyum/dashboard-kasir/src/pages/Kasir.jsx))
- **Antarmuka Kasir Cepat:** Memilih produk dengan sekali klik, memilih opsi *Dine In* atau *Take Away*.
- **Metode Pembayaran:** Mendukung pembayaran **Tunai** (dengan fitur kalkulator kembalian instan) dan **QRIS**.
- **Pencetakan Struk:** Generate struk digital POS seketika setelah pembayaran dikonfirmasi.

#### 2. Pesanan Masuk Real-time ([`Pesanan.jsx`](file:///d:/Documents/umkm-menyum/dashboard-kasir/src/pages/Pesanan.jsx))
- **Penerimaan Pesanan Tanpa Refresh:** Setiap ada order yang masuk dari website pelanggan, kartu pesanan langsung muncul berkat *Supabase Realtime Channel*.
- **Manajemen Alur Dapur:** Mengubah status pesanan secara bertahap:
  `Menunggu Konfirmasi` ➔ `Diproses (Sedang Dimasak)` ➔ `Selesai` / `Dibatalkan`.
- **Rincian Topping & Bukti Bayar:** Kasir dapat melihat rincian topping tiap menu dan memverifikasi bukti transaksi.

#### 3. Manajemen Produk & HPP ([`Produk.jsx`](file:///d:/Documents/umkm-menyum/dashboard-kasir/src/pages/Produk.jsx))
- **Katalog Terpusat:** Menambah produk baru, mengubah harga jual, mengupdate stok, dan mengatur status aktif/non-aktif menu.
- **Kalkulasi HPP & Bahan Baku:** Mencatat modal dasar (*capital cost*) dan biaya bahan baku (*material cost*) untuk keperluan analisa profitabilitas.

#### 4. Buku Kas & Analisa Keuangan ([`BukuKas.jsx`](file:///d:/Documents/umkm-menyum/dashboard-kasir/src/pages/BukuKas.jsx))
- **Pencatatan Otomatis:** Setiap transaksi kasir atau order selesai langsung dibukukan sebagai pos pemasukan (*cash in*).
- **Pencatatan Manual Pengeluaran:** Kasir/Owner dapat mencatat biaya operasional harian (gas, bahan baku darurat, es batu, kemasan).
- **Kalkulator Laba Bersih:** Menghitung selisih pemasukan dan pengeluaran secara real-time.

---

## 5. Skema & Konfigurasi Database Supabase

Database menggunakan arsitektur relasional PostgreSQL di platform Supabase. Seluruh tabel dapat diakses oleh kedua aplikasi sesuai hak akses masing-masing.

### Tabel Utama

| Nama Tabel | Peran Utama | Aplikasi Pengelola | Aplikasi Pembaca |
| :--- | :--- | :--- | :--- |
| `admin_users` | Kredensial login admin/kasir/owner | Database / Owner | Website (`/brangkas`) & Kasir |
| `products` | Katalog menu, harga, stok, & modal | Dashboard Kasir | Website Utama & Kasir |
| `orders` | Transaksi pesanan, antrian, & status | Web & Kasir POS | Dashboard Kasir (Realtime) |
| `order_items` | Detail item menu & pilihan topping | Web & Kasir POS | Dashboard Kasir |
| `cash_flow` | Arus kas masuk/keluar & pembukuan | Dashboard Kasir | Dashboard Kasir |
| `articles` | Artikel berita & edukasi gizi | Panel Web CMS | Website Utama |
| `reviews` | Testimoni pelanggan & rating | Publik & Panel CMS | Website Utama |
| `site_settings` | Kontak WA, medsos, alamat, & video | Panel Web CMS | Website Utama |
| `site_videos` | (Opsional) Tabel data video beranda | Panel Web CMS | Website Utama |

---

### Skrip SQL Supabase Siap Eksekusi

Salin seluruh kode di bawah ini, buka dashboard Supabase Anda -> menu **SQL Editor** -> klik **New Query** -> tempel dan klik **Run**:

```sql
-- ==========================================================
-- SKRIP SETUP LENGKAP DATABASE TERPUSAT: UMKM MENYUM
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABEL AKUN LOGIN ADMIN & KASIR
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'kasir' CHECK (role IN ('admin', 'kasir', 'owner')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABEL KATALOG PRODUK
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Makanan',
  price NUMERIC NOT NULL DEFAULT 0,
  capital_cost NUMERIC DEFAULT 0,
  material_cost NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 100,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABEL TRANSAKSI PESANAN
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  queue_number TEXT,
  customer_name TEXT NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  source TEXT DEFAULT 'website',
  order_type TEXT DEFAULT 'Dine In',
  payment_method TEXT DEFAULT 'QRIS',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TABEL ITEM PESANAN & TOPPING
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT,
  product_name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL DEFAULT 0,
  toppings TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0
);

-- 6. TABEL ARUS KAS (BUKU KAS)
CREATE TABLE IF NOT EXISTS public.cash_flow (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Operasional',
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. TABEL ARTIKEL & BERITA
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Edukasi Gizi',
  read_time TEXT NOT NULL DEFAULT '3 menit baca',
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TABEL TESTIMONI & ULASAN
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Pelanggan MenYum',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. TABEL PENGATURAN KONTEN, KONTAK & VIDEO
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  whatsapp_number TEXT NOT NULL DEFAULT '6281234567890',
  instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/menyum.id',
  tiktok_url TEXT NOT NULL DEFAULT 'https://tiktok.com/@menyum.id',
  address TEXT NOT NULL DEFAULT 'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Makasar, Kota Jakarta Timur 13620',
  opening_hours TEXT NOT NULL DEFAULT '09.00 - 17.00 WIB',
  video_url TEXT DEFAULT '',
  video_aspect TEXT DEFAULT 'portrait',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. TABEL KHUSUS VIDEO (CADANGAN)
CREATE TABLE IF NOT EXISTS public.site_videos (
  id TEXT PRIMARY KEY DEFAULT 'main_video',
  title TEXT DEFAULT 'Video Proses Bakar Saus Mentai Khas MenYum',
  video_url TEXT DEFAULT '',
  video_aspect TEXT DEFAULT 'portrait',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ROW LEVEL SECURITY (RLS) & IZIN AKSES
ALTER TABLE public.site_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_videos" ON public.site_videos FOR SELECT USING (true);
CREATE POLICY "Public write site_videos" ON public.site_videos FOR ALL USING (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 12. AKTIFKAN REPLIKASI REALTIME
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 13. SEED DATA AWAL LOGIN & SETTINGS
INSERT INTO public.admin_users (username, password, name, role)
VALUES 
  ('admin', 'menyum123', 'Owner MenYum', 'admin'),
  ('kasir', 'kasir123', 'Kasir Outlet', 'kasir')
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.site_settings (id, whatsapp_number, instagram_url, tiktok_url, address, opening_hours)
VALUES (
  'general',
  '6281234567890',
  'https://instagram.com/menyum.id',
  'https://tiktok.com/@menyum.id',
  'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Makasar, Kota Jakarta Timur 13620',
  '09.00 - 17.00 WIB'
)
ON CONFLICT (id) DO NOTHING;
```

---

## 6. Panduan Koding: Mengganti Gambar, Heading, & Teks Manual

Berikut adalah panduan praktis untuk developer atau pengelola web yang ingin mengubah teks, slogan, gambar, atau warna langsung di level kode:

### 1. Cara Mengganti Logo Brand Navbar
- **File Lokasi:** [`website-utama/src/components/Navbar.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/Navbar.jsx)
- **Aset Terkait:** [`website-utama/src/assets/beranda/LOGO MENYUM.svg`](file:///d:/Documents/umkm-menyum/website-utama/src/assets/beranda/LOGO%20MENYUM.svg)

```jsx
// Baris 3: Import logo dari folder assets
import logoMenyum from '../assets/beranda/LOGO MENYUM.svg';

// Baris 38-43: Elemen gambar logo di dalam tombol brand
<img
  src={logoMenyum}
  alt="MenYum Mentai Yummy"
  // Anda dapat mengatur tinggi logo: h-9 (mobile), sm:h-10 (tablet), md:h-[42px] (desktop)
  className="h-9 sm:h-10 md:h-[42px] w-auto object-contain group-hover:scale-105 transition-transform"
/>
```
> **Tips:** Jika ingin mengganti logo dengan file baru (misal `logo-baru.png`), simpan file tersebut ke `src/assets/beranda/`, lalu ubah baris 3 menjadi:
> `import logoMenyum from '../assets/beranda/logo-baru.png';`

---

### 2. Cara Mengubah Slogan, Heading, & Subheading Hero
- **File Lokasi:** [`website-utama/src/pages/Home.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Home.jsx)

```jsx
// Baris 60-63: Badge Slogan Kecil di atas Judul
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7b32b]/20 text-[#3a1409] text-xs font-bold">
  <Sparkles size={14} className="text-[#e46000]" />
  <span>UMKM Kuliner Jepang Kampus</span> {/* <-- Ubah teks badge di sini */}
</div>

// Baris 65-67: Heading Judul Utama
<h1 className="text-3xl sm:text-4xl md:text-[60px] lg:text-[66px] font-extrabold text-[#3a1409]">
  Mentai yang <span className="text-[#e46000]">bikin nagih</span>, harga pelajar.
</h1>

// Baris 69-71: Paragraf Subheading Deskripsi
<p className="text-sm sm:text-base md:text-lg text-[#7a5a4c] leading-relaxed max-w-xl">
  Saus mentai creamy, dibakar sebentar sampai wangi. Dibuat saat dipesan untuk sarapan atau makan siang kamu.
</p>
```

---

### 3. Cara Mengganti Foto Banner Menu Utama
- **File Lokasi:** [`website-utama/src/pages/Home.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Home.jsx)

```jsx
// Baris 14-15: Import foto lokal produk
import mentaiHero2 from '../assets/beranda/menyum nasi mentai 2.png';
import mentaiCombo1 from '../assets/beranda/menyum nasi mentai 1.png';

// Baris 96-105: Render foto lingkaran di Hero
<img
  src={mentaiHero2} // <-- Ganti variabel ini atau ganti URL langsung
  alt="Nasi Mentai MenYum"
  className="w-full h-full rounded-full object-cover shadow-inner"
/>
```

---

### 4. Cara Mengubah Teks Profil, Visi, & Misi
- **File Lokasi:** [`website-utama/src/pages/Profil.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/pages/Profil.jsx)

```jsx
// Baris 4-23: Tiga Kartu Nilai Keunggulan
const values = [
  {
    metric: '100%',
    desc: 'Dimasak saat dipesan',
    detail: 'Setiap porsi nasi mentai dibakar seketika agar selalu hangat dan gurih.',
    icon: Award,
  },
  // ...
];

// Baris 52-54: Paragraf "Kami" (Cerita Lahirnya Usaha)
<p className="text-sm sm:text-base text-[#7a5a4c] leading-relaxed">
  Bisnis ini lahir dari sebuah tugas perkuliahan. Dari sekadar ide kreatif mahasiswa, kami berkomitmen untuk mengembangkannya...
</p>

// Baris 67-69: Paragraf "Visi"
<p className="text-sm sm:text-base text-[#7a5a4c] leading-relaxed">
  Menjadi UMKM yang menyediakan makanan dan minuman praktis, nikmat, dan higienis...
</p>
```

---

### 5. Cara Mengubah Kontak WhatsApp, Alamat, & Jam Operasional Manual
- **File Lokasi:** [`website-utama/src/components/Footer.jsx`](file:///d:/Documents/umkm-menyum/website-utama/src/components/Footer.jsx)

```jsx
// Baris 4-11: Fallback jika data di database Supabase kosong
const whatsappNumber = siteSettings.whatsapp_number || '6281234567890'; // Format internasional (tanpa tanda +)
const instagramUrl = siteSettings.instagram_url || 'https://instagram.com/menyum.id';
const tiktokUrl = siteSettings.tiktok_url || 'https://tiktok.com/@menyum.id';
const address = siteSettings.address || 'Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu...';
const openingHours = siteSettings.opening_hours || '09.00 - 17.00 WIB';
```
> *Catatan:* Anda juga bisa mengubah data kontak ini kapan saja secara langsung tanpa koding melalui menu Panel Web di URL `/brangkas`.

---

### 6. Cara Menyesuaikan Warna Brand / Palet Tema Tailwind
Warna resmi MenYum menggunakan palet warna kuliner Jepang yang hangat:

| Kode Hex | Deskripsi Warna | Penggunaan di Kelas Tailwind |
| :--- | :--- | :--- |
| `#e46000` | Oranye Utama (Brand Flame) | `bg-[#e46000]`, `text-[#e46000]`, `border-[#e46000]` |
| `#c85300` | Oranye Gelap (Hover state) | `hover:bg-[#c85300]` |
| `#f7b32b` | Kuning Telur Mentai (Accent) | `bg-[#f7b32b]`, `border-[#f7b32b]` |
| `#3a1409` | Cokelat Gelap (Heading Text) | `text-[#3a1409]`, `bg-[#3a1409]` |
| `#7a5a4c` | Cokelat Sedang (Body Text) | `text-[#7a5a4c]` |
| `#f1e4da` | Krem Border Halus | `border-[#f1e4da]` |
| `#fff8f2` | Krem Sangat Terang (Card BG) | `bg-[#fff8f2]`, `bg-[#fff2e5]` |

Untuk mengubah warna aksen secara global, Anda cukup mencari dan mengganti (*Find and Replace*) kode hex tersebut di seluruh proyek atau menambahkan utility class di [`website-utama/src/index.css`](file:///d:/Documents/umkm-menyum/website-utama/src/index.css).

---

## 7. Panduan Instalasi & Menjalankan Proyek di Lokal

### Prasyarat
- **Node.js:** Versi 18.0.0 atau lebih baru (Rekomendasi v20+ LTS).
- **npm:** Versi 9.0.0 ke atas.
- **Git:** Terpasang di komputer Anda.

### Langkah-Langkah

1. **Clone Repository:**
   ```bash
   git clone https://github.com/Anixrobot/project-umkm-menyum.git
   cd project-umkm-menyum
   ```

2. **Setup Environment Variables:**
   - Masuk ke folder `website-utama`, buat file `.env`:
     ```env
     VITE_SUPABASE_URL=https://suexxwtyqnuaktqbzprd.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Masuk ke folder `dashboard-kasir`, buat file `.env` dengan kredensial yang sama.

3. **Menjalankan Website Utama:**
   ```bash
   cd website-utama
   npm install
   npm run dev
   ```
   Buka browser di `http://localhost:5173` (Akses admin di `http://localhost:5173/brangkas`).

4. **Menjalankan Dashboard Kasir POS:**
   Buka terminal baru:
   ```bash
   cd dashboard-kasir
   npm install
   npm run dev
   ```
   Buka browser di `http://localhost:5174`.

5. **Pengujian Build & Linting:**
   ```bash
   # Di folder website-utama maupun dashboard-kasir:
   npm run lint   # Memastikan tidak ada kesalahan sintaks
   npm run build  # Membuat bundle produksi ke folder dist/
   ```

---

## 8. Panduan Deployment ke Cloudflare Pages

Kedua aplikasi telah teruji dan teroptimasi penuh untuk dideploy ke **Cloudflare Pages**:

1. **Login ke Cloudflare Dashboard** -> Pilih menu **Workers & Pages** -> Klik **Create application** -> Tab **Pages** -> **Connect to Git**.
2. **Pilih Repository:** `Anixrobot/project-umkm-menyum`.
3. **Pengaturan Build untuk Website Utama (`website-utama`):**
   - **Project Name:** `project-webmenyum`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `website-utama`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
   - **Environment Variables:** Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. **Pengaturan Build untuk Dashboard Kasir (`dashboard-kasir`):**
   - Buat project terpisah di Cloudflare Pages dengan konfigurasi:
   - **Root Directory:** `dashboard-kasir`
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
5. **Konfigurasi SPA Routing:**
   File [`website-utama/public/_redirects`](file:///d:/Documents/umkm-menyum/website-utama/public/_redirects) otomatis mencegah error 404 saat pengguna me-refresh halaman `/brangkas`.

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk kemajuan UMKM Kuliner Indonesia • <strong>MenYum (Mentai Yummy)</strong> © 2026</sub>
</div>

