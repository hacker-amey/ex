import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Zap, 
  Bot, 
  Code, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const AGENT_CONTRIBUTION_DATA = [
  { name: 'System Arch', tasks: 12, loc: 420 },
  { name: 'Frontend', tasks: 18, loc: 1150 },
  { name: 'Backend', tasks: 16, loc: 890 },
  { name: 'Database', tasks: 8, loc: 380 },
  { name: 'QA Engineer', tasks: 22, loc: 210 },
  { name: 'Debugger', tasks: 6, loc: 140 },
  { name: 'Security', tasks: 10, loc: 180 },
  { name: 'DevOps', tasks: 7, loc: 290 }
];

const QUALITY_DISTRIBUTION = [
  { name: 'Syntax & Types', value: 99, color: '#22d3ee' },
  { name: 'Test Coverage', value: 100, color: '#34d399' },
  { name: 'OWASP Security', value: 98, color: '#818cf8' },
  { name: 'Performance', value: 97, color: '#f59e0b' }
];

export const AnalyticsSection: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>PLATFORM-WIDE INTELLIGENCE TELEMETRY</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Autonomous Engineering Analytics
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Aggregated workforce throughput, self-healing efficacy, and software synthesis metrics.
          </p>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>AUTONOMOUS CODE</span>
            <Code className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">42,850</h3>
          <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2k lines this week
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>SELF-HEALED BUGS</span>
            <Wrench className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 font-mono">100%</h3>
          <p className="text-[11px] text-zinc-400 font-mono">24/24 runtime errors resolved</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>AVG BUILD TIME</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">8.4s</h3>
          <p className="text-[11px] text-cyan-400 font-mono">Sub-minute deployment</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>AVG QUALITY SCORE</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">98.6 / 100</h3>
          <p className="text-[11px] text-zinc-400 font-mono">Enterprise verified</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Contribution Chart */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
            Agent Output & Tasks Completed
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENT_CONTRIBUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="tasks" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Distribution Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
            Quality Pillar Verification Scores
          </h3>
          <div className="space-y-4 pt-2">
            {QUALITY_DISTRIBUTION.map((item) => (
              <div key={item.name} className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-300">{item.name}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
