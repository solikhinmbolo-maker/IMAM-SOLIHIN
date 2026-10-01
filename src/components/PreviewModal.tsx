import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Download, 
  CheckCircle, 
  ExternalLink,
  Eye, 
  Award, 
  Loader2,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { ArsipItem, getFileAttachment, getStoredSyncConfig } from '../data/mockDatabase';

interface PreviewModalProps {
  item: ArsipItem | null;
  onClose: () => void;
  onPrint: (item: ArsipItem) => void;
  onDownload: (item: ArsipItem) => void;
}

// Convert base64 data URI to standard Blob Object URL for Chromium PDF rendering
function convertDataUriToBlobUrl(dataUrl: string): string {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
    const parts = dataUrl.split(',');
    if (parts.length < 2) return dataUrl;
    
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
    
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error creating Blob URL for PDF preview:', err);
    return dataUrl;
  }
}

export default function PreviewModal({ item, onClose, onPrint, onDownload }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'certificate'>('file');
  const [fileData, setFileData] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const syncConfig = getStoredSyncConfig();
  const folderId = syncConfig.folderId || '1aYz2ZRwFdz0trZDWt8g3_V_wluZx9n3x';

  useEffect(() => {
    if (!item) return;

    setActiveTab('file');

    if (item.fileDataUrl) {
      setFileData(item.fileDataUrl);
      return;
    }

    // Try loading from IndexedDB
    setIsLoadingFile(true);
    getFileAttachment(item.id)
      .then((data) => {
        if (data) {
          setFileData(data);
        } else {
          setFileData('');
          setActiveTab('certificate');
        }
      })
      .catch(() => {
        setFileData('');
        setActiveTab('certificate');
      })
      .finally(() => {
        setIsLoadingFile(false);
      });
  }, [item]);

  // Generate Blob URL whenever fileData changes
  useEffect(() => {
    if (!fileData) {
      setBlobUrl('');
      return;
    }

    if (fileData.startsWith('data:')) {
      const url = convertDataUriToBlobUrl(fileData);
      setBlobUrl(url);
      return () => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      setBlobUrl(fileData);
    }
  }, [fileData]);

  if (!item) return null;

  const isPdf = (fileData && fileData.startsWith('data:application/pdf')) || 
                (blobUrl && blobUrl.startsWith('blob:')) ||
                (item.namaFileAsli && item.namaFileAsli.toLowerCase().endsWith('.pdf'));

  const isImage = (fileData && fileData.startsWith('data:image')) || 
                  (item.namaFileAsli && /\.(jpe?g|png|webp|gif|bmp)$/i.test(item.namaFileAsli));

  const handleOpenFullscreen = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else if (fileData) {
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Poppins']">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-white flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md text-white">
                {item.namaFileAsli || item.subjek}
              </h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">{item.kategori}</span>
                <span>•</span>
                <span>{item.subjek}</span>
                <span>•</span>
                <span className="font-mono text-slate-300">{item.id}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('file')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Berkas Asli ({item.namaFileAsli ? item.namaFileAsli.split('.').pop()?.toUpperCase() : 'PDF'})</span>
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Lembar Verifikasi</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'file' && (blobUrl || fileData) && (
              <button
                onClick={handleOpenFullscreen}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                title="Buka Dokumen di Tab Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </button>
            )}

            <button
              onClick={() => onPrint(item)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={() => onDownload(item)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              title="Unduh Berkas"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
              title="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-y-auto flex items-center justify-center relative">
          
          {isLoadingFile ? (
            <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="text-xs font-medium">Memuat berkas fisik dokumen...</span>
            </div>
          ) : activeTab === 'file' ? (
            /* ============================================================== */
            /* 1. TAMPILAN BERKAS ASLI (PDF / GAMBAR)                          */
            /* ============================================================== */
            (blobUrl || fileData) ? (
              isImage ? (
                <div className="w-full h-full flex items-center justify-center p-2 overflow-auto">
                  <img
                    src={fileData || blobUrl}
                    alt={item.namaFileAsli}
                    className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-700"
                  />
                </div>
              ) : (
                /* PDF Viewer using Blob URL with object fallback for Chromium */
                <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl relative min-h-[75vh]">
                  <object
                    data={blobUrl || fileData}
                    type="application/pdf"
                    className="w-full h-full min-h-[75vh] rounded-2xl bg-white border-0"
                  >
                    <iframe
                      src={blobUrl || fileData}
                      className="w-full h-full min-h-[75vh] border-0 rounded-2xl bg-white"
                      title={item.namaFileAsli || 'Dokumen PDF'}
                    >
                      <div className="flex flex-col items-center justify-center p-12 text-slate-800 bg-white h-full space-y-4">
                        <FileText className="w-16 h-16 text-blue-600" />
                        <h4 className="font-bold text-base">Dokumen PDF Siap Ditampilkan</h4>
                        <p className="text-xs text-slate-500 max-w-sm text-center">
                          Browser Anda memerlukan izin untuk membuka pratinjau PDF langsung di dalam frame.
                        </p>
                        <button
                          onClick={handleOpenFullscreen}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                        >
                          Buka PDF di Tab Baru
                        </button>
                      </div>
                    </iframe>
                  </object>
                </div>
              )
            ) : (
              /* Fallback if no physical file in cache */
              <div className="text-center p-8 max-w-md bg-slate-900 border border-slate-800 rounded-3xl text-slate-300 space-y-4 shadow-xl">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-base font-bold text-white">File Fisik Tersimpan di Google Drive</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Berkas <strong>{item.namaFileAsli || item.kategori}</strong> diunggah langsung ke penyimpanan Google Drive Anda. Anda dapat melihat lembar verifikasi digital atau membuka file langsung di Drive.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Buka Lembar Verifikasi
                  </button>
                  <a
                    href={`https://drive.google.com/drive/folders/${folderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Folder Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )
          ) : (
            /* ============================================================== */
            /* 2. LEMBAR VERIFIKASI DIGITAL RESMI (SURAT RESMI SEKOLAH)       */
            /* ============================================================== */
            <div className="w-full max-w-2xl bg-white text-slate-800 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 relative my-auto animate-fadeIn">
              {/* Formal Certificate/Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center">
                <p className="text-[10px] tracking-widest font-bold text-slate-500 uppercase">
                  KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
                </p>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide mt-1">
                  SMP AL-HIKAM
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sistem Informasi Manajemen E-Arsip Dokumen Sekolah Digital
                </p>
                <p className="text-[10px] text-slate-500">
                  Jl. Pesantren Al-Hikam, Kab. Jombang, Jawa Timur | NPSN: 20503412
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center my-5">
                <h3 className="text-base font-extrabold uppercase underline tracking-wider text-slate-900">
                  {item.kategori}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Nomor Registrasi Arsip: <strong className="font-mono text-blue-700">{item.id}</strong>
                </p>
              </div>

              {/* Document Details Table */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed my-5">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Nama Subjek / Pemilik</span>
                  <span className="col-span-2 font-bold text-slate-900">: {item.subjek}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Nomor Induk (NISN / NIP)</span>
                  <span className="col-span-2 font-mono font-bold text-blue-800">: {item.identitas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Tahun Angkatan / Dokumen</span>
                  <span className="col-span-2 font-medium">: {item.tahun}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Kategori Dokumen</span>
                  <span className="col-span-2 font-medium">: {item.kategori} ({item.kategoriUtama})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Nama Berkas Asli</span>
                  <span className="col-span-2 font-mono text-xs text-slate-600 truncate">: {item.namaFileAsli || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Tanggal Pengarsipan</span>
                  <span className="col-span-2 font-medium">: {item.tanggal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Petugas Pengunggah</span>
                  <span className="col-span-2 font-medium">: {item.uploader}</span>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 block">DOKUMEN TERVERIFIKASI DIGITAL</span>
                    <span className="text-[10px] text-slate-500 block">Tersimpan aman di Google Drive E-Arsip Al-Hikam</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Kepala Sekolah / Tim Tata Usaha</span>
                  <span className="text-xs font-bold text-slate-900 block mt-3">Drs. H. Solikhin, M.Pd</span>
                  <span className="text-[9px] text-slate-400 block">NIP. 197405121999031001</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>Google Drive Cloud Storage:</span>
            <span className="font-mono text-cyan-400">{folderId}</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">E-ARSIP SMP AL-HIKAM</span>
        </div>
      </div>
    </div>
  );
}
