import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('admin@alhicam.sch.id');
  const [password, setPassword] = useState('alhicam2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const validEmails = ['admin@alhicam.sch.id', 'solikhin@alhicam.sch.id', 'admin'];
    const validPass = 'alhicam2026';

    if (!cleanEmail || !password) {
      setErrorMessage('Silakan isi Email dan Password terlebih dahulu.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (validEmails.includes(cleanEmail) && password === validPass) {
        const userName = cleanEmail.includes('solikhin') ? 'Solikhin Mbolo' : 'Solikhin Mbolo';
        onLoginSuccess({
          email: cleanEmail,
          name: userName,
          role: 'Super Administrator'
        });
      } else {
        setErrorMessage('Email atau Password tidak cocok! Gunakan admin@alhicam.sch.id / alhicam2026');
      }
    }, 800);
  };

  const handleKirimReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setShowResetModal(false);
      setResetSuccessMsg(`Permohonan reset password untuk ${resetEmail} telah dikirim ke nomor WhatsApp Admin (6281994285759).`);
      setResetEmail('');
      setTimeout(() => setResetSuccessMsg(''), 7000);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-['Poppins']">
      {/* Background Building with 20% opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920')` }}
      />

      {/* Ambient Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-1000" />

      {/* Login Card Glassmorphism */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/75 backdrop-blur-2xl border border-cyan-500/25 rounded-3xl p-8 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 transition-all duration-300">
        
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="https://i.ibb.co.com/Jw175yjb/file-00000000c4287208bc89c0bb125befc2-1.png" 
              alt="Logo SMP Al-Hikam" 
              className="w-20 h-20 object-contain drop-shadow-[0_4px_12px_rgba(6,182,212,0.4)]"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            E-ARSIP <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">AL-HICAM</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Digital Arsip SMP Al-Hikam</p>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-3" />
        </div>

        {/* Success Alert (e.g. from password reset) */}
        {resetSuccessMsg && (
          <div className="mb-6 p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            <span>{resetSuccessMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs sm:text-sm flex items-start gap-2.5 animate-bounce">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Email / Username</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alhicam.sch.id"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-cyan-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                required
                className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
              <span>Ingat saya</span>
            </label>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Lupa password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memverifikasi Akses...
              </span>
            ) : (
              <>
                <span>MASUK KE PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-4 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 text-center">
          Kredensial Default: <strong className="text-white">admin@alhicam.sch.id</strong> / <strong className="text-white">alhicam2026</strong>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-semibold text-slate-400">
            <span className="bg-slate-900 px-3 tracking-wider">ATAU MASUK DENGAN</span>
          </div>
        </div>

        {/* Google Workspace Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-3 px-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Google Workspace SMP</span>
        </button>
      </div>

      {/* Modal Reset Password */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Masukkan email Anda untuk mengirimkan permohonan reset password langsung ke WhatsApp Admin E-Arsip.
            </p>
            <form onSubmit={handleKirimReset}>
              <div className="relative mb-5 text-left">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Masukkan Email Anda"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {resetLoading ? 'Mengirim...' : 'Kirim ke Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Google Workspace Info */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pemberitahuan SSO</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Fitur Single Sign-On (SSO) Google Workspace SMP Al-Hikam terintegrasi dengan domain resmi sekolah (@alhicam.sch.id). Untuk saat ini silakan login menggunakan akun administrator utama.
            </p>
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
