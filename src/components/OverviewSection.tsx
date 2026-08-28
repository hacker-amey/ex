import React, { useState } from 'react';
import { Project, ProductType } from '../../shared/types';
import { PRODUCT_ARCHETYPES } from '../../shared/constants';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Zap, 
  GitBranch, 
  Flame, 
  Layers, 
  RefreshCw, 
  Terminal,
  ChevronRight,
  Boxes,
  Lock,
  Workflow
} from 'lucide-react';

interface OverviewSectionProps {
  currentProject: Project | null;
  onSelectArchetype: (type: ProductType) => void;
  onStartBuild: (prompt: string, type: ProductType) => void;
  isBuilding: boolean;
  onNavigateSection: (section: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  currentProject,
  onSelectArchetype,
  onStartBuild,
  isBuilding,
  onNavigateSection
}) => {
  const [promptText, setPromptText] = useState<string>(
    currentProject?.prompt || PRODUCT_ARCHETYPES.FoodFleet.defaultPrompt
  );
  const [selectedType, setSelectedType] = useState<ProductType>(
    currentProject?.productType || 'FoodFleet'
  );

  const handleTemplateClick = (type: ProductType) => {
    setSelectedType(type);
    setPromptText(PRODUCT_ARCHETYPES[type].defaultPrompt);
    onSelectArchetype(type);
  };

  const handleExecute = () => {
    onStartBuild(promptText, selectedType);
  };

  const activeAgentsCount = currentProject?.agents.filter(a => a.status === 'WORKING' || a.status === 'ANALYZING').length || 0;
  const isLive = currentProject?.deployment?.status === 'LIVE';

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-6 text-zinc-300">
      {/* Top Grid: Requirement Orchestrator + Project Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Requirement Orchestrator */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900 border border-zinc-800 p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="absolute top-0 right-0 p-3 opacity-10 font-bold text-4xl text-zinc-400 select-none font-mono">
            INPUT
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-mono flex items-center gap-2">
                <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                <span>Requirement Orchestrator</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                PROMPT TO PRODUCTION
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Input natural-language software requirements. Buildora's autonomous AI workforce decomposes specs, plans architecture, generates full-stack code, validates tests, and deploys.
            </p>

            <div className="relative">
              <textarea
                id="main-requirement-input"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe what you want to build... (e.g. Build a food delivery platform with restaurant discovery, cart, checkout and live order tracking.)"
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 mt-2 border-t border-zinc-800/80">
            {/* Quick Archetype Selectors */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 font-mono">ARCHETYPES:</span>
              {(['FoodFleet', 'CommerceX', 'PipelineX', 'CampusOS'] as ProductType[]).map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    id={`btn-archetype-${type.toLowerCase()}`}
                    onClick={() => handleTemplateClick(type)}
                    className={`text-[10px] px-2.5 py-1 rounded border font-mono transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-800 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>

            {/* Build Button */}
            <button
              id="btn-build-my-product"
              onClick={handleExecute}
              disabled={isBuilding || !promptText.trim()}
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-xs tracking-widest uppercase transition-all shadow-md font-mono ${
                isBuilding
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                  : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white active:scale-95 shadow-indigo-600/20'
              }`}
            >
              {isBuilding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-cyan-400 rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>START BUILD</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Project State Card */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest font-mono">PROJECT STATE</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px] font-bold">
                {currentProject?.stage}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{currentProject?.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{currentProject?.requirement?.businessGoal}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs font-mono">
              <div className="flex justify-between items-center text-zinc-400">
                <span>ESTIMATED LOC:</span>
                <span className="text-zinc-200">{currentProject?.requirement?.estimatedLoC || 2840} lines</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>QUALITY SCORE:</span>
                <span className="text-emerald-400 font-bold">{currentProject?.qualityScore || 98}/100</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>DEPLOY STATUS:</span>
                <span className={isLive ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                  {currentProject?.deployment?.status || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateSection('product')}
            id="btn-overview-open-product"
            className="w-full mt-4 py-2 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition-all"
          >
            <span>Open {currentProject?.productType} Interactive App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central 12-Column Technical Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Autonomous Task Graph & Live Logs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Autonomous Task Graph Container */}
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Autonomous Task Graph</h3>
                <span className="text-[10px] text-zinc-400 font-mono">TASK-882-ORD • PARALLEL EXECUTION</span>
              </div>
              <button 
                onClick={() => onNavigateSection('pipeline')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>Full Pipeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Task Graph Circles */}
            <div className="flex items-center justify-between py-3 px-2 border-y border-zinc-800 overflow-x-auto gap-3">
              {[
                { label: 'Analysis', status: 'done' },
                { label: 'Structure', status: 'done' },
                { label: 'Working', status: isBuilding ? 'active' : 'done' },
                { label: 'Test', status: currentProject?.tests?.length ? 'done' : 'pending' },
                { label: 'Deploy', status: isLive ? 'done' : 'pending' }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center space-y-1 shrink-0">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                      step.status === 'active' ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 animate-pulse' :
                      step.status === 'done' ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400' :
                      'border-zinc-700 bg-zinc-800/40 text-zinc-500'
                    }`}>
                      {step.status === 'done' ? '✓' : idx + 1}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{step.label}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="flex-1 h-[1px] bg-zinc-800 min-w-[20px]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Split Sub-Panels: Log Console & Architecture Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Left Sub-panel: Log Console */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800/90 p-3 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-1.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">LOG CONSOLE</span>
                  <span className="text-[9px] text-cyan-400">STREAMING</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <div className="text-zinc-400"><span className="text-cyan-400 font-semibold">[SYS]</span> Initializing DAG worker pool...</div>
                  <div className="text-zinc-400"><span className="text-violet-400 font-semibold">[FE]</span> Synthesized React components & routes</div>
                  <div className="text-zinc-400"><span className="text-emerald-400 font-semibold">[API]</span> REST endpoints active with schema validation</div>
                  <div className="text-zinc-400"><span className="text-amber-400 font-semibold">[SEC]</span> AST security audit complete: 0 vulns</div>
                  <div className="text-zinc-400"><span className="text-cyan-400 font-semibold">[FIX]</span> Self-healing loop verified null checks</div>
                  {currentProject?.logs.slice(0, 3).map((l, i) => (
                    <div key={i} className="text-zinc-400 truncate">
                      <span className="text-zinc-400">[{l.level}]</span> {l.message}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sub-panel: Architecture Preview */}
              <div className="rounded-lg bg-zinc-950 border border-zinc-800/90 p-3 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-1.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">ARCHITECTURE PREVIEW</span>
                  <span className="text-[9px] text-emerald-400">MICROSERVICES</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[9px] text-zinc-400">CLIENT</div>
                    <div className="text-xs font-bold text-cyan-400">React + Vite</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[9px] text-zinc-400">SERVER</div>
                    <div className="text-xs font-bold text-violet-400">Node / Express</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[9px] text-zinc-400">DATABASE</div>
                    <div className="text-xs font-bold text-emerald-400">In-Memory / SQL</div>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <div className="text-[9px] text-zinc-400">INGRESS</div>
                    <div className="text-xs font-bold text-amber-400">Cloud Run</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: AI Workforce Pool */}
        <div className="lg:col-span-4 rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">AI Workforce Pool</h3>
                <span className="text-[10px] text-zinc-400 font-mono">10 ACTIVE SPECIALISTS</span>
              </div>
              <button
                onClick={() => onNavigateSection('workforce')}
                className="text-xs text-violet-400 hover:text-violet-300 font-mono"
              >
                Inspect All
              </button>
            </div>

            {/* Agent List Items */}
            <div className="space-y-2 pt-1">
              {currentProject?.agents.slice(0, 5).map((agent) => (
                <div 
                  key={agent.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs font-mono"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-violet-400 shrink-0">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-zinc-200 text-[11px] truncate">{agent.name}</div>
                      <div className="text-[9px] text-zinc-400 truncate">{agent.role}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                    agent.status === 'WORKING' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse' :
                    agent.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Accuracy Progress Meter */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between text-zinc-400">
                <span>BUILD ACCURACY</span>
                <span className="text-emerald-400 font-bold">98.2%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[98.2%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <button
              onClick={() => onNavigateSection('testing')}
              className="w-full py-2 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Self-Healing Engine</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

