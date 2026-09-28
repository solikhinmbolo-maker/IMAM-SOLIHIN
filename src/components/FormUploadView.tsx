import React, { useState, useEffect } from 'react';
import { 
  CloudUpload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  Check, 
  Sparkles,
  ArrowRight
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
    if (activeKategoriList.length > 0 && !kategori) {
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
      setErrorMessage('Mohon lengkapi nama siswa/guru/instansi.');
      return;
    }

    if (modeUpload === 'individual') {
      if (!selectedFile) {
        setErrorMessage('Mohon pilih file berkas terlebih dahulu.');
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
        setErrorMessage('Pilih minimal 1 berkas pada tabel kategori untuk upload kolektif.');
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

            // Save all items
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-slate-200/80 animate-fadeIn font-['Poppins']">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner">
            <CloudUpload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Formulir Pengarsipan Dokumen</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">Kategori Aktif:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                {jenisArsip}
              </span>
            </div>
          </div>
        </div>

        {/* Switcher Mode: Individual vs Kolektif */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setModeUpload('individual')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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

      {/* Target Category Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-2">Target Berkas:</span>
        {(['Arsip Siswa', 'Arsip Guru', 'Arsip Lainnya'] as const).map(j => (
          <button
            key={j}
            type="button"
            onClick={() => {
              setJenisArsip(j);
              setNamaSubjek('');
              setIdentitas('');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              jenisArsip === j
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {j}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Tahun & NISN/NIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {jenisArsip === 'Arsip Siswa' ? 'Tahun Lulus / Angkatan' : 
               jenisArsip === 'Arsip Guru' ? 'Tahun Penerbitan SK' : 'Tahun Dokumen'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            {jenisArsip === 'Arsip Siswa' ? (
              <select
                value={tahun}
                onChange={(e) => {
                  setTahun(e.target.value);
                  setNamaSubjek('');
                }}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="" disabled>-- Pilih Tahun Angkatan --</option>
                {tahunList.map(t => (
                  <option key={t} value={t}>Angkatan {t}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                placeholder="Contoh: 2026"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {jenisArsip === 'Arsip Siswa' ? 'NISN / NIS' : 
               jenisArsip === 'Arsip Guru' ? 'NIP / NUPTK' : 'Nomor Surat / Kode'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={identitas}
              onChange={(e) => setIdentitas(e.target.value)}
              readOnly={jenisArsip !== 'Arsip Lainnya'}
              placeholder={jenisArsip === 'Arsip Lainnya' ? 'Masukkan nomor surat / kode berkas' : 'Pilih Nama untuk memunculkan otomatis'}
              required
              className={`w-full px-4 py-3 rounded-xl text-sm border transition-all ${
                jenisArsip === 'Arsip Lainnya'
                  ? 'bg-white border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-600 font-mono'
              }`}
            />
          </div>
        </div>

        {/* Row 2: Nama Subjek / Siswa / Guru */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            {jenisArsip === 'Arsip Siswa' ? 'Nama Siswa / Alumni' : 
             jenisArsip === 'Arsip Guru' ? 'Nama Guru / Pegawai' : 'Nama Instansi / Perihal Surat'}
            <span className="text-red-500 ml-1">*</span>
          </label>
          {jenisArsip === 'Arsip Siswa' ? (
            <select
              value={namaSubjek}
              onChange={(e) => setNamaSubjek(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="" disabled>-- Pilih Nama Siswa --</option>
              {siswaFilter.map(s => (
                <option key={s.id} value={s.nama}>{s.nama} ({s.kelas})</option>
              ))}
            </select>
          ) : jenisArsip === 'Arsip Guru' ? (
            <select
              value={namaSubjek}
              onChange={(e) => setNamaSubjek(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="" disabled>-- Pilih Nama Guru --</option>
              {masterGuru.map(g => (
                <option key={g.id} value={g.nama}>{g.nama} - {g.jabatan}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={namaSubjek}
              onChange={(e) => setNamaSubjek(e.target.value)}
              placeholder="Contoh: Dinas Pendidikan Kab. Jombang"
              required
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          )}
        </div>

        {/* MODE INDIVIDUAL */}
        {modeUpload === 'individual' ? (
          <div className="space-y-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Nama / Judul Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={namaDokumen}
                onChange={(e) => setNamaDokumen(e.target.value)}
                placeholder="Contoh: Ijazah SMP Andika Pratama - Kelulusan 2024"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Kategori Arsip <span className="text-red-500">*</span>
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {activeKategoriList.map(kat => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Pilih Berkas Dokumen <span className="text-red-500">*</span>
              </label>
              <label className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl cursor-pointer transition-all">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <CloudUpload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                  {selectedFile ? selectedFile.name : 'Klik untuk cari atau jatuhkan file di sini'}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Format bebas (PDF, Gambar, Word) Maksimal 10MB
                </span>
                {selectedFile && (
                  <span className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Berkas terpilih ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </span>
                )}
              </label>
            </div>
          </div>
        ) : (
          /* MODE KOLEKTIF */
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>DAFTAR KATEGORI BERKAS SUBJEK</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Terlampir: <strong>{Object.keys(kolektifFiles).length}</strong> dari {activeKategoriList.length} kategori
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-3 px-4 font-bold w-1/3">Kategori Dokumen</th>
                    <th className="py-3 px-4 font-bold w-5/12">Status / Nama Berkas</th>
                    <th className="py-3 px-4 font-bold text-right w-1/4">Aksi Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeKategoriList.map(kat => {
                    const isAttached = !!kolektifFiles[kat];
                    return (
                      <tr key={kat} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          📄 {kat}
                        </td>
                        <td className="py-3 px-4">
                          {isAttached ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1.5 truncate max-w-xs">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{kolektifFiles[kat].file.name}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-slate-300" />
                              Belum terlampir
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            {isAttached ? (
                              <>
                                <label className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> Ganti
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => e.target.files && handleKolektifFile(kat, e.target.files[0])}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeKolektifFile(kat)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus Berkas"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <label className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                                <CloudUpload className="w-3 h-3" /> Pilih File
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => e.target.files && handleKolektifFile(kat, e.target.files[0])}
                                />
                              </label>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {progressStatus}
              </span>
              <span className="text-blue-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isUploading ? 'Memproses...' : 'Mulai Unggah Arsip'}</span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scaleUp border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pengarsipan Berhasil!</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Sebanyak <strong>{successInfo.count} dokumen</strong> milik <strong>{successInfo.name}</strong> berhasil diunggah ke Google Drive dan disinkronkan ke database E-Arsip.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                onUploadSuccess();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Selesai & Lihat Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
