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
    if (!raw) {
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
    return INITIAL_ARSIP;
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
