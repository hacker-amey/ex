import React, { useState } from 'react';
import { Project, LogEntry } from '../../shared/types';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check, 
  Filter, 
  Download, 
  RefreshCw,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2
} from 'lucide-react';

interface ObservabilitySectionProps {
  currentProject: Project | null;
}

export const ObservabilitySection: React.FC<ObservabilitySectionProps> = ({ currentProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const logs = currentProject?.logs || [];

  const filteredLogs = logs.filter((log) => {
    const matchesCat = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || log.level === selectedLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.agent && log.agent.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const formatted = filteredLogs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category}] ${l.agent ? `(${l.agent}) ` : ''}${l.message}`).join('\n');
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['All', 'Orchestrator', 'Architecture', 'Backend', 'Database', 'Testing', 'Security', 'Deployment'];
  const levels = ['All', 'info', 'warn', 'error', 'success'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Terminal className="w-4 h-4" />
            <span>REAL-TIME STREAMING TELEMETRY</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Observability & Agent Execution Logs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time event stream capturing orchestration decisions, AST patches, test outputs, and cloud deployments.
          </p>
        </div>

        <button
          onClick={handleCopyLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all font-mono"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Filtered Logs'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search log messages or agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category filters */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="rounded-2xl bg-[#08090f] border border-zinc-800 p-6 space-y-3 font-mono text-xs shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-zinc-400 font-semibold">buildora-agent-orchestrator.log</span>
          </div>
          <span>Showing {filteredLogs.length} events</span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 py-1.5 px-2 rounded hover:bg-zinc-900/60 transition-colors"
            >
              <span className="text-zinc-500 text-[10px] shrink-0">{log.timestamp}</span>

              {/* Level indicator */}
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${
                log.level === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                log.level === 'warn' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                log.level === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-zinc-800 text-cyan-300'
              }`}>
                {log.level}
              </span>

              {/* Category */}
              <span className="text-zinc-400 font-semibold shrink-0">[{log.category}]</span>

              {/* Agent if present */}
              {log.agent && (
                <span className="text-violet-400 shrink-0 font-medium">{log.agent}:</span>
              )}

              {/* Message */}
              <span className={`leading-relaxed ${
                log.level === 'error' ? 'text-rose-300 font-semibold' :
                log.level === 'success' ? 'text-emerald-300' :
                'text-zinc-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
