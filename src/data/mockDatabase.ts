export interface MasterSiswaItem {
  id: string;
  nama: string;
  tahun: string;
  kelas: string;
  nisn: string;
}

export interface MasterGuruItem {
  id: string;
  nama: string;
  nuptk: string;
  jabatan: string;
}

export interface ArsipItem {
  id: string;
  tanggal: string;
  tahun: string;
  identitas: string;
  subjek: string;
  kategori: string;
  kategoriUtama: 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';
  namaFileAsli: string;
  ukuran?: string;
  linkDrive?: string;
  uploader: string;
  fileDataUrl?: string;
}

export const INITIAL_MASTER_SISWA: MasterSiswaItem[] = [
  { id: 'S001', nama: 'Andika Pratama', tahun: '2024', kelas: '9A', nisn: '0071829301' },
  { id: 'S002', nama: 'Ahmad Fauzi', tahun: '2024', kelas: '9B', nisn: '0071829302' },
  { id: 'S003', nama: 'Budi Santoso', tahun: '2023', kelas: '9A', nisn: '0062819203' },
  { id: 'S004', nama: 'Citra Dewi Permata', tahun: '2024', kelas: '9C', nisn: '0071829304' },
  { id: 'S005', nama: 'Dedi Kurniawan', tahun: '2022', kelas: '9B', nisn: '0053819205' },
  { id: 'S006', nama: 'Eka Nurhaliza', tahun: '2023', kelas: '9C', nisn: '0062819206' },
  { id: 'S007', nama: 'Fajar Ramadhan', tahun: '2025', kelas: '9A', nisn: '0081829307' },
  { id: 'S008', nama: 'Gita Permata Sari', tahun: '2025', kelas: '9B', nisn: '0081829308' },
  { id: 'S009', nama: 'Hadi Saputra', tahun: '2024', kelas: '9A', nisn: '0071829309' },
  { id: 'S010', nama: 'Indah Lestari', tahun: '2023', kelas: '9B', nisn: '0062819210' },
  { id: 'S011', nama: 'Muhammad Rizky', tahun: '2025', kelas: '9C', nisn: '0081829311' },
  { id: 'S012', nama: 'Nabila Azzahra', tahun: '2022', kelas: '9A', nisn: '0053819212' },
  { id: 'S013', nama: 'Rian Hidayat', tahun: '2024', kelas: '9B', nisn: '0071829313' },
  { id: 'S014', nama: 'Siti Rohmah', tahun: '2023', kelas: '9A', nisn: '0062819214' },
  { id: 'S015', nama: 'Zahra Amelia', tahun: '2025', kelas: '9A', nisn: '0081829315' },
];

export const INITIAL_MASTER_GURU: MasterGuruItem[] = [
  { id: 'G001', nama: 'Drs. H. Solikhin, M.Pd', nuptk: '197405121999031001', jabatan: 'Kepala Sekolah' },
  { id: 'G002', nama: 'Siti Aminah, S.Pd', nuptk: '198208152006042015', jabatan: 'Guru Matematika' },
  { id: 'G003', nama: 'Nurul Hidayah, S.Kom', nuptk: '198903142015051002', jabatan: 'Guru TIK & Operator' },
  { id: 'G004', nama: 'Agus Setiawan, M.Pd', nuptk: '197811202005011003', jabatan: 'Waka Kurikulum' },
  { id: 'G005', nama: 'Dewi Sartika, S.Si', nuptk: '198506102010012019', jabatan: 'Guru IPA' },
  { id: 'G006', nama: 'Bambang Irawan, S.Pd', nuptk: '198104232008011007', jabatan: 'Guru Bahasa Indonesia' },
  { id: 'G007', nama: 'Rina Kusuma, S.Pd', nuptk: '199012052019032008', jabatan: 'Guru Bahasa Inggris' },
  { id: 'G008', nama: 'Ahmad Mubarok, S.Ag', nuptk: '197607192003121004', jabatan: 'Guru PAI' },
];

export const KATEGORI_SISWA = [
  'Ijazah SD/MI',
  'SKL SD/MI',
  'Ijazah SMP',
  'SKL SMP',
  'Pakta Integritas',
  'Berkas SPMB',
  'Berkas PIP/KIP',
  'Dokumen Lainnya'
];

export const KATEGORI_GURU = [
  'KTP Guru',
  'Kartu Keluarga (KK)',
  'Akta IV',
  'NPWP',
  'BPJS Ketenagakerjaan',
  'Buku Rekening',
  'Ijazah SD/MI',
  'Ijazah SMP/MTs',
  'Ijazah SMA/SMK/MA',
  'Ijazah S1',
  'Ijazah Profesi',
  'Ijazah S2',
  'Transkrip Nilai',
  'Sertifikat Pendidik (Serdik)'
];

export const KATEGORI_LAINNYA = [
  'Surat Masuk',
  'Surat Keluar',
  'Proposal atau LPJ',
  'Nota Dinas',
  'Berkas Umum'
];

export const INITIAL_ARSIP: ArsipItem[] = [
  {
    id: 'SSW-0001',
    tanggal: '28/09/2026',
    tahun: '2024',
    identitas: '0071829301',
    subjek: 'Andika Pratama',
    kategori: 'Ijazah SMP',
    kategoriUtama: 'Arsip Siswa',
    namaFileAsli: 'Ijazah_SMP_Andika_Pratama.pdf',
    ukuran: '1.8 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-ijazah-andika/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'SSW-0002',
    tanggal: '28/09/2026',
    tahun: '2024',
    identitas: '0071829301',
    subjek: 'Andika Pratama',
    kategori: 'SKL SMP',
    kategoriUtama: 'Arsip Siswa',
    namaFileAsli: 'SKL_Andika_Pratama.pdf',
    ukuran: '1.2 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-skl-andika/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'SSW-0003',
    tanggal: '27/09/2026',
    tahun: '2024',
    identitas: '0071829302',
    subjek: 'Ahmad Fauzi',
    kategori: 'Ijazah SD/MI',
    kategoriUtama: 'Arsip Siswa',
    namaFileAsli: 'Ijazah_SD_Ahmad_Fauzi.pdf',
    ukuran: '2.1 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-ijazah-fauzi/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'SSW-0004',
    tanggal: '26/09/2026',
    tahun: '2023',
    identitas: '0062819203',
    subjek: 'Budi Santoso',
    kategori: 'Pakta Integritas',
    kategoriUtama: 'Arsip Siswa',
    namaFileAsli: 'Pakta_Integritas_Budi.pdf',
    ukuran: '850 KB',
    linkDrive: 'https://drive.google.com/file/d/demo-pakta-budi/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'SSW-0005',
    tanggal: '25/09/2026',
    tahun: '2024',
    identitas: '0071829304',
    subjek: 'Citra Dewi Permata',
    kategori: 'Berkas SPMB',
    kategoriUtama: 'Arsip Siswa',
    namaFileAsli: 'SPMB_Citra_Dewi.pdf',
    ukuran: '3.4 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-spmb-citra/view',
    uploader: 'solikhin@alhicam.sch.id'
  },
  {
    id: 'GRU-0001',
    tanggal: '27/09/2026',
    tahun: '2024',
    identitas: '197405121999031001',
    subjek: 'Drs. H. Solikhin, M.Pd',
    kategori: 'Sertifikat Pendidik (Serdik)',
    kategoriUtama: 'Arsip Guru',
    namaFileAsli: 'Serdik_Drs_H_Solikhin_MPd.pdf',
    ukuran: '2.4 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-serdik-solikhin/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'GRU-0002',
    tanggal: '26/09/2026',
    tahun: '2024',
    identitas: '197405121999031001',
    subjek: 'Drs. H. Solikhin, M.Pd',
    kategori: 'Ijazah S2',
    kategoriUtama: 'Arsip Guru',
    namaFileAsli: 'Ijazah_S2_Solikhin.pdf',
    ukuran: '1.9 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-s2-solikhin/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'GRU-0003',
    tanggal: '25/09/2026',
    tahun: '2023',
    identitas: '198208152006042015',
    subjek: 'Siti Aminah, S.Pd',
    kategori: 'KTP Guru',
    kategoriUtama: 'Arsip Guru',
    namaFileAsli: 'KTP_Siti_Aminah.jpg',
    ukuran: '620 KB',
    linkDrive: 'https://drive.google.com/file/d/demo-ktp-siti/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'GRU-0004',
    tanggal: '24/09/2026',
    tahun: '2023',
    identitas: '198903142015051002',
    subjek: 'Nurul Hidayah, S.Kom',
    kategori: 'Kartu Keluarga (KK)',
    kategoriUtama: 'Arsip Guru',
    namaFileAsli: 'KK_Nurul_Hidayah.pdf',
    ukuran: '1.1 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-kk-nurul/view',
    uploader: 'solikhin@alhicam.sch.id'
  },
  {
    id: 'LYN-0001',
    tanggal: '28/09/2026',
    tahun: '2026',
    identitas: '045/SMP-AH/IX/2026',
    subjek: 'Dinas Pendidikan Kab. Jombang',
    kategori: 'Surat Masuk',
    kategoriUtama: 'Arsip Lainnya',
    namaFileAsli: 'Surat_Edaran_Asesmen_Nasional_2026.pdf',
    ukuran: '940 KB',
    linkDrive: 'https://drive.google.com/file/d/demo-surat-masuk/view',
    uploader: 'admin@alhicam.sch.id'
  },
  {
    id: 'LYN-0002',
    tanggal: '22/09/2026',
    tahun: '2026',
    identitas: '012/SMP-AH/BOS/2026',
    subjek: 'LPJ Bantuan Operasional Sekolah (BOS) Tahap 1',
    kategori: 'Proposal atau LPJ',
    kategoriUtama: 'Arsip Lainnya',
    namaFileAsli: 'LPJ_Dana_BOS_Tahap_1_2026.pdf',
    ukuran: '4.8 MB',
    linkDrive: 'https://drive.google.com/file/d/demo-lpj-bos/view',
    uploader: 'admin@alhicam.sch.id'
  }
];

// =====================================================================
// PERSISTENCE ENGINE: LocalStorage (Metadata) + IndexedDB / Memory (Blobs)
// This guarantees that large file attachments NEVER cause QuotaExceededError!
// =====================================================================

export const DB_KEYS = {
  MASTER_SISWA: 'EARSIP_MASTER_SISWA',
  MASTER_GURU: 'EARSIP_MASTER_GURU',
  ARSIP_ITEMS: 'EARSIP_ITEMS',
  AUTH_USER: 'EARSIP_AUTH_USER'
};

// In-Memory blob cache for instant retrieval without hitting storage limits
const fileBlobCache = new Map<string, string>();

// IndexedDB Helper for Large File Attachments (Has Gigabytes of quota)
const IDB_NAME = 'EARSIP_ATTACHMENTS_DB';
const IDB_STORE = 'file_attachments';
const IDB_VERSION = 1;

function openIDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveFileAttachment(id: string, dataUrl: string) {
  if (!dataUrl) return;
  fileBlobCache.set(id, dataUrl);
  try {
    const db = await openIDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(dataUrl, id);
  } catch (err) {
    console.warn('Could not save to IndexedDB', err);
  }
}

export async function getFileAttachment(id: string): Promise<string | null> {
  if (fileBlobCache.has(id)) {
    return fileBlobCache.get(id) || null;
  }
  try {
    const db = await openIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(id);
      req.onsuccess = () => {
        const res = req.result || null;
        if (res) fileBlobCache.set(id, res);
        resolve(res);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Self-Healing Routine: Clean any large base64 strings from existing LocalStorage
function sanitizeLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DB_KEYS.ARSIP_ITEMS);
    if (!raw) return;

    const parsed: ArsipItem[] = JSON.parse(raw);
    let needsClean = false;

    const cleaned = parsed.map(item => {
      if (item.fileDataUrl) {
        needsClean = true;
        // Move to memory cache and IndexedDB
        fileBlobCache.set(item.id, item.fileDataUrl);
        saveFileAttachment(item.id, item.fileDataUrl);
        const { fileDataUrl, ...rest } = item;
        return rest as ArsipItem;
      }
      return item;
    });

    if (needsClean) {
      localStorage.setItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(cleaned));
    }
  } catch (err) {
    console.warn('Sanitizing bloated localStorage:', err);
    try {
      // In case quota is completely frozen, reset with clean seed items
      localStorage.removeItem(DB_KEYS.ARSIP_ITEMS);
      localStorage.setItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(INITIAL_ARSIP));
    } catch {}
  }
}

// Run immediately
sanitizeLocalStorage();

export function getStoredMasterSiswa(): MasterSiswaItem[] {
  try {
    const raw = localStorage.getItem(DB_KEYS.MASTER_SISWA);
    if (!raw) {
      safeSetItem(DB_KEYS.MASTER_SISWA, JSON.stringify(INITIAL_MASTER_SISWA));
      return INITIAL_MASTER_SISWA;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MASTER_SISWA;
  }
}

export function getStoredMasterGuru(): MasterGuruItem[] {
  try {
    const raw = localStorage.getItem(DB_KEYS.MASTER_GURU);
    if (!raw) {
      safeSetItem(DB_KEYS.MASTER_GURU, JSON.stringify(INITIAL_MASTER_GURU));
      return INITIAL_MASTER_GURU;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MASTER_GURU;
  }
}

// Safe LocalStorage setter with Quota Protection & automatic trimming
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`LocalStorage quota error for key ${key}. Trimming...`, err);
    try {
      if (key === DB_KEYS.ARSIP_ITEMS) {
        // Keep latest 30 items without fileDataUrl
        const parsed: ArsipItem[] = JSON.parse(value);
        const trimmed = parsed.slice(0, 30).map(it => {
          const copy = { ...it };
          delete copy.fileDataUrl;
          return copy;
        });
        localStorage.setItem(key, JSON.stringify(trimmed));
      }
    } catch (innerErr) {
      console.error('SafeSetItem emergency fallback failed', innerErr);
    }
  }
}

export function getStoredArsip(): ArsipItem[] {
  try {
    const raw = localStorage.getItem(DB_KEYS.ARSIP_ITEMS);
    if (raw === null) {
      safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(INITIAL_ARSIP));
      return INITIAL_ARSIP;
    }
    const items: ArsipItem[] = JSON.parse(raw);
    // Enrich with fileDataUrl from memory cache if available
    return items.map(item => {
      if (fileBlobCache.has(item.id)) {
        return { ...item, fileDataUrl: fileBlobCache.get(item.id) };
      }
      return item;
    });
  } catch {
    return [];
  }
}

export function saveArsipItem(item: ArsipItem): ArsipItem[] {
  // 1. If item has file attachment, store safely in IndexedDB & Memory Cache
  if (item.fileDataUrl) {
    fileBlobCache.set(item.id, item.fileDataUrl);
    saveFileAttachment(item.id, item.fileDataUrl);
  }

  // 2. Prepare clean item for LocalStorage (NO giant base64 strings!)
  const cleanItemForStorage: ArsipItem = { ...item };
  delete cleanItemForStorage.fileDataUrl;

  const current = getStoredArsip();
  const currentClean = current.map(c => {
    const copy = { ...c };
    delete copy.fileDataUrl;
    return copy;
  });

  const updatedClean = [cleanItemForStorage, ...currentClean];
  safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(updatedClean));

  // Return list with enriched item for immediate UI update
  return [item, ...current];
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingItem?: ArsipItem;
  reason?: string;
}

/**
 * Auto-detect duplicate archive records across Siswa, Guru, and Lainnya.
 */
export function checkDuplicateArsip(params: {
  kategoriUtama: 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';
  subjek: string;
  kategori: string;
  identitas?: string;
  tahun?: string;
}): DuplicateCheckResult {
  const current = getStoredArsip();
  const subjekNorm = (params.subjek || '').trim().toLowerCase();
  const kategoriNorm = (params.kategori || '').trim().toLowerCase();
  const identitasNorm = (params.identitas || '').trim().toLowerCase();

  if (!subjekNorm || !kategoriNorm) {
    return { isDuplicate: false };
  }

  const found = current.find(item => {
    if (item.kategoriUtama !== params.kategoriUtama) return false;

    // Check if category matches
    const sameCategory = item.kategori.trim().toLowerCase() === kategoriNorm;
    if (!sameCategory) return false;

    // For Siswa: match by name or by NISN
    if (params.kategoriUtama === 'Arsip Siswa') {
      const matchName = item.subjek.trim().toLowerCase() === subjekNorm;
      const matchNisn = identitasNorm && identitasNorm !== '-' && item.identitas.trim().toLowerCase() === identitasNorm;
      return matchName || matchNisn;
    }

    // For Guru: match by name or by NUPTK
    if (params.kategoriUtama === 'Arsip Guru') {
      const matchName = item.subjek.trim().toLowerCase() === subjekNorm;
      const matchNuptk = identitasNorm && identitasNorm !== '-' && item.identitas.trim().toLowerCase() === identitasNorm;
      return matchName || matchNuptk;
    }

    // For Lainnya: match by subject/document perihal & category
    if (params.kategoriUtama === 'Arsip Lainnya') {
      const matchSubject = item.subjek.trim().toLowerCase() === subjekNorm;
      const matchIdentitas = identitasNorm && identitasNorm !== '-' && item.identitas.trim().toLowerCase() === identitasNorm;
      return matchSubject || matchIdentitas;
    }

    return false;
  });

  if (found) {
    return {
      isDuplicate: true,
      existingItem: found,
      reason: `Berkas "${found.kategori}" untuk "${found.subjek}" sudah pernah diunggah pada ${found.tanggal} (ID: ${found.id}).`
    };
  }

  return { isDuplicate: false };
}

/**
 * Replace an existing archive document with updated file and metadata (Anti-duplication replace)
 */
export function replaceArsipItem(existingId: string, newItem: ArsipItem): ArsipItem[] {
  // If item has file attachment, store safely
  if (newItem.fileDataUrl) {
    fileBlobCache.set(newItem.id, newItem.fileDataUrl);
    saveFileAttachment(newItem.id, newItem.fileDataUrl);
  }

  const current = getStoredArsip();
  const cleanItemForStorage: ArsipItem = { ...newItem };
  delete cleanItemForStorage.fileDataUrl;

  const updatedClean = current.map(item => {
    if (item.id === existingId) {
      return cleanItemForStorage;
    }
    const copy = { ...item };
    delete copy.fileDataUrl;
    return copy;
  });

  safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(updatedClean));
  return current.map(item => item.id === existingId ? newItem : item);
}

// =====================================================================
// MASTER DATA MANAGEMENT (BUKU INDUK)
// =====================================================================

export function saveMasterSiswa(item: MasterSiswaItem): MasterSiswaItem[] {
  const current = getStoredMasterSiswa();
  const index = current.findIndex(s => s.id === item.id || (s.nisn && s.nisn === item.nisn));
  let updated: MasterSiswaItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  safeSetItem(DB_KEYS.MASTER_SISWA, JSON.stringify(updated));
  addAuditLog({
    aksi: 'UPDATE',
    kategori: 'Buku Induk Siswa',
    subjek: item.nama,
    detail: `Pembaruan data siswa NISN: ${item.nisn} (Kelas ${item.kelas}, Angkatan ${item.tahun})`,
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  });
  return updated;
}

export function deleteMasterSiswa(id: string): MasterSiswaItem[] {
  const current = getStoredMasterSiswa();
  const target = current.find(s => s.id === id);
  const updated = current.filter(s => s.id !== id);
  safeSetItem(DB_KEYS.MASTER_SISWA, JSON.stringify(updated));
  if (target) {
    addAuditLog({
      aksi: 'DELETE',
      kategori: 'Buku Induk Siswa',
      subjek: target.nama,
      detail: `Penghapusan master data siswa ${target.nama} (${target.nisn})`,
      operator: 'admin@alhicam.sch.id',
      status: 'WARNING'
    });
  }
  return updated;
}

export function saveMasterGuru(item: MasterGuruItem): MasterGuruItem[] {
  const current = getStoredMasterGuru();
  const index = current.findIndex(g => g.id === item.id || (g.nuptk && g.nuptk === item.nuptk));
  let updated: MasterGuruItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  safeSetItem(DB_KEYS.MASTER_GURU, JSON.stringify(updated));
  addAuditLog({
    aksi: 'UPDATE',
    kategori: 'Direktori Pendidik',
    subjek: item.nama,
    detail: `Pembaruan data guru NUPTK: ${item.nuptk} (${item.jabatan})`,
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  });
  return updated;
}

export function deleteMasterGuru(id: string): MasterGuruItem[] {
  const current = getStoredMasterGuru();
  const target = current.find(g => g.id === id);
  const updated = current.filter(g => g.id !== id);
  safeSetItem(DB_KEYS.MASTER_GURU, JSON.stringify(updated));
  if (target) {
    addAuditLog({
      aksi: 'DELETE',
      kategori: 'Direktori Pendidik',
      subjek: target.nama,
      detail: `Penghapusan data guru ${target.nama}`,
      operator: 'admin@alhicam.sch.id',
      status: 'WARNING'
    });
  }
  return updated;
}

// =====================================================================
// AUDIT LOG & JEJAK AKTIVITAS
// =====================================================================

export interface AuditLogItem {
  id: string;
  waktu: string;
  aksi: 'UPLOAD' | 'UPDATE' | 'UNDUH' | 'PREVIEW' | 'DELETE' | 'LEGALISIR';
  kategori: string;
  subjek: string;
  detail: string;
  operator: string;
  status: 'SUCCESS' | 'WARNING';
}

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-1001',
    waktu: '01/10/2026 15:42:10',
    aksi: 'UPLOAD',
    kategori: 'Arsip Siswa',
    subjek: 'Andika Pratama',
    detail: 'Pengunggahan berkas Ijazah SMP Kelulusan 2024 ke Google Drive',
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-1002',
    waktu: '01/10/2026 14:15:32',
    aksi: 'LEGALISIR',
    kategori: 'Legalisir Digital',
    subjek: 'Budi Santoso',
    detail: 'Penerbitan QR Code & Stempel Legalisir Resmi Ijazah SMP (Reg: LEG-2026-0042)',
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-1003',
    waktu: '30/09/2026 11:20:05',
    aksi: 'UPDATE',
    kategori: 'Arsip Guru',
    subjek: 'Drs. H. Solikhin, M.Pd',
    detail: 'Pembaruan (replace) dokumen Sertifikat Pendidik (Serdik)',
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-1004',
    waktu: '29/09/2026 09:30:18',
    aksi: 'UNDUH',
    kategori: 'Arsip Siswa',
    subjek: 'Citra Dewi Permata',
    detail: 'Unduh berkas Berkas SPMB format PDF',
    operator: 'solikhin@alhicam.sch.id',
    status: 'SUCCESS'
  },
  {
    id: 'LOG-1005',
    waktu: '28/09/2026 16:04:45',
    aksi: 'UPLOAD',
    kategori: 'Arsip Lainnya',
    subjek: 'Dinas Pendidikan Kab. Jombang',
    detail: 'Pengarsipan Surat Masuk Edaran Asesmen Nasional',
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  }
];

export const DB_AUDIT_KEY = 'EARSIP_AUDIT_LOGS';

export function getStoredAuditLogs(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(DB_AUDIT_KEY);
    if (!raw) {
      safeSetItem(DB_AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(log: Omit<AuditLogItem, 'id' | 'waktu'>): AuditLogItem[] {
  const current = getStoredAuditLogs();
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID');
  const timeStr = now.toLocaleTimeString('id-ID');
  const newLog: AuditLogItem = {
    ...log,
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    waktu: `${dateStr} ${timeStr}`
  };
  const updated = [newLog, ...current.slice(0, 100)];
  safeSetItem(DB_AUDIT_KEY, JSON.stringify(updated));
  return updated;
}

// =====================================================================
// LEGALISIR & VERIFIKASI KEABSAHAN IJAZAH
// =====================================================================

export interface LegalisirRecord {
  id: string;
  nomorRegistrasi: string;
  tanggalPengesahan: string;
  namaAlumni: string;
  nisn: string;
  tahunLulus: string;
  jenisDokumen: string;
  nomorSeriIjazah: string;
  statusKeaslian: 'ASLI_TERVERIFIKASI' | 'PERLU_KONFIRMASI';
  pejabatPengesah: string;
  jabatanPengesah: string;
  qrCodeToken: string;
}

export const INITIAL_LEGALISIR: LegalisirRecord[] = [
  {
    id: 'LEG-01',
    nomorRegistrasi: 'LEG/2026/SMP-AH/001',
    tanggalPengesahan: '28/09/2026',
    namaAlumni: 'Andika Pratama',
    nisn: '0071829301',
    tahunLulus: '2024',
    jenisDokumen: 'Ijazah SMP',
    nomorSeriIjazah: 'DN-05/DIK/2024/004912',
    statusKeaslian: 'ASLI_TERVERIFIKASI',
    pejabatPengesah: 'Drs. H. Solikhin, M.Pd',
    jabatanPengesah: 'Kepala Sekolah SMP Al-Hikam',
    qrCodeToken: 'VERIF-AH-2024-001-ANDIKA'
  },
  {
    id: 'LEG-02',
    nomorRegistrasi: 'LEG/2026/SMP-AH/002',
    tanggalPengesahan: '25/09/2026',
    namaAlumni: 'Budi Santoso',
    nisn: '0062819203',
    tahunLulus: '2023',
    jenisDokumen: 'Surat Keterangan Lulus (SKL)',
    nomorSeriIjazah: 'SKL/SMP-AH/VI/2023/118',
    statusKeaslian: 'ASLI_TERVERIFIKASI',
    pejabatPengesah: 'Drs. H. Solikhin, M.Pd',
    jabatanPengesah: 'Kepala Sekolah SMP Al-Hikam',
    qrCodeToken: 'VERIF-AH-2023-002-BUDI'
  }
];

export const DB_LEGALISIR_KEY = 'EARSIP_LEGALISIR';

export function getStoredLegalisir(): LegalisirRecord[] {
  try {
    const raw = localStorage.getItem(DB_LEGALISIR_KEY);
    if (!raw) {
      safeSetItem(DB_LEGALISIR_KEY, JSON.stringify(INITIAL_LEGALISIR));
      return INITIAL_LEGALISIR;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEGALISIR;
  }
}

export function saveLegalisirRecord(record: LegalisirRecord): LegalisirRecord[] {
  const current = getStoredLegalisir();
  const updated = [record, ...current];
  safeSetItem(DB_LEGALISIR_KEY, JSON.stringify(updated));
  addAuditLog({
    aksi: 'LEGALISIR',
    kategori: 'Legalisir Digital',
    subjek: record.namaAlumni,
    detail: `Penerbitan legalisir ${record.jenisDokumen} No: ${record.nomorRegistrasi}`,
    operator: 'admin@alhicam.sch.id',
    status: 'SUCCESS'
  });
  return updated;
}

// =====================================================================
// GOOGLE SHEETS & GOOGLE DRIVE INTEGRATION (WEBHOOK SYNC)
// =====================================================================

export interface GoogleSyncConfig {
  webhookUrl: string;
  folderId: string;
  spreadsheetId: string;
  autoSync: boolean;
  lastSyncTime?: string;
}

export const DEFAULT_SYNC_CONFIG: GoogleSyncConfig = {
  webhookUrl: '',
  folderId: '1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x',
  spreadsheetId: '1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE',
  autoSync: true
};

export const DB_CONFIG_KEY = 'EARSIP_GOOGLE_CONFIG';

export function getStoredSyncConfig(): GoogleSyncConfig {
  try {
    const raw = localStorage.getItem(DB_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.folderId === '1M_Ry_o-q7JGeXRfYdlpE8E2AuF_aOE8f' || !parsed.folderId) {
        parsed.folderId = '1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x';
      }
      if (parsed.spreadsheetId === '1ew4gfR53zeBdAcf57wWNdOmE9NiZjsvZikXgSxNHwEQ' || !parsed.spreadsheetId) {
        parsed.spreadsheetId = '1kaPMSn1vJkE_fUL0pVwQe_C5eVMOV6y1D5Ge_A3pHpE';
      }
      return parsed;
    }
  } catch {}
  return DEFAULT_SYNC_CONFIG;
}

export function saveStoredSyncConfig(cfg: GoogleSyncConfig) {
  try {
    localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save GoogleSyncConfig', err);
  }
}

/**
 * Sends archive item and uploaded base64 file directly to Google Apps Script
 */
export async function syncItemToGoogleCloud(
  item: ArsipItem, 
  fileBase64?: string
): Promise<{ success: boolean; driveUrl?: string; message?: string }> {
  const config = getStoredSyncConfig();
  if (!config.webhookUrl || !config.webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Webhook Google Apps Script belum disetel di Pengaturan.' };
  }

  try {
    const payload = {
      action: 'UPLOAD_ARSIP',
      folderId: config.folderId,
      spreadsheetId: config.spreadsheetId,
      id: item.id,
      tanggal: item.tanggal,
      tahun: item.tahun,
      identitas: item.identitas,
      subjek: item.subjek,
      kategori: item.kategori,
      kategoriUtama: item.kategoriUtama,
      namaFile: item.namaFileAsli,
      ukuran: item.ukuran || '1.2 MB',
      uploader: item.uploader,
      fileData: fileBase64 || item.fileDataUrl || ''
    };

    // Google Apps Script requires text/plain or no-cors / standard json
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result && result.status === 'success') {
      const realUrl = result.driveUrl || result.fileUrl || item.linkDrive;
      return {
        success: true,
        driveUrl: realUrl,
        message: 'Tersimpan otomatis ke Google Drive & dicatat di Google Sheet'
      };
    } else {
      return {
        success: false,
        message: result?.message || 'Respon webhook tidak valid'
      };
    }
  } catch (err: any) {
    console.warn('Sync to Google Cloud error:', err);
    return { success: false, message: err.message || 'Gagal mengirim ke Google Apps Script.' };
  }
}

/**
 * Push all master siswa & guru to Google Spreadsheet DATA_MASTER_SISWA and DATA_MASTER_GURU tabs
 */
export async function syncMasterToGoogleSheet(): Promise<{ success: boolean; message: string }> {
  const config = getStoredSyncConfig();
  if (!config.webhookUrl || !config.webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Webhook belum diatur di Pengaturan Google Cloud' };
  }
  const siswaList = getStoredMasterSiswa();
  const guruList = getStoredMasterGuru();

  try {
    const payload = {
      action: 'SYNC_ALL_MASTER',
      spreadsheetId: config.spreadsheetId,
      siswaList,
      guruList
    };

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result && result.status === 'success') {
      return { success: true, message: 'Daftar Siswa & Guru berhasil dicatat ke tab DATA_MASTER_SISWA dan DATA_MASTER_GURU di Spreadsheet!' };
    }
    return { success: false, message: result?.message || 'Respon webhook gagal' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal mengirim data ke Google Spreadsheet' };
  }
}

/**
 * Fetch live archives directly from Google Spreadsheet / Drive via Webhook
 */
export async function fetchLiveArsipFromGoogle(): Promise<{ success: boolean; items?: ArsipItem[]; message?: string }> {
  const config = getStoredSyncConfig();
  if (!config.webhookUrl) {
    return { success: false, message: 'URL Webhook belum diatur di Pengaturan Google Cloud' };
  }
  try {
    const response = await fetch(`${config.webhookUrl}?action=getArsip&t=${Date.now()}`);
    const data = await response.json();
    if (data && data.status === 'success' && Array.isArray(data.items)) {
      const items: ArsipItem[] = data.items.map((it: any) => ({
        id: it.id || `ARS-${Date.now()}`,
        tanggal: it.tanggal || new Date().toLocaleDateString('id-ID'),
        tahun: it.tahun || '-',
        identitas: it.identitas || '-',
        subjek: it.subjek || '-',
        kategori: it.kategori || '-',
        kategoriUtama: (it.kategoriUtama as any) || 'Arsip Siswa',
        namaFileAsli: it.namaFile || it.namaFileAsli || 'Dokumen',
        ukuran: it.ukuran || '0 KB',
        uploader: it.uploader || 'Admin',
        linkDrive: it.driveUrl || it.linkDrive || '#'
      }));
      safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(items));
      return { success: true, items };
    }
    return { success: false, message: data?.message || 'Gagal memuat data' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal terhubung ke Google Apps Script' };
  }
}

/**
 * Clear all sample demo archives to start fresh from 0
 */
export function clearAllArsipData(): void {
  safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify([]));
  fileBlobCache.clear();
}

/**
 * Clear all sample demo students & teachers from Master Data (Buku Induk)
 */
export function clearAllMasterData(): void {
  safeSetItem(DB_KEYS.MASTER_SISWA, JSON.stringify([]));
  safeSetItem(DB_KEYS.MASTER_GURU, JSON.stringify([]));
}

/**
 * Restore sample initial master students & teachers for demonstration
 */
export function restoreSampleMasterData(): void {
  safeSetItem(DB_KEYS.MASTER_SISWA, JSON.stringify(INITIAL_MASTER_SISWA));
  safeSetItem(DB_KEYS.MASTER_GURU, JSON.stringify(INITIAL_MASTER_GURU));
}

/**
 * Restore sample initial archives for demonstration
 */
export function restoreSampleArsipData(): void {
  safeSetItem(DB_KEYS.ARSIP_ITEMS, JSON.stringify(INITIAL_ARSIP));
}




