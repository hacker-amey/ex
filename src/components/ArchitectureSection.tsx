import React, { useState } from 'react';
import { Project } from '../../shared/types';
import { 
  Layers, 
  Database, 
  Server, 
  Layout, 
  ShieldCheck, 
  Cloud, 
  Key, 
  CheckCircle2, 
  Code, 
  Terminal, 
  Cpu, 
  FileText,
  Boxes
} from 'lucide-react';

interface ArchitectureSectionProps {
  currentProject: Project | null;
}

export const ArchitectureSection: React.FC<ArchitectureSectionProps> = ({ currentProject }) => {
  const [activeTab, setActiveTab] = useState<'requirement' | 'architecture' | 'schema'>('requirement');
  const req = currentProject?.requirement;
  const arch = currentProject?.architecture;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0e1017] border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>REQUIREMENTS & SYSTEM TOPOLOGY</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Specification & Architecture Blueprint
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Deconstructed natural language requirements mapped to enterprise architecture patterns and relational schemas.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('requirement')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'requirement' ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Requirement Analysis
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture' ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            System Blueprint
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schema' ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Database Schemas
          </button>
        </div>
      </div>

      {/* TAB 1: REQUIREMENT ANALYSIS */}
      {activeTab === 'requirement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Goal & Users */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                1. Business Goal & Target Users
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
              <strong className="text-white block mb-1">Executive Summary:</strong>
              {req?.businessGoal || 'Autonomous full-stack software generation.'}
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400">TARGET USER PERSONAS:</span>
              <div className="flex flex-wrap gap-2">
                {req?.users?.map((u, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                2. Core Functional Features
              </h3>
            </div>
            <div className="space-y-2">
              {req?.coreFeatures?.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/60 text-xs text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical & Database Requirements */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                3. Technical & Database Specifications
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-cyan-400 font-mono font-semibold block">TECHNICAL CONSTRAINTS:</span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  {req?.technicalRequirements?.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-violet-400 font-mono font-semibold block">DATABASE SPECS:</span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  {req?.databaseRequirements?.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Security & Deployment Requirements */}
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                4. Security & Deployment Guardrails
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-emerald-400 font-mono font-semibold block">SECURITY POLICIES:</span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  {req?.securityRequirements?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-1">
                <span className="text-cyan-400 font-mono font-semibold block">DEPLOYMENT TARGETS:</span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  {req?.deploymentRequirements?.map((dp, i) => <li key={i}>{dp}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM BLUEPRINT */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">ARCHITECTURE PATTERN</span>
              <h4 className="text-sm font-bold text-white">{arch?.pattern}</h4>
            </div>
            <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">DATABASE & CACHE</span>
              <h4 className="text-sm font-bold text-white">{arch?.database} / {arch?.caching}</h4>
            </div>
            <div className="p-4 rounded-xl bg-[#0e1017] border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono text-zinc-400">API PROTOCOL</span>
              <h4 className="text-sm font-bold text-white">{arch?.apiProtocol}</h4>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
              System Components Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {arch?.components?.map((comp, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300 font-mono">{comp.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {comp.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMAS */}
      {activeTab === 'schema' && (
        <div className="p-6 rounded-2xl bg-[#0e1017] border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 font-mono">
                PostgreSQL Relational ERD & Data Dictionary
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">Schema Verified by DB Engineer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arch?.schemas?.map((table, i) => (
              <div key={i} className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
                <div className="bg-zinc-800/80 px-4 py-2.5 border-b border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-white font-mono">{table.table}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">TABLE</span>
                </div>
                <div className="p-3 divide-y divide-zinc-800/60 font-mono text-xs text-zinc-300">
                  {table.fields?.map((field, fIdx) => (
                    <div key={fIdx} className="py-1.5 flex items-center justify-between">
                      <span className="text-zinc-200">{field.split(' ')[0]}</span>
                      <span className="text-[10px] text-zinc-400">{field.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
