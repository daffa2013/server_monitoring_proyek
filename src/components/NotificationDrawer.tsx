import React from 'react';
import { NotificationItem } from '../types';
import { X, Trophy, Award, Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectProjectById?: (projectId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectProjectById
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Pusat Notifikasi Siswa
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

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {notifications.filter(n => !n.read).length} belum dibaca
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onMarkAllAsRead();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Tandai Dibaca
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClearNotifications();
              }}
              className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map(notif => {
            const is100 = notif.type === 'milestone_100';
            const is75 = notif.type === 'milestone_75';
            const is50 = notif.type === 'milestone_50';
            const is25 = notif.type === 'milestone_25';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.projectId && onSelectProjectById) {
                    soundManager.playClick();
                    onSelectProjectById(notif.projectId);
                    onClose();
                  }
                }}
                className={`p-4 rounded-xl border text-xs transition-colors cursor-pointer ${
                  !notif.read
                    ? is100
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    {is100 ? (
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <span className="truncate">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {notif.message}
                </p>

                {notif.projectTitle && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span className="truncate font-medium text-slate-400">
                      {notif.projectTitle}
                    </span>
                    <span className="text-cyan-400 inline-flex items-center gap-1 shrink-0">
                      Lihat Proyek <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Belum ada notifikasi baru untuk siswa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
