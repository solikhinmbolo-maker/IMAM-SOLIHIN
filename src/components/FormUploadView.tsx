import React, { useState, useEffect } from 'react';
import { 
  CloudUpload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Trash2, 
  RefreshCw, 
  Check, 
  Calendar,
  User,
  Hash,
  FileCheck,
  Paperclip,
  Upload,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { 
  MasterSiswaItem, 
  MasterGuruItem, 
  ArsipItem, 
  KATEGORI_SISWA, 
  KATEGORI_GURU, 
  KATEGORI_LAINNYA,
  getStoredMasterSiswa, 
  getStoredMasterGuru, 
  saveArsipItem 
} from '../data/mockDatabase';

interface FormUploadViewProps {
  initialJenis?: 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya';
  onUploadSuccess: () => void;
  onCancel: () => void;
}

export default function FormUploadView({ 
  initialJenis = 'Arsip Siswa', 
  onUploadSuccess, 
  onCancel 
}: FormUploadViewProps) {
  const [modeUpload, setModeUpload] = useState<'individual' | 'kolektif'>('individual');
  const [jenisArsip, setJenisArsip] = useState<'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya'>(initialJenis);

  // Master Data
  const [masterSiswa, setMasterSiswa] = useState<MasterSiswaItem[]>([]);
  const [masterGuru, setMasterGuru] = useState<MasterGuruItem[]>([]);
  const [tahunList, setTahunList] = useState<string[]>([]);

  // Form Fields
  const [tahun, setTahun] = useState('');
  const [namaSubjek, setNamaSubjek] = useState('');
  const [identitas, setIdentitas] = useState(''); // NISN or NIP
  const [namaDokumen, setNamaDokumen] = useState('');
  const [kategori, setKategori] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');

  // Kolektif Upload Files mapping
  const [kolektifFiles, setKolektifFiles] = useState<{ [category: string]: { file: File; base64: string } }>({});

  // Upload Progress & State
  const [isUploading, setIsUploading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string }>({ count: 1, name: '' });
  const [errorMessage, setErrorMessage] = useState('');

  // Load Master Data
  useEffect(() => {
    const sList = getStoredMasterSiswa();
    const gList = getStoredMasterGuru();
    setMasterSiswa(sList);
    setMasterGuru(gList);

    const distinctTahun = Array.from(new Set(sList.map(s => s.tahun))).sort().reverse();
    setTahunList(distinctTahun);

    if (distinctTahun.length > 0 && !tahun) {
      setTahun(distinctTahun[0]);
    }
  }, []);

  // Update dynamic categories based on active type
  const activeKategoriList = 
    jenisArsip === 'Arsip Siswa' ? KATEGORI_SISWA :
    jenisArsip === 'Arsip Guru' ? KATEGORI_GURU : 
    KATEGORI_LAINNYA;

  // Filter siswa based on selected tahun
  const siswaFilter = masterSiswa.filter(s => s.tahun === tahun);

  // Sync NISN on siswa change
  useEffect(() => {
    if (jenisArsip === 'Arsip Siswa') {
      const match = siswaFilter.find(s => s.nama === namaSubjek);
      setIdentitas(match ? match.nisn : '');
    }
  }, [namaSubjek, jenisArsip, siswaFilter]);

  // Sync NUPTK on guru change
  useEffect(() => {
    if (jenisArsip === 'Arsip Guru') {
      const match = masterGuru.find(g => g.nama === namaSubjek);
      setIdentitas(match ? match.nuptk : '');
    }
  }, [namaSubjek, jenisArsip, masterGuru]);

  // Default initial kategori
  useEffect(() => {
    if (activeKategoriList.length > 0) {
      setKategori(activeKategoriList[0]);
    }
  }, [jenisArsip]);

  // File dropzone handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Ukuran file melebihi 10MB! Mohon kompres terlebih dahulu.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');

      // Auto-fill namaDokumen if empty
      if (!namaDokumen && namaSubjek) {
        setNamaDokumen(`${kategori} - ${namaSubjek} (${tahun})`);
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Kolektif file picker
  const handleKolektifFile = (kat: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`Ukuran berkas ${kat} melebihi batas 10MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setKolektifFiles(prev => ({
        ...prev,
        [kat]: { file, base64: reader.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeKolektifFile = (kat: string) => {
    setKolektifFiles(prev => {
      const copy = { ...prev };
      delete copy[kat];
      return copy;
    });
  };

  // Sound effect
  const playSuccessSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!namaSubjek.trim()) {
      setErrorMessage('Mohon pilih nama siswa/guru atau instansi terlebih dahulu.');
      return;
    }

    if (modeUpload === 'individual') {
      if (!selectedFile) {
        setErrorMessage('Mohon pilih file berkas dokumen terlebih dahulu.');
        return;
      }

      setIsUploading(true);
      setProgressPercent(20);
      setProgressStatus('Membaca & memverifikasi dokumen...');

      const timer1 = setTimeout(() => {
        setProgressPercent(60);
        setProgressStatus('Mengunggah ke folder Google Drive E-Arsip...');
      }, 500);

      const timer2 = setTimeout(() => {
        setProgressPercent(90);
        setProgressStatus('Mencatat riwayat ke database spreadsheet...');
      }, 900);

      const timer3 = setTimeout(() => {
        setProgressPercent(100);
        setProgressStatus('Pengarsipan selesai!');

        const prefix = jenisArsip === 'Arsip Siswa' ? 'SSW' : jenisArsip === 'Arsip Guru' ? 'GRU' : 'LYN';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newId = `${prefix}-${randomNum}`;
        const todayStr = new Date().toLocaleDateString('id-ID');

        const newArsip: ArsipItem = {
          id: newId,
          tanggal: todayStr,
          tahun: tahun || new Date().getFullYear().toString(),
          identitas: identitas || '-',
          subjek: namaSubjek,
          kategori: kategori,
          kategoriUtama: jenisArsip,
          namaFileAsli: selectedFile.name,
          ukuran: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          linkDrive: `https://drive.google.com/file/d/${newId}/view`,
          uploader: 'admin@alhicam.sch.id',
          fileDataUrl: fileBase64
        };

        saveArsipItem(newArsip);
        setIsUploading(false);
        playSuccessSound();
        setSuccessInfo({ count: 1, name: namaSubjek });
        setShowSuccessModal(true);

        // Reset
        setSelectedFile(null);
        setFileBase64('');
        setNamaDokumen('');
      }, 1400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Mode Kolektif
      const count = Object.keys(kolektifFiles).length;
      if (count === 0) {
        setErrorMessage('Pilih minimal 1 berkas pada daftar kategori untuk upload kolektif.');
        return;
      }

      setIsUploading(true);
      setProgressPercent(15);
      setProgressStatus(`Mempersiapkan pengunggahan ${count} berkas...`);

      let currentStep = 0;
      const categories = Object.keys(kolektifFiles);

      const interval = setInterval(() => {
        currentStep++;
        const percent = Math.min(95, Math.round((currentStep / count) * 90));
        setProgressPercent(percent);
        setProgressStatus(`Mengunggah berkas (${currentStep}/${count}): ${categories[currentStep - 1] || 'Selesai'}...`);

        if (currentStep >= count) {
          clearInterval(interval);

          setTimeout(() => {
            setProgressPercent(100);
            setProgressStatus('Semua berkas kolektif berhasil disimpan!');

            const todayStr = new Date().toLocaleDateString('id-ID');
            const prefix = jenisArsip === 'Arsip Siswa' ? 'SSW' : jenisArsip === 'Arsip Guru' ? 'GRU' : 'LYN';

            categories.forEach((katKey, idx) => {
              const fileObj = kolektifFiles[katKey];
              const randomNum = Math.floor(1000 + Math.random() * 9000) + idx;
              const newId = `${prefix}-${randomNum}`;

              saveArsipItem({
                id: newId,
                tanggal: todayStr,
                tahun: tahun || new Date().getFullYear().toString(),
                identitas: identitas || '-',
                subjek: namaSubjek,
                kategori: katKey,
                kategoriUtama: jenisArsip,
                namaFileAsli: fileObj.file.name,
                ukuran: `${(fileObj.file.size / (1024 * 1024)).toFixed(1)} MB`,
                linkDrive: `https://drive.google.com/file/d/${newId}/view`,
                uploader: 'admin@alhicam.sch.id',
                fileDataUrl: fileObj.base64
              });
            });

            setIsUploading(false);
            playSuccessSound();
            setSuccessInfo({ count, name: namaSubjek });
            setShowSuccessModal(true);
            setKolektifFiles({});
          }, 400);
        }
      }, 350);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-slate-200/90 animate-fadeIn font-['Poppins'] max-w-full overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Unggah Berkas Baru</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Pilih subjek dan lampirkan dokumen digital</p>
            </div>
          </div>
        </div>

        {/* Native Segmented Control: Individual vs Kolektif */}
        <div className="w-full sm:w-auto flex items-center bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setModeUpload('individual')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modeUpload === 'individual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload Individual</span>
          </button>
          <button
            type="button"
            onClick={() => setModeUpload('kolektif')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modeUpload === 'kolektif'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Upload Kolektif</span>
          </button>
        </div>
      </div>

      {/* Target Category Swipeable Pills */}
      <div className="mb-5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Pilih Kelompok Berkas:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['Arsip Siswa', 'Arsip Guru', 'Arsip Lainnya'] as const).map(j => (
            <button
              key={j}
              type="button"
              onClick={() => {
                setJenisArsip(j);
                setNamaSubjek('');
                setIdentitas('');
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all flex-shrink-0 cursor-pointer ${
                jenisArsip === j
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {j === 'Arsip Siswa' ? '🎓 ' : j === 'Arsip Guru' ? '👨‍🏫 ' : '📁 '}
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* Row 1: Tahun & NISN/NIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {jenisArsip === 'Arsip Siswa' ? 'Tahun Lulus / Angkatan' : 
                 jenisArsip === 'Arsip Guru' ? 'Tahun Penerbitan SK' : 'Tahun Dokumen'}
              </span>
              <span className="text-red-500">*</span>
            </label>
            {jenisArsip === 'Arsip Siswa' ? (
              <div className="relative">
                <select
                  value={tahun}
                  onChange={(e) => {
                    setTahun(e.target.value);
                    setNamaSubjek('');
                  }}
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 hover:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Tahun Angkatan --</option>
                  {tahunList.map(t => (
                    <option key={t} value={t}>Angkatan {t}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            ) : (
              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                placeholder="Contoh: 2026"
                required
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-all"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {jenisArsip === 'Arsip Siswa' ? 'NISN / NIS' : 
                 jenisArsip === 'Arsip Guru' ? 'NIP / NUPTK' : 'Nomor Surat / Kode'}
              </span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={identitas}
              onChange={(e) => setIdentitas(e.target.value)}
              readOnly={jenisArsip !== 'Arsip Lainnya'}
              placeholder={jenisArsip === 'Arsip Lainnya' ? 'Masukkan nomor surat atau kode' : 'Otomatis muncul setelah memilih nama'}
              required
              className={`w-full px-3.5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm border transition-all font-mono ${
                jenisArsip === 'Arsip Lainnya'
                  ? 'bg-slate-50 focus:bg-white border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500'
                  : 'bg-slate-100/90 border-slate-200 text-slate-700'
              }`}
            />
          </div>
        </div>

        {/* Row 2: Nama Subjek / Siswa / Guru */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {jenisArsip === 'Arsip Siswa' ? 'Nama Siswa / Alumni' : 
               jenisArsip === 'Arsip Guru' ? 'Nama Guru / Pegawai' : 'Nama Instansi / Perihal Surat'}
            </span>
            <span className="text-red-500">*</span>
          </label>
          {jenisArsip === 'Arsip Siswa' ? (
            <div className="relative">
              <select
                value={namaSubjek}
                onChange={(e) => setNamaSubjek(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 hover:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>-- Pilih Nama Siswa --</option>
                {siswaFilter.map(s => (
                  <option key={s.id} value={s.nama}>{s.nama} ({s.kelas})</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          ) : jenisArsip === 'Arsip Guru' ? (
            <div className="relative">
              <select
                value={namaSubjek}
                onChange={(e) => setNamaSubjek(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 hover:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>-- Pilih Nama Guru --</option>
                {masterGuru.map(g => (
                  <option key={g.id} value={g.nama}>{g.nama} - {g.jabatan}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              value={namaSubjek}
              onChange={(e) => setNamaSubjek(e.target.value)}
              placeholder="Contoh: Dinas Pendidikan Kab. Jombang"
              required
              className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-all"
            />
          )}
        </div>

        {/* MODE INDIVIDUAL */}
        {modeUpload === 'individual' ? (
          <div className="space-y-4 pt-1">
            {/* Kategori Arsip Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Kategori Arsip <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-blue-600 font-normal">{activeKategoriList.length} kategori tersedia</span>
              </label>
              <div className="relative">
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 hover:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {activeKategoriList.map(kat => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Nama / Judul Dokumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul / Nama Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={namaDokumen}
                onChange={(e) => setNamaDokumen(e.target.value)}
                placeholder="Contoh: Ijazah SMP Andika Pratama - Kelulusan 2024"
                required
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Native Mobile Attachment Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Berkas Dokumen <span className="text-red-500">*</span>
              </label>
              
              {!selectedFile ? (
                <label className="group flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-3xl cursor-pointer transition-all text-center">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <strong className="text-xs sm:text-sm text-slate-800 font-bold block">
                    Sentuh untuk Pilih File Dokumen
                  </strong>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Format: PDF, Foto Scan (JPG/PNG), Word (Maks. 10MB)
                  </span>
                </label>
              ) : (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block truncate">{selectedFile.name}</strong>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terlampir
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <label className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                      <span>Ganti</span>
                      <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileBase64('');
                      }}
                      className="p-1.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MODE KOLEKTIF - ADAPTED BEAUTIFULLY FOR MOBILE */
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>DAFTAR KATEGORI KOLEKTIF</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {Object.keys(kolektifFiles).length}/{activeKategoriList.length} Terpilih
              </span>
            </div>

            {/* Mobile Cards List instead of cramped table */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {activeKategoriList.map((kat, idx) => {
                const isAttached = !!kolektifFiles[kat];
                return (
                  <div 
                    key={kat} 
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isAttached ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200/90'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 block truncate">{kat}</span>
                        {isAttached && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Siap
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {isAttached ? (
                          <span className="text-emerald-700 font-medium">{kolektifFiles[kat].file.name}</span>
                        ) : (
                          'Belum ada file dipilih'
                        )}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {isAttached ? (
                        <div className="flex items-center gap-1">
                          <label className="p-2 bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold cursor-pointer">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => e.target.files && handleKolektifFile(kat, e.target.files[0])}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeKolektifFile(kat)}
                            className="p-2 bg-red-100 text-red-600 rounded-xl"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Pilih</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files && handleKolektifFile(kat, e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl animate-fadeIn space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-blue-950">
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="truncate">{progressStatus}</span>
              </span>
              <span className="text-blue-700 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons Action (Mobile-First CTA) */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full sm:w-auto order-1 sm:order-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isUploading ? 'Memproses Berkas...' : 'Unggah Dokumen Sekarang'}</span>
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="w-full sm:w-auto order-2 sm:order-1 px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-scaleUp border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">Pengarsipan Berhasil!</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Sebanyak <strong>{successInfo.count} berkas dokumen</strong> milik <strong>{successInfo.name}</strong> telah berhasil disimpan ke Google Drive dan tercatat di database E-Arsip.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                onUploadSuccess();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              Lihat di Daftar Unduh
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
