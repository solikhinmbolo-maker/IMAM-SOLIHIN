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
  FileText,
  BookOpen,
  Stamp,
  History,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';
import FormUploadView from './components/FormUploadView';
import FormUnduhView from './components/FormUnduhView';
import RekapArsipView from './components/RekapArsipView';
import BukuIndukView from './components/BukuIndukView';
import LegalisirView from './components/LegalisirView';
import AuditLogView from './components/AuditLogView';
import LaporanView from './components/LaporanView';
import PreviewModal from './components/PreviewModal';
import { 
  ArsipItem, 
  DB_KEYS, 
  getStoredSyncConfig, 
  saveStoredSyncConfig, 
  GoogleSyncConfig,
  clearAllArsipData,
  restoreSampleArsipData,
  getStoredArsip,
  syncItemToGoogleCloud
} from './data/mockDatabase';

type ActivePage = 'dashboard' | 'upload' | 'unduh' | 'rekap' | 'buku-induk' | 'legalisir' | 'audit-log' | 'laporan';
type SubKategori = 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';

// Isolated live clock component so ticking every second doesn't re-render entire page/charts
function LiveClock() {
  const [timeStr, setTimeStr] = useState('');

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

      setTimeStr(`${dayName}, ${date} ${monthName} ${year} | ${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{timeStr || 'Memuat waktu...'}</span>;
}

// 30 Minutes Inactivity Timeout in milliseconds (30 * 60 * 1000)
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export default function App() {
  // Session expired notice message
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<string>('');

  // Auth state: Default MUST LOGIN FIRST (null) unless there is a fresh session verified within 30 min
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.AUTH_USER);
      const lastActive = localStorage.getItem('EARSIP_LAST_ACTIVE_TIME');
      if (saved && lastActive) {
        const timeDiff = Date.now() - parseInt(lastActive, 10);
        if (timeDiff < INACTIVITY_TIMEOUT_MS) {
          return JSON.parse(saved);
        }
      }
    } catch {}
    // Security by default: Always require login when opened fresh
    return null;
  });

  const [lastActiveTime, setLastActiveTime] = useState<number>(Date.now());

  // Real-time Inactivity Auto-Logout Tracker (30 Menit)
  useEffect(() => {
    if (!currentUser) return;

    const recordActivity = () => {
      const now = Date.now();
      setLastActiveTime(now);
      localStorage.setItem('EARSIP_LAST_ACTIVE_TIME', now.toString());
    };

    // User activity events: mouse movement, keystroke, touch, click, scroll
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    let lastThrottledTime = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle event updating every 4 seconds to prevent CPU overhead
      if (now - lastThrottledTime > 4000) {
        lastThrottledTime = now;
        recordActivity();
      }
    };

    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Periodic check every 10 seconds whether 30 minutes of inactivity has passed
    const timerInterval = setInterval(() => {
      const savedLast = localStorage.getItem('EARSIP_LAST_ACTIVE_TIME');
      const lastTime = savedLast ? parseInt(savedLast, 10) : lastActiveTime;
      const elapsed = Date.now() - lastTime;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        // Automatically logout user after 30 minutes idle
        localStorage.removeItem(DB_KEYS.AUTH_USER);
        localStorage.removeItem('EARSIP_LAST_ACTIVE_TIME');
        setCurrentUser(null);
        setSessionExpiredNotice('⚠️ Sesi Anda telah kedaluwarsa otomatis karena tidak ada aktivitas selama 30 menit demi keamanan sistem. Silakan login kembali.');
      }
    }, 10000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      clearInterval(timerInterval);
    };
  }, [currentUser, lastActiveTime]);

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

  // Google Sync Config
  const [syncConfig, setSyncConfig] = useState<GoogleSyncConfig>(() => getStoredSyncConfig());
  const [copiedGAS, setCopiedGAS] = useState(false);
  const [testConnStatus, setTestConnStatus] = useState<string>('');
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [dbVersion, setDbVersion] = useState(0);

  const handleCopyGAS = () => {
    const code = `// ================================================================
// GOOGLE APPS SCRIPT WEBHOOK E-ARSIP SMP AL-HIKAM
// ================================================================

// 1. JALANKAN FUNGSI INI SEKALI (KLIK RUN/JALANKAN) DI EDITOR APPS SCRIPT:
// Berfungsi untuk mengizinkan hak akses Google Sheet dan otomatis
// membuat 4 Tab: REKAP_SEMUA_ARSIP, ARSIP_SISWA, ARSIP_GURU, ARSIP_LAINNYA
function setupDatabaseDanIzin() {
  var sheetId = '1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE';
  var ss = SpreadsheetApp.openById(sheetId);
  var headers = [
    'ID ARSIP', 'TANGGAL UPLOAD', 'TAHUN / ANGKATAN', 'IDENTITAS (NISN/NUPTK)', 
    'NAMA SUBJEK', 'KATEGORI DOKUMEN', 'KATEGORI UTAMA', 'NAMA FILE ASLI', 
    'UKURAN', 'UPLOADER', 'LINK GOOGLE DRIVE'
  ];
  getOrCreateSheet(ss, 'REKAP_SEMUA_ARSIP', headers);
  getOrCreateSheet(ss, 'ARSIP_SISWA', headers);
  getOrCreateSheet(ss, 'ARSIP_GURU', headers);
  getOrCreateSheet(ss, 'ARSIP_LAINNYA', headers);
  Logger.log('BERHASIL! 4 Tab database telah otomatis disiapkan di: ' + ss.getName());
}

// 2. WEBHOOK OTOMATIS SAAT ADA DOKUMEN DIUNGGAH DARI APLIKASI WEB
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var rootFolderId = data.folderId || '1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x';
    var sheetId = data.spreadsheetId || '1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE';
    
    // -------------------------------------------------------------
    // A. SIMPAN FILE KE SUBFOLDER GOOGLE DRIVE OTOMATIS
    // -------------------------------------------------------------
    var rootFolder = DriveApp.getFolderById(rootFolderId);

    // Kategori Utama: 1. ARSIP SISWA / 2. ARSIP GURU / 3. ARSIP LAINNYA
    var subfolderName = '3. ARSIP LAINNYA';
    if (data.kategoriUtama === 'Arsip Siswa') {
      subfolderName = '1. ARSIP SISWA';
    } else if (data.kategoriUtama === 'Arsip Guru') {
      subfolderName = '2. ARSIP GURU & PTK';
    }
    var categoryFolder = getOrCreateFolder(rootFolder, subfolderName);
    
    // Subfolder Angkatan untuk Siswa
    var targetFolder = categoryFolder;
    if (data.tahun && data.tahun !== '-') {
      targetFolder = getOrCreateFolder(categoryFolder, 'Angkatan ' + data.tahun);
    }

    // Buat & Simpan File Fisik
    var fileUrl = '-';
    if (data.fileData && data.fileData.indexOf('base64,') > -1) {
      var split = data.fileData.split('base64,');
      var contentType = split[0].split(':')[1].split(';')[0];
      var bytes = Utilities.base64Decode(split[1]);
      var cleanFileName = (data.subjek ? data.subjek + ' - ' : '') + (data.kategori || 'Dokumen') + ' - ' + (data.namaFile || 'arsip.pdf');
      var blob = Utilities.newBlob(bytes, contentType, cleanFileName);
      
      var file = targetFolder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    // -------------------------------------------------------------
    // B. SIMPAN REKAP BARIS KE GOOGLE SPREADSHEET OTOMATIS
    // -------------------------------------------------------------
    var ss = SpreadsheetApp.openById(sheetId);
    var headers = [
      'ID ARSIP', 'TANGGAL UPLOAD', 'TAHUN / ANGKATAN', 'IDENTITAS (NISN/NUPTK)', 
      'NAMA SUBJEK', 'KATEGORI DOKUMEN', 'KATEGORI UTAMA', 'NAMA FILE ASLI', 
      'UKURAN', 'UPLOADER', 'LINK GOOGLE DRIVE'
    ];

    var rowData = [
      data.id || ('ARS-' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd-HHmmss')),
      data.tanggal || Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm:ss'),
      data.tahun || '-',
      data.identitas || '-',
      data.subjek || '-',
      data.kategori || '-',
      data.kategoriUtama || 'Arsip Siswa',
      data.namaFile || '-',
      data.ukuran || '-',
      data.uploader || 'Admin',
      fileUrl
    ];

    // 1. Simpan ke Tab Utama 'REKAP_SEMUA_ARSIP'
    var sheetSemua = getOrCreateSheet(ss, 'REKAP_SEMUA_ARSIP', headers);
    sheetSemua.appendRow(rowData);

    // 2. Simpan juga ke Tab Kategori
    var tabName = data.kategoriUtama === 'Arsip Siswa' ? 'ARSIP_SISWA' : data.kategoriUtama === 'Arsip Guru' ? 'ARSIP_GURU' : 'ARSIP_LAINNYA';
    var sheetKategori = getOrCreateSheet(ss, tabName, headers);
    sheetKategori.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      driveUrl: fileUrl,
      message: 'Berhasil diarsipkan ke Google Drive & Sheet!'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Cari atau Buat Subfolder Otomatis di Google Drive
function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parent.createFolder(name);
}

// Helper: Cari atau Buat Tab Sheet Otomatis dengan Format Biru Gelap
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    var defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
    if (defaultSheet && defaultSheet.getLastRow() === 0) {
      defaultSheet.setName(name);
      sheet = defaultSheet;
    } else {
      sheet = ss.insertSheet(name);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    for (var i = 1; i <= headers.length; i++) {
      try { sheet.autoResizeColumn(i); } catch(eResize) {}
    }
  }
  return sheet;
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'Webhook E-Arsip SMP Al-Hikam Aktif!'
  })).setMimeType(ContentService.MimeType.JSON);
}`;

    navigator.clipboard.writeText(code);
    setCopiedGAS(true);
    setTimeout(() => setCopiedGAS(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!syncConfig.webhookUrl) {
      setTestConnStatus('⚠️ Masukkan URL Webhook terlebih dahulu!');
      return;
    }
    setIsTestingConn(true);
    setTestConnStatus('Sedang memeriksa respon webhook...');
    try {
      const res = await fetch(syncConfig.webhookUrl);
      const data = await res.json();
      if (data && data.status === 'online') {
        setTestConnStatus('✅ Terhubung! Webhook Google Apps Script aktif & online.');
      } else {
        setTestConnStatus('✅ Terhubung ke Webhook Google Apps Script!');
      }
    } catch (e: any) {
      setTestConnStatus('⚠️ Belum merespon. Pastikan Webhook di-deploy dengan akses "Anyone / Siapa saja".');
    } finally {
      setIsTestingConn(false);
    }
  };

  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [bulkSyncStatus, setBulkSyncStatus] = useState('');

  const handleBulkSyncToSheet = async () => {
    if (!syncConfig.webhookUrl) {
      alert('⚠️ Mohon masukkan URL Webhook terlebih dahulu!');
      return;
    }
    const items = getStoredArsip();
    if (items.length === 0) {
      alert('Tidak ada arsip untuk disinkronkan. Unggah dokumen terlebih dahulu.');
      return;
    }

    setIsBulkSyncing(true);
    setBulkSyncStatus(`Menyinkronkan 0/${items.length} berkas ke Spreadsheet...`);
    let successCount = 0;

    for (let i = 0; i < items.length; i++) {
      setBulkSyncStatus(`Mengirim baris (${i + 1}/${items.length}): ${items[i].subjek}...`);
      try {
        const res = await syncItemToGoogleCloud(items[i]);
        if (res.success) successCount++;
      } catch (e) {
        console.warn('Sync item failed:', items[i].id, e);
      }
    }

    setIsBulkSyncing(false);
    setBulkSyncStatus(`✅ Berhasil menyinkronkan ${successCount} dari ${items.length} berkas ke Spreadsheet!`);
    setTimeout(() => setBulkSyncStatus(''), 7000);
  };

  const handleSaveSettings = () => {
    saveStoredSyncConfig(syncConfig);
    setShowSettingModal(false);
  };

  const handleLoginSuccess = (user: { email: string; name: string; role: string }) => {
    setCurrentUser(user);
    const now = Date.now();
    localStorage.setItem(DB_KEYS.AUTH_USER, JSON.stringify(user));
    localStorage.setItem('EARSIP_LAST_ACTIVE_TIME', now.toString());
    setSessionExpiredNotice('');
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(DB_KEYS.AUTH_USER);
    localStorage.removeItem('EARSIP_LAST_ACTIVE_TIME');
    setCurrentUser(null);
    setShowLogoutModal(false);
    setMobileProfileSheetOpen(false);
    setSessionExpiredNotice('');
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} sessionNotice={sessionExpiredNotice} />;
  }

  // Titles mapping
  const pageTitles: { [key in ActivePage]: string } = {
    dashboard: 'Dashboard Executive',
    upload: `Upload Dokumen (${activeSubKategori})`,
    unduh: `Unduh Dokumen (${activeSubKategori})`,
    rekap: 'Matriks Rekap Kelengkapan Berkas',
    'buku-induk': 'Buku Induk Digital (Siswa & Guru)',
    legalisir: 'Verifikasi & Legalisir Digital',
    'audit-log': 'Log & Jejak Audit Pengarsipan',
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

          {/* Buku Induk Digital (Siswa & Guru) */}
          <button
            onClick={() => {
              setActivePage('buku-induk');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'buku-induk'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Buku Induk Digital</span>
          </button>

          {/* Verifikasi & Legalisir */}
          <button
            onClick={() => {
              setActivePage('legalisir');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'legalisir'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Stamp className="w-4 h-4" />
            <span>Verifikasi & Legalisir</span>
          </button>

          {/* Log Aktivitas & Audit */}
          <button
            onClick={() => {
              setActivePage('audit-log');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activePage === 'audit-log'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Log Aktivitas & Audit</span>
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
                <LiveClock />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* 30-Min Idle Protection Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Proteksi Sesi 30 Menit Aktif</span>
            </div>

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
              key={dbVersion}
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

          {activePage === 'buku-induk' && (
            <BukuIndukView
              onNavigateToArsip={(sub, nama) => {
                setActivePage('unduh');
                setActiveSubKategori(sub);
              }}
            />
          )}

          {activePage === 'legalisir' && (
            <LegalisirView />
          )}

          {activePage === 'audit-log' && (
            <AuditLogView />
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

      {/* 8. MODAL PENGATURAN SISTEM & SINKRONISASI GOOGLE */}
      {showSettingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sinkronisasi Google Drive & Sheet</h3>
                  <p className="text-xs text-slate-500">Hubungkan penyimpanan arsip fisik dan rekap database</p>
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
              
              {/* Webhook URL Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. URL Webhook Google Apps Script (Web App URL)
                </label>
                <input
                  type="text"
                  value={syncConfig.webhookUrl}
                  onChange={(e) => setSyncConfig({ ...syncConfig, webhookUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-purple-600"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Didapat setelah mengklik <strong>Deploy &gt; New Deployment &gt; Web App</strong> di Google Sheets Anda.
                </span>
              </div>

              {/* Folder ID and Sheet ID */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                      ID Folder Google Drive
                    </label>
                    <a
                      href={`https://drive.google.com/drive/folders/${syncConfig.folderId || '1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <span>Buka Folder Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={syncConfig.folderId}
                    onChange={(e) => setSyncConfig({ ...syncConfig, folderId: e.target.value })}
                    placeholder="1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                    ✓ Folder E-Arsip Al-Hikam Aktif
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      ID Google Spreadsheet
                    </label>
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${syncConfig.spreadsheetId || '1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE'}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <span>Buka Spreadsheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={syncConfig.spreadsheetId}
                    onChange={(e) => setSyncConfig({ ...syncConfig, spreadsheetId: e.target.value })}
                    placeholder="1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                    ✓ Spreadsheet Database Siswa & Guru Aktif
                  </span>
                </div>
              </div>

              {/* Action Buttons: Copy Script & Test */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <strong className="text-xs text-purple-900 block font-bold">Kode Script Google (Apps Script)</strong>
                    <span className="text-[11px] text-purple-700">Tinggal copy dan paste di menu Ekstensi Google Sheet Anda</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyGAS}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedGAS ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedGAS ? 'Tersalin ke Clipboard!' : 'Salin Kode Script'}</span>
                  </button>
                </div>

                {syncConfig.webhookUrl && (
                  <>
                    <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-slate-600">Periksa kesiapan koneksi:</span>
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingConn}
                        className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-semibold cursor-pointer"
                      >
                        {isTestingConn ? 'Menguji...' : '⚡ Uji Respon Webhook'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <strong className="text-xs text-emerald-900 block font-bold">Sinkronkan Berkas ke Spreadsheet</strong>
                        <span className="text-[10px] text-emerald-700">Kirim ulang berkas lokal yang belum tercatat ke tabel Sheet</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBulkSyncToSheet}
                        disabled={isBulkSyncing}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                        <span>{isBulkSyncing ? 'Menyinkronkan...' : 'Kirim Semua ke Sheet'}</span>
                      </button>
                    </div>
                  </>
                )}

                {bulkSyncStatus && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] font-semibold text-emerald-800 border border-emerald-300 animate-fadeIn">
                    {bulkSyncStatus}
                  </div>
                )}

                {testConnStatus && (
                  <div className="p-2.5 bg-white/90 rounded-xl text-[11px] font-semibold text-slate-800 border border-purple-200">
                    {testConnStatus}
                  </div>
                )}
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                ✓ <strong>Mode Fleksibel:</strong> Jika Webhook belum disetel, aplikasi tetap menyimpan dokumen secara lokal di IndexedDB agar arsip tidak pernah hilang. Saat Webhook sudah disetel, file fisik otomatis terunggah ke Google Drive Anda!
              </div>

              {/* Basis Data Control: Kosongkan Demo / Mulai dari 0 */}
              <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <strong className="text-xs text-rose-900 block font-bold">Status Data E-Arsip Sekolah</strong>
                    <span className="text-[11px] text-rose-700">
                      Bersihkan 13 data arsip contoh demo agar Dashboard mulai bersih dari angka 0.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Kosongkan semua data arsip demo agar dashboard mulai dari angka 0?')) {
                          clearAllArsipData();
                          setDbVersion(v => v + 1);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Kosongkan Data (Mulai dari 0)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        restoreSampleArsipData();
                        setDbVersion(v => v + 1);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100/60 font-semibold text-xs cursor-pointer"
                      title="Muat Ulang Contoh Data Demo"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSettingModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Simpan Pengaturan
              </button>
            </div>
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
