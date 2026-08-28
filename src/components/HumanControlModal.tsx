import React from 'react';
import { Project, ProjectApproval } from '../../shared/types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  UserCheck,
  Cpu
} from 'lucide-react';

interface HumanControlModalProps {
  currentProject: Project | null;
  onApprove: (approvalId: string, status: 'APPROVED' | 'REJECTED') => void;
  onClose: () => void;
}

export const HumanControlModal: React.FC<HumanControlModalProps> = ({
  currentProject,
  onApprove,
  onClose
}) => {
  const approvals = currentProject?.approvals || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#0e1017] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Human-in-the-Loop Approval Gates</h3>
              <p className="text-xs text-zinc-400">Review critical architectural decisions and deployment authorizations.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Approvals List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {approvals.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-white">{req.title}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                      {req.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{req.description}</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  req.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                }`}>
                  {req.status}
                </span>
              </div>

              {/* Action Buttons if Pending */}
              {req.status === 'PENDING' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
                  <button
                    onClick={() => onApprove(req.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 border border-zinc-700 text-xs font-mono transition-all"
                  >
                    Reject Gate
                  </button>
                  <button
                    onClick={() => onApprove(req.id, 'APPROVED')}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    Grant Authorization
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
