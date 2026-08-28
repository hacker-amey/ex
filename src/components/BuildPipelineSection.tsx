import React from 'react';
import { Project, BuildStage } from '../../shared/types';
import { 
  GitMerge, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Bot, 
  Cpu, 
  Zap, 
  Activity
} from 'lucide-react';

interface BuildPipelineSectionProps {
  currentProject: Project | null;
  onTriggerBuild: () => void;
  isBuilding: boolean;
  onNavigateSection: (section: string) => void;
}

const STAGES: { key: BuildStage; label: string; agent: string }[] = [
  { key: 'REQUIREMENT_ANALYSIS', label: 'Requirement Analysis', agent: 'Product Manager' },
  { key: 'PRODUCT_PLANNING', label: 'Product Planning', agent: 'Product Manager' },
  { key: 'ARCHITECTURE', label: 'System Architecture', agent: 'System Architect' },
  { key: 'AGENT_ASSIGNMENT', label: 'Agent Assignment', agent: 'Orchestrator' },
  { key: 'DATABASE_API_GENERATION', label: 'Database & API Generation', agent: 'DB & Backend Engineers' },
  { key: 'CODE_GENERATION', label: 'Code Generation', agent: 'Frontend & Code Reviewer' },
  { key: 'TESTING', label: 'Automated Testing', agent: 'QA Engineer' },
  { key: 'FAILURE_DETECTION', label: 'Failure Detection', agent: 'QA Engineer' },
  { key: 'AUTONOMOUS_DEBUGGING', label: 'Autonomous Debugging', agent: 'Debugging Engineer' },
  { key: 'SECURITY_REVIEW', label: 'Security Review', agent: 'Security Engineer' },
  { key: 'PERFORMANCE_OPTIMIZATION', label: 'Performance Tuning', agent: 'DevOps & Architect' },
  { key: 'DEPLOYMENT', label: 'Production Deployment', agent: 'DevOps Engineer' }
];

export const BuildPipelineSection: React.FC<BuildPipelineSectionProps> = ({
  currentProject,
  onTriggerBuild,
  isBuilding,
  onNavigateSection
}) => {
  const currentStage = currentProject?.stage || 'IDLE';
  const progress = currentProject?.progress || 0;

  const getStageStatus = (stageKey: BuildStage, index: number) => {
    if (currentStage === 'COMPLETED') return 'completed';
    if (currentStage === stageKey) return isBuilding ? 'active' : 'completed';
    const stageIndex = STAGES.findIndex(s => s.key === currentStage);
    if (stageIndex === -1) return 'pending';
    if (index < stageIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <GitMerge className="w-4 h-4" />
            <span>CENTRAL ORCHESTRATOR DAG PIPELINE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Autonomous Multi-Agent Build Pipeline
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Orchestrating 10 parallel agents with state-machine task graph and autonomous self-healing loops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTriggerBuild}
            disabled={isBuilding}
            id="btn-pipeline-start-build"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
              isBuilding
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-indigo-600/30 active:scale-95 border border-indigo-400/30'
            }`}
          >
            {isBuilding ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-cyan-400 rounded-full animate-spin" />
                <span>Running Pipeline ({progress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RE-RUN FULL PIPELINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Progress Gauge */}
      <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>CURRENT ACTIVE STAGE:</span>
            <span className="text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
              {currentStage}
            </span>
          </div>
          <span className="text-zinc-400">{progress}% COMPLETE</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden p-[1px] border border-zinc-800">
          <div
            className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>

        {/* Linear Stage Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
          {STAGES.map((s, idx) => {
            const status = getStageStatus(s.key, idx);
            return (
              <div
                key={s.key}
                className={`p-3 rounded-xl border text-xs transition-all flex flex-col justify-between space-y-1.5 ${
                  status === 'active'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : status === 'completed'
                    ? 'bg-zinc-900/80 border-emerald-500/40 text-zinc-200'
                    : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 font-semibold">Step {idx + 1}</span>
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : status === 'active' ? (
                    <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[11px] leading-tight text-white">{s.label}</h4>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{s.agent}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orchestration Task Graph DAG Table */}
      <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Task Dependency Graph (DAG)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">10 Task Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                <th className="pb-3 pl-2 font-semibold">TASK NODE</th>
                <th className="pb-3 font-semibold">ASSIGNED AGENT</th>
                <th className="pb-3 font-semibold">DEPENDENCIES</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold">SUMMARY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {currentProject?.tasks.map((task) => (
                <tr key={task.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 pl-2 font-semibold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{task.name}</span>
                  </td>
                  <td className="py-3 text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
                      {task.agentRole}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400 text-[11px]">
                    {task.dependencies.length > 0 ? task.dependencies.join(', ') : 'ROOT'}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      task.status === 'healed' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      task.status === 'failed' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' :
                      task.status === 'running' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400 text-[11px] max-w-xs truncate">
                    {task.outputSummary || 'Awaiting execution window in schedule graph'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
