import React from 'react';
import { Plus, Volume2, VolumeX, Bell } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TopNavProps {
  activeTab: 'telemetry' | 'projects' | 'simulator' | 'education' | 'grades';
  onSelectTab: (tab: 'telemetry' | 'projects' | 'simulator' | 'education' | 'grades') => void;
  onOpenReportModal: () => void;
  unreadNotifCount: number;
  onOpenNotifDrawer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal,
  unreadNotifCount,
  onOpenNotifDrawer,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectTab('telemetry');
            }}
            className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-cyan-400 transition-colors">
              ServerEdu Kelas 7
            </span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectTab('telemetry');
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Metrik Server
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectTab('projects');
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Proyek Siswa
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectTab('simulator');
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Simulasi Beban
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectTab('education');
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'education'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pojok Belajar
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectTab('grades');
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 cursor-pointer ${
                activeTab === 'grades'
                  ? 'border-cyan-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Rekap Nilai
            </button>
          </nav>

          {/* Zone 3: 1 primary action with secondary utility icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleMute();
              }}
              title={isMuted ? 'Nyalakan Efek Suara' : 'Senyapkan Suara'}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenNotifDrawer();
              }}
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Notifikasi Siswa"
              title="Notifikasi Progres & Target"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenReportModal();
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Lapor Progres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800/80 overflow-x-auto gap-2">
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'telemetry' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Metrik Server
        </button>
        <button
          onClick={() => onSelectTab('projects')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'projects' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Proyek Siswa
        </button>
        <button
          onClick={() => onSelectTab('simulator')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'simulator' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Simulasi Beban
        </button>
        <button
          onClick={() => onSelectTab('education')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'education' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Pojok Belajar
        </button>
        <button
          onClick={() => onSelectTab('grades')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'grades' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Rekap Nilai
        </button>
      </div>
    </header>
  );
};
