import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import logoMenyum from '../assets/beranda/LOGO MENYUM.svg';
import { loginAdminUser } from '../services/supabaseService';

export default function AdminLogin({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Harap isi username dan password Anda.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdminUser(username, password);

      if (result.success && result.user) {
        // Simpan sesi ke localStorage
        try {
          localStorage.setItem('menyum_admin_user', JSON.stringify(result.user));
        } catch (err) {
          console.warn('Gagal menyimpan sesi login ke storage:', err);
        }

        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setErrorMessage(result.error || 'Username atau password tidak cocok.');
      }
    } catch (err) {
      console.error('Error proses login:', err);
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-[#f1e4da] rounded-3xl p-6 sm:p-9 shadow-lg max-w-md w-full text-left relative overflow-hidden">
        {/* Top Decorative Color Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e46000] via-[#f7b32b] to-[#e46000] absolute top-0 left-0" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <img
            src={logoMenyum}
            alt="MenYum Mentai Yummy"
            className="h-11 w-auto mx-auto object-contain mb-3"
          />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold mb-2">
            <ShieldCheck size={14} className="text-[#e46000]" />
            <span>Autentikasi Pengelola Web</span>
          </div>

          <h2 className="text-2xl font-black text-[#3a1409] tracking-tight">
            Masuk ke Panel Web
          </h2>
          <p className="text-xs text-[#7a5a4c] mt-1 leading-relaxed">
            Silakan masukkan kredensial akun admin/kasir Anda untuk mengelola artikel, moderasi ulasan, dan pengaturan situs.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3a1409] uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a5a4c]">
                <User size={17} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username akun"
                required
                autoFocus
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFAF2] border border-[#f1e4da] focus:border-[#e46000] rounded-xl text-sm text-[#3a1409] placeholder:text-[#a08579] focus:outline-none focus:ring-2 focus:ring-[#e46000]/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3a1409] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a5a4c]">
                <Lock size={17} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun"
                required
                disabled={loading}
                className="w-full pl-10 pr-11 py-2.5 bg-[#FFFAF2] border border-[#f1e4da] focus:border-[#e46000] rounded-xl text-sm text-[#3a1409] placeholder:text-[#a08579] focus:outline-none focus:ring-2 focus:ring-[#e46000]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7a5a4c] hover:text-[#e46000] transition"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <span>Masuk ke Panel Web</span>
            )}
          </button>
        </form>

        {/* Quick Fill Helpers for Testing */}
        <div className="mt-6 pt-5 border-t border-[#f1e4da]/70">
          <div className="text-[11px] font-semibold text-[#7a5a4c] mb-2 text-center">
            Pilihan Akun Terdaftar (Klik untuk isi otomatis):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickAccount('admin', 'menyumepirginpren124')}
              className="p-2 rounded-lg bg-[#FFFAF2] hover:bg-[#fff0e0] border border-[#f1e4da] text-left transition cursor-pointer"
            >
              <div className="font-bold text-[#3a1409]">Akun Admin</div>
              <div className="text-[10px] text-[#7a5a4c] truncate">admin</div>
            </button>

            <button
              type="button"
              onClick={() => fillQuickAccount('kasir', 'kasir123')}
              className="p-2 rounded-lg bg-[#FFFAF2] hover:bg-[#fff0e0] border border-[#f1e4da] text-left transition cursor-pointer"
            >
              <div className="font-bold text-[#3a1409]">Akun Kasir</div>
              <div className="text-[10px] text-[#7a5a4c] truncate">kasir</div>
            </button>
          </div>
        </div>

        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#7a5a4c] hover:text-[#e46000] font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda Website</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
