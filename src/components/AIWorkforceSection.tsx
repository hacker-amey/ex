import React, { useState } from 'react';
import { Project, AgentState, AgentRole } from '../../shared/types';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Code, 
  Layers, 
  ShieldCheck, 
  Wrench, 
  Terminal, 
  Zap, 
  Eye, 
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';

interface AIWorkforceSectionProps {
  currentProject: Project | null;
}

export const AIWorkforceSection: React.FC<AIWorkforceSectionProps> = ({ currentProject }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(
    currentProject?.agents[0] || null
  );

  const agents = currentProject?.agents || [];
  const activeCount = agents.filter(a => a.status === 'WORKING' || a.status === 'ANALYZING').length;
  const completedCount = agents.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-violet-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>SPECIALIZED MULTI-AGENT WORKFORCE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            10 Autonomous Engineering Agents
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Each agent possesses fine-tuned domain skills, specialized system prompts, and autonomous task boundaries.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-400">ACTIVE: </span>
            <span className="text-cyan-400 font-bold">{activeCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span className="text-zinc-400">COMPLETED: </span>
            <span className="text-emerald-400 font-bold">{completedCount}/10</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Agent Cards + Live Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 10 Agent Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <div
                key={agent.id}
                id={`agent-card-${agent.role.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-zinc-900/90 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-[#0e1017] border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50'
                }`}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{agent.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-mono font-medium">{agent.role}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    agent.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    agent.status === 'WORKING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                    agent.status === 'ANALYZING' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse' :
                    agent.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    agent.status === 'RETRYING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                {/* Current Task & Action */}
                <div className="space-y-1 text-xs">
                  <p className="text-zinc-300 font-medium line-clamp-1">{agent.currentTask}</p>
                  <p className="text-[11px] text-zinc-400 truncate">Last Action: {agent.lastAction}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>PROGRESS</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        agent.status === 'COMPLETED' ? 'bg-emerald-400' :
                        agent.status === 'FAILED' ? 'bg-rose-500' :
                        'bg-cyan-400'
                      }`}
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Agent Inspector */}
        <div className="rounded-2xl bg-[#0e1017] border border-zinc-800 p-6 space-y-6 flex flex-col justify-between">
          {selectedAgent ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <img
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/60"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono">{selectedAgent.role}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{selectedAgent.specialty}</p>
                </div>
              </div>

              {/* Status Details */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">ACTIVE STATUS:</span>
                  <span className="text-cyan-300 font-bold uppercase">{selectedAgent.status}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-zinc-400 block">CURRENT TASK OBJECTIVE:</span>
                  <span className="text-zinc-200 block font-sans">{selectedAgent.currentTask}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-zinc-400 block">LAST RECORDED ACTION:</span>
                  <span className="text-zinc-300 block font-sans">{selectedAgent.lastAction}</span>
                </div>
              </div>

              {/* Output Inspector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-semibold uppercase">AGENT OUTPUT & ARTIFACTS</span>
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="p-3.5 rounded-xl bg-[#08090f] border border-zinc-800/80 font-mono text-xs text-emerald-400 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {selectedAgent.output || 'No output recorded yet.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              Select an agent to inspect their telemetry and artifact logs.
            </div>
          )}

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Buildora Orchestrator synchronizes state across all 10 agents via SSE streams.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
