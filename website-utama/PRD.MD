# Product Requirements Document (PRD): Website Utama UMKM Menyum

## 1. Project Overview & Architecture
- **Project Name:** MenYum (Mentai Yummy) - Public Website & Web CMS
- **Workspace Directory:** `umkm-menyum/website-utama`
- **Tech Stack:** React.js (Vite), Tailwind CSS v3, Lucide React / Heroicons (optional icons), React State & `localStorage` (Mock Database before Supabase integration).
- **Target Audience:** Mahasiswa, dosen, pekerja, dan masyarakat sekitar area kampus (Jatiwaringin, Jakarta Timur).
- **Core Objective:** Etalase digital interaktif untuk melihat profil usaha, membaca artikel gizi, melihat ulasan pelanggan, memilih menu makanan/minuman ke dalam keranjang, melakukan pembayaran via QRIS, serta menyediakan Panel Admin Web (CMS) mandiri untuk mengelola katalog produk dan artikel.

---

## 2. Critical Refactoring & Coding Rules (Mandatory for AI Agent)
1. **Responsive Layout Refactoring:** The raw Figma export uses fixed desktop widths (`w-[1920px] px-[460px]`) and `absolute` coordinates. **DO NOT** use rigid `w-[1920px]` or `absolute` positioning for page layout. Refactor all sections into responsive Flexbox and CSS Grid inside a centered container: `max-w-[1040px] mx-auto px-5`.
2. **Typography Color Fix:** The raw Figma export contains a bug where headings use `text-black/20`. **REPLACE** all `text-black/20` on headings, titles, and primary text with Dark Espresso Brown: `text-[#3a1409]`.
3. **Interactive State & Persistence:** Since the Supabase backend is not connected yet, use React `useState` synced with `localStorage` so that:
   - Adding/editing products and articles in the **Web CMS Panel** updates the public pages immediately.
   - Adding items to the **Cart** and confirming orders saves the transaction to `localStorage` (key: `menyum_orders`) to simulate integration with the POS Cashier Dashboard.
   - Submitting a customer review in **Testimoni** appends the review to the list dynamically.
4. **Clean Component Architecture:** Place all modular components inside `src/components/` or `src/pages/` and manage navigation cleanly in `src/App.jsx`.

---

## 3. Design System & Tokens (Figma Spec)

### 3.1. Color Palette
| Token Role | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#e46000` | `bg-[#e46000]` / `text-[#e46000]` | Tombol CTA utama, pill navigasi aktif, teks harga, highlight judul |
| **Brand Primary Hover** | `#c85300` | `hover:bg-[#c85300]` | State hover pada tombol utama |
| **Brand Secondary (Gold)** | `#f7b32b` | `bg-[#f7b32b]` / `text-[#f7b32b]` | Lingkaran foto Hero, badge "Terlaris", bintang rating, judul kolom Footer |
| **Brand Accent (Light Gold)**| `#f6d55c` | `text-[#f6d55c]` | Sub-teks logo "MENTAI YUMMY" pada Footer |
| **Heading Text (Dark)** | `#3a1409` | `text-[#3a1409]` | Seluruh judul halaman (H1, H2, H3), judul kartu, teks utama |
| **Body & Muted Text** | `#7a5a4c` | `text-[#7a5a4c]` | Paragraf deskripsi, subtitle, link navigasi non-aktif |
| **Surface / Background** | `#ffffff` | `bg-white` | Background halaman utama, navbar, dan kartu |
| **Warm Cream Surface** | `#fff8f2` | `bg-[#fff8f2]` | Background area gambar produk & kartu testimoni |
| **Border & Divider** | `#f1e4da` | `border-[#f1e4da]` | Garis batas navbar, kartu produk, input form, kotak QRIS |
| **Footer Background** | `#54180c` | `bg-[#54180c]` | Background footer global |
| **Footer Text** | `#fff3ea` | `text-[#fff3ea]` | Teks isi pada footer |
| **WhatsApp Button** | `#25d366` | `bg-[#25d366]` / `text-[#06301a]` | Tombol melayang Chat WhatsApp |

### 3.2. Typography Scale
- **Hero & Main Page Titles (Home, Profil):** `text-4xl md:text-[66px] font-bold leading-[1.1] text-[#3a1409]`
- **Section Page Titles (Menu, Testimoni):** `text-3xl md:text-[52px] font-bold leading-tight text-[#3a1409]`
- **Sub-Section Headings (Artikel, Yang Kami Pegang):** `text-2xl md:text-[40px] font-bold text-[#3a1409]`
- **Card Titles (Produk, Artikel, Highlight):** `text-[21px] font-bold text-[#3a1409]`
- **Box Titles (Kami, Visi, Misi, Pesananmu, QRIS):** `text-[18.7px] font-bold text-[#3a1409]`
- **Body Text:** `text-lg` (18px), `text-base` (16px), `text-[15px]`, `text-sm` (14px) dengan warna `text-[#7a5a4c]`.

### 3.3. Border Radius & Shadows
- **Buttons & Filter Pills:** `rounded-full` (`rounded-[999px]`)
- **Content & Product Cards:** `rounded-[18px]` dengan `border-2 border-[#f1e4da]`
- **Article Cards:** `rounded-[13px]` dengan `border border-[#f1e4da]` dan shadow `shadow-[0_0_15.3px_rgba(0,0,0,0.12)]`
- **Form Inputs:** `rounded-xl border-2 border-[#f1e4da]`

---

## 4. Global Components Specification

### 4.1. Navbar (`Navbar.jsx`)
- **Wrapper:** `sticky top-0 z-40 w-full bg-white border-b border-[#f1e4da] h-16`
- **Inner Container:** `max-w-[1040px] mx-auto px-5 h-full flex items-center justify-between`
- **Left Brand Logo (Clickable -> `'home'`):**
  - Menyertakan ikon SVG maskot MenYum (gunakan kode SVG asli dari desain Figma dengan warna `#FFFAF2`, `#682D1D`, `#F2690C`, `#F99718`) bersanding dengan teks **`M`** (`text-[#3a1409]`) + **`enYum`** (`text-[#e46000]`) ukuran `text-[28px] font-bold`.
  - Di bawahnya terdapat teks kecil **`MENTAI YUMMY`** (`text-[10px] font-bold text-[#7a5a4c] tracking-wider`).
- **Center Navigation Pills:**
  - Item menu: `Home`, `Profil`, `Menu`, `Testimoni`, `Artikel`, dan `Panel Web`.
  - **Active State:** `bg-[#e46000] text-white px-4 py-2 rounded-[28px] text-sm font-semibold transition`
  - **Inactive State:** `text-[#7a5a4c] hover:text-[#e46000] px-4 py-2 rounded-lg text-sm font-semibold transition`
- **Right CTA Button:**
  - Tombol **"Pesan sekarang"** (`px-[26px] py-2.5 rounded-full bg-[#e46000] text-white text-base font-bold hover:bg-[#c85300]`).
  - Menampilkan badge angka jumlah item jika keranjang (`cart`) tidak kosong, dan mengarahkan ke halaman `'menu'` saat diklik.

### 4.2. Footer (`Footer.jsx`)
- **Wrapper:** `w-full bg-[#54180c] text-[#fff3ea] py-14 mt-20`
- **Inner Grid:** `max-w-[1040px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10`
  - **Kolom 1 (Brand):** Logo SVG + Teks **M** (`text-white`) **enYum** (`text-[#f7b32b]`) `text-[28px] font-bold`, sub-teks **MENTAI YUMMY** (`text-[10px] font-bold text-[#f6d55c]`), dan deskripsi `"Mentai enak untuk kalangan usia"` (`text-[15px] text-[#fff3ea]/90`).
  - **Kolom 2 (Lokasi & jam buka):** Judul `"Lokasi & jam buka"` (`text-xl font-bold text-[#f7b32b]`), Alamat: `"Jl. Raya Jatiwaringin No.2, RT.8/RW.13, Cipinang Melayu, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13620"`, dan `"Jam Buka : 09.00 - 17.00"`.
  - **Kolom 3 (Ikuti kami):** Judul `"Ikuti kami"` (`text-xl font-bold text-[#f7b32b]`), deretan link horizontal (`flex gap-4 text-[15px]`): `Instagram`, `TikTok`, `WhatsApp`.
- **Copyright Bar:** `max-w-[1040px] mx-auto px-5 mt-12 pt-6 border-t border-[#fff3ea]/10 text-center text-[15px] text-[#fff3ea]/90` bertuliskan: `"Copyrights © 2026 Rootbrother, All Rights Reserved"`.

### 4.3. Floating WhatsApp Button
- Posisi `fixed bottom-6 right-6 z-50`.
- Desain: `px-[18px] py-3 rounded-full bg-[#25d366] text-[#06301a] text-[15px] font-bold shadow-lg hover:scale-105 transition flex items-center gap-2` dengan teks **"Chat WhatsApp"**.

---

## 5. Page-by-Page Specifications & Copywriting

### 5.1. Halaman Home (`Home.jsx`)
1. **Hero Section:**
   - Container `max-w-[1040px] mx-auto px-5 py-10` dengan background gambar `home.jpeg` (atau fallback warna krem hangat jika gambar belum tersedia) `rounded-[24px] bg-cover bg-center`.
   - **2-Column Layout (`grid-cols-1 md:grid-cols-12 gap-8 items-center`):**
     - **Kiri (7 Kolom):**
       - Heading: `"Mentai yang "` + `<span className="text-[#e46000]">bikin nagih</span>` + `", harga pelajar."`
       - Subtitle: `"Saus mentai creamy, dibakar sebentar sampai wangi. Dibuat saat dipesan."`
       - CTA Group (`flex flex-wrap gap-3 pt-3`):
         - Button 1: **"Tentang MenYum"** (`bg-[#e46000] text-white font-bold px-[26px] py-3 rounded-full` -> pindah ke tab `'profil'`).
         - Button 2: **"Lihat Video"** (`bg-[#e46000] text-white font-bold px-[26px] py-3 rounded-full` -> buka modal video promosi/proses bakar mentai).
     - **Kanan (5 Kolom):**
       - Lingkaran frame kuning `w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full bg-[#f7b32b] flex items-center justify-center mx-auto` yang membungkus gambar produk `menyum-1.png` (`w-[260px] h-[260px] md:w-[314px] md:h-[314px] rounded-full object-cover`).
   - **3 Value Highlights Bar (Bawah Hero, `grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-6`):**
     - Item 1: **"Dibakar saat dipesan"** | `"Mentai selalu hangat dan creamy."`
     - Item 2: **"Bayar pakai QRIS"** | `"Semua e-wallet dan mobile banking."`
     - Item 3: **"Antar area kampus"** | `"Gratis ongkir mulai Rp40.000."`
2. **About Preview Section (`my-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center`):**
   - **Gambar:** `gemini_generated_image_kdx60vkdx60vkdx6-1.png` (atau placeholder mentai Jepang berkualitas tinggi) ukuran `w-full max-w-[583px] rounded-[18px] object-cover`.
   - **Konten Teks:**
     - Heading: `"Nikmati makanan "` + `<span className="text-[#e46000]">Jepang khas</span>` + `" MenYum"`
     - Deskripsi: `"MenYum merupakan UMKM yang bergerak di bidang kuliner dengan menawarkan produk makanan dan minuman yang lezat, praktis, dan terjangkau. MenYum menyediakan nasi mentai telur sebagai pilihan sarapan atau makan siang serta dalgona coffee sebagai teman beraktivitas. Kami berkomitmen untuk menjaga kualitas dan cita rasa produk dengan harga yang terjangkau bagi mahasiswa maupun pekerja"`
     - Tombol: **"Lihat menu"** (`bg-[#e46000] text-white font-bold px-[26px] py-3 rounded-full` -> pindah ke tab `'menu'`).
3. **Artikel & Berita Preview Section:**
   - Heading: **"Artikel & berita"** (`text-[40px] font-bold text-[#3a1409]`).
   - Subtitle: `"Info gizi dan kabar terbaru dari dapur kami."` (`text-base text-[#7a5a4c]`).
   - **Grid 3 Kolom:** Menampilkan 3 kartu artikel pertama dari state artikel.
   - **Bottom Action:** Tombol rata kanan **"Lihat selengkapnya"** (`bg-[#e46000] text-white font-bold px-[26px] py-3 rounded-full` -> pindah ke tab `'artikel'`).

### 5.2. Halaman Profil (`Profil.jsx`)
- **Header:**
  - Judul: **"Profil MenYum"** (`text-4xl md:text-[66px] font-bold text-[#3a1409]`).
  - Sub-judul: `"MenYum singkatan dari Mentai Yummy. Kami mulai dari satu ide sederhana: mentai enak tidak harus mahal."` (`text-lg text-[#7a5a4c] mt-2`).
- **Grid 2 Kolom ("Kami" & "Visi"):**
  - **Card "Kami":** `rounded-[18px] bg-white border-2 border-[#f1e4da] p-[22px]`
    - Judul: **"Kami"** (`text-[18.7px] font-bold text-[#3a1409] mb-3`)
    - Isi: `"Bisnis ini lahir dari sebuah tugas perkuliahan. Dari sekadar ide kreatif mahasiswa, kami berkomitmen untuk mengembangannya menjadi usaha yang berkelanjutan"`
  - **Card "Visi":** `rounded-[18px] bg-white border-2 border-[#f1e4da] p-[22px]`
    - Judul: **"Visi"** (`text-[18.7px] font-bold text-[#3a1409] mb-3`)
    - Isi: `"Menjadi UMKM yang menyediakan makanan dan minuman untuk menemani aktivitas sehari-hari."`
- **Card Full-Width ("Misi"):** `rounded-[18px] bg-white border-2 border-[#f1e4da] p-[22px] my-5`
  - Judul: **"Misi"** (`text-[18.7px] font-bold text-[#3a1409] mb-3`)
  - Isi:
    1. Menyediakan nasi mentai dan dalgona coffee yang enak dan berkualitas.
    2. Menjadi pilihan makanan untuk sarapan dan makan siang.
    3. Menawarkan produk dengan harga yang terjangkau.
    4. Memberikan pelayanan yang ramah dan memuaskan pelanggan
- **Seksi "Yang Kami Pegang":**
  - Judul: **"Yang Kami Pegang"** (`text-[40px] font-bold text-[#3a1409] mt-8 mb-6`).
  - **Grid 3 Kolom:**
    - Kolom 1: **`100%`** (`text-[40px] font-bold text-[#e46000]`) | `"Dimasak saat dipesan"` (`text-base text-[#7a5a4c]`)
    - Kolom 2: **`Halal`** (`text-[40px] font-bold text-[#e46000]`) | `"menjamin bahan-bahan makanan halal semua"` (`text-base text-[#7a5a4c]`)
    - Kolom 3: **`Kantong Pelajar`** (`text-[40px] font-bold text-[#e46000]`) | `"Harga yang murah dan terjangkau"` (`text-base text-[#7a5a4c]`)

### 5.3. Halaman Menu & Pembayaran QRIS (`Menu.jsx`)
- **Header:**
  - Judul: **"Menu & daftar harga"** (`text-4xl md:text-[52px] font-bold text-[#3a1409]`).
  - Sub-judul: `"Pilih kategori, tambahkan ke keranjang, lalu bayar lewat QRIS."` (`text-lg text-[#7a5a4c]`).
- **Filter Kategori (`flex gap-2 pt-5 pb-4`):**
  - Tombol: `Semua`, `Makanan`, `Minuman`.
  - Aktif: `px-[18px] py-1.5 rounded-full bg-[#e46000] border-2 border-[#e46000] text-sm font-bold text-white`.
  - Non-aktif: `px-[18px] py-1.5 rounded-full bg-white border-2 border-[#f1e4da] text-sm font-bold text-[#3a1409]`.
- **Katalog Produk Default (Grid `grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5`):**
  1. **Rice egg mentai**
     - Kategori: `Makanan`
     - Deskripsi: `"topping add on (sosis, bakso, chili oil)"`
     - Harga Default: `15000` (Format tampilan: `Rp15.000`)
     - Badge: `"Terlaris"` (`bg-[#f7b32b] text-xs font-bold text-[#3a1409] px-2.5 py-0.5 rounded-full absolute left-2.5 top-2.5`)
     - Gambar: `gemini_generated_image_y3d9goy3d9goy3d9-1.jpeg` (dengan fallback image mentai)
  2. **Dalgona Coffe.**
     - Kategori: `Minuman`
     - Deskripsi: `"Manis sedang, 400 ml"`
     - Harga Default: `10000` (Format tampilan: `Rp10.000`)
     - Badge: `null`
     - Gambar: `gemini_generated_image_xawlimxawlimxawl-1.jpeg` (dengan fallback image dalgona coffee)
- **Desain Product Card:**
  - `rounded-[18px] bg-white border-2 border-[#f1e4da] overflow-hidden flex flex-col justify-between`
  - Box Gambar Atas: `h-[140px] bg-[#fff8f2] relative flex items-center justify-center overflow-hidden`
  - Box Konten Bawah: `p-4 flex flex-col flex-grow justify-between`
  - Tombol **"Tambah"**: `w-full p-[9px] rounded-full bg-[#e46000] text-white text-base font-bold hover:bg-[#c85300] mt-3`
- **Panel Keranjang & Checkout QRIS (`grid-cols-1 md:grid-cols-2 gap-5 pt-7`):**
  - **Kolom Kiri - Card "Pesananmu" (`rounded-[18px] bg-white border-2 border-[#f1e4da] p-[22px]`):**
    - Judul: **"Pesananmu"** (`text-[18.7px] font-bold text-[#3a1409]`).
    - Jika kosong tampilkan `"Keranjang masih kosong."` (`text-sm text-[#7a5a4c]`).
    - Jika ada item: tampilkan daftar item, tombol `-` / `+` kuantitas, opsi pilih *Add-on Topping* (Sosis / Bakso / Chili Oil), input **Nama Pemesan / Catatan**, serta baris **Total** (`text-base font-bold text-[#3a1409]`).
  - **Kolom Kanan - Card "Bayar dengan QRIS" (`rounded-[18px] bg-white border-2 border-[#f1e4da] p-[22px]`):**
    - Judul: **"Bayar dengan QRIS"** (`text-[18.7px] font-bold text-[#3a1409]`).
    - Kotak QR (`min-h-[150px] w-[150px] rounded-[14px] border-2 border-[#f1e4da] border-dashed flex items-center justify-center p-3 my-3`):
      - Sebelum konfirmasi: menampilkan teks `"Kode QR muncul di sini setelah pesanan dikonfirmasi"` (`text-[13px] text-center text-[#7a5a4c]`).
      - Setelah tombol **"Konfirmasi pesanan"** diklik: merender gambar kode QRIS simulasi yang jelas, nomor Order ID, tombol **" Tandai Sudah Bayar"**, dan menyimpan objek pesanan ke `localStorage` (`menyum_orders`) dengan status `Pending`.

### 5.4. Halaman Testimoni (`Testimoni.jsx`)
- **Header:**
  - Judul: **"Kata pelanggan"** (`text-4xl md:text-[52px] font-bold text-[#3a1409]`).
  - Sub-judul: `"Dari semua, untuk semua."` (`text-lg text-[#7a5a4c]`).
- **Grid 3 Kolom Ulasan (`grid-cols-1 md:grid-cols-3 gap-5 mt-6`):**
  - Desain Card: `bg-[#fff8f2] border-l-[5px] border-[#f7b32b] rounded-tr-[18px] rounded-br-[18px] p-[22px] flex flex-col justify-between min-h-[140px]`
  - Data Awal (9 Testimoni Asli Figma, semuanya `★★★★★`):
    1. `"Enak banget, harus cobain sihh"` — **king rafi**
    2. `"Mentainya Uweeenak Poll"` — **reyfan amirul**
    3. `"enak der, rekomen sih buat di cobain"` — **ikhsan**
    4. `"ayo cobain enak banget tau"` — **akamsi**
    5. `"ga nyesel sih nyobain ini"` — **badrul**
    6. `"wajib cobain sih"` — **epan**
    7. `"enak kali lek"` — **orang priok asli**
    8. `"masyaallah enak nasmen nya"` — **pak ustad**
    9. `"enak cuy gass cobain"` — **ayup**
- **Form "Tulis ulasanmu" (`max-w-[520px] mt-12 space-y-3`):**
  - Judul: **"Tulis ulasanmu"** (`text-4xl font-bold text-[#3a1409] mb-2`).
  - Input **Nama**: `w-full px-3.5 py-[11px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409] placeholder-[#757575]`
  - Dropdown **Rating**: Pilihan `5 bintang` s/d `1 bintang` (`w-full px-[18px] py-[13.5px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409]`).
  - Textarea **Ceritakan pengalamanmu**: `w-full px-3.5 pt-[11px] pb-[55px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409] placeholder-[#757575]`
  - Tombol **"Kirim ulasan"**: `w-full py-3 rounded-full bg-[#e46000] text-white text-base font-bold hover:bg-[#c85300]`.

### 5.5. Halaman Artikel & Berita (`Artikel.jsx`)
- **Header:**
  - Judul: **"Artikel & berita"** (`text-[40px] font-bold text-[#3a1409]`).
  - Sub-judul: `"Info gizi dan kabar terbaru dari dapur kami."` (`text-base text-[#7a5a4c] mt-1 mb-6`).
- **Grid 3 Kolom Artikel (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6`):**
  - Desain Card: `p-[9px] rounded-[13px] border border-[#f1e4da] bg-white shadow-[0_0_15.3px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition cursor-pointer`
  - Box Atas: `h-40 rounded-[18px] bg-[#fff8f2] flex items-center justify-center text-[64px]` (mendukung emoji `🥚`, `🍱`, `☕`, `🔥` atau URL foto artikel).
  - Judul Artikel: `text-[21px] font-bold text-[#3a1409] pt-2 px-1`
  - Caption Artikel: `text-[15px] text-[#7a5a4c] px-1 pb-2`
  - Isi data awal dengan 7 artikel menarik seputar gizi telur mentai, manfaat protein untuk mahasiswa, keunggulan saus mentai panggang, dan kesegaran Dalgona Coffee. Saat kartu diklik, buka modal baca artikel lengkap.

### 5.6. Halaman Panel Web / CMS Mandiri (`AdminPanel.jsx`)
- Halaman khusus untuk pengelola website guna mengatur konten etalase tanpa mencampuri urusan pembukuan kasir:
  1. **Manajemen Katalog Menu (CRUD):** Form tambah/edit/hapus produk (Nama Produk, Kategori `Makanan`/`Minuman`, Harga Jual, Deskripsi/Topping, URL Gambar, dan checkbox `Terlaris`).
  2. **Manajemen Artikel & Berita (CRUD):** Form tambah/hapus artikel gizi (Judul, Ikon Emoji / URL Gambar, Caption Singkat, Isi Artikel Lengkap).
  3. **Log Pesanan Web (`menyum_orders`):** Tabel ringkas untuk melihat daftar pesanan yang baru saja dibuat pelanggan dari halaman Menu beserta status QRIS-nya.