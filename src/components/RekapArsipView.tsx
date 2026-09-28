import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Search, 
  Check, 
  X, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  Eye,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  MasterSiswaItem, 
  MasterGuruItem, 
  ArsipItem, 
  KATEGORI_SISWA, 
  KATEGORI_GURU,
  getStoredMasterSiswa, 
  getStoredMasterGuru, 
  getStoredArsip 
} from '../data/mockDatabase';

interface RekapArsipViewProps {
  onPreview: (item: ArsipItem) => void;
}

export default function RekapArsipView({ onPreview }: RekapArsipViewProps) {
  const [targetKelompok, setTargetKelompok] = useState<'Siswa' | 'Guru'>('Siswa');
  const [searchName, setSearchName] = useState('');

  const masterSiswa = getStoredMasterSiswa();
  const masterGuru = getStoredMasterGuru();
  const allArsip = getStoredArsip();

  // Matriks Siswa
  const siswaMatrix = useMemo(() => {
    return masterSiswa.map((siswa, idx) => {
      // Find all archives for this student
      const userArchives = allArsip.filter(
        a => a.kategoriUtama === 'Arsip Siswa' && 
        (a.subjek.toLowerCase().includes(siswa.nama.toLowerCase()) || a.identitas === siswa.nisn)
      );

      const statusMap: { [kat: string]: boolean } = {};
      let completedCount = 0;

      KATEGORI_SISWA.forEach(kat => {
        const found = userArchives.some(a => {
          const aKat = a.kategori.toLowerCase();
          const target = kat.toLowerCase();
          return aKat.includes(target) || target.includes(aKat);
        });
        statusMap[kat] = found;
        if (found) completedCount++;
      });

      return {
        no: idx + 1,
        nama: siswa.nama,
        tahun: siswa.tahun,
        nisn: siswa.nisn,
        kelas: siswa.kelas,
        statusMap,
        completedCount,
        total: KATEGORI_SISWA.length,
        userArchives
      };
    });
  }, [masterSiswa, allArsip]);

  // Matriks Guru
  const guruMatrix = useMemo(() => {
    return masterGuru.map((guru, idx) => {
      const userArchives = allArsip.filter(
        a => a.kategoriUtama === 'Arsip Guru' && 
        (a.subjek.toLowerCase().includes(guru.nama.toLowerCase()) || a.identitas === guru.nuptk)
      );

      const statusMap: { [kat: string]: boolean } = {};
      let completedCount = 0;

      KATEGORI_GURU.forEach(kat => {
        const found = userArchives.some(a => {
          const aKat = a.kategori.toLowerCase();
          const target = kat.toLowerCase();
          return aKat.includes(target) || target.includes(aKat);
        });
        statusMap[kat] = found;
        if (found) completedCount++;
      });

      return {
        no: idx + 1,
        nama: guru.nama,
        nuptk: guru.nuptk,
        jabatan: guru.jabatan,
        statusMap,
        completedCount,
        total: KATEGORI_GURU.length,
        userArchives
      };
    });
  }, [masterGuru, allArsip]);

  // Filtered rows by search
  const filteredSiswa = useMemo(() => {
    const q = searchName.toLowerCase().trim();
    if (!q) return siswaMatrix;
    return siswaMatrix.filter(s => s.nama.toLowerCase().includes(q) || s.nisn.includes(q));
  }, [siswaMatrix, searchName]);

  const filteredGuru = useMemo(() => {
    const q = searchName.toLowerCase().trim();
    if (!q) return guruMatrix;
    return guruMatrix.filter(g => g.nama.toLowerCase().includes(q) || g.nuptk.includes(q));
  }, [guruMatrix, searchName]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-slate-200/80 animate-fadeIn font-['Poppins']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span>Matriks Rekap Kelengkapan Berkas</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status kelengkapan dokumen yang sudah dan belum diunggah secara menyeluruh
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span>✅ Lengkap</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
            <span>❌ Belum Ada</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Kelompok:</label>
          <div className="flex rounded-xl bg-white border border-slate-300 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setTargetKelompok('Siswa')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                targetKelompok === 'Siswa' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Siswa ({masterSiswa.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetKelompok('Guru')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                targetKelompok === 'Guru' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Guru ({masterGuru.length})</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Cari Nama {targetKelompok}:
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={`Ketik nama ${targetKelompok.toLowerCase()} untuk menyaring matriks...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* MATRIX TABLE: SISWA */}
      {targetKelompok === 'Siswa' ? (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-3 px-3 w-10 text-center">NO</th>
                <th className="py-3 px-4 min-w-[180px]">NAMA SISWA</th>
                <th className="py-3 px-3 text-center">TH. LULUS</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                {KATEGORI_SISWA.map(kat => (
                  <th key={kat} className="py-3 px-2 text-center font-bold tracking-tight text-[11px] max-w-[90px] whitespace-normal">
                    {kat.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-slate-400 font-medium">
                    Data siswa tidak ditemukan dengan kata kunci "{searchName}".
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((row, idx) => {
                  const percent = Math.round((row.completedCount / row.total) * 100);
                  const isAllComplete = row.completedCount === row.total;

                  return (
                    <tr key={row.nisn} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block font-semibold">{row.nama}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">NISN: {row.nisn} • {row.kelas}</span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700 font-semibold">{row.tahun}</td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAllComplete ? 'bg-emerald-100 text-emerald-800' :
                          row.completedCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.completedCount}/{row.total} ({percent}%)
                        </span>
                      </td>
                      {KATEGORI_SISWA.map(kat => {
                        const hasDoc = row.statusMap[kat];
                        const matchedDoc = row.userArchives.find(a => {
                          const aKat = a.kategori.toLowerCase();
                          const target = kat.toLowerCase();
                          return aKat.includes(target) || target.includes(aKat);
                        });

                        return (
                          <td key={kat} className="py-3 px-2 text-center">
                            {hasDoc ? (
                              <button
                                type="button"
                                onClick={() => matchedDoc && onPreview(matchedDoc)}
                                title={`Sudah Diunggah: Klik untuk Preview`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                              >
                                ✅
                              </button>
                            ) : (
                              <span 
                                title="Belum Diunggah" 
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold"
                              >
                                ❌
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* MATRIX TABLE: GURU */
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
          <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-3 px-3 w-10 text-center">NO</th>
                <th className="py-3 px-4 min-w-[200px]">NAMA GURU / PEGAWAI</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                {KATEGORI_GURU.map(kat => (
                  <th key={kat} className="py-3 px-2 text-center font-bold tracking-tight text-[10px] max-w-[85px] whitespace-normal">
                    {kat.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={17} className="py-8 text-center text-slate-400 font-medium">
                    Data guru tidak ditemukan dengan kata kunci "{searchName}".
                  </td>
                </tr>
              ) : (
                filteredGuru.map((row, idx) => {
                  const percent = Math.round((row.completedCount / row.total) * 100);
                  const isAllComplete = row.completedCount === row.total;

                  return (
                    <tr key={row.nuptk} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block font-semibold">{row.nama}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">NUPTK: {row.nuptk} • {row.jabatan}</span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAllComplete ? 'bg-emerald-100 text-emerald-800' :
                          row.completedCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row.completedCount}/{row.total} ({percent}%)
                        </span>
                      </td>
                      {KATEGORI_GURU.map(kat => {
                        const hasDoc = row.statusMap[kat];
                        const matchedDoc = row.userArchives.find(a => {
                          const aKat = a.kategori.toLowerCase();
                          const target = kat.toLowerCase();
                          return aKat.includes(target) || target.includes(aKat);
                        });

                        return (
                          <td key={kat} className="py-3 px-2 text-center">
                            {hasDoc ? (
                              <button
                                type="button"
                                onClick={() => matchedDoc && onPreview(matchedDoc)}
                                title={`Sudah Diunggah: Klik untuk Preview`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                              >
                                ✅
                              </button>
                            ) : (
                              <span 
                                title="Belum Diunggah" 
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold"
                              >
                                ❌
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
