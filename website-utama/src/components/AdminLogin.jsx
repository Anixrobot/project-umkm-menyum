import { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
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
      setErrorMessage('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdminUser(username, password);

      if (result.success && result.user) {
        // Simpan sesi sementara di sessionStorage (hilang saat tab ditutup)
        try {
          sessionStorage.setItem('menyum_admin_user', JSON.stringify(result.user));
        } catch (err) {
          console.warn('Gagal menyimpan sesi login:', err);
        }

        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setErrorMessage(result.error || 'Username atau password salah.');
      }
    } catch (err) {
      console.error('Error proses login:', err);
      setErrorMessage('Gagal terhubung ke server autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="bg-white border border-[#f1e4da] rounded-2xl p-7 sm:p-9 shadow-lg max-w-sm w-full text-left">
        {/* Brand Logo & Title */}
        <div className="text-center mb-6">
          <img
            src={logoMenyum}
            alt="MenYum"
            className="h-10 w-auto mx-auto object-contain mb-3"
          />
          <h2 className="text-xl font-bold text-[#3a1409]">
            Login Panel Admin
          </h2>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form: Hanya Username, Password, dan Tombol Masuk */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3a1409] mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7a5a4c]">
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="off"
                disabled={loading}
                className="w-full pl-9 pr-3 py-2 bg-[#FFFAF2] border border-[#f1e4da] focus:border-[#e46000] rounded-xl text-sm text-[#3a1409] focus:outline-none focus:ring-2 focus:ring-[#e46000]/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3a1409] mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7a5a4c]">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="off"
                disabled={loading}
                className="w-full pl-9 pr-10 py-2 bg-[#FFFAF2] border border-[#f1e4da] focus:border-[#e46000] rounded-xl text-sm text-[#3a1409] focus:outline-none focus:ring-2 focus:ring-[#e46000]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7a5a4c] hover:text-[#e46000] transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memeriksa...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>
        </form>

        {/* Back to Home Link */}
        {onBackToHome && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#7a5a4c] hover:text-[#e46000] transition cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
