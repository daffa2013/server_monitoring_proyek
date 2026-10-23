import React, { useState, useEffect } from 'react';
import { StudentProject, MilestoneTask } from '../types';
import { X, CheckCircle, Trophy, Sparkles, Link as LinkIcon, FileText } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ReportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StudentProject[];
  initialProject?: StudentProject | null;
  onSubmitReport: (
    projectId: string,
    taskId: string,
    reporterName: string,
    notes: string,
    link: string
  ) => void;
}

export const ReportProgressModal: React.FC<ReportProgressModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProject,
  onSubmitReport
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    if (initialProject) {
      setSelectedProjectId(initialProject.id);
      const uncompletedTask = initialProject.tasks.find(t => !t.completed);
      setSelectedTaskId(uncompletedTask ? uncompletedTask.id : initialProject.tasks[0]?.id || '');
      setReporterName(initialProject.leadStudent);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
      const uncompleted = projects[0].tasks.find(t => !t.completed);
      setSelectedTaskId(uncompleted ? uncompleted.id : projects[0].tasks[0]?.id || '');
      setReporterName(projects[0].leadStudent);
    }
  }, [initialProject, projects, isOpen]);

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const activeTask = activeProject?.tasks.find(t => t.id === selectedTaskId);

  // Calculate projected new progress
  const currentProgress = activeProject ? activeProject.currentProgress : 0;
  const taskWeight = activeTask && !activeTask.completed ? activeTask.weight : 0;
  const projectedProgress = Math.min(100, currentProgress + taskWeight);
  const willReach100 = projectedProgress === 100 && currentProgress < 100;

  if (!isOpen || !activeProject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedTaskId || !reporterName.trim()) return;

    soundManager.playClick();
    onSubmitReport(selectedProjectId, selectedTaskId, reporterName, notes, link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <span className="text-xs font-semibold text-cyan-400 tracking-wider">PELAPORAN PROGRES TAHAP</span>
            <h2 className="text-lg font-bold text-white">Lapor Capaian Proyek Siswa</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Select Project */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Pilih Proyek Tim</label>
            <select
              value={selectedProjectId}
              onChange={e => {
                const projId = e.target.value;
                setSelectedProjectId(projId);
                const proj = projects.find(p => p.id === projId);
                const uncompleted = proj?.tasks.find(t => !t.completed);
                setSelectedTaskId(uncompleted ? uncompleted.id : proj?.tasks[0]?.id || '');
                if (proj) setReporterName(proj.leadStudent);
              }}
              className="w-full px-3 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.classGroup} · {p.currentProgress}% Poin)
                </option>
              ))}
            </select>
          </div>

          {/* Select Task Milestone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Pilih Tahapan yang Diselesaikan</label>
            <div className="space-y-2">
              {activeProject.tasks.map(task => {
                const isSelected = task.id === selectedTaskId;
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      if (!task.completed) {
                        soundManager.playClick();
                        setSelectedTaskId(task.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      task.completed
                        ? 'opacity-50 bg-slate-950/40 border-slate-900 cursor-not-allowed'
                        : isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <span className="font-semibold block truncate">{task.title}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{task.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-cyan-400 block">+{task.weight} Poin</span>
                      <span className="text-[10px] text-slate-500">
                        {task.completed ? 'Sudah Selesai' : 'Siap Lapor'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projected Points Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Proyeksi Poin Proyek:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold">
                <span className="text-slate-400">{currentProgress}%</span>
                <span className="text-slate-600">→</span>
                <span className="text-cyan-400 text-sm">{projectedProgress}% Poin</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  willReach100 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${projectedProgress}%` }}
              />
            </div>

            {willReach100 && (
              <div className="flex items-center gap-2 pt-1 text-xs text-amber-300 font-semibold">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Laporan ini akan melengkapi target 100% dan membuka lencana Juara!</span>
              </div>
            )}
          </div>

          {/* Reporter Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Nama Siswa Pelapor</label>
            <input
              type="text"
              required
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              placeholder="Contoh: Fajar Pratama"
              className="w-full px-3 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Activity Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Catatan Pengerjaan & Temuan</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Jelaskan apa yang berhasil tim kerjakan, kendala yang diatasi, atau hasil pengujian server..."
              className="w-full px-3 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Evidence Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Tautan Bukti / Repositori / Demo (Opsional)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://github.com/... atau tautan Google Drive / Figma"
                className="w-full pl-9 pr-3 py-2 text-xs text-white bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!activeTask || activeTask.completed}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md ${
                willReach100
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-500/20'
                  : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-cyan-500/20'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan & Tambah Poin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
