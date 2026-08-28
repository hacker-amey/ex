import React from 'react';
import { 
  LayoutDashboard, 
  GitMerge, 
  Bot, 
  Layers, 
  CheckSquare, 
  ShieldCheck, 
  Gauge, 
  CloudUpload, 
  Sparkles, 
  Smartphone, 
  BarChart3, 
  History, 
  Terminal,
  ChevronRight,
  ShieldAlert,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { Project } from '../../shared/types';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentProject: Project | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onSectionChange,
  currentProject,
  isOpenMobile,
  onCloseMobile
}) => {
  const pendingApprovals = currentProject?.approvals.filter(a => a.status === 'PENDING').length || 0;
  const activeAgents = currentProject?.agents.filter(a => a.status === 'WORKING' || a.status === 'ANALYZING').length || 0;
  const failedTests = currentProject?.tests.filter(t => t.status === 'failed').length || 0;
  const vulnsCount = currentProject?.security.filter(s => s.status === 'DETECTED').length || 0;

  const navGroups = [
    {
      group: 'MAIN CONSOLE',
      items: [
        { id: 'overview', label: 'Overview', glyph: '⬚', icon: LayoutDashboard, badge: null },
        { id: 'pipeline', label: 'Build Pipeline', glyph: '⌬', icon: GitMerge, badge: currentProject?.stage !== 'COMPLETED' && currentProject?.stage !== 'IDLE' ? 'LIVE' : null, badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' },
        { id: 'workforce', label: 'AI Workforce', glyph: '◈', icon: Bot, badge: `${activeAgents}/10`, badgeColor: activeAgents > 0 ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-zinc-800 text-zinc-400' },
        { id: 'architecture', label: 'Architecture', glyph: '◳', icon: Layers, badge: currentProject?.architecture?.pattern ? 'Spec' : null },
      ]
    },
    {
      group: 'MONITORING',
      items: [
        { id: 'testing', label: 'Testing Center', glyph: '▣', icon: CheckSquare, badge: failedTests > 0 ? `${failedTests} Fail` : '47/47', badgeColor: failedTests > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
        { id: 'security', label: 'Security Center', glyph: '🛡', icon: ShieldCheck, badge: vulnsCount > 0 ? `${vulnsCount} Alert` : 'Secure', badgeColor: vulnsCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
        { id: 'performance', label: 'Performance', glyph: '⚡', icon: Gauge, badge: `${currentProject?.performance?.apiLatencyMs || 28}ms` },
        { id: 'deployment', label: 'Deployment', glyph: '🚀', icon: CloudUpload, badge: currentProject?.deployment?.status || 'PENDING', badgeColor: currentProject?.deployment?.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400' },
        { id: 'observability', label: 'Telemetry Logs', glyph: '⌥', icon: Terminal, badge: `${currentProject?.logs.length || 0} logs` }
      ]
    },
    {
      group: 'WORKSPACE & DEMOS',
      items: [
        { id: 'product', label: 'Generated Product', glyph: '✦', icon: Sparkles, badge: currentProject?.productType || 'App', badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold' },
        { id: 'mobile', label: 'Voice AI Console', glyph: '📱', icon: Smartphone, badge: 'Active' },
        { id: 'analytics', label: 'Analytics', glyph: '📊', icon: BarChart3, badge: null },
        { id: 'history', label: 'Project Catalog', glyph: '🗂', icon: History, badge: '4 archetypes' }
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-zinc-900/40 backdrop-blur-md border-r border-zinc-800 w-60 text-zinc-300 select-none">
      {/* Approvals notification strip if any */}
      {pendingApprovals > 0 && (
        <div className="p-3 border-b border-zinc-800 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono font-bold">GATE ACTION</span>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              <AlertTriangle className="w-2.5 h-2.5" />
              {pendingApprovals} PENDING
            </span>
          </div>
        </div>
      )}

      {/* Grouped Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {navGroups.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <div className="px-3 py-1.5 text-zinc-500 text-[10px] uppercase font-bold tracking-widest font-mono">
              {grp.group}
            </div>
            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onSectionChange(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-all group ${
                      isActive
                        ? 'bg-zinc-800 text-cyan-400 border border-zinc-700 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-sm w-4 text-center ${isActive ? 'opacity-90 text-cyan-400' : 'opacity-50 text-zinc-400'}`}>
                        {item.glyph}
                      </span>
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-zinc-800 text-zinc-400'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Infrastructure Info */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 font-mono text-[10px] text-zinc-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>CLUSTER</span>
          <span className="text-cyan-400">SEA-ZONE-1</span>
        </div>
        <div className="flex items-center justify-between">
          <span>REPLICA POOL</span>
          <span className="text-zinc-300">10 AGENTS</span>
        </div>
        <div className="flex items-center justify-between">
          <span>SELF-HEAL</span>
          <span className="text-emerald-400">AUTOMATIC</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block h-[calc(100vh-53px)] sticky top-[53px] shrink-0">
        {content}
      </aside>

      {/* Mobile drawer backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

