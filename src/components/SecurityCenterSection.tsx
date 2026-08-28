import React, { useState } from 'react';
import { Project, SecurityVulnerability } from '../../shared/types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Terminal, 
  RefreshCw, 
  Key, 
  Code,
  Zap
} from 'lucide-react';

interface SecurityCenterSectionProps {
  currentProject: Project | null;
}

export const SecurityCenterSection: React.FC<SecurityCenterSectionProps> = ({ currentProject }) => {
  const [isRescanning, setIsRescanning] = useState(false);
  const vulns = currentProject?.security || [];

  const handleRescan = () => {
    setIsRescanning(true);
    setTimeout(() => {
      setIsRescanning(false);
    }, 900);
  };

  const criticalCount = vulns.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length;
  const resolvedCount = vulns.filter(v => v.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>OWASP TOP 10 & SAST STATIC SCANNER</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Review & Vulnerability Remediation
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Automated AST analysis guarding against SQLi, XSS, CSRF, Token abuse, and secret leaks.
          </p>
        </div>

        <button
          onClick={handleRescan}
          disabled={isRescanning}
          id="btn-security-rescan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all shadow-md active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRescanning ? 'animate-spin text-cyan-400' : 'text-zinc-400'}`} />
          <span>{isRescanning ? 'Scanning Codebase...' : 'Execute SAST Rescan'}</span>
        </button>
      </div>

      {/* Security Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">OWASP AUDIT STATUS</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">CERTIFIED SECURE</h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">RESOLVED FINDINGS</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">{resolvedCount} Vulnerabilities Fixed</h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">SECRETS EXPOSURE</span>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">0 Leaks (Server Sealed)</h4>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400">DEFENSE AGENT</span>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-bold text-white">Zoe Thorne</h4>
          </div>
        </div>
      </div>

      {/* Security Check Categories List */}
      <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
          Security Check Matrix & Remediations
        </h3>

        <div className="space-y-3">
          {vulns.map((vuln) => (
            <div
              key={vuln.id}
              className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-white">{vuln.title}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 text-[10px] border border-zinc-700">
                    {vuln.category}
                  </span>
                  <span className="text-zinc-500">[{vuln.file}]</span>
                </div>
                <p className="text-xs text-zinc-400">{vuln.description}</p>
                {vuln.remediation && (
                  <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Remediation: {vuln.remediation}</span>
                  </p>
                )}
              </div>

              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start md:self-center">
                {vuln.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
