import React, { useState } from 'react';
import { ServerNode, SimulatorConfig } from '../types';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Zap, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SimulatorLabViewProps {
  nodes: ServerNode[];
  simulatorConfig: SimulatorConfig;
  onUpdateSimulator: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onTriggerSpike: (type: 'test_quiz' | 'ddos_stress' | 'cache_flush' | 'failover') => void;
}

export const SimulatorLabView: React.FC<SimulatorLabViewProps> = ({
  nodes,
  simulatorConfig,
  onUpdateSimulator,
  onTriggerSpike
}) => {
  const [activeScenario, setActiveScenario] = useState<string>('idle');

  const runScenario = (
    scenarioId: string,
    type: 'test_quiz' | 'ddos_stress' | 'cache_flush' | 'failover'
  ) => {
    soundManager.playClick();
    setActiveScenario(scenarioId);
    onTriggerSpike(type);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-cyan-400 tracking-wider mb-1">
          LABORATORIUM SIMULASI KOMPUTASI KELAS 7
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Simulator Beban Server & Eksperimen Real-Time
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Eksperimen interaktif untuk memahami bagaimana infrastruktur sekolah merespons lonjakan pengguna,
          optimasi memori, dan pengujian keandalan aplikasi web siswa.
        </p>
      </div>

      {/* Preset Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scenario 1: Quiz Time */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-cyan-400">SKENARIO 1</span>
              <span className="text-[11px] text-slate-500 font-mono">30 Pengguna</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              Ujian Kuis Interaktif Serentak
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Simulasikan 30 siswa kelas 7 mengerjakan kuis bersamaan. Server akan memproses kalkulasi skor.
            </p>
          </div>
          <button
            onClick={() => runScenario('quiz', 'test_quiz')}
            className="w-full py-2 px-3 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Jalankan Skenario Kuis</span>
          </button>
        </div>

        {/* Scenario 2: Memory Leak & Stress */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-rose-400">SKENARIO 2</span>
              <span className="text-[11px] text-slate-500 font-mono">Stress Test</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              Uji Beban & Lonjakan Ekstrem
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Simulasikan ribuan permintaan mendadak untuk melihat mekanisme proteksi dan alarm CPU.
            </p>
          </div>
          <button
            onClick={() => runScenario('stress', 'ddos_stress')}
            className="w-full py-2 px-3 text-xs font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Picukan Beban Ekstrem</span>
          </button>
        </div>

        {/* Scenario 3: Cache Flush & Cleanup */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400">SKENARIO 3</span>
              <span className="text-[11px] text-slate-500 font-mono">Optimasi</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              Bersihkan Cache & Pendinginan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Kosongkan buffer memori sementara agar RAM server kembali lega dan latensi kembali ke belasan ms.
            </p>
          </div>
          <button
            onClick={() => runScenario('cache', 'cache_flush')}
            className="w-full py-2 px-3 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Optimalisasi & Reset</span>
          </button>
        </div>

        {/* Scenario 4: Failover Routing */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-400">SKENARIO 4</span>
              <span className="text-[11px] text-slate-500 font-mono">Redundansi</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              Simulasi Redundansi Jaringan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Uji ketahanan jika salah satu jalur terputus: trafik dialihkan otomatis ke Node cadangan.
            </p>
          </div>
          <button
            onClick={() => runScenario('failover', 'failover')}
            className="w-full py-2 px-3 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Uji Jalur Cadangan</span>
          </button>
        </div>
      </div>

      {/* Live Visualizer Board */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Kondisi Terkini Simulasi Laboratorium
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Parameter ini mengendalikan data real-time pada tab Metrik Server dan log sistem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400">
              {simulatorConfig.activeRequestsPerSec} Req / Detik
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSimulator(p => ({
                  ...p,
                  trafficMultiplier: 1,
                  stressMode: false,
                  packetLossSimulation: false,
                  activeRequestsPerSec: 15
                }));
                setActiveScenario('idle');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan Default</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Pengganda Beban Aktif</div>
            <div className="text-2xl font-bold text-white font-mono">{simulatorConfig.trafficMultiplier}x</div>
            <p className="text-[11px] text-slate-500 mt-2">
              Setara dengan simulasi {simulatorConfig.trafficMultiplier * 25} siswa mengakses serentak.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Status Mode Tekanan (Stress)</div>
            <div className={`text-2xl font-bold font-mono ${simulatorConfig.stressMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simulatorConfig.stressMode ? 'AKTIF (HIGH LOAD)' : 'NORMAL (NOMINAL)'}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {simulatorConfig.stressMode
                ? 'Proses komputasi sedang mengonsumsi 80%+ kapasitas RAM.'
                : 'Alokasi memori berjalan stabil di bawah batas aman.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Rata-rata Respon Cluster</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {Math.round(nodes.reduce((a, b) => a + b.latencyMs, 0) / nodes.length)} ms
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Waktu transfer paket data dari server ke peramban siswa di lab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
