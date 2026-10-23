import React, { useState } from 'react';
import { StudentProject, ClassGrade } from '../types';
import { Printer, Download, Trophy, Award, CheckCircle2, Search } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface GradesSummaryViewProps {
  projects: StudentProject[];
  onOpenReportModal: (project?: StudentProject) => void;
  onSelectProject: (project: StudentProject) => void;
}

export const GradesSummaryView: React.FC<GradesSummaryViewProps> = ({
  projects,
  onOpenReportModal,
  onSelectProject
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassGrade>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = projects.filter(p => {
    const matchesClass = selectedClass === 'Semua' || p.classGroup === selectedClass;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leadStudent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mentorTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const totalPoints = filtered.reduce((acc, p) => acc + p.currentProgress, 0);
  const avgProgress = filtered.length > 0 ? Math.round(totalPoints / filtered.length) : 0;
  const completedCount = filtered.filter(p => p.currentProgress === 100).length;
  const totalTasksDone = filtered.reduce(
    (acc, p) => acc + p.tasks.filter(t => t.completed).length,
    0
  );
  const totalTasksAll = filtered.reduce((acc, p) => acc + p.tasks.length, 0);

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleExportCSV = () => {
    soundManager.playClick();
    const headers = ['ID', 'Judul Proyek', 'Kelas', 'Kategori', 'Ketua Tim', 'Poin (0-100)', 'Status Milestone', 'Guru Pembimbing'];
    const rows = filtered.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.classGroup,
      p.category,
      `"${p.leadStudent}"`,
      p.currentProgress,
      p.currentProgress === 100 ? 'Selesai 100%' : `${p.currentProgress}% Berjalan`,
      `"${p.mentorTeacher}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_proyek_kelas7_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 tracking-wider mb-1">
            EVALUASI AKADEMIK TIK KELAS 7
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Rekapitulasi Nilai & Poin Capaian Proyek
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan penilaian kumulatif berdasarkan laporan berkala dan penyelesaian milestone server.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Rata-rata Poin Kelas</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{avgProgress}</span>
            <span className="text-xs text-slate-400">/ 100 Poin</span>
          </div>
          <div className="text-xs text-cyan-400 mt-2 font-medium">
            Tingkat ketuntasan baik
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Proyek Capai 100% Target</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{completedCount}</span>
            <span className="text-xs text-slate-400">dari {filtered.length} Proyek</span>
          </div>
          <div className="text-xs text-amber-400/80 mt-2 font-medium">
            Lencana Juara Diraih
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Tugas Milestone Terverifikasi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{totalTasksDone}</span>
            <span className="text-xs text-slate-400">/ {totalTasksAll} Tahapan</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {Math.round((totalTasksDone / (totalTasksAll || 1)) * 100)}% Tugas Selesai
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Total Kelompok Siswa</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{filtered.length}</span>
            <span className="text-xs text-slate-400">Tim Aktif</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Kelas 7A, 7B, dan 7C
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
          {/* Class Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {(['Semua', 'Kelas 7A', 'Kelas 7B', 'Kelas 7C'] as ClassGrade[]).map(cls => (
              <button
                key={cls}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedClass(cls);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter nama proyek / siswa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs text-white bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Proyek & Kategori</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Ketua Tim</th>
                <th className="py-3 px-4">Pembimbing</th>
                <th className="py-3 px-4 text-right">Tahap Selesai</th>
                <th className="py-3 px-4 text-right">Poin Capaian</th>
                <th className="py-3 px-4 text-center">Status Target</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal">
              {filtered.map(proj => {
                const tasksDone = proj.tasks.filter(t => t.completed).length;
                const is100 = proj.currentProgress === 100;

                return (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      soundManager.playClick();
                      onSelectProject(proj);
                    }}
                  >
                    <td className="py-3 px-4 font-medium text-white max-w-xs">
                      <div className="truncate font-semibold">{proj.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{proj.category}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{proj.classGroup}</td>
                    <td className="py-3 px-4 text-slate-200">{proj.leadStudent}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{proj.mentorTeacher}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {tasksDone} / {proj.tasks.length}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-mono font-bold text-sm tabular-nums ${
                          is100 ? 'text-amber-400' : 'text-cyan-400'
                        }`}
                      >
                        {proj.currentProgress}
                      </span>
                      <span className="text-slate-500 text-[11px]"> / 100</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {is100 ? (
                        <span className="text-amber-400 font-medium text-xs inline-flex items-center gap-1 justify-center">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>100% Juara</span>
                        </span>
                      ) : proj.currentProgress >= 75 ? (
                        <span className="text-cyan-400 text-xs">75% Ahli</span>
                      ) : proj.currentProgress >= 50 ? (
                        <span className="text-emerald-400 text-xs">50% Penjelajah</span>
                      ) : (
                        <span className="text-blue-400 text-xs">25% Arsitek</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          soundManager.playClick();
                          onOpenReportModal(proj);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      >
                        Lapor
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
