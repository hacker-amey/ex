import React from 'react';
import { Project } from '../../shared/types';
import { 
  Gauge, 
  Zap, 
  Cpu, 
  Activity, 
  HardDrive, 
  CheckCircle2,
  TrendingDown,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';

interface PerformanceCenterSectionProps {
  currentProject: Project | null;
}

const LATENCY_DATA = [
  { time: '00:00', raw: 142, optimized: 28 },
  { time: '00:05', raw: 156, optimized: 24 },
  { time: '00:10', raw: 198, optimized: 31 },
  { time: '00:15', raw: 134, optimized: 22 },
  { time: '00:20', raw: 165, optimized: 27 },
  { time: '00:25', raw: 140, optimized: 25 },
  { time: '00:30', raw: 180, optimized: 29 }
];

const BUNDLE_DATA = [
  { name: 'Core Bundle', kb: 42 },
  { name: 'UI Components', kb: 28 },
  { name: 'Motion/Icons', kb: 36 },
  { name: 'Router & State', kb: 14 }
];

export const PerformanceCenterSection: React.FC<PerformanceCenterSectionProps> = ({ currentProject }) => {
  const perf = currentProject?.performance;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span>RUNTIME TELEMETRY & LATENCY BENCHMARKS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Performance & Resource Optimization
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time profiling of API response curves, memory allocation, and query execution indexes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Lighthouse: {perf?.lighthouseScore || 99}/100</span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">P99 API LATENCY</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-white font-mono">{perf?.apiLatencyMs || 28} ms</h4>
            <span className="text-emerald-400 text-xs font-mono flex items-center">
              <TrendingDown className="w-3 h-3" /> -78%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">BUNDLE SIZE</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-white font-mono">{perf?.bundleSizeKb || 120} KB</h4>
            <span className="text-emerald-400 text-xs font-mono">Gzipped</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">DB QUERY TIME</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-white font-mono">{perf?.dbQueryMs || 4.2} ms</h4>
            <span className="text-cyan-400 text-xs font-mono">Indexed</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">THROUGHPUT</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-white font-mono">{perf?.requestsPerSec || 1850} req/s</h4>
            <span className="text-violet-400 text-xs font-mono">Autoscaling</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Comparison Chart */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              API Latency: Raw vs AI-Optimized (ms)
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" /> Raw
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Optimized
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LATENCY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Line type="monotone" dataKey="raw" stroke="#f43f5e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="optimized" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bundle Breakdown Bar Chart */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Client Bundle Size Breakdown (KB)
            </h3>
            <span className="text-xs font-mono text-zinc-400">Total: 120 KB</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUNDLE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px' }} 
                />
                <Bar dataKey="kb" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
