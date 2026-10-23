import React, { useState, useEffect } from 'react';
import { StudentProject, ServerNode, TelemetryPoint, NotificationItem, SimulatorConfig } from './types';
import {
  INITIAL_STUDENT_PROJECTS,
  INITIAL_SERVER_NODES,
  INITIAL_NOTIFICATIONS
} from './data/initialData';
import { soundManager } from './utils/soundEffects';
import { TopNav } from './components/TopNav';
import { ServerMonitoringView } from './components/ServerMonitoringView';
import { ProjectTrackingView } from './components/ProjectTrackingView';
import { SimulatorLabView } from './components/SimulatorLabView';
import { EducationalGlossaryView } from './components/EducationalGlossaryView';
import { GradesSummaryView } from './components/GradesSummaryView';
import { ReportProgressModal } from './components/ReportProgressModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastNotification } from './components/ToastNotification';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'telemetry' | 'projects' | 'simulator' | 'education' | 'grades'>('telemetry');

  // Persistence in localStorage
  const [projects, setProjects] = useState<StudentProject[]>(() => {
    try {
      const saved = localStorage.getItem('serveredu_projects');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROJECTS;
    } catch {
      return INITIAL_STUDENT_PROJECTS;
    }
  });

  const [nodes, setNodes] = useState<ServerNode[]>(INITIAL_SERVER_NODES);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('serveredu_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([
    { time: '18:10:00', cpu: 22, ram: 44, network: 320, latency: 18 },
    { time: '18:10:02', cpu: 28, ram: 45, network: 380, latency: 19 },
    { time: '18:10:04', cpu: 24, ram: 45, network: 350, latency: 17 },
    { time: '18:10:06', cpu: 32, ram: 46, network: 410, latency: 21 },
    { time: '18:10:08', cpu: 29, ram: 46, network: 390, latency: 18 },
    { time: '18:10:10', cpu: 26, ram: 45, network: 360, latency: 18 },
    { time: '18:10:12', cpu: 34, ram: 47, network: 430, latency: 22 },
    { time: '18:10:14', cpu: 30, ram: 47, network: 400, latency: 19 },
    { time: '18:10:16', cpu: 27, ram: 46, network: 370, latency: 18 },
    { time: '18:10:18', cpu: 35, ram: 48, network: 460, latency: 20 },
    { time: '18:10:20', cpu: 31, ram: 47, network: 420, latency: 19 },
    { time: '18:10:22', cpu: 28, ram: 47, network: 390, latency: 18 }
  ]);

  const [serverLogs, setServerLogs] = useState<Array<{ id: string; time: string; method: string; path: string; status: number; latency: number; client: string }>>([
    { id: '1', time: '18:11:02', method: 'GET', path: '/api/mading/artikel-7a', status: 200, latency: 14, client: 'Lab Komputer 03' },
    { id: '2', time: '18:11:05', method: 'POST', path: '/api/kuis/kirim-skor', status: 201, latency: 28, client: 'Laptop Siswa 7B' },
    { id: '3', time: '18:11:08', method: 'GET', path: '/assets/logo-sekolah.png', status: 304, latency: 6, client: 'Tablet Guru' },
    { id: '4', time: '18:11:12', method: 'GET', path: '/api/jadwal/piket-harian', status: 200, latency: 16, client: 'Bot Server 7A' },
    { id: '5', time: '18:11:15', method: 'GET', path: '/api/perpustakaan/buku-isbn', status: 200, latency: 22, client: 'Scanner 7C' }
  ]);

  const [simulatorConfig, setSimulatorConfig] = useState<SimulatorConfig>({
    trafficMultiplier: 1,
    stressMode: false,
    packetLossSimulation: false,
    activeRequestsPerSec: 18,
    isPaused: false
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportingProject, setReportingProject] = useState<StudentProject | null>(null);
  const [inspectingProject, setInspectingProject] = useState<StudentProject | null>(null);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Save projects to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('serveredu_projects', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serveredu_notifs', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Real-time telemetry generator loop (every 1500ms)
  useEffect(() => {
    if (simulatorConfig.isPaused) return;

    const interval = setInterval(() => {
      const nowStr = new Date().toTimeString().split(' ')[0];
      const mult = simulatorConfig.trafficMultiplier;
      const stress = simulatorConfig.stressMode;

      // Base calculation influenced by multiplier and stress mode
      let baseCpu = 20 * mult + (Math.random() * 8 - 4);
      if (stress) baseCpu += 40;
      const newCpu = Math.min(98, Math.max(12, Math.round(baseCpu)));

      let baseRam = 40 + mult * 4 + (Math.random() * 4 - 2);
      if (stress) baseRam += 35;
      const newRam = Math.min(96, Math.max(25, Math.round(baseRam)));

      const baseNetwork = Math.round(280 * mult + Math.random() * 60);
      const baseLatency = Math.min(220, Math.max(12, Math.round(15 + mult * 6 + (stress ? 45 : 0) + (Math.random() * 4 - 2))));

      setTelemetryHistory(prev => {
        const next = [...prev.slice(-20), {
          time: nowStr,
          cpu: newCpu,
          ram: newRam,
          network: baseNetwork,
          latency: baseLatency
        }];
        return next;
      });

      // Fluctuate node stats realistically
      setNodes(prevNodes =>
        prevNodes.map(node => {
          const nodeCpu = Math.min(99, Math.max(10, Math.round(newCpu + (Math.random() * 12 - 6))));
          const nodeRam = Math.min(node.ramTotalMB - 100, Math.max(800, Math.round((newRam / 100) * node.ramTotalMB)));
          const nodeLat = Math.min(180, Math.max(8, Math.round(baseLatency + (Math.random() * 6 - 3))));
          const isWarn = nodeCpu > 80 || nodeLat > 90;

          return {
            ...node,
            cpuPercent: nodeCpu,
            ramUsageMB: nodeRam,
            latencyMs: nodeLat,
            status: isWarn ? 'warning' : 'nominal',
            uptimeSeconds: node.uptimeSeconds + 2,
            activeConnections: Math.round(25 * mult + Math.random() * 10)
          };
        })
      );

      // Randomly append server log every few ticks
      if (Math.random() > 0.4) {
        const sampleRoutes = [
          { m: 'GET', p: '/api/proyek-mading/halaman-utama', s: 200, c: 'Siswa 7A' },
          { m: 'POST', p: '/api/kuis-sejarah/jawab', s: 200, c: 'Siswa 7B' },
          { m: 'GET', p: '/api/server/telemetri-node', s: 200, c: 'Monitor Lab' },
          { m: 'GET', p: '/api/bot/jadwal-piket-7a', s: 200, c: 'Bot Client' },
          { m: 'POST', p: '/api/progres/sync', s: 201, c: 'Klien Web Siswa' }
        ];
        const route = sampleRoutes[Math.floor(Math.random() * sampleRoutes.length)];
        const newLog = {
          id: Math.random().toString(36).substring(7),
          time: nowStr,
          method: route.m,
          path: route.p,
          status: route.s,
          latency: Math.round(baseLatency * (0.8 + Math.random() * 0.4)),
          client: route.c
        };

        setServerLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [simulatorConfig]);

  // Handler for reporting progress from student modal
  const handleProgressReport = (
    projectId: string,
    taskId: string,
    reporterName: string,
    notes: string,
    link: string
  ) => {
    let newlyUnlockedMilestones: number[] = [];
    let updatedProjName = '';
    let reached100 = false;

    setProjects(prevProjects =>
      prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        updatedProjName = proj.title;
        const now = new Date().toISOString().split('T')[0];

        const updatedTasks = proj.tasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              completed: true,
              completedAt: now,
              submittedBy: reporterName,
              notes: notes || t.notes,
              submissionLink: link || t.submissionLink
            };
          }
          return t;
        });

        // Recalculate total progress
        const newProgress = Math.min(
          100,
          updatedTasks.filter(t => t.completed).reduce((sum, t) => sum + t.weight, 0)
        );

        // Check milestones
        const oldUnlocked = proj.milestonesUnlocked || [];
        const newUnlocked = [...oldUnlocked];

        [25, 50, 75, 100].forEach(threshold => {
          if (newProgress >= threshold && !oldUnlocked.includes(threshold)) {
            newUnlocked.push(threshold);
            newlyUnlockedMilestones.push(threshold);
            if (threshold === 100) reached100 = true;
          }
        });

        return {
          ...proj,
          tasks: updatedTasks,
          currentProgress: newProgress,
          lastUpdated: now,
          milestonesUnlocked: newUnlocked
        };
      })
    );

    // Create notifications for newly achieved milestones
    if (newlyUnlockedMilestones.length > 0) {
      newlyUnlockedMilestones.forEach(m => {
        let title = '';
        let message = '';
        let notifType: NotificationItem['type'] = 'milestone_25';

        if (m === 100) {
          title = '🏆 MAHAKARYA 100% SELESAI!';
          message = `Luar biasa! Proyek "${updatedProjName}" berhasil mencapai poin sempurna 100% dan meraih gelar Juara DevOps Kelas 7!`;
          notifType = 'milestone_100';
          setShowConfetti(true);
          soundManager.playFanfare();
        } else if (m === 75) {
          title = '⚡ Target 75% Tercapai: Ahli Sistem!';
          message = `Tim "${updatedProjName}" berhasil melampaui 75% capaian proyek dan siap menuju rilis final.`;
          notifType = 'milestone_75';
          soundManager.playMilestoneChime();
        } else if (m === 50) {
          title = '🎯 Target 50% Tercapai: Penjelajah Kode!';
          message = `Proyek "${updatedProjName}" telah mencapai separuh perjalanan (50%) dengan integrasi logika server!`;
          notifType = 'milestone_50';
          soundManager.playMilestoneChime();
        } else if (m === 25) {
          title = '🚀 Milestone 25% Terbuka: Arsitek Muda!';
          message = `Selamat kepada "${updatedProjName}" atas pencapaian milestone perancangan pertama (25%).`;
          notifType = 'milestone_25';
          soundManager.playMilestoneChime();
        }

        const newNotif: NotificationItem = {
          id: 'notif-' + Date.now() + '-' + m,
          timestamp: 'Baru saja',
          title,
          message,
          type: notifType,
          projectId,
          projectTitle: updatedProjName,
          read: false
        };

        setNotifications(prev => [newNotif, ...prev]);
        setActiveToast(newNotif);
      });
    } else {
      // Regular submission notification
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        timestamp: 'Baru saja',
        title: 'Laporan Tugas Berhasil Disimpan',
        message: `Laporan progres oleh ${reporterName} untuk proyek "${updatedProjName}" berhasil diverifikasi.`,
        type: 'submission',
        projectId,
        projectTitle: updatedProjName,
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      setActiveToast(newNotif);
      soundManager.playClick();
    }
  };

  // Quick toggle task checkbox on project card or detail modal
  const handleToggleTask = (projectId: string, taskId: string) => {
    let newlyUnlockedMilestones: number[] = [];
    let updatedProjName = '';

    setProjects(prevProjects =>
      prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;
        updatedProjName = proj.title;

        const updatedTasks = proj.tasks.map(t => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            return {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined
            };
          }
          return t;
        });

        const newProgress = Math.min(
          100,
          updatedTasks.filter(t => t.completed).reduce((sum, t) => sum + t.weight, 0)
        );

        const oldUnlocked = proj.milestonesUnlocked || [];
        const newUnlocked = [...oldUnlocked];

        [25, 50, 75, 100].forEach(threshold => {
          if (newProgress >= threshold && !oldUnlocked.includes(threshold)) {
            newUnlocked.push(threshold);
            newlyUnlockedMilestones.push(threshold);
          }
        });

        return {
          ...proj,
          tasks: updatedTasks,
          currentProgress: newProgress,
          lastUpdated: new Date().toISOString().split('T')[0],
          milestonesUnlocked: newUnlocked
        };
      })
    );

    // If milestone crossed
    if (newlyUnlockedMilestones.length > 0) {
      const topMilestone = Math.max(...newlyUnlockedMilestones);
      if (topMilestone === 100) {
        setShowConfetti(true);
        soundManager.playFanfare();
      } else {
        soundManager.playMilestoneChime();
      }

      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        timestamp: 'Baru saja',
        title: topMilestone === 100 ? '🏆 TARGET 100% SELESAI!' : `🎯 Target ${topMilestone}% Terbuka!`,
        message: `Proyek "${updatedProjName}" telah membuka capaian milestone ${topMilestone}% Poin!`,
        type: topMilestone === 100 ? 'milestone_100' : 'milestone_50',
        projectId,
        projectTitle: updatedProjName,
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      setActiveToast(newNotif);
    }
  };

  // Node operational action handlers
  const handleRestartNode = (nodeId: string) => {
    setNodes(prev =>
      prev.map(n =>
        n.id === nodeId
          ? {
              ...n,
              cpuPercent: 12,
              ramUsageMB: Math.round(n.ramTotalMB * 0.22),
              latencyMs: 12,
              uptimeSeconds: 0,
              status: 'nominal'
            }
          : n
      )
    );

    const targetNode = nodes.find(n => n.id === nodeId);
    const notif: NotificationItem = {
      id: 'notif-restart-' + Date.now(),
      timestamp: 'Baru saja',
      title: 'Layanan Node Berhasil Direstart',
      message: `Node ${targetNode?.name || nodeId} berhasil di-restart. Memori disegarkan kembali ke kondisi optimal.`,
      type: 'server_alert',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
    setActiveToast(notif);
  };

  const handlePingNode = (nodeId: string) => {
    const ping = Math.floor(Math.random() * 12 + 10);
    setNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, latencyMs: ping } : n))
    );
  };

  const handleTriggerSpike = (type: 'test_quiz' | 'ddos_stress' | 'cache_flush' | 'failover') => {
    if (type === 'test_quiz') {
      setSimulatorConfig(p => ({ ...p, trafficMultiplier: 2, activeRequestsPerSec: 45 }));
    } else if (type === 'ddos_stress') {
      setSimulatorConfig(p => ({ ...p, trafficMultiplier: 5, stressMode: true, activeRequestsPerSec: 120 }));
      soundManager.playAlert();
    } else if (type === 'cache_flush') {
      setSimulatorConfig(p => ({ ...p, trafficMultiplier: 1, stressMode: false, activeRequestsPerSec: 15 }));
      setNodes(prev => prev.map(n => ({ ...n, ramUsageMB: Math.round(n.ramTotalMB * 0.25), cpuPercent: 18 })));
    } else if (type === 'failover') {
      setSimulatorConfig(p => ({ ...p, trafficMultiplier: 2, activeRequestsPerSec: 50 }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Confetti Animation Layer */}
      <ConfettiCanvas
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => {
          setReportingProject(null);
          setIsReportModalOpen(true);
        }}
        unreadNotifCount={notifications.filter(n => !n.read).length}
        onOpenNotifDrawer={() => setIsNotifDrawerOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => {
          soundManager.isMuted = !isMuted;
          setIsMuted(!isMuted);
        }}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'telemetry' && (
          <ServerMonitoringView
            nodes={nodes}
            telemetryHistory={telemetryHistory}
            simulatorConfig={simulatorConfig}
            onUpdateSimulator={setSimulatorConfig}
            onRestartNode={handleRestartNode}
            onPingNode={handlePingNode}
            serverLogs={serverLogs}
            onOpenEducationModal={() => setActiveTab('education')}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectTrackingView
            projects={projects}
            onSelectProject={setInspectingProject}
            onOpenReportModal={proj => {
              setReportingProject(proj || null);
              setIsReportModalOpen(true);
            }}
            onToggleTask={handleToggleTask}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorLabView
            nodes={nodes}
            simulatorConfig={simulatorConfig}
            onUpdateSimulator={setSimulatorConfig}
            onTriggerSpike={handleTriggerSpike}
          />
        )}

        {activeTab === 'education' && (
          <EducationalGlossaryView />
        )}

        {activeTab === 'grades' && (
          <GradesSummaryView
            projects={projects}
            onOpenReportModal={proj => {
              setReportingProject(proj || null);
              setIsReportModalOpen(true);
            }}
            onSelectProject={setInspectingProject}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Program Pembelajaran TIK & Monitoring Server Proyek Siswa Kelas 7 SMP</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Standar Kurikulum Merdeka</span>
            <span aria-hidden="true">·</span>
            <span>Telemetri Real-Time</span>
            <span aria-hidden="true">·</span>
            <span>Target Capaian 100% Poin</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ReportProgressModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        initialProject={reportingProject}
        onSubmitReport={handleProgressReport}
      />

      <ProjectDetailModal
        project={inspectingProject}
        serverNode={nodes.find(n => n.id === inspectingProject?.serverNodeId)}
        onClose={() => setInspectingProject(null)}
        onOpenReportModal={proj => {
          setReportingProject(proj);
          setIsReportModalOpen(true);
        }}
        onToggleTask={handleToggleTask}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearNotifications={() => {
          setNotifications([]);
        }}
        onSelectProjectById={projId => {
          const found = projects.find(p => p.id === projId);
          if (found) {
            setInspectingProject(found);
          }
        }}
      />

      {/* Dynamic Pop-up Toast for Milestone Unlocks */}
      <ToastNotification
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
        onViewProject={projId => {
          const found = projects.find(p => p.id === projId);
          if (found) setInspectingProject(found);
        }}
      />
    </div>
  );
}
