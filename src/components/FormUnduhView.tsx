import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Printer, 
  Download, 
  CloudDownload, 
  FileText,
  User
} from 'lucide-react';
import { ArsipItem, getStoredArsip } from '../data/mockDatabase';

interface FormUnduhViewProps {
  kategoriMenu?: 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';
  onPreview: (item: ArsipItem) => void;
}

export default function FormUnduhView({ 
  kategoriMenu = 'Arsip Siswa', 
  onPreview 
}: FormUnduhViewProps) {
  const [filterTahun, setFilterTahun] = useState('SEMUA');
  const [filterJenis, setFilterJenis] = useState('SEMUA');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingItemName, setDownloadingItemName] = useState('');

  // Get data
  const allArsip = getStoredArsip();

  // Filter based on active category
  const scopedData = useMemo(() => {
    return allArsip.filter(item => {
      if (kategoriMenu) {
        return item.kategoriUtama === kategoriMenu;
      }
      return true;
    });
  }, [allArsip, kategoriMenu]);

  // Distinct Years & Categories for filters
  const distinctTahun = useMemo(() => {
    const set = new Set(scopedData.map(d => d.tahun).filter(Boolean));
    return Array.from(set).sort().reverse();
  }, [scopedData]);

  const distinctJenis = useMemo(() => {
    const set = new Set(scopedData.map(d => d.kategori).filter(Boolean));
    return Array.from(set).sort();
  }, [scopedData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return scopedData.filter(item => {
      const matchTahun = filterTahun === 'SEMUA' || String(item.tahun).trim() === filterTahun;
      const matchJenis = filterJenis === 'SEMUA' || String(item.kategori).trim() === filterJenis;
      
      const q = searchTerm.toLowerCase().trim();
      const combined = `${item.subjek} ${item.identitas} ${item.kategori} ${item.tahun} ${item.namaFileAsli}`.toLowerCase();
      const matchSearch = !q || combined.includes(q);

      return matchTahun && matchJenis && matchSearch;
    });
  }, [scopedData, filterTahun, filterJenis, searchTerm]);

  // Handle Download Simulation
  const handleDownload = (item: ArsipItem) => {
    setIsDownloading(true);
    setDownloadingItemName(item.namaFileAsli || item.subjek);
    setDownloadProgress(20);

    const timer1 = setTimeout(() => setDownloadProgress(60), 150);
    const timer2 = setTimeout(() => setDownloadProgress(100), 300);
    const timer3 = setTimeout(() => {
      setIsDownloading(false);
      setDownloadProgress(0);

      // Trigger browser download simulation or download dataUrl if available
      const element = document.createElement('a');
      const fileContent = item.fileDataUrl || `data:text/plain;charset=utf-8,Dokumen E-Arsip Al-Hicam\nNama: ${item.subjek}\nKategori: ${item.kategori}\nTahun: ${item.tahun}\nID: ${item.id}`;
      element.setAttribute('href', fileContent);
      element.setAttribute('download', item.namaFileAsli || `${item.subjek}_${item.kategori}.txt`);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Handle Print
  const handlePrint = (item: ArsipItem) => {
    onPreview(item);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-slate-200/80 animate-fadeIn font-['Poppins']">
      
      {/* HEADER EMERALD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b-2 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <span>Daftar Unduh:</span>
              <span className="text-emerald-600">{kategoriMenu}</span>
            </h3>
            <p className="text-xs text-slate-500">Akses dan unduh arsip langsung ke perangkat Anda</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mode Unduh Langsung</span>
        </div>
      </div>

      {/* FILTER BERTINGKAT & SMART SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
        
        {/* Dropdown Filter Tahun */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Filter Tahun:</span>
          </label>
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="SEMUA">Semua Tahun</option>
            {distinctTahun.map(th => (
              <option key={th} value={th}>Tahun {th}</option>
            ))}
          </select>
        </div>

        {/* Dropdown Filter Jenis Dokumen */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            <span>Jenis Dokumen:</span>
          </label>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="SEMUA">Semua Jenis</option>
            {distinctJenis.map(jn => (
              <option key={jn} value={jn}>{jn}</option>
            ))}
          </select>
        </div>

        {/* Smart Search */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span>Cari Cepat (Nama / NISN / Subjek):</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama siswa, NISN, atau judul berkas..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar Animasi Unduh */}
      {isDownloading && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 animate-fadeIn space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-emerald-900">
            <span className="flex items-center gap-2">
              <CloudDownload className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>Mengunduh berkas: <strong>{downloadingItemName}</strong></span>
            </span>
            <span className="text-emerald-700 font-bold">{downloadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-200 rounded-full"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabel Data Arsip */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3.5 px-4">Tanggal & Tahun</th>
              <th className="py-3.5 px-4">Subjek / Nama</th>
              <th className="py-3.5 px-4">NISN / NIP / Identitas</th>
              <th className="py-3.5 px-4">Kategori Dokumen</th>
              <th className="py-3.5 px-4 text-center">Aksi Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">Dokumen tidak ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter tahun atau kata kunci pencarian Anda</p>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block">{item.tanggal}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                      Th: {item.tahun || '-'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="text-slate-900 block font-semibold">{item.subjek}</strong>
                    <span className="text-xs text-slate-500 font-mono">{item.namaFileAsli}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-200">
                      <User className="w-3 h-3 text-slate-400" />
                      {item.identitas || '-'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                        title="Lihat Preview Dokumen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Cetak Button */}
                      <button
                        type="button"
                        onClick={() => handlePrint(item)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        title="Cetak Dokumen"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak</span>
                      </button>

                      {/* Unduh Button */}
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        title="Unduh Berkas Langsung"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
