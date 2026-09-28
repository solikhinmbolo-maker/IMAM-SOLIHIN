import React from 'react';
import { X, Printer, FileText, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { ArsipItem } from '../data/mockDatabase';

interface PreviewModalProps {
  item: ArsipItem | null;
  onClose: () => void;
  onPrint: (item: ArsipItem) => void;
  onDownload: (item: ArsipItem) => void;
}

export default function PreviewModal({ item, onClose, onPrint, onDownload }: PreviewModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Poppins']">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold truncate max-w-xs sm:max-w-md">{item.namaFileAsli || item.subjek}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{item.kategori}</span>
                <span>•</span>
                <span>{item.tanggal}</span>
                <span>•</span>
                <span className="font-mono text-cyan-400">{item.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(item)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={() => onDownload(item)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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

        {/* Content Viewer */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-8 overflow-y-auto flex items-center justify-center">
          {item.fileDataUrl && item.fileDataUrl.startsWith('data:image') ? (
            <img 
              src={item.fileDataUrl} 
              alt={item.namaFileAsli} 
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-slate-800" 
            />
          ) : (
            <div className="w-full max-w-2xl bg-white text-slate-800 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 relative">
              {/* Formal Certificate/Document Header Mock */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                <p className="text-[10px] tracking-widest font-bold text-slate-500 uppercase">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</p>
                <h2 className="text-xl font-bold text-slate-900 tracking-wide mt-1">SMP AL-HIKAM</h2>
                <p className="text-xs text-slate-600 mt-0.5">Sistem Informasi Manajemen E-Arsip Dokumen Sekolah Digital</p>
                <p className="text-[10px] text-slate-500">Jl. Pesantren Al-Hikam, Kab. Jombang, Jawa Timur | NPSN: 20503412</p>
              </div>

              {/* Document Title */}
              <div className="text-center my-6">
                <h3 className="text-base font-bold uppercase underline tracking-wider text-slate-900">
                  {item.kategori}
                </h3>
                <p className="text-xs text-slate-600 mt-1">Nomor Registrasi Arsip: <strong>{item.id}</strong></p>
              </div>

              {/* Document Body */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed my-6">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Nama Subjek / Pemilik</span>
                  <span className="col-span-2 font-bold text-slate-900">: {item.subjek}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Nomor Induk (NISN / NIP)</span>
                  <span className="col-span-2 font-mono font-medium">: {item.identitas}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Tahun Angkatan / Dokumen</span>
                  <span className="col-span-2 font-medium">: {item.tahun}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Kategori Dokumen</span>
                  <span className="col-span-2 font-medium">: {item.kategori} ({item.kategoriUtama})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Tanggal Pengarsipan</span>
                  <span className="col-span-2 font-medium">: {item.tanggal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-600">Petugas Pengunggah</span>
                  <span className="col-span-2 font-medium">: {item.uploader}</span>
                </div>
              </div>

              {/* Verification Stamp & QR Mock */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block">DOKUMEN TERVERIFIKASI DIGITAL</span>
                    <span className="text-[9px] text-slate-500 block">Tersimpan aman di Google Drive E-Arsip Al-Hicam</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Kepala Sekolah / Tim Tata Usaha</span>
                  <span className="text-xs font-bold text-slate-900 block mt-4">Drs. H. Solikhin, M.Pd</span>
                  <span className="text-[9px] text-slate-400 block">NIP. 197405121999031001</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Google Drive Cloud Storage: FOLDER_ID: 1M_Ry_o-q7JGeXRfYdlpE8E2AuF_aOE8f</span>
          <span className="text-cyan-400 font-mono">E-ARSIP AL-HICAM V1.0</span>
        </div>
      </div>
    </div>
  );
}
