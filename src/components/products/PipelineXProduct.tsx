import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Plus, 
  DollarSign, 
  Users, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface PipelineXProps {
  data: any;
  onAction: (action: string, payload: any) => void;
}

const STAGES = ['Lead', 'Qualified', 'Demo', 'Proposal', 'Closed Won'];

export const PipelineXProduct: React.FC<PipelineXProps> = ({ data, onAction }) => {
  const [viewTab, setViewTab] = useState<'board' | 'contacts'>('board');
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealValue, setNewDealValue] = useState('50000');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const deals = data?.deals || [];
  const contacts = data?.contacts || [];

  const totalARR = deals.reduce((acc: number, d: any) => acc + (d.value || 0), 0);
  const wonARR = deals.filter((d: any) => d.stage === 'Closed Won').reduce((acc: number, d: any) => acc + d.value, 0);

  const handleAdvance = (dealId: string, currentStage: string) => {
    const currentIndex = STAGES.indexOf(currentStage);
    if (currentIndex < STAGES.length - 1) {
      const newStage = STAGES[currentIndex + 1];
      onAction('PIPELINEX_ADVANCE_DEAL', { dealId, newStage });
    }
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle.trim()) return;
    const newDeal = {
      id: 'deal-' + Date.now(),
      title: newDealTitle,
      company: newDealCompany || 'Enterprise Prospect',
      value: parseInt(newDealValue) || 45000,
      stage: 'Lead',
      owner: 'Sarah Connor',
      probability: 25
    };
    deals.push(newDeal);
    setNewDealTitle('');
    setNewDealCompany('');
    setIsAddOpen(false);
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-zinc-800 text-zinc-100 overflow-hidden shadow-2xl">
      {/* Topbar */}
      <div className="bg-[#121520] border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GitPullRequest className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">PipelineX</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                B2B SALES PIPELINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Autonomous deal routing & forecast modeling</p>
          </div>
        </div>

        {/* View toggles & Add Deal */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setViewTab('board')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewTab === 'board' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Deal Kanban
            </button>
            <button
              onClick={() => setViewTab('contacts')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewTab === 'contacts' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Contact Rolodex
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            id="btn-pipelinex-add-deal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="bg-zinc-950/80 border-b border-zinc-800/80 px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-zinc-400 text-[10px]">TOTAL PIPELINE ARR</span>
          <h4 className="text-base font-bold text-white font-mono">${totalARR.toLocaleString()}</h4>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">CLOSED WON ARR</span>
          <h4 className="text-base font-bold text-emerald-400 font-mono">${wonARR.toLocaleString()}</h4>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">ACTIVE DEALS</span>
          <h4 className="text-base font-bold text-cyan-400 font-mono">{deals.length} Opportunities</h4>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">WIN RATE</span>
          <h4 className="text-base font-bold text-violet-400 font-mono">42.8%</h4>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewTab === 'board' && (
        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-5 gap-4 min-w-[900px]">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter((d: any) => d.stage === stage);
              const stageSum = stageDeals.reduce((a: number, b: any) => a + b.value, 0);

              return (
                <div key={stage} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div>
                        <span className="font-bold text-xs text-white uppercase font-mono">{stage}</span>
                        <span className="text-[10px] text-zinc-400 block font-mono">${stageSum.toLocaleString()}</span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400 font-mono">
                        {stageDeals.length}
                      </span>
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-2.5">
                      {stageDeals.map((deal: any) => (
                        <div
                          key={deal.id}
                          className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{deal.title}</span>
                            <span className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-zinc-400" />
                              {deal.company}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-xs font-mono">
                            <span className="text-emerald-400 font-bold">${deal.value.toLocaleString()}</span>
                            {stage !== 'Closed Won' && (
                              <button
                                onClick={() => handleAdvance(deal.id, deal.stage)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-bold"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTACTS LIST VIEW */}
      {viewTab === 'contacts' && (
        <div className="p-6 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3">CONTACT</th>
                  <th className="p-3">COMPANY & ROLE</th>
                  <th className="p-3">COMMUNICATIONS</th>
                  <th className="p-3">ENGAGEMENT STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {contacts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-zinc-900/40">
                    <td className="p-3 font-bold text-white">{c.name}</td>
                    <td className="p-3 text-zinc-400">{c.role} at <span className="text-zinc-200">{c.company}</span></td>
                    <td className="p-3 space-y-0.5">
                      <span className="flex items-center gap-1 text-cyan-400"><Mail className="w-3 h-3" /> {c.email}</span>
                      <span className="flex items-center gap-1 text-zinc-400"><Phone className="w-3 h-3" /> {c.phone}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Deal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <form onSubmit={handleAddDeal} className="relative z-10 w-full max-w-md bg-[#0e1017] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-mono">Add New Enterprise Opportunity</h3>
            <div className="space-y-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Deal Title (e.g. Global Expansion Licensing)"
                value={newDealTitle}
                onChange={(e) => setNewDealTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={newDealCompany}
                onChange={(e) => setNewDealCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
              />
              <input
                type="number"
                placeholder="Annual Deal Value ($)"
                value={newDealValue}
                onChange={(e) => setNewDealValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs uppercase font-mono"
            >
              Add to Pipeline
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
