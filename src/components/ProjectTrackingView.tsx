import React, { useState } from 'react';
import { StudentProject, ClassGrade } from '../types';
import { Search, Trophy, CheckCircle2, Circle, Users, ArrowUpRight, Award, Plus, Server } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ProjectTrackingViewProps {
  projects: StudentProject[];
  onSelectProject: (project: StudentProject) => void;
  onOpenReportModal: (project?: StudentProject) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
}

export const ProjectTrackingView: React.FC<ProjectTrackingViewProps> = ({
  projects,
  onSelectProject,
  onOpenReportModal,
  onToggleTask
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassGrade>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgress, setFilterProgress] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredProjects = projects.filter(p => {
    const matchesClass = selectedClass === 'Semua' || p.classGroup === selectedClass;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.leadStudent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamMembers.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      filterProgress === 'all'
        ? true
        : filterProgress === 'completed'
        ? p.currentProgress === 100
        : p.currentProgress < 100;
    return matchesClass && matchesQuery && matchesStatus;
  });

  const getMilestoneBadge = (progress: number) => {
    if (progress === 100) return { label: 'Juara 100% Sempurna', color: 'text-amber-300' };
    if (progress >= 75) return { label: 'Ahli Sistem (75%+)', color: 'text-cyan-400' };
    if (progress >= 50) return { label: 'Penjelajah Kode (50%+)', color: 'text-emerald-400' };
    if (progress >= 25) return { label: 'Arsitek Muda (25%+)', color: 'text-blue-400' };
    return { label: 'Tahap Persiapan', color: 'text-slate-400' };
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 tracking-wider mb-1">
            SISTEM CAPAIAN SISWA KELAS 7
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pelacak Progres & Poin Proyek Siswa
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Setiap laporan aktivitas tim menyumbangkan poin menuju target 100% dengan lencana prestasi bertingkat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenReportModal();
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lapor Aktivitas Proyek</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul proyek, ketua, atau anggota tim..."
              className="w-full pl-9 pr-4 py-2 text-xs text-white bg-slate-950 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Class Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
            {(['Semua', 'Kelas 7A', 'Kelas 7B', 'Kelas 7C'] as ClassGrade[]).map(cls => (
              <button
                key={cls}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedClass(cls);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Progress State Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                setFilterProgress('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterProgress === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setFilterProgress('in_progress');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterProgress === 'in_progress'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Berjalan
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setFilterProgress('completed');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterProgress === 'completed'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Selesai 100%
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map(project => {
          const badge = getMilestoneBadge(project.currentProgress);
          const isComplete = project.currentProgress === 100;

          return (
            <div
              key={project.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all ${
                isComplete
                  ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="text-cyan-400 font-semibold">{project.classGroup}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{project.mentorTeacher}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {project.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectProject(project);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Buka Rincian Proyek"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Progress & Points Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-baseline text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base font-mono tabular-nums">
                      {project.currentProgress}
                    </span>
                    <span className="text-slate-400">/ 100 Poin</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className={`font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  {isComplete && (
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Target Tercapai!</span>
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isComplete
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm shadow-amber-400/50'
                        : project.currentProgress >= 75
                        ? 'bg-cyan-400'
                        : project.currentProgress >= 50
                        ? 'bg-emerald-400'
                        : 'bg-blue-400'
                    }`}
                    style={{ width: `${project.currentProgress}%` }}
                  />
                </div>

                {/* Milestone Targets Indicator */}
                <div className="flex justify-between text-[11px] text-slate-500 font-mono px-1">
                  <span className={project.currentProgress >= 25 ? 'text-blue-400' : ''}>25%</span>
                  <span className={project.currentProgress >= 50 ? 'text-emerald-400' : ''}>50%</span>
                  <span className={project.currentProgress >= 75 ? 'text-cyan-400' : ''}>75%</span>
                  <span className={project.currentProgress >= 100 ? 'text-amber-400 font-bold' : ''}>100% Target</span>
                </div>
              </div>

              {/* Task Checklist Interactive Strip */}
              <div className="space-y-2 mb-5 pt-3 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Tahapan Milestone Proyek:
                </div>
                {project.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => {
                      soundManager.playClick();
                      onToggleTask(project.id, task.id);
                    }}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800/60 transition-colors cursor-pointer group"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-medium truncate ${
                            task.completed ? 'text-slate-300 line-through' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="font-mono text-cyan-400 text-[11px] ml-2 shrink-0">
                          +{task.weight} Poin
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 truncate">
                  <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">Tim: {project.leadStudent} & {project.teamMembers.length - 1} lainnya</span>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenReportModal(project);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors cursor-pointer shrink-0"
                >
                  + Lapor Tahap Ini
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="lg:col-span-2 p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-slate-400">Tidak ada proyek yang sesuai dengan kata kunci atau filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('Semua');
                setFilterProgress('all');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
