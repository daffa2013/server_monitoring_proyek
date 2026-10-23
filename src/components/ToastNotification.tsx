import React from 'react';
import { Trophy, Award, X, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface ToastNotificationProps {
  toast: NotificationItem | null;
  onDismiss: () => void;
  onViewProject?: (projectId: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onDismiss,
  onViewProject
}) => {
  if (!toast) return null;

  const is100 = toast.type === 'milestone_100';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
          is100
            ? 'bg-slate-900/95 border-amber-400 text-white ring-2 ring-amber-400/30'
            : 'bg-slate-900/95 border-cyan-500/70 text-white ring-1 ring-cyan-500/30'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="p-2 rounded-xl bg-slate-800 shrink-0">
            {is100 ? (
              <Trophy className="w-5 h-5 text-amber-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{toast.title}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-snug mt-1">
              {toast.message}
            </p>

            {toast.projectId && onViewProject && (
              <button
                onClick={() => {
                  onViewProject(toast.projectId!);
                  onDismiss();
                }}
                className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Buka Proyek Terkait →
              </button>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
