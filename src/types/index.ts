export type ClassGrade = 'Semua' | 'Kelas 7A' | 'Kelas 7B' | 'Kelas 7C';

export type ProjectStatus = 'draft' | 'in_progress' | 'review' | 'completed';

export interface MilestoneTask {
  id: string;
  title: string;
  description: string;
  weight: number; // percentage points (sum up to 100 for the project)
  completed: boolean;
  completedAt?: string;
  submittedBy?: string;
  notes?: string;
  submissionLink?: string;
}

export interface StudentProject {
  id: string;
  title: string;
  classGroup: 'Kelas 7A' | 'Kelas 7B' | 'Kelas 7C';
  category: 'Aplikasi Web' | 'Game Edukasi' | 'Bot & Otomasi' | 'Sistem Sekolah' | 'IoT & Hardware';
  teamMembers: string[];
  leadStudent: string;
  mentorTeacher: string;
  description: string;
  serverNodeId: string; // Connected server node
  tasks: MilestoneTask[];
  currentProgress: number; // 0 to 100
  createdAt: string;
  lastUpdated: string;
  milestonesUnlocked: number[]; // e.g. [25, 50, 75, 100]
}

export interface ServerNode {
  id: string;
  name: string;
  role: string;
  ipAddress: string;
  status: 'nominal' | 'warning' | 'critical';
  uptimeSeconds: number;
  cpuPercent: number;
  ramUsageMB: number;
  ramTotalMB: number;
  diskUsageGB: number;
  diskTotalGB: number;
  networkInKBps: number;
  networkOutKBps: number;
  latencyMs: number;
  activeConnections: number;
  temperatureC: number;
}

export interface TelemetryPoint {
  time: string;
  cpu: number;
  ram: number;
  network: number;
  latency: number;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'milestone_25' | 'milestone_50' | 'milestone_75' | 'milestone_100' | 'server_alert' | 'submission';
  projectId?: string;
  projectTitle?: string;
  read: boolean;
}

export interface SimulatorConfig {
  trafficMultiplier: number; // 1x, 2x, 5x, 10x
  stressMode: boolean; // Memory stress simulation
  packetLossSimulation: boolean;
  activeRequestsPerSec: number;
  isPaused: boolean;
}
