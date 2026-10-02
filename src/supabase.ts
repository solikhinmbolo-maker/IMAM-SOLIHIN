import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ArsipItem, MasterSiswaItem, MasterGuruItem } from './data/mockDatabase';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isEnabled: boolean;
}

const STORAGE_KEY_SUPABASE = 'EARSIP_SUPABASE_CONFIG';

// Helper to sanitize Supabase URL
export function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return 'https://ynlcaasuybwscbikjmzt.supabase.co';
  let cleaned = rawUrl.trim();
  if (cleaned.endsWith('.supabase.com')) {
    cleaned = cleaned.replace(/\.supabase\.com$/, '.supabase.co');
  }
  if (cleaned.endsWith('.supabase.com/')) {
    cleaned = cleaned.replace(/\.supabase\.com\/$/, '.supabase.co');
  }
  return cleaned;
}

// Default Supabase configuration (fallback to env or localStorage)
export function getStoredSupabaseConfig(): SupabaseConfig {
  const DEFAULT_URL = 'https://ynlcaasuybwscbikjmzt.supabase.co';

  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        url: sanitizeSupabaseUrl(parsed.url || import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL),
        anonKey: parsed.anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        isEnabled: parsed.isEnabled !== false
      };
    }
  } catch {}

  return {
    url: sanitizeSupabaseUrl((import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_URL),
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
    isEnabled: true
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(config));
    cachedClient = null; // Reset client instance
  } catch (err) {
    console.warn('Failed to save Supabase config to localStorage:', err);
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  try {
    const validUrl = sanitizeSupabaseUrl(config.url);
    cachedClient = createClient(validUrl, config.anonKey.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test Supabase connectivity
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL atau Anon Key belum dikonfigurasi.'
    };
  }

  try {
    const { data, error } = await client.from('arsip').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, mention SQL schema
      if (error.code === '42P01' || error.message.includes('relation "arsip" does not exist')) {
        return {
          success: false,
          message: 'Koneksi berhasil, namun tabel "arsip" belum dibuat di Supabase. Silakan jalankan script SQL yang tersedia.'
        };
      }
      return {
        success: false,
        message: `Gagal query: ${error.message} (Kode: ${error.code})`
      };
    }

    return {
      success: true,
      message: '✓ Berhasil terhubung ke Supabase PostgreSQL Cloud!'
    };
  } catch (err) {
    return {
      success: false,
      message: `Error koneksi: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

/**
 * Fetch all archives from Supabase
 */
export async function fetchArsipFromSupabase(): Promise<ArsipItem[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('arsip')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error);
      return null;
    }

    if (!Array.isArray(data)) return [];

    return data.map((row: any) => ({
      id: row.id,
      tanggal: row.tanggal || '',
      tahun: row.tahun || '',
      identitas: row.identitas || '-',
      subjek: row.subjek || '',
      kategori: row.kategori || '',
      kategoriUtama: row.kategori_utama || 'Arsip Siswa',
      namaFileAsli: row.nama_file_asli || '',
      ukuran: row.ukuran || '',
      linkDrive: row.link_drive || '',
      uploader: row.uploader || 'admin@alhicam.sch.id',
      isTrash: Boolean(row.is_trash),
      deletedAt: row.deleted_at || undefined
    }));
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
    return null;
  }
}

/**
 * Save / Upsert an archive item to Supabase
 */
export async function saveArsipToSupabase(item: ArsipItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: item.id,
      tanggal: item.tanggal || '',
      tahun: item.tahun || '',
      identitas: item.identitas || '-',
      subjek: item.subjek || '',
      kategori: item.kategori || '',
      kategori_utama: item.kategoriUtama,
      nama_file_asli: item.namaFileAsli,
      ukuran: item.ukuran || '',
      link_drive: item.linkDrive || '',
      uploader: item.uploader || 'admin@alhicam.sch.id',
      is_trash: Boolean(item.isTrash),
      deleted_at: item.isTrash ? (item.deletedAt || new Date().toISOString()) : null,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('arsip')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save exception:', err);
    return false;
  }
}

/**
 * Bulk save / sync all local archives to Supabase
 */
export async function syncAllArsipToSupabase(items: ArsipItem[]): Promise<{ success: boolean; count: number }> {
  const client = getSupabaseClient();
  if (!client || !Array.isArray(items) || items.length === 0) {
    return { success: false, count: 0 };
  }

  try {
    const rows = items.map(item => ({
      id: item.id,
      tanggal: item.tanggal || '',
      tahun: item.tahun || '',
      identitas: item.identitas || '-',
      subjek: item.subjek || '',
      kategori: item.kategori || '',
      kategori_utama: item.kategoriUtama,
      nama_file_asli: item.namaFileAsli,
      ukuran: item.ukuran || '',
      link_drive: item.linkDrive || '',
      uploader: item.uploader || 'admin@alhicam.sch.id',
      is_trash: Boolean(item.isTrash),
      deleted_at: item.isTrash ? (item.deletedAt || new Date().toISOString()) : null,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client
      .from('arsip')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Supabase bulk sync error:', error);
      return { success: false, count: 0 };
    }

    return { success: true, count: rows.length };
  } catch (err) {
    console.error('Supabase bulk sync exception:', err);
    return { success: false, count: 0 };
  }
}
export async function deleteArsipFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('arsip')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete exception:', err);
    return false;
  }
}

/**
 * Upload file base64 directly to Supabase Storage bucket 'arsip'
 */
export async function uploadFileToSupabaseStorage(
  id: string,
  fileName: string,
  base64OrBlob: string | Blob
): Promise<{ success: boolean; publicUrl?: string; message?: string }> {
  const client = getSupabaseClient();
  if (!client || !base64OrBlob) {
    return { success: false, message: 'Supabase client belum aktif atau file kosong' };
  }

  try {
    let blob: Blob;
    let mimeType = 'application/octet-stream';

    if (base64OrBlob instanceof Blob) {
      blob = base64OrBlob;
      mimeType = blob.type || 'application/octet-stream';
    } else {
      const parts = base64OrBlob.split(',');
      if (parts.length > 1) {
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) mimeType = mimeMatch[1];
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        blob = new Blob([array], { type: mimeType });
      } else {
        blob = new Blob([base64OrBlob], { type: mimeType });
      }
    }

    const safeExt = mimeType.includes('pdf') ? '.pdf' : mimeType.includes('png') ? '.png' : '.jpg';
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${id}_${cleanName}${cleanName.includes('.') ? '' : safeExt}`;

    const { error } = await client.storage
      .from('arsip')
      .upload(storagePath, blob, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      let errorMsg = error.message;
      if (error.message.includes('Bucket not found') || (error as any).statusCode === 404) {
        errorMsg = 'Bucket "arsip" belum dibuat di Supabase Storage.';
      } else if (error.message.includes('row-level security') || (error as any).statusCode === 403 || (error as any).statusCode === '403') {
        errorMsg = 'Izin upload ditolak (Storage RLS Policy). Jalankan script SQL izin storage di Supabase.';
      }
      return { success: false, message: errorMsg };
    }

    const { data: publicUrlData } = client.storage
      .from('arsip')
      .getPublicUrl(storagePath);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      message: 'File berhasil diunggah ke Supabase Storage!'
    };
  } catch (err: any) {
    console.warn('Supabase storage exception:', err);
    return { success: false, message: err.message || 'Gagal upload ke Supabase Storage' };
  }
}

/**
 * Live test to verify Supabase Storage bucket 'arsip' and RLS permission
 */
export async function testSupabaseStorage(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Koneksi Supabase belum aktif.' };
  }

  try {
    const testBlob = new Blob(['PING_SMP_ALHICAM'], { type: 'text/plain' });
    const testPath = `_test_ping_${Date.now()}.txt`;

    const { error } = await client.storage
      .from('arsip')
      .upload(testPath, testBlob, { upsert: true });

    if (error) {
      if (error.message.includes('Bucket not found') || (error as any).statusCode === 404) {
        return { 
          success: false, 
          message: '❌ Bucket "arsip" BELUM DIBUAT di Supabase Storage! Klik "+ New bucket" ➔ nama: "arsip" ➔ centang "Public bucket".' 
        };
      }
      if (error.message.includes('row-level security') || error.message.includes('RLS') || (error as any).statusCode === 403 || (error as any).statusCode === '403') {
        return { 
          success: false, 
          message: '❌ Izin Upload Ditolak (RLS Policy). Jalankan script SQL Storage di menu SQL Editor Supabase.' 
        };
      }
      return { success: false, message: `❌ Gagal akses Storage: ${error.message}` };
    }

    // Bersihkan file ping
    await client.storage.from('arsip').remove([testPath]);

    return { 
      success: true, 
      message: '✓ Berhasil! Bucket "arsip" aktif & siap menerima file foto/PDF!' 
    };
  } catch (err: any) {
    return { success: false, message: `Error Storage: ${err?.message || String(err)}` };
  }
}

/**
 * Subscribe to realtime changes on Supabase 'arsip' table
 */
export function subscribeToSupabaseArsip(onUpdate: (items: ArsipItem[]) => void) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  // Initial fetch
  fetchArsipFromSupabase().then(items => {
    if (items) onUpdate(items);
  });

  const channel = client
    .channel('arsip_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'arsip' },
      () => {
        fetchArsipFromSupabase().then(items => {
          if (items) onUpdate(items);
        });
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

/**
 * Ready-to-use SQL Schema for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- SKEMA DATABASE E-ARSIP SMP AL-HIKAM JOMBANG (SUPABASE SQL)
-- Salin dan jalankan script ini di menu "SQL Editor" pada Supabase
-- =========================================================

-- 1. TABEL ARSIP DOKUMEN DIGITAL (Terhubung ke Google Drive)
CREATE TABLE IF NOT EXISTS public.arsip (
    id TEXT PRIMARY KEY,
    tanggal TEXT,
    tahun TEXT,
    identitas TEXT DEFAULT '-',
    subjek TEXT NOT NULL,
    kategori TEXT NOT NULL,
    kategori_utama TEXT NOT NULL,
    nama_file_asli TEXT,
    ukuran TEXT,
    link_drive TEXT,
    uploader TEXT DEFAULT 'admin@alhicam.sch.id',
    is_trash BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indeks untuk pencarian super cepat
CREATE INDEX IF NOT EXISTS idx_arsip_subjek ON public.arsip (subjek);
CREATE INDEX IF NOT EXISTS idx_arsip_identitas ON public.arsip (identitas);
CREATE INDEX IF NOT EXISTS idx_arsip_kategori ON public.arsip (kategori_utama, kategori);
CREATE INDEX IF NOT EXISTS idx_arsip_is_trash ON public.arsip (is_trash);

-- 2. TABEL MASTER DATA SISWA (Buku Induk Siswa)
CREATE TABLE IF NOT EXISTS public.master_siswa (
    id TEXT PRIMARY KEY,
    nisn TEXT,
    nama TEXT NOT NULL,
    kelas TEXT,
    angkatan TEXT,
    jk TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL MASTER DATA GURU & PEGAWAI
CREATE TABLE IF NOT EXISTS public.master_guru (
    id TEXT PRIMARY KEY,
    nuptk TEXT,
    nip TEXT,
    nama TEXT NOT NULL,
    jabatan TEXT,
    tugas TEXT,
    jk TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ATUR HAK AKSES KEAMANAN (Row Level Security)
ALTER TABLE public.arsip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_guru ENABLE ROW LEVEL SECURITY;

-- Izinkan akses baca dan tulis penuh untuk Anon Key (Frontend Web)
DROP POLICY IF EXISTS "Public Full Access Arsip" ON public.arsip;
CREATE POLICY "Public Full Access Arsip" ON public.arsip FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Siswa" ON public.master_siswa;
CREATE POLICY "Public Full Access Siswa" ON public.master_siswa FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access Guru" ON public.master_guru;
CREATE POLICY "Public Full Access Guru" ON public.master_guru FOR ALL USING (true) WITH CHECK (true);

-- 5. AKTIFKAN REALTIME REPLICATION SUPABASE
ALTER PUBLICATION supabase_realtime ADD TABLE public.arsip;
ALTER PUBLICATION supabase_realtime ADD TABLE public.master_siswa;
ALTER PUBLICATION supabase_realtime ADD TABLE public.master_guru;

-- 6. IZIN AKSES STORAGE BUCKET 'arsip' (Upload & Baca Berkas Fisik)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('arsip', 'arsip', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'arsip');

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'arsip');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'arsip');
`;
