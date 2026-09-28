import React, { useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  FolderOpen, 
  GraduationCap, 
  Briefcase, 
  Boxes, 
  CloudUpload, 
  FolderCheck, 
  HardDrive, 
  FilePlus, 
  ArrowUpRight,
  TrendingUp,
  Download,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { getStoredArsip, getStoredMasterSiswa } from '../data/mockDatabase';

Chart.register(...registerables);

interface DashboardViewProps {
  onNavigate: (view: 'upload' | 'unduh' | 'rekap' | 'laporan', subcategory?: 'Arsip Siswa' | 'Arsip Guru' | 'Arsip Lainnya') => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const donutChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);

  const allArsip = getStoredArsip();
  const allSiswa = getStoredMasterSiswa();

  // Calculate Metrics
  const totalArsip = allArsip.length;
  const siswaArsip = allArsip.filter(a => a.kategoriUtama === 'Arsip Siswa').length;
  const guruArsip = allArsip.filter(a => a.kategoriUtama === 'Arsip Guru').length;
  const lainnyaArsip = allArsip.filter(a => a.kategoriUtama === 'Arsip Lainnya').length;

  // Insight metrics
  const todayStr = new Date().toLocaleDateString('id-ID');
  const uploadHariIni = allArsip.filter(a => a.tanggal === todayStr).length;

  // Category distribution
  const kategoriCountMap: { [cat: string]: number } = {};
  allArsip.forEach(a => {
    kategoriCountMap[a.kategori] = (kategoriCountMap[a.kategori] || 0) + 1;
  });

  const sortedCategories = Object.entries(kategoriCountMap).sort((a, b) => b[1] - a[1]);
  const topKategoriEntry = sortedCategories[0] || ['Belum Ada', 0];
  const topKategoriPct = totalArsip > 0 ? Math.round((topKategoriEntry[1] / totalArsip) * 100) : 0;
  const latestItem = allArsip[0] ? `${allArsip[0].subjek} (${allArsip[0].kategori})` : '-';

  // Siswa per angkatan
  const siswaPerTahun: { [th: string]: number } = {};
  allSiswa.forEach(s => {
    siswaPerTahun[s.tahun] = (siswaPerTahun[s.tahun] || 0) + 1;
  });
  const angkatanLabels = Object.keys(siswaPerTahun).sort();
  const angkatanData = angkatanLabels.map(th => siswaPerTahun[th]);

  // Donut chart colors
  const donutColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  useEffect(() => {
    // 1. Donut Chart
    if (donutCanvasRef.current) {
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }

      const labels = sortedCategories.slice(0, 6).map(e => e[0]);
      const data = sortedCategories.slice(0, 6).map(e => e[1]);

      donutChartInstance.current = new Chart(donutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['Belum Ada'],
          datasets: [{
            data: data.length > 0 ? data : [1],
            backgroundColor: donutColors.slice(0, labels.length || 1),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // 2. Bar Chart
    if (barCanvasRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const ctx = barCanvasRef.current.getContext('2d');
      let gradient: any = '#3b82f6';
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.95)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
      }

      barChartInstance.current = new Chart(barCanvasRef.current, {
        type: 'bar',
        data: {
          labels: angkatanLabels.map(th => `Angkatan ${th}`),
          datasets: [{
            label: 'Jumlah Siswa',
            data: angkatanData,
            backgroundColor: gradient,
            borderRadius: 8,
            maxBarThickness: 55
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    }

    return () => {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [allArsip, allSiswa]);

  return (
    <div className="space-y-6 animate-fadeIn font-['Poppins']">
      
      {/* 1. HERO INSIGHT CARD */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-slate-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-600 to-indigo-600" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Insight Hari Ini</h2>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Update
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <CloudUpload className="w-3.5 h-3.5 text-blue-500" />
                  Statistik Upload
                </span>
                <p className="text-sm font-bold text-slate-900">
                  +{uploadHariIni} <small className="text-xs font-normal text-slate-500">file baru hari ini</small>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <FolderCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Kategori Terbesar
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {topKategoriEntry[0]} <small className="text-xs text-emerald-600 font-semibold">({topKategoriPct}%)</small>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                  Storage Google Drive
                </span>
                <p className="text-sm font-bold text-slate-900">
                  68.4 GB <small className="text-xs font-normal text-slate-500">dari 100 GB terpakai</small>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <FilePlus className="w-3.5 h-3.5 text-amber-500" />
                  Arsip Terbaru Hari Ini
                </span>
                <p className="text-sm font-bold text-slate-900 truncate" title={latestItem}>
                  {latestItem}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Arsip */}
        <div className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_10px_25px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <FolderOpen className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold">{totalArsip}</h3>
            <p className="text-xs font-medium text-blue-100 mt-1">Total Arsip Tersimpan</p>
          </div>
          <div className="pt-3 border-t border-white/20 text-[11px] text-blue-100">
            Terhubung ke Google Drive E-Arsip
          </div>
        </div>

        {/* Arsip Siswa */}
        <div className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_10px_25px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              Siswa
            </span>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold">{siswaArsip}</h3>
            <p className="text-xs font-medium text-emerald-100 mt-1">Arsip Data Siswa</p>
          </div>
          <div className="pt-3 border-t border-white/20 text-[11px] text-emerald-100">
            Total {allSiswa.length} data siswa terdaftar
          </div>
        </div>

        {/* Arsip Guru */}
        <div className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_10px_25px_rgba(245,158,11,0.25)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              Guru
            </span>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold">{guruArsip}</h3>
            <p className="text-xs font-medium text-amber-100 mt-1">Arsip Data Guru</p>
          </div>
          <div className="pt-3 border-t border-white/20 text-[11px] text-amber-100">
            14 kategori berkas kepegawaian
          </div>
        </div>

        {/* Arsip Lainnya */}
        <div className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-purple-500 to-purple-700 shadow-[0_10px_25px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              <Boxes className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              Lainnya
            </span>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold">{lainnyaArsip}</h3>
            <p className="text-xs font-medium text-purple-100 mt-1">Arsip Lain Nya</p>
          </div>
          <div className="pt-3 border-t border-white/20 text-[11px] text-purple-100">
            Surat masuk, keluar & LPJ sekolah
          </div>
        </div>

      </section>

      {/* 3. CHARTS GRID (2 COLUMNS SEJAJAR) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kotak Kiri: Upload per Kategori */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Upload per Kategori</h4>
              <p className="text-xs text-slate-500">Distribusi persentase & jumlah berkas</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
              <canvas ref={donutCanvasRef} />
            </div>

            <div className="flex-1 w-full space-y-2 max-h-48 overflow-y-auto pr-2">
              {sortedCategories.slice(0, 5).map(([label, count], i) => {
                const pct = totalArsip > 0 ? ((count / totalArsip) * 100).toFixed(1) : '0';
                return (
                  <div key={label} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: donutColors[i % donutColors.length] }} 
                      />
                      <span className="font-medium text-slate-700 truncate max-w-[130px]">{label}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-slate-900">{pct}%</strong>
                      <span className="text-slate-400 text-[10px] ml-1">({count})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kotak Kanan: Grafik Jumlah Siswa */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">Grafik Jumlah Siswa</h4>
              <p className="text-xs text-slate-500">Berdasarkan tahun angkatan master data</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Angkatan</span>
            </span>
          </div>

          <div className="w-full h-56 relative">
            <canvas ref={barCanvasRef} />
          </div>
        </div>

      </section>

      {/* 4. QUICK SHORTCUTS ACTIONS */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Aksi Cepat Pengarsipan</h3>
            <p className="text-xs text-slate-400">Pilih menu cepat untuk memproses pengarsipan digital sekolah</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('upload', 'Arsip Siswa')}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <strong className="block text-sm font-semibold text-white">Upload Siswa</strong>
            <span className="text-[11px] text-slate-400">Unggah berkas alumni</span>
          </button>

          <button
            onClick={() => onNavigate('upload', 'Arsip Guru')}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <strong className="block text-sm font-semibold text-white">Upload Guru</strong>
            <span className="text-[11px] text-slate-400">Berkas kepegawaian</span>
          </button>

          <button
            onClick={() => onNavigate('unduh', 'Arsip Siswa')}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <strong className="block text-sm font-semibold text-white">Unduh Arsip</strong>
            <span className="text-[11px] text-slate-400">Pencarian & direct download</span>
          </button>

          <button
            onClick={() => onNavigate('rekap')}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:-translate-y-1 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <strong className="block text-sm font-semibold text-white">Rekap Matriks</strong>
            <span className="text-[11px] text-slate-400">Cek status kelengkapan</span>
          </button>
        </div>
      </section>

    </div>
  );
}
