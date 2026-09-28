import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CloudUpload, 
  CloudDownload, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Settings, 
  Power, 
  Menu, 
  X, 
  ChevronDown, 
  Shield,
  ArrowLeft,
  ChevronRight,
  HardDrive,
  Database,
  ExternalLink,
  Sparkles,
  FileText
} from 'lucide-react';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';
import FormUploadView from './components/FormUploadView';
import FormUnduhView from './components/FormUnduhView';
import RekapArsipView from './components/RekapArsipView';
import LaporanView from './components/LaporanView';
import PreviewModal from './components/PreviewModal';
import { ArsipItem, DB_KEYS } from './data/mockDatabase';

type ActivePage = 'dashboard' | 'upload' | 'unduh' | 'rekap' | 'laporan';
type SubKategori = 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      email: 'admin@alhicam.sch.id',
      name: 'Solikhin Mbolo',
      role: 'Super Administrator'
    };
  });

  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [activeSubKategori, setActiveSubKategori] = useState<SubKategori>('Arsip Siswa');

  // Accordion Menus in Sidebar
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [unduhMenuOpen, setUnduhMenuOpen] = useState(false);

  // Mobile sidebar drawer & profile sheet
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileProfileSheetOpen, setMobileProfileSheetOpen] = useState(false);

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<ArsipItem | null>(null);

  // Live Clock (WIB)
  const [clockString, setClockString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

      const dayName = days[now.getDay()];
      const date = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setClockString(`${dayName}, ${date} ${monthName} ${year} | ${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (user: { email: string; name: string; role: string }) => {
    setCurrentUser(user);
    localStorage.setItem(DB_KEYS.AUTH_USER, JSON.stringify(user));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(DB_KEYS.AUTH_USER);
    setCurrentUser(null);
    setShowLogoutModal(false);
    setMobileProfileSheetOpen(false);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Titles mapping
  const pageTitles: { [key in ActivePage]: string } = {
    dashboard: 'Dashboard Executive',
    upload: `Upload Dokumen (${activeSubKategori})`,
    unduh: `Unduh Dokumen (${activeSubKategori})`,
    rekap: 'Matriks Rekap Kelengkapan Berkas',
    laporan: 'Statistik & Laporan Arsip'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins'] text-slate-800 antialiased selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
      
      {/* 1. MOBILE DRAWER OVERLAY */}
      {(mobileSidebarOpen || mobileProfileSheetOpen) && (
        <div 
          onClick={() => {
            setMobileSidebarOpen(false);
            setMobileProfileSheetOpen(false);
          }}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 2. SIDEBAR NAVIGATION (DESKTOP & ACCESSIBLE AS DRAWER) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header with Logo */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co.com/Jw175yjb/file-00000000c4287208bc89c0bb125befc2-1.png" 
              alt="Logo SMP Al-Hikam" 
              className="w-10 h-10 object-contain drop-shadow"
            />
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white">DIGITAL_ARSIP</h2>
              <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest">smp al-hikam</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActivePage('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Upload Dokumen Accordion */}
          <div>
            <button
              onClick={() => setUploadMenuOpen(!uploadMenuOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activePage === 'upload'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CloudUpload className="w-4 h-4" />
                <span>Upload Dokumen</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${uploadMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {uploadMenuOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1">
                {(['Arsip Siswa', 'Arsip Guru', 'Arsip Lainnya'] as const).map(sub => (
                  <button
                    key={sub}
                    onClick={() => {
                      setActivePage('upload');
                      setActiveSubKategori(sub);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activePage === 'upload' && activeSubKategori === sub
                        ? 'text-blue-400 bg-blue-500/15 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unduh Dokumen Accordion */}
          <div>
            <button
              onClick={() => setUnduhMenuOpen(!unduhMenuOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activePage === 'unduh'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CloudDownload className="w-4 h-4" />
                <span>Unduh Dokumen</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${unduhMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {unduhMenuOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1">
                {(['Arsip Siswa', 'Arsip Guru', 'Arsip Lainnya'] as const).map(sub => (
                  <button
                    key={sub}
                    onClick={() => {
                      setActivePage('unduh');
                      setActiveSubKategori(sub);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activePage === 'unduh' && activeSubKategori === sub
                        ? 'text-blue-400 bg-blue-500/15 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rekap Arsip */}
          <button
            onClick={() => {
              setActivePage('rekap');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'rekap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Rekap Arsip</span>
          </button>

          {/* Divider */}
          <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            MANAJEMEN & LAPORAN
          </div>

          {/* Statistik & Laporan */}
          <button
            onClick={() => {
              setActivePage('laporan');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'laporan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistik & Laporan</span>
          </button>

          {/* Manajemen User */}
          <button
            onClick={() => {
              setShowUserModal(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Manajemen User</span>
          </button>

          {/* Pengaturan Sistem */}
          <button
            onClick={() => {
              setShowSettingModal(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Sistem</span>
          </button>
        </div>

        {/* Sidebar Footer System Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">E-Arsip V1.0</p>
              <p className="text-[10px] text-slate-400">SMP Al-Hikam Jombang</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-8 w-full max-w-full overflow-x-hidden">
        
        {/* ============================================================== */}
        {/* DESKTOP HEADER (TETAP SAMA PERSIS DENGAN YANG DISUKAI USER)     */}
        {/* ============================================================== */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-xl border-b-2 border-blue-500/70 text-white px-8 py-3.5 shadow-md items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                {pageTitles[activePage]}
              </h1>
              <p className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{clockString || 'Memuat waktu...'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex flex-col items-center justify-center text-red-400 hover:text-red-300 transition-transform active:scale-95 cursor-pointer group"
              title="Keluar dari Sistem"
            >
              <div className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 transition-colors">
                <Power className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-red-400 mt-1 uppercase tracking-wider">Logout</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-700/80">
              <div className="text-right">
                <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-cyan-400 font-semibold block">{currentUser.role}</span>
              </div>
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?name=Solikhin+Mbolo&background=3b82f6&color=fff&size=100"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white/80 object-cover shadow"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online" />
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================== */}
        {/* REFINED MOBILE HEADER (ORIGINAL DARK WITH RICH GRADIENT & GLOW)*/}
        {/* ============================================================== */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#080E21] via-[#0F1B3E] to-[#0A132C] text-white px-4 sm:px-6 py-4 border-b-2 border-blue-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
          
          {/* Subtle Ambient Gradient Light Reflections (No stiff solid color) */}
          <div className="absolute -top-10 left-1/4 w-48 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 right-12 w-40 h-20 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            {activePage === 'dashboard' ? (
              /* Brand & Logo with deep gradient and clean typography */
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-md shadow-blue-500/30 flex items-center justify-center flex-shrink-0 border border-white/20">
                  <img 
                    src="https://i.ibb.co.com/Jw175yjb/file-00000000c4287208bc89c0bb125befc2-1.png" 
                    alt="Logo SMP Al-Hikam" 
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-extrabold tracking-tight text-white leading-none drop-shadow-sm">
                      E-ARSIP AL-HICAM
                    </h1>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-1">
                    SMP Al-Hikam • Digital Portal
                  </p>
                </div>
              </div>
            ) : (
              /* Contextual Sub-page Header with Back Navigation */
              <button
                onClick={() => setActivePage('dashboard')}
                className="flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-200 shadow-sm">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block leading-none">Kembali</span>
                  <span className="text-sm font-bold text-white block mt-0.5 max-w-[210px] truncate">
                    {pageTitles[activePage].split('(')[0]}
                  </span>
                </div>
              </button>
            )}

            {/* Right: Single Refined Profile Pill Trigger */}
            <button
              onClick={() => setMobileProfileSheetOpen(true)}
              className="flex items-center gap-2.5 p-1 pl-3 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white active:scale-95 transition-all cursor-pointer shadow-md"
              title="Profil & Opsi Cepat"
            >
              <div className="text-right hidden xs:block">
                <span className="text-[11px] font-bold text-white block leading-none truncate max-w-[90px]">Pak Solikhin</span>
                <span className="text-[9px] text-cyan-400 font-medium leading-none block mt-0.5">Admin</span>
              </div>
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?name=Solikhin+Mbolo&background=3b82f6&color=fff&size=100"
                  alt="Avatar"
                  className="w-7 h-7 rounded-full border border-blue-400 object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
              </div>
            </button>
          </div>
        </header>

        {/* View Contents with top padding for fixed header in mobile */}
        <div className="p-3.5 sm:p-8 pt-[82px] lg:pt-8 flex-1 w-full max-w-full overflow-x-hidden">
          {activePage === 'dashboard' && (
            <DashboardView
              onNavigate={(page, sub) => {
                setActivePage(page);
                if (sub) setActiveSubKategori(sub);
              }}
            />
          )}

          {activePage === 'upload' && (
            <FormUploadView
              initialJenis={activeSubKategori}
              onUploadSuccess={() => setActivePage('unduh')}
              onCancel={() => setActivePage('dashboard')}
            />
          )}

          {activePage === 'unduh' && (
            <FormUnduhView
              kategoriMenu={activeSubKategori}
              onPreview={(item) => setPreviewItem(item)}
            />
          )}

          {activePage === 'rekap' && (
            <RekapArsipView
              onPreview={(item) => setPreviewItem(item)}
            />
          )}

          {activePage === 'laporan' && (
            <LaporanView
              onPreview={(item) => setPreviewItem(item)}
            />
          )}
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. MODERN MOBILE PROFILE & UTILITY SHEET (MODERN EXECUTIVE MENU) */}
      {/* ============================================================== */}
      {mobileProfileSheetOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-slate-800 text-white rounded-t-3xl p-5 shadow-2xl animate-scaleUp lg:hidden">
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

          {/* User info card */}
          <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-800">
            <img
              src="https://ui-avatars.com/api/?name=Solikhin+Mbolo&background=3b82f6&color=fff&size=100"
              alt="Avatar"
              className="w-12 h-12 rounded-2xl border-2 border-blue-500 object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={() => setMobileProfileSheetOpen(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action options list */}
          <div className="space-y-1 mb-4">
            <button
              onClick={() => {
                setMobileProfileSheetOpen(false);
                setShowSettingModal(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Pengaturan Sistem & Database</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                setMobileProfileSheetOpen(false);
                setShowUserModal(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Manajemen Hak Akses Pengguna</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => {
                setMobileProfileSheetOpen(false);
                setMobileSidebarOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Menu className="w-4 h-4" />
                </div>
                <span>Buka Menu Navigasi Lengkap</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              setMobileProfileSheetOpen(false);
              setShowLogoutModal(true);
            }}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Power className="w-4 h-4" />
            <span>Keluar dari Akun (Logout)</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. REFINED FLOATING BOTTOM NAVIGATION (MINIMALIST & NATIVE FEEL)*/}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex lg:hidden items-center justify-around py-1.5 px-2">
        {/* Dashboard */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activePage === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activePage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
          }`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* Upload */}
        <button
          onClick={() => {
            setActivePage('upload');
            setActiveSubKategori('Arsip Siswa');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activePage === 'upload'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activePage === 'upload' ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
          }`}>
            <CloudUpload className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Upload</span>
        </button>

        {/* Unduh */}
        <button
          onClick={() => {
            setActivePage('unduh');
            setActiveSubKategori('Arsip Siswa');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activePage === 'unduh'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activePage === 'unduh' ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
          }`}>
            <CloudDownload className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Unduh</span>
        </button>

        {/* Rekap */}
        <button
          onClick={() => setActivePage('rekap')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activePage === 'rekap'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activePage === 'rekap' ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
          }`}>
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Rekap</span>
        </button>

        {/* Laporan */}
        <button
          onClick={() => setActivePage('laporan')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activePage === 'laporan'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activePage === 'laporan' ? 'bg-blue-50 text-blue-600' : 'bg-transparent'
          }`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Laporan</span>
        </button>
      </nav>

      {/* 6. MODAL KONFIRMASI LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-scaleUp text-white">
            <div className="w-14 h-14 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Power className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1">Konfirmasi Logout</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem E-Arsip Al-Hicam?
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL MANAJEMEN USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Manajemen Pengguna</h3>
                  <p className="text-xs text-slate-500">Daftar akun berwenang sistem E-Arsip</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { name: 'Solikhin Mbolo', email: 'admin@alhicam.sch.id', role: 'Super Administrator', status: 'Aktif' },
                { name: 'Operator Tata Usaha', email: 'solikhin@alhicam.sch.id', role: 'Administrator Arsip', status: 'Aktif' },
                { name: 'Nurul Hidayah, S.Kom', email: 'nurul@alhicam.sch.id', role: 'Admin Guru & TIK', status: 'Aktif' }
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-slate-900 block">{u.name}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 block">
                      {u.role}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">● {u.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Tutup Panel
            </button>
          </div>
        </div>
      )}

      {/* 8. MODAL PENGATURAN SISTEM */}
      {showSettingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pengaturan Sistem E-Arsip</h3>
                  <p className="text-xs text-slate-500">Konfigurasi penyimpanan Cloud & Database</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block mb-1">Google Drive Root Folder ID:</span>
                <span className="font-mono text-slate-900 font-bold select-all">1M_Ry_o-q7JGeXRfYdlpE8E2AuF_aOE8f</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block mb-1">Google Spreadsheet Database ID:</span>
                <span className="font-mono text-slate-900 font-bold select-all">1ew4gfR53zeBdAcf57wWNdOmE9NiZjsvZikXgSxNHwEQ</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-0.5">Zona Waktu:</span>
                  <span className="font-medium text-slate-900">Asia/Jakarta (WIB)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-500 block mb-0.5">Maks. File Upload:</span>
                  <span className="font-medium text-slate-900">10 MB / Berkas</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                ✓ Sistem berjalan dengan sinkronisasi lokal instan dan siap dihubungkan langsung ke webhook Google Apps Script ataupun REST API.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Simpan & Tutup
            </button>
          </div>
        </div>
      )}

      {/* 9. PREVIEW DOKUMEN MODAL */}
      <PreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onPrint={(item) => {
          window.print();
        }}
        onDownload={(item) => {
          const element = document.createElement('a');
          const fileContent = item.fileDataUrl || `data:text/plain;charset=utf-8,Dokumen E-Arsip Al-Hicam\nNama: ${item.subjek}\nKategori: ${item.kategori}\nTahun: ${item.tahun}\nID: ${item.id}`;
          element.setAttribute('href', fileContent);
          element.setAttribute('download', item.namaFileAsli || `${item.subjek}_${item.kategori}.txt`);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
      />

    </div>
  );
}
