import React from 'react';
import { Project, ProductType } from '../../shared/types';
import { PRODUCT_ARCHETYPES } from '../../shared/constants';
import { 
  History, 
  Boxes, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Play, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ProjectHistorySectionProps {
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onSelectArchetype: (type: ProductType) => void;
  onNavigateSection: (section: string) => void;
}

export const ProjectHistorySection: React.FC<ProjectHistorySectionProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onSelectArchetype,
  onNavigateSection
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <History className="w-4 h-4" />
            <span>ENTERPRISE REPOSITORY & HISTORICAL BUILDS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Software Project Catalog
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Explore ready-to-run software builds across all 4 product archetypes and custom natural-language requirements.
          </p>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const isCurrent = project.id === currentProjectId;
          return (
            <div
              key={project.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isCurrent
                  ? 'bg-zinc-900/90 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : 'bg-[#0e1017] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {project.productType}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Score: {project.qualityScore}/100</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{project.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{project.prompt}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>STAGE:</span>
                  <span className="text-zinc-200 uppercase">{project.stage}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>CREATED:</span>
                  <span className="text-zinc-400">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-cyan-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <span>{isCurrent ? 'Active Project' : 'Load Project'}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    onSelectProject(project.id);
                    onNavigateSection('product');
                  }}
                  className="py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-cyan-400 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
