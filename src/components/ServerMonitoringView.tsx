import React, { useState } from 'react';
import { ServerNode, TelemetryPoint, SimulatorConfig } from '../types';
import { Cpu, HardDrive, Wifi, Activity, Play, Pause, RotateCw, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ServerMonitoringViewProps {
  nodes: ServerNode[];
  telemetryHistory: TelemetryPoint[];
  simulatorConfig: SimulatorConfig;
  onUpdateSimulator: (updater: (prev: SimulatorConfig) => SimulatorConfig) => void;
  onRestartNode: (nodeId: string) => void;
  onPingNode: (nodeId: string) => void;
  serverLogs: Array<{ id: string; time: string; method: string; path: string; status: number; latency: number; client: string }>;
  onOpenEducationModal: () => void;
}

export const ServerMonitoringView: React.FC<ServerMonitoringViewProps> = ({
  nodes,
  telemetryHistory,
  simulatorConfig,
  onUpdateSimulator,
  onRestartNode,
  onPingNode,
  serverLogs,
  onOpenEducationModal
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Calculate aggregated metrics
  const avgCpu = Math.round(nodes.reduce((acc, n) => acc + n.cpuPercent, 0) / nodes.length);
  const totalRamUsed = (nodes.reduce((acc, n) => acc + n.ramUsageMB, 0) / 1024).toFixed(1);
  const totalRamCapacity = (nodes.reduce((acc, n) => acc + n.ramTotalMB, 0) / 1024).toFixed(0);
  const avgLatency = Math.round(nodes.reduce((acc, n) => acc + n.latencyMs, 0) / nodes.length);
  const totalNetworkSpeed = nodes.reduce((acc, n) => acc + n.networkInKBps + n.networkOutKBps, 0);

  // SVG Chart helpers
  const svgWidth = 720;
  const svgHeight = 200;
  const padding = 24;

  const pointsCpu = telemetryHistory.map((pt, idx) => {
    const x = padding + (idx / Math.max(telemetryHistory.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (pt.cpu / 100) * (svgHeight - padding * 2);
    return `${x},${y}`;
  });

  const pointsRam = telemetryHistory.map((pt, idx) => {
    const x = padding + (idx / Math.max(telemetryHistory.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (pt.ram / 100) * (svgHeight - padding * 2);
    return `${x},${y}`;
  });

  const cpuPath = pointsCpu.length > 0 ? `M ${pointsCpu.join(' L ')}` : '';
  const ramPath = pointsRam.length > 0 ? `M ${pointsRam.join(' L ')}` : '';

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs} jam ${mins} mnt`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner with Generated Classroom Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/server_classroom_lab_1792717925991.jpg"
            alt="Laboratorium Komputer dan Server Sekolah Kelas 7"
            className="w-full h-full object-cover opacity-25 filter contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10 max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 tracking-wider mb-2">
            TELEMETRI INFRASTRUKTUR SEKOLAH
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3 text-balance">
            Monitoring Server & Sumber Daya Proyek Siswa Kelas 7
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Pantau beban CPU, alokasi memori RAM, lalu lintas data, dan latensi node server secara real-time. 
            Siswa dapat menguji performa aplikasi mereka dan memahami cara kerja infrastruktur komputasi modern.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="text-slate-200 font-medium">4 Node Server Aktif</span>
            <span aria-hidden="true">·</span>
            <span>Update Real-time 1.5s</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenEducationModal();
              }}
              className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 underline underline-offset-4 cursor-pointer font-medium"
            >
              <Info className="w-4 h-4" />
              <span>Panduan Konsep Server untuk Kelas 7</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Beban Rata-rata CPU</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{avgCpu}%</span>
            <span className="text-xs text-slate-400">
              {avgCpu > 75 ? 'Beban Tinggi' : 'Kapasitas Normal'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                avgCpu > 80 ? 'bg-rose-500' : avgCpu > 60 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(avgCpu, 100)}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Penggunaan Memori RAM</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{totalRamUsed}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalRamCapacity} GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${(parseFloat(totalRamUsed) / parseFloat(totalRamCapacity)) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Latensi Jaringan</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{avgLatency}</span>
            <span className="text-xs text-slate-400">ms (Respon Cepat)</span>
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-2">
            <span>Ping Lokal</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono font-medium">0.0% Packet Loss</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800/90 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Lalu Lintas Jaringan</span>
            <Wifi className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {(totalNetworkSpeed / 1024).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">MB/detik</span>
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-2">
            <span>Trafik I/O</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{nodes.reduce((a, b) => a + b.activeConnections, 0)} Koneksi</span>
          </div>
        </div>
      </div>

      {/* Main Real-time Chart & Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Live Telemetry Canvas */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Grafik Beban CPU & Memori Real-Time
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                  <span>CPU (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" />
                  <span>RAM (%)</span>
                </div>
                <span aria-hidden="true">·</span>
                <span className="font-mono">Sampel per 1.5 detik</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSimulator(prev => ({ ...prev, isPaused: !prev.isPaused }));
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  simulatorConfig.isPaused
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {simulatorConfig.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Lanjutkan Stream</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Jeda Stream</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56 stroke-linecap-round stroke-linejoin-round"
            >
              {/* Horizontal Reference Lines */}
              {[25, 50, 75, 100].map(val => {
                const y = svgHeight - padding - (val / 100) * (svgHeight - padding * 2);
                return (
                  <g key={val}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={svgWidth - padding}
                      y2={y}
                      stroke="rgba(51, 65, 85, 0.4)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={padding - 6}
                      y={y + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Time baseline */}
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="#334155"
                strokeWidth="1"
              />

              {/* RAM line (emerald) */}
              {ramPath && (
                <path
                  d={ramPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              )}

              {/* CPU line (cyan) */}
              {cpuPath && (
                <path
                  d={cpuPath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              )}

              {/* Current value dots */}
              {pointsCpu.length > 0 && (
                <circle
                  cx={pointsCpu[pointsCpu.length - 1].split(',')[0]}
                  cy={pointsCpu[pointsCpu.length - 1].split(',')[1]}
                  r="4"
                  fill="#06b6d4"
                />
              )}
            </svg>

            {/* Bottom time indicators */}
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2 px-6">
              <span>-30 detik</span>
              <span>-15 detik</span>
              <span>Sekarang (Real-Time)</span>
            </div>
          </div>

          {/* Quick Telemetry Bar Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">CPU Sekarang</span>
              <span className="text-lg font-semibold text-cyan-400 font-mono tabular-nums">
                {telemetryHistory[telemetryHistory.length - 1]?.cpu || 0}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">RAM Sekarang</span>
              <span className="text-lg font-semibold text-emerald-400 font-mono tabular-nums">
                {telemetryHistory[telemetryHistory.length - 1]?.ram || 0}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Throughput</span>
              <span className="text-lg font-semibold text-purple-400 font-mono tabular-nums">
                {telemetryHistory[telemetryHistory.length - 1]?.network || 0} KB/s
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Latensi Paket</span>
              <span className="text-lg font-semibold text-amber-400 font-mono tabular-nums">
                {telemetryHistory[telemetryHistory.length - 1]?.latency || 0} ms
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive Simulator Controls for 7th Graders */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Simulasi Beban & Uji Siswa</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Atur parameter uji coba untuk mengamati respons grafik saat server mendapat beban akses.
            </p>
          </div>

          {/* Traffic Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Beban Pengunjung (Trafik)</span>
              <span className="text-cyan-400 font-mono font-semibold">
                {simulatorConfig.trafficMultiplier}x Beban
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {[1, 2, 5, 10].map(mult => (
                <button
                  key={mult}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSimulator(p => ({ ...p, trafficMultiplier: mult }));
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    simulatorConfig.trafficMultiplier === mult
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              {simulatorConfig.trafficMultiplier === 1 && 'Kondisi biasa saat jam pelajaran reguler.'}
              {simulatorConfig.trafficMultiplier === 2 && 'Seluruh siswa kelas 7 membuka aplikasi bersama.'}
              {simulatorConfig.trafficMultiplier === 5 && 'Ujian online serentak satu angkatan sekolah.'}
              {simulatorConfig.trafficMultiplier === 10 && 'Simulasi lonjakan ekstrem (stress testing).'}
            </p>
          </div>

          {/* Stress Mode Toggle */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-200 block">Tes Beban Memori Tinggi</span>
                <span className="text-[11px] text-slate-400">Simulasikan proses berat di RAM</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSimulator(p => ({ ...p, stressMode: !p.stressMode }));
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  simulatorConfig.stressMode ? 'bg-rose-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulatorConfig.stressMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {simulatorConfig.stressMode && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>Memori sedang ditekan! Perhatikan grafik RAM hijau melonjak di atas 80%.</span>
              </div>
            )}
          </div>

          {/* Educational Note Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Prinsip Keamanan Sistem</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arsitektur terdistribusi membuat aplikasi kelas tidak langsung lumpuh meski salah satu server diuji beban berat.
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Server Nodes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Status Unit Node Server Sekolah
            </h2>
            <p className="text-xs text-slate-400">
              Pilih node untuk memantau rincian sumber daya dan melakukan aksi operasional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            const isWarning = node.status === 'warning' || node.cpuPercent > 75;

            return (
              <div
                key={node.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedNodeId(node.id);
                }}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight truncate">
                      {node.name.split('·')[0].trim()}
                    </h3>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {node.role}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isWarning ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {isWarning ? '▲ BEBAN' : '● NOMINAL'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Beban CPU</span>
                    <span className="font-mono text-white tabular-nums">{node.cpuPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full ${node.cpuPercent > 70 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ width: `${node.cpuPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>RAM Terpakai</span>
                    <span className="font-mono text-white tabular-nums">
                      {(node.ramUsageMB / 1024).toFixed(1)} / {(node.ramTotalMB / 1024).toFixed(0)} GB
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Latensi</span>
                    <span className="font-mono text-white tabular-nums">{node.latencyMs} ms</span>
                  </div>
                </div>

                {/* Node Metadata footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-800">
                  <span className="font-mono">{node.ipAddress}</span>
                  <span>{formatUptime(node.uptimeSeconds)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector & Live Log Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Node Detail Sheet */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-cyan-400 font-semibold tracking-wider">RINCIAN NODE TERPILIH</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeNode.name}</h3>
              <p className="text-xs text-slate-400">{activeNode.role}</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-slate-800 text-slate-300 rounded">
              {activeNode.ipAddress}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Suhu Server</span>
              <span className="text-base font-semibold text-white font-mono">{activeNode.temperatureC}°C</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Pendingin Lab Normal</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Penyimpanan Disk</span>
              <span className="text-base font-semibold text-white font-mono">
                {activeNode.diskUsageGB} / {activeNode.diskTotalGB} GB
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">SSD NVMe Sekolah</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Koneksi Aktif</span>
              <span className="text-base font-semibold text-white font-mono">{activeNode.activeConnections}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Browser Siswa</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Waktu Nyala (Uptime)</span>
              <span className="text-base font-semibold text-white font-mono">
                {Math.floor(activeNode.uptimeSeconds / 3600)} jam
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">99.9% Reliabilitas</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onPingNode(activeNode.id);
              }}
              className="flex-1 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Uji Ping Respon
            </button>
            <button
              onClick={() => {
                soundManager.playAlert();
                onRestartNode(activeNode.id);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              title="Mulai Ulang Layanan Node"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Restart Layanan</span>
            </button>
          </div>
        </div>

        {/* Live HTTP Traffic Stream Log */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Log Permintaan & Akses Proyek Siswa
              </h3>
              <p className="text-xs text-slate-400">
                Aliran aktivitas real-time saat siswa memuat mading, kuis, atau mengirimkan data.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">Live Socket Active</span>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs max-h-64 overflow-y-auto space-y-1.5">
            {serverLogs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-4 py-1 px-2 rounded hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-slate-500 text-[11px]">{log.time}</span>
                  <span
                    className={`font-semibold text-[11px] ${
                      log.status === 200 || log.status === 201
                        ? 'text-emerald-400'
                        : log.status === 304
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-slate-300 font-medium">{log.method}</span>
                  <span className="text-slate-400 truncate">{log.path}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
                  <span className="text-slate-400">{log.latency}ms</span>
                  <span>{log.client}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
