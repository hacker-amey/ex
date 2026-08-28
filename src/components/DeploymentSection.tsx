import React, { useState } from 'react';
import { Project } from '../../shared/types';
import { 
  CloudUpload, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Server, 
  Globe, 
  RefreshCw, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Copy, 
  Check
} from 'lucide-react';

interface DeploymentSectionProps {
  currentProject: Project | null;
  onDeploy: () => void;
  onNavigateSection: (section: string) => void;
}

export const DeploymentSection: React.FC<DeploymentSectionProps> = ({
  currentProject,
  onDeploy,
  onNavigateSection
}) => {
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const deploy = currentProject?.deployment;

  const handleCopyUrl = () => {
    if (deploy?.endpointUrl) {
      navigator.clipboard.writeText(deploy.endpointUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    onDeploy();
    setTimeout(() => {
      setIsDeploying(false);
    }, 1000);
  };

  const isLive = deploy?.status === 'LIVE';

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1">
            <CloudUpload className="w-4 h-4" />
            <span>CONTAINER ORCHESTRATION & INGRESS PIPELINE</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cloud Run & Production Deployment
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Automated OCI packaging, zero-downtime canary rollout, and multi-replica health verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerDeploy}
            disabled={isDeploying}
            id="btn-trigger-deploy"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeploying ? 'animate-spin text-cyan-400' : 'text-zinc-400'}`} />
            <span>{isDeploying ? 'Deploying...' : 'Redeploy Cluster'}</span>
          </button>

          <button
            onClick={() => onNavigateSection('product')}
            id="btn-launch-live-product"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 border border-emerald-400/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Live Product</span>
          </button>
        </div>
      </div>

      {/* Deployment Stages Linear Progress */}
      <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
          Deployment Pipeline Verification
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            'Build Completed',
            'Containerized',
            'Env Provisioned',
            'Cloud Configured',
            'Ingress Deployed',
            'Health Checks (100%)',
            'Live & Operational'
          ].map((stageName, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500">Stage 0{idx + 1}</span>
              <p className="text-xs font-semibold text-white leading-tight">{stageName}</p>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Live Cluster Specifications Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Ingress & Endpoint details */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                Production Ingress Endpoint
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {deploy?.status || 'LIVE'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="font-mono text-xs text-cyan-300 truncate">
              {deploy?.endpointUrl || 'https://foodfleet-app.run.app'}
            </div>
            <button
              onClick={handleCopyUrl}
              className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-zinc-400">
              <span>DEPLOYMENT ID:</span>
              <span className="text-zinc-200">{deploy?.id}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>ACTIVE CLUSTER:</span>
              <span className="text-zinc-200">{deploy?.cluster}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>DEPLOYED REGION:</span>
              <span className="text-zinc-200">{deploy?.region}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>COMMIT HASH:</span>
              <span className="text-zinc-200">{deploy?.commitHash}</span>
            </div>
          </div>
        </div>

        {/* Right: Container Runtime Stats */}
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-5">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Container Runtime Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-zinc-400 text-[10px]">HEALTH SCORE</span>
              <h4 className="text-lg font-bold text-emerald-400">{deploy?.healthScore || 100}%</h4>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-zinc-400 text-[10px]">ACTIVE REPLICAS</span>
              <h4 className="text-lg font-bold text-cyan-400">{deploy?.replicas || 3} Pods</h4>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono space-y-1.5">
            <span className="text-zinc-400 block text-[10px]">CONTAINER IMAGE URI:</span>
            <p className="text-zinc-300 text-[11px] truncate">{deploy?.containerId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
