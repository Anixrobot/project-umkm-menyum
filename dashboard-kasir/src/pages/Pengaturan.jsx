import { useState, useRef } from 'react';
import {
  QrCode,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  uploadImageToSupabaseStorage,
  updateQrisImageInSupabase,
} from '../services/supabaseService';

export default function Pengaturan({ qrisImageUrl, onUpdateQrisImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(qrisImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (PNG, JPG, JPEG, WebP)!', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file terlalu besar, maksimal 5 MB!', 'error');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleCancelSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(qrisImageUrl || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveQris = async () => {
    if (!selectedFile && !previewUrl) {
      showToast('Silakan pilih file gambar QRIS toko terlebih dahulu!', 'error');
      return;
    }

    setIsUploading(true);
    let finalUrl = qrisImageUrl || '';

    try {
      if (selectedFile) {
        // 1. Upload ke Supabase Storage (bucket: settings)
        const uploadedUrl = await uploadImageToSupabaseStorage(
          'settings',
          selectedFile,
          'qris'
        );

        if (uploadedUrl) {
          finalUrl = uploadedUrl;
        }
      }

      // 2. Simpan URL ke tabel konfigurasi/pengaturan (site_settings)
      await updateQrisImageInSupabase(finalUrl);

      // 3. Update global state
      if (onUpdateQrisImage) {
        onUpdateQrisImage(finalUrl);
      }

      setSelectedFile(null);
      setPreviewUrl(finalUrl);
      showToast('Gambar QRIS toko berhasil disimpan dan siap digunakan di Kasir POS!', 'success');
    } catch (err) {
      console.warn('Gagal upload ke storage settings:', err);
      // Fallback: Jika storage policy belum dibuka, gunakan preview lokal
      if (previewUrl) {
        await updateQrisImageInSupabase(previewUrl);
        if (onUpdateQrisImage) onUpdateQrisImage(previewUrl);
        showToast(
          'Gambar QRIS disimpan secara lokal (Storage bucket settings belum aktif di Supabase).',
          'success'
        );
      } else {
        showToast('Gagal mengunggah gambar QRIS. Silakan coba kembali.', 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar QRIS kustom?')) return;
    setIsUploading(true);
    try {
      await updateQrisImageInSupabase('');
      if (onUpdateQrisImage) onUpdateQrisImage('');
      setSelectedFile(null);
      setPreviewUrl('');
      showToast('QRIS kustom dihapus. Sistem kembali ke template default.', 'info');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Pengaturan Toko & Integrasi QRIS</span>
            <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2.5 py-0.5 rounded-full">
              Konfigurasi Kasir
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Kelola gambar QRIS resmi outlet MenYum, integrasi Supabase Storage, dan operasional kasir
          </p>
        </div>

        {previewUrl && (
          <button
            onClick={() => setShowTestModal(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles size={15} className="text-amber-500" />
            <span>Uji Tampilan Scan QRIS</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-4xl">
        {/* Card: Form Upload QRIS Toko Dinamis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <QrCode size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Upload Gambar QRIS Toko Dinamis
                </h3>
                <p className="text-xs text-slate-500">
                  Gambar ini akan otomatis menggantikan barcode dummy di Modal Kasir POS dan Pesanan Web
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold">
              bucket: settings
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Current QRIS */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Current QRIS"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode size={28} className="text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {previewUrl ? 'QRIS Toko Aktif' : 'Template Dummy Default'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {previewUrl
                      ? selectedFile
                        ? `File baru dipilih: ${selectedFile.name} (Belum disimpan)`
                        : 'Terhubung dan aktif di kasir POS & halaman pesanan'
                      : 'Belum ada gambar QRIS toko kustom yang diunggah'}
                  </p>
                </div>
              </div>

              {previewUrl && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTestModal(true)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Pratinjau
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Pilih atau Tarik File Gambar QRIS (BCA, GoPay, OVO, ShopeePay, Dana)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50/80 scale-101'
                    : 'border-slate-300 hover:border-orange-400 bg-slate-50/40 hover:bg-orange-50/20'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Tarik file gambar QRIS ke sini, atau{' '}
                  <span className="text-orange-600 underline">buka dari folder</span>
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  Format yang didukung: PNG, JPG, JPEG, WebP (Maksimal 5 MB)
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[11px] bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-500 font-medium">
                    📁 Jelajahi File Komputer
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {selectedFile && (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleCancelSelectedFile}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batalkan Pilihan
                </button>
              )}

              <button
                type="button"
                disabled={isUploading || (!selectedFile && previewUrl === qrisImageUrl)}
                onClick={handleSaveQris}
                className="px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Menyimpan ke Supabase Storage...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Simpan & Terapkan QRIS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card: Petunjuk & Arsitektur Supabase */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h4 className="font-bold text-slate-800 text-sm">
              Cara Kerja Sinkronisasi QRIS
            </h4>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
            <li>
              File gambar diunggah ke <strong>Supabase Storage</strong> di bucket <code>settings</code>.
            </li>
            <li>
              URL publik dari gambar disimpan di tabel database <code>site_settings</code> (kolom <code>qris_image_url</code>) dan di-cache pada <code>localStorage</code> untuk kecepatan instan.
            </li>
            <li>
              Saat kasir memilih metode <strong>QRIS</strong> pada modal pembayaran POS atau pesanan masuk, gambar QRIS toko ini akan ditampilkan secara otomatis.
            </li>
          </ul>
        </div>
      </div>

      {/* Pop-up Uji Tampilan Scan QRIS */}
      {showTestModal && previewUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-slate-800 text-sm">Pratinjau QRIS Kasir</h4>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-dashed border-orange-300 rounded-xl flex flex-col items-center">
              <div className="w-52 h-52 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={previewUrl}
                  alt="QRIS Toko MenYum"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-slate-600 font-bold mt-3">
                🥟 QRIS Pembayaran UMKM MenYum
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Scan via BCA Mobile, GoPay, OVO, ShopeePay, Dana, LinkAja
              </span>
            </div>

            <button
              onClick={() => setShowTestModal(false)}
              className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
