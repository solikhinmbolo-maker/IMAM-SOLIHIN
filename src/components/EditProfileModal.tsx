import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { addAuditLog, DB_KEYS } from '../data/mockDatabase';
import { saveUserProfileToSupabase } from '../supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onSaveSuccess: (updatedUser: {
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSaveSuccess
}: EditProfileModalProps) {
  const [name, setName] = useState(currentUser.name || 'Solikhin Mbolo');
  const [email, setEmail] = useState(currentUser.email || 'admin@alhicam.sch.id');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser.avatarUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Solikhin Mbolo')}&background=2563eb&color=fff&size=200`
  );

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Hanya file gambar (JPG, PNG, WebP) yang diizinkan.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran foto maksimal 5 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Compress profile avatar using in-memory canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 320; // 320x320 optimal square profile size
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            setAvatarUrl(compressed);
            setMessage(null);
          } else {
            setAvatarUrl(dataUrl);
            setMessage(null);
          }
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToInitials = () => {
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim() || 'Solikhin Mbolo')}&background=2563eb&color=fff&size=200`;
    setAvatarUrl(newAvatar);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setMessage({ type: 'error', text: 'Nama Lengkap wajib diisi.' });
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Alamat Email / Username tidak valid.' });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
        return;
      }
    }

    setIsSaving(true);

    try {
      const updatedUser = {
        name: cleanName,
        email: cleanEmail,
        role: currentUser.role || 'Super Administrator',
        avatarUrl: avatarUrl
      };

      // 1. Simpan ke LocalStorage Auth & Akun Sistem
      localStorage.setItem(DB_KEYS.AUTH_USER, JSON.stringify(updatedUser));
      
      // Ambil kredensial yang tersimpan atau update password baru
      const existingAccountRaw = localStorage.getItem('EARSIP_ADMIN_ACCOUNT');
      const existingAccount = existingAccountRaw ? JSON.parse(existingAccountRaw) : {};
      const newAccount = {
        ...existingAccount,
        name: cleanName,
        email: cleanEmail,
        role: updatedUser.role,
        avatarUrl: avatarUrl,
        ...(password ? { password: password } : {})
      };
      localStorage.setItem('EARSIP_ADMIN_ACCOUNT', JSON.stringify(newAccount));

      // Update daftar pengguna di EARSIP_USER_LIST agar sinkron seketika dengan Manajemen Pengguna
      const currentListRaw = localStorage.getItem('EARSIP_USER_LIST');
      if (currentListRaw) {
        try {
          const list = JSON.parse(currentListRaw);
          const updatedUserList = list.map((u: any) => {
            if (u.isSuperAdmin || u.email.toLowerCase() === cleanEmail || u.email.toLowerCase() === currentUser.email.toLowerCase()) {
              return {
                ...u,
                name: cleanName,
                email: cleanEmail,
                avatarUrl: avatarUrl
              };
            }
            return u;
          });
          localStorage.setItem('EARSIP_USER_LIST', JSON.stringify(updatedUserList));
        } catch {}
      }

      // 2. Simpan ke database Supabase (jika tabel users tersedia)
      await saveUserProfileToSupabase(updatedUser).catch(() => {});

      // 3. Catat di Audit Log Sistem
      addAuditLog({
        aksi: 'UPDATE',
        kategori: 'Profil Pengguna',
        subjek: cleanName,
        detail: `Pembaruan profil administrator (${cleanEmail})${password ? ' & perubahan kata sandi' : ''}`,
        operator: cleanEmail,
        status: 'SUCCESS'
      });

      setMessage({ type: 'success', text: '✓ Profil dan kredensial akun berhasil disimpan ke sistem!' });
      
      // Update state di parent (App.tsx)
      onSaveSuccess(updatedUser);

      // Tutup otomatis setelah jeda
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 900);
    } catch (err: any) {
      setIsSaving(false);
      setMessage({ type: 'error', text: err?.message || 'Gagal menyimpan perubahan profil.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(37,99,235,0.15)] text-white relative animate-scaleUp overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/3 w-64 h-24 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Edit Profil Administrator</h3>
              <p className="text-xs text-slate-400">Ubah nama, username, password, dan foto profil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="py-4 space-y-4 overflow-y-auto flex-1 pr-1 relative z-10">
          
          {/* Notification Alert */}
          {message && (
            <div className={`p-3 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn ${
              message.type === 'success' 
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' 
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Photo Avatar Section */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-3 border-blue-500/80 shadow-lg shadow-blue-500/20"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                title="Ganti Foto"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5">Ubah</span>
              </button>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0F172A]" title="Aktif" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Foto Profil Pengguna</span>
                <span className="text-[11px] text-slate-400 block">Mendukung format JPG, PNG, atau avatar inisial resmi</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Unggah Foto Baru</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToInitials}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pakai Inisial</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Solikhin Mbolo"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Email / Username Login
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alhicam.sch.id"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>

            {/* Role Badge (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Hak Akses & Peran Sistem
              </label>
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white">{currentUser.role || 'Super Administrator'}</span>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40">
                  Akses Penuh
                </span>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Ubah Kata Sandi (Opsional)
                </span>
                <span className="text-[10px] text-slate-500">Biarkan kosong jika tetap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password Baru */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password baru (min. 6 char)"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password */}
                <div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    disabled={!password}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Sistem...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
