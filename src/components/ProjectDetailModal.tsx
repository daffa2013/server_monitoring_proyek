import React from 'react';
import { StudentProject, ServerNode } from '../types';
import { X, CheckCircle2, Circle, Users, ExternalLink, Trophy, Server, Plus, Calendar } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ProjectDetailModalProps {
  project: StudentProject | null;
  serverNode?: ServerNode;
  onClose: () => void;
  onOpenReportModal: (project: StudentProject) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  serverNode,
  onClose,
  onOpenReportModal,
  onToggleTask
}) => {
  if (!project) return null;

  const is100 = project.currentProgress === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span className="text-cyan-400 font-semibold">{project.classGroup}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>Pembimbing: {project.mentorTeacher}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
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

        {/* Modal Content Scrollable Area */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* 100% Celebration Banner if Complete */}
          {is100 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 flex items-center gap-3 text-amber-200">
              <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Target 100% Poin Sempurna Tercapai!</h4>
                <p className="text-xs text-amber-300/90 mt-0.5">
                  Tim ini telah menuntaskan seluruh milestone pengembangan perangkat lunak dan lolos uji performa server.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Deskripsi Proyek
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Points Progress */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Poin Akumulasi Siswa</span>
              <span className="font-mono font-bold text-base text-white">
                <span className={is100 ? 'text-amber-400' : 'text-cyan-400'}>{project.currentProgress}</span> / 100 Poin
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  is100 ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
                style={{ width: `${project.currentProgress}%` }}
              />
            </div>
          </div>

          {/* Team Members */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Susunan Anggota Tim Siswa ({project.classGroup})</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {project.teamMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-slate-200"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>

          {/* Connected Server Node */}
          {serverNode && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    Infrastruktur Hosting Proyek
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {serverNode.latencyMs}ms Latensi
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{serverNode.name}</span>
                <span className="font-mono">{serverNode.ipAddress}</span>
              </div>
            </div>
          )}

          {/* Task Milestones List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Daftar Capaian Milestone (Total 100 Poin)
              </h4>
              <span className="text-xs text-slate-500">Klik untuk verifikasi cepat</span>
            </div>

            <div className="space-y-2">
              {project.tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => {
                    soundManager.playClick();
                    onToggleTask(project.id, task.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? 'bg-slate-950/70 border-slate-800/80'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span
                        className={`font-semibold ${
                          task.completed ? 'text-slate-300 line-through' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold ml-2 shrink-0">
                        +{task.weight} Poin
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {task.description}
                    </p>

                    {task.notes && (
                      <div className="p-2 bg-slate-900 rounded-md text-[11px] text-slate-300 mb-2">
                        <span className="font-semibold text-slate-400">Catatan Siswa:</span> {task.notes}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      {task.submittedBy && <span>Pelapor: {task.submittedBy}</span>}
                      {task.completedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{task.completedAt}</span>
                        </>
                      )}
                      {task.submissionLink && (
                        <>
                          <span aria-hidden="true">·</span>
                          <a
                            href={task.submissionLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline"
                          >
                            <span>Bukti Karya</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Dibuat {project.createdAt} · Update {project.lastUpdated}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onOpenReportModal(project);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Lapor Aktivitas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
