import React, { useState, useRef } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Save, 
  Camera, 
  RefreshCw, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { addAuditLog } from '../data/mockDatabase';
import { saveUserProfileToSupabase } from '../supabase';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Aktif' | 'Nonaktif';
  password?: string;
  avatarUrl?: string;
  isSuperAdmin?: boolean;
}

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  { 
    id: 'usr-1', 
    name: 'Solikhin Mbolo', 
    email: 'admin@alhicam.sch.id', 
    role: 'Super Administrator', 
    status: 'Aktif', 
    isSuperAdmin: true 
  },
  { 
    id: 'usr-2', 
    name: 'Operator Tata Usaha', 
    email: 'solikhin@alhicam.sch.id', 
    role: 'Administrator Arsip', 
    status: 'Aktif' 
  },
  { 
    id: 'usr-3', 
    name: 'Nurul Hidayah, S.Kom', 
    email: 'nurul@alhicam.sch.id', 
    role: 'Admin Guru & TIK', 
    status: 'Aktif' 
  }
];

export function getStoredUserList(): SystemUser[] {
  try {
    const raw = localStorage.getItem('EARSIP_USER_LIST');
    if (!raw) {
      localStorage.setItem('EARSIP_USER_LIST', JSON.stringify(INITIAL_SYSTEM_USERS));
      return INITIAL_SYSTEM_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SYSTEM_USERS;
  } catch {
    return INITIAL_SYSTEM_USERS;
  }
}

export function saveStoredUserList(users: SystemUser[]) {
  try {
    localStorage.setItem('EARSIP_USER_LIST', JSON.stringify(users));
  } catch {}
}

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string; role: string; avatarUrl?: string };
  onUpdateCurrentUser: (updatedUser: { email: string; name: string; role: string; avatarUrl?: string }) => void;
}

export default function UserManagementModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser
}: UserManagementModalProps) {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const list = getStoredUserList();
    // Synchronize current superadmin account if present
    const updated = list.map(u => {
      if (u.isSuperAdmin || u.email === currentUser.email) {
        return {
          ...u,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          avatarUrl: currentUser.avatarUrl || u.avatarUrl
        };
      }
      return u;
    });
    return updated;
  });

  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for editing / creating
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Administrator Arsip');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [formPassword, setFormPassword] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleStartEdit = (user: SystemUser) => {
    setEditingUser(user);
    setIsCreatingNew(false);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPassword('');
    setFormAvatar(user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=120`);
    setMessage(null);
  };

  const handleStartCreate = () => {
    setEditingUser(null);
    setIsCreatingNew(true);
    setFormName('');
    setFormEmail('');
    setFormRole('Administrator Arsip');
    setFormStatus('Aktif');
    setFormPassword('');
    setFormAvatar('https://ui-avatars.com/api/?name=User+Baru&background=2563eb&color=fff&size=120');
    setMessage(null);
  };

  const handleCancelForm = () => {
    setEditingUser(null);
    setIsCreatingNew(false);
    setMessage(null);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Hanya file gambar (JPG, PNG) yang diperbolehkan.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setFormAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    const cleanEmail = formEmail.trim().toLowerCase();

    if (!cleanName) {
      setMessage({ type: 'error', text: 'Nama Lengkap wajib diisi.' });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Alamat Email tidak valid.' });
      return;
    }

    if (isCreatingNew && !formPassword) {
      setMessage({ type: 'error', text: 'Password wajib diisi untuk pengguna baru.' });
      return;
    }

    if (formPassword && formPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter.' });
      return;
    }

    // Check duplicate email
    const duplicate = users.find(u => u.email.toLowerCase() === cleanEmail && (!editingUser || u.id !== editingUser.id));
    if (duplicate) {
      setMessage({ type: 'error', text: `Email ${cleanEmail} sudah digunakan oleh akun lain.` });
      return;
    }

    let updatedList: SystemUser[];

    if (isCreatingNew) {
      const newUser: SystemUser = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: formRole,
        status: formStatus,
        password: formPassword,
        avatarUrl: formAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=2563eb&color=fff&size=120`,
        isSuperAdmin: formRole === 'Super Administrator'
      };
      updatedList = [...users, newUser];

      addAuditLog({
        aksi: 'UPDATE',
        kategori: 'Manajemen Pengguna',
        subjek: cleanName,
        detail: `Penambahan akun baru: ${cleanName} (${cleanEmail} - ${formRole})`,
        operator: currentUser.email,
        status: 'SUCCESS'
      });

      // Simpan ke Supabase users
      saveUserProfileToSupabase({
        email: cleanEmail,
        name: cleanName,
        role: formRole,
        avatarUrl: newUser.avatarUrl
      }).catch(() => {});

    } else if (editingUser) {
      const isCurrentActiveUser = editingUser.email.toLowerCase() === currentUser.email.toLowerCase() || editingUser.isSuperAdmin;

      updatedList = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: cleanName,
            email: cleanEmail,
            role: formRole,
            status: formStatus,
            avatarUrl: formAvatar,
            ...(formPassword ? { password: formPassword } : {})
          };
        }
        return u;
      });

      // Jika yang diedit adalah akun diri sendiri yang sedang login (Superadmin):
      if (isCurrentActiveUser) {
        const updatedSelf = {
          name: cleanName,
          email: cleanEmail,
          role: formRole,
          avatarUrl: formAvatar
        };

        onUpdateCurrentUser(updatedSelf);

        // Update kredensial admin login di localStorage
        const adminAccRaw = localStorage.getItem('EARSIP_ADMIN_ACCOUNT');
        const adminAcc = adminAccRaw ? JSON.parse(adminAccRaw) : {};
        const newAdminAcc = {
          ...adminAcc,
          name: cleanName,
          email: cleanEmail,
          role: formRole,
          avatarUrl: formAvatar,
          ...(formPassword ? { password: formPassword } : {})
        };
        localStorage.setItem('EARSIP_ADMIN_ACCOUNT', JSON.stringify(newAdminAcc));
      }

      addAuditLog({
        aksi: 'UPDATE',
        kategori: 'Manajemen Pengguna',
        subjek: cleanName,
        detail: `Pembaruan akun ${cleanName} (${cleanEmail} - ${formRole})${formPassword ? ' & ganti kata sandi' : ''}`,
        operator: currentUser.email,
        status: 'SUCCESS'
      });

      // Simpan ke Supabase users
      saveUserProfileToSupabase({
        email: cleanEmail,
        name: cleanName,
        role: formRole,
        avatarUrl: formAvatar
      }).catch(() => {});
    } else {
      return;
    }

    setUsers(updatedList);
    saveStoredUserList(updatedList);

    setMessage({ type: 'success', text: `✓ Akun ${cleanName} berhasil disimpan dan disinkronkan ke sistem!` });
    setTimeout(() => {
      handleCancelForm();
    }, 800);
  };

  const handleDeleteUser = (user: SystemUser) => {
    if (user.isSuperAdmin || user.email === currentUser.email) {
      alert('Akun Super Administrator utama tidak dapat dihapus demi keamanan sistem!');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun ${user.name} (${user.email})?`)) {
      return;
    }

    const filtered = users.filter(u => u.id !== user.id);
    setUsers(filtered);
    saveStoredUserList(filtered);

    addAuditLog({
      aksi: 'DELETE',
      kategori: 'Manajemen Pengguna',
      subjek: user.name,
      detail: `Penghapusan akun pengguna: ${user.name} (${user.email})`,
      operator: currentUser.email,
      status: 'WARNING'
    });

    setMessage({ type: 'success', text: `Akun ${user.name} berhasil dihapus dari sistem.` });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl animate-scaleUp text-white relative flex flex-col max-h-[92vh]">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-60 h-20 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Manajemen Pengguna</h3>
              <p className="text-xs text-slate-400">Daftar akun berwenang & hak akses sistem E-Arsip</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Notification */}
        {message && (
          <div className={`p-3 mb-3 rounded-2xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn relative z-10 ${
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

        {/* Modal Content: FORM or LIST */}
        <div className="flex-1 overflow-y-auto pr-1 relative z-10">
          
          {/* ============================================================== */}
          {/* A. EDIT / CREATE FORM                                          */}
          {/* ============================================================== */}
          {(editingUser || isCreatingNew) ? (
            <form onSubmit={handleSaveUser} className="space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Daftar</span>
                </button>
                <span className="text-xs font-bold text-cyan-400">
                  {isCreatingNew ? 'Tambah Akun Baru' : `Edit Akun: ${editingUser?.name}`}
                </span>
              </div>

              {/* Avatar Uploader */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={formAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formName || 'User')}&background=2563eb&color=fff&size=100`}
                    alt="Avatar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Ubah</span>
                  </button>
                </div>

                <div className="flex-1 space-y-1.5">
                  <span className="text-xs font-bold text-white block">Foto Profil Pengguna</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Unggah Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(formName || 'User')}&background=2563eb&color=fff&size=100`)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-all cursor-pointer border border-slate-700"
                    >
                      Inisial
                    </button>
                  </div>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Solikhin Mbolo"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Email / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Email / Username Login
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@alhicam.sch.id"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Peran / Hak Akses
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value="Super Administrator">Super Administrator (Akses Penuh)</option>
                    <option value="Administrator Arsip">Administrator Arsip</option>
                    <option value="Admin Guru & TIK">Admin Guru & TIK</option>
                    <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                    <option value="Operator Madrasah">Operator Madrasah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                  >
                    <option value="Aktif">Aktif (Bisa Login)</option>
                    <option value="Nonaktif">Nonaktif (Ditangguhkan)</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    {isCreatingNew ? 'Kata Sandi / Password *' : 'Ganti Password (Kosongkan jika tidak diubah)'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={isCreatingNew ? 'Minimal 6 karakter' : 'Masukkan password baru jika ingin diganti'}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Akun</span>
                </button>
              </div>

            </form>
          ) : (
            /* ============================================================== */
            /* B. USERS LIST VIEW                                             */
            /* ============================================================== */
            <div className="space-y-3">
              
              {/* Header Action Bar */}
              <div className="flex items-center justify-between mb-3 px-0.5">
                <span className="text-xs font-semibold text-slate-400">
                  Total {users.length} Akun Terdaftar
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>

              {/* Users Cards */}
              {users.map((u) => {
                const isCurrent = u.email.toLowerCase() === currentUser.email.toLowerCase() || u.isSuperAdmin;

                return (
                  <div 
                    key={u.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-500/40 shadow-sm shadow-blue-500/10' 
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <img
                        src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2563eb&color=fff&size=100`}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-xs sm:text-sm font-bold text-white truncate">{u.name}</strong>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 bg-blue-500/20 text-cyan-300 border border-blue-500/40 rounded text-[9px] font-bold">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block truncate">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden xs:block">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 block">
                          {u.role}
                        </span>
                        <span className={`text-[10px] font-semibold block mt-0.5 ${u.status === 'Aktif' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          ● {u.status}
                        </span>
                      </div>

                      {/* Action Buttons: Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(u)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
                          title={`Edit Data ${u.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {!u.isSuperAdmin && u.email !== currentUser.email && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm"
                            title={`Hapus Akun ${u.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        {!editingUser && !isCreatingNew && (
          <div className="pt-4 border-t border-slate-800 mt-4 relative z-10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Perubahan tersinkron otomatis ke sistem
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Tutup Panel
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
