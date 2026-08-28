import React from 'react';
import { Project, ProductType } from '../../shared/types';
import { 
  Bot, 
  Cpu, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Gauge, 
  CloudUpload, 
  Smartphone, 
  BarChart3, 
  History, 
  FileCode, 
  CheckCircle2, 
  Sparkles,
  Play,
  Flame,
  Zap
} from 'lucide-react';

interface HeaderProps {
  currentProject: Project | null;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onNewProjectModal: () => void;
  onTriggerBuild: () => void;
  isBuilding: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onOpenMobileCenter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProjectModal,
  onTriggerBuild,
  isBuilding,
  activeSection,
  onSectionChange,
  onOpenMobileCenter
}) => {
  const activeAgentsCount = currentProject?.agents.filter(a => a.status === 'WORKING' || a.status === 'ANALYZING').length || 0;
  const isLive = currentProject?.deployment?.status === 'LIVE';

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-6 py-2.5 flex items-center justify-between transition-all">
      {/* Left: Brand & Telemetry */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => onSectionChange('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="buildora-logo-header"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-violet-500/20 group-hover:shadow-cyan-500/30 transition-all font-mono">
            B
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold tracking-tight text-white text-base font-sans">BUILDORA</span>
            <span className="text-zinc-500 font-normal text-xs font-mono">v1.4</span>
          </div>
        </div>

        {/* Telemetry Status Indicators */}
        <div className="hidden lg:flex items-center space-x-5 text-xs font-mono uppercase tracking-widest text-zinc-400 pl-4 border-l border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            <span className="text-[11px]">System: Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
            <span className="text-[11px]">Engine: {currentProject?.mode === 'AI' ? 'Real AI' : 'Demo Mode'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px]">Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* Center / Right: Project Selector, API badge, and Actions */}
      <div className="flex items-center gap-3">
        {/* Project Selector */}
        <div className="hidden md:flex items-center gap-2">
          <label htmlFor="project-select" className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">PROJECT:</label>
          <select
            id="project-select"
            value={currentProject?.id || ''}
            onChange={(e) => onSelectProject(e.target.value)}
            aria-label="Select Project"
            className="bg-zinc-950 border border-zinc-700/80 text-xs text-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer font-mono"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} [{p.productType}] — {p.stage}
              </option>
            ))}
          </select>
        </div>

        {/* API Model Pill */}
        <div className="hidden sm:flex items-center px-3 py-1 rounded bg-zinc-800/90 border border-zinc-700 text-xs font-mono text-zinc-300">
          API: CLAUDE-3.5
        </div>

        {/* Mobile Command Center trigger */}
        <button
          onClick={onOpenMobileCenter}
          id="btn-mobile-command-header"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all font-mono"
          title="Open Mobile Command Center"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Voice Control</span>
        </button>

        {/* Live Product Preview shortcut */}
        <button
          onClick={() => onSectionChange('product')}
          id="btn-live-product-header"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            isLive 
              ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 shadow-sm' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <span>{currentProject?.productType || 'Product'} Preview</span>
        </button>

        {/* Primary Build Button */}
        <button
          onClick={onTriggerBuild}
          disabled={isBuilding}
          id="btn-build-now-header"
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-all ${
            isBuilding
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
              : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
          }`}
        >
          {isBuilding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-cyan-400 rounded-full animate-spin" />
              <span>BUILDING...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>BUILD PRODUCT</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

