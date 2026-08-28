import React, { useState, useEffect, useRef } from 'react';
import { Project, ProductType } from '../shared/types';
import { PRODUCT_ARCHETYPES } from '../shared/constants';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewSection } from './components/OverviewSection';
import { BuildPipelineSection } from './components/BuildPipelineSection';
import { AIWorkforceSection } from './components/AIWorkforceSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { TestingCenterSection } from './components/TestingCenterSection';
import { SecurityCenterSection } from './components/SecurityCenterSection';
import { PerformanceCenterSection } from './components/PerformanceCenterSection';
import { DeploymentSection } from './components/DeploymentSection';
import { GeneratedProductSection } from './components/GeneratedProductSection';
import { MobileCommandCenter } from './components/MobileCommandCenter';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ProjectHistorySection } from './components/ProjectHistorySection';
import { ObservabilitySection } from './components/ObservabilitySection';
import { HumanControlModal } from './components/HumanControlModal';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isOpenMobileNav, setIsOpenMobileNav] = useState<boolean>(false);
  const [isOpenMobileCommand, setIsOpenMobileCommand] = useState<boolean>(false);
  const [isOpenApprovals, setIsOpenApprovals] = useState<boolean>(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch all projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data: Project[] = await res.json();
          setProjects(data);
          if (data.length > 0 && !currentProjectId) {
            setCurrentProjectId(data[0].id);
          }
        }
      } catch (err) {
        console.warn('Backend fetch fallback (loading in-memory):', err);
      }
    }
    loadProjects();
  }, []);

  // Connect SSE for real-time live events on active project
  useEffect(() => {
    if (!currentProjectId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const sse = new EventSource(`/api/projects/${currentProjectId}/events`);
    eventSourceRef.current = sse;

    sse.addEventListener('INITIAL_STATE', (e: MessageEvent) => {
      try {
        const p: Project = JSON.parse(e.data);
        updateProjectState(p);
      } catch (err) {
        console.error('SSE JSON error:', err);
      }
    });

    sse.addEventListener('PROJECT_UPDATED', (e: MessageEvent) => {
      try {
        const p: Project = JSON.parse(e.data);
        updateProjectState(p);
        if (p.stage === 'COMPLETED' || p.stage === 'FAILED') {
          setIsBuilding(false);
        } else if (p.stage !== 'IDLE') {
          setIsBuilding(true);
        }
      } catch (err) {
        console.error('SSE JSON error:', err);
      }
    });

    sse.addEventListener('LOG_ADDED', (e: MessageEvent) => {
      try {
        const log = JSON.parse(e.data);
        setProjects(prev => prev.map(proj => {
          if (proj.id === currentProjectId) {
            return {
              ...proj,
              logs: [log, ...proj.logs]
            };
          }
          return proj;
        }));
      } catch (err) {
        console.error('SSE Log parse error:', err);
      }
    });

    return () => {
      sse.close();
    };
  }, [currentProjectId]);

  const updateProjectState = (p: Project) => {
    setProjects(prev => {
      const exists = prev.some(item => item.id === p.id);
      if (exists) {
        return prev.map(item => item.id === p.id ? p : item);
      }
      return [p, ...prev];
    });
  };

  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0] || null;

  // Trigger Autonomous Multi-Agent Build
  const handleTriggerBuild = async () => {
    if (!currentProject) return;
    setIsBuilding(true);
    try {
      const res = await fetch(`/api/projects/${currentProject.id}/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        throw new Error('Failed to start build');
      }
    } catch (err: any) {
      console.error('Build start error:', err);
      setIsBuilding(false);
    }
  };

  // Start Build with prompt & archetype
  const handleStartBuildWithPrompt = async (prompt: string, type: ProductType) => {
    try {
      setIsBuilding(true);
      // Check if current project matches archetype or create new
      let targetProjectId = currentProject?.id;
      if (currentProject?.productType !== type) {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, productType: type })
        });
        if (res.ok) {
          const newProj = await res.json();
          targetProjectId = newProj.id;
          setCurrentProjectId(newProj.id);
        }
      }

      if (targetProjectId) {
        await fetch(`/api/projects/${targetProjectId}/build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        setActiveSection('pipeline');
      }
    } catch (err) {
      console.error('Start build error:', err);
      setIsBuilding(false);
    }
  };

  // Switch Archetype template
  const handleSelectArchetype = (type: ProductType) => {
    const existing = projects.find(p => p.productType === type);
    if (existing) {
      setCurrentProjectId(existing.id);
    } else {
      // Create project for this archetype
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: PRODUCT_ARCHETYPES[type].defaultPrompt,
          productType: type
        })
      }).then(r => r.json()).then(newProj => {
        setProjects(prev => [...prev, newProj]);
        setCurrentProjectId(newProj.id);
      });
    }
  };

  // Trigger Live Action for generated products (FoodFleet, CommerceX, PipelineX, CampusOS)
  const handleLiveAction = async (action: string, payload: any) => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/projects/${currentProject.id}/live-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => prev.map(p => {
          if (p.id === currentProject.id) {
            return {
              ...p,
              interactiveData: data.interactiveData
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Live action error:', err);
    }
  };

  // Deploy project
  const handleDeploy = async () => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/projects/${currentProject.id}/deploy`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => prev.map(p => {
          if (p.id === currentProject.id) {
            return {
              ...p,
              deployment: data.deployment
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Deploy error:', err);
    }
  };

  // Approve Gate
  const handleApprove = async (approvalId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!currentProject) return;
    try {
      const res = await fetch(`/api/projects/${currentProject.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, status })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => prev.map(p => {
          if (p.id === currentProject.id) {
            return {
              ...p,
              approvals: data.approvals
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  // Simulate self healing test failure
  const handleSimulateSelfHealing = () => {
    if (!currentProject) return;
    handleTriggerBuild();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black antialiased">
      {/* Top Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={setCurrentProjectId}
        onNewProjectModal={() => handleSelectArchetype('FoodFleet')}
        onTriggerBuild={handleTriggerBuild}
        isBuilding={isBuilding}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onOpenMobileCenter={() => setIsOpenMobileCommand(true)}
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          currentProject={currentProject}
          isOpenMobile={isOpenMobileNav}
          onCloseMobile={() => setIsOpenMobileNav(false)}
        />

        {/* Dynamic Section View Content */}
        <main className="flex-1 overflow-y-auto pb-6">
          {activeSection === 'overview' && (
            <OverviewSection
              currentProject={currentProject}
              onSelectArchetype={handleSelectArchetype}
              onStartBuild={handleStartBuildWithPrompt}
              isBuilding={isBuilding}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'pipeline' && (
            <BuildPipelineSection
              currentProject={currentProject}
              onTriggerBuild={handleTriggerBuild}
              isBuilding={isBuilding}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'workforce' && (
            <AIWorkforceSection currentProject={currentProject} />
          )}

          {activeSection === 'architecture' && (
            <ArchitectureSection currentProject={currentProject} />
          )}

          {activeSection === 'testing' && (
            <TestingCenterSection
              currentProject={currentProject}
              onSimulateSelfHealing={handleSimulateSelfHealing}
              isBuilding={isBuilding}
            />
          )}

          {activeSection === 'security' && (
            <SecurityCenterSection currentProject={currentProject} />
          )}

          {activeSection === 'performance' && (
            <PerformanceCenterSection currentProject={currentProject} />
          )}

          {activeSection === 'deployment' && (
            <DeploymentSection
              currentProject={currentProject}
              onDeploy={handleDeploy}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'product' && (
            <GeneratedProductSection
              currentProject={currentProject}
              onSelectArchetype={handleSelectArchetype}
              onLiveAction={handleLiveAction}
            />
          )}

          {activeSection === 'mobile' && (
            <MobileCommandCenter
              currentProject={currentProject}
              onTriggerBuild={handleTriggerBuild}
              onDeploy={handleDeploy}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'analytics' && (
            <AnalyticsSection />
          )}

          {activeSection === 'history' && (
            <ProjectHistorySection
              projects={projects}
              currentProjectId={currentProjectId}
              onSelectProject={setCurrentProjectId}
              onSelectArchetype={handleSelectArchetype}
              onNavigateSection={setActiveSection}
            />
          )}

          {activeSection === 'observability' && (
            <ObservabilitySection currentProject={currentProject} />
          )}
        </main>
      </div>

      {/* Technical Dashboard Telemetry Footer Bar */}
      <footer className="h-8 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between text-[10px] font-mono text-zinc-400 select-none shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">PROJECT_ID: {currentProject?.id ? currentProject.id.toUpperCase() : 'BF-88219-X'}</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">ARCHETYPE: {currentProject?.productType || 'FOODFLEET'}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-zinc-400">
            <span>SECURE_TUNNEL:</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-zinc-400">
            <span>REGION:</span>
            <span className="text-zinc-300">US-EAST-1</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            <span>CONNECTED TO ORCHESTRATOR</span>
          </div>
        </div>
      </footer>

      {/* Mobile Command Floating Drawer / Modal */}
      {isOpenMobileCommand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-3xl">
            <MobileCommandCenter
              currentProject={currentProject}
              onTriggerBuild={handleTriggerBuild}
              onDeploy={handleDeploy}
              onNavigateSection={(sec) => {
                setActiveSection(sec);
                setIsOpenMobileCommand(false);
              }}
              onClose={() => setIsOpenMobileCommand(false)}
            />
          </div>
        </div>
      )}

      {/* Human Approvals Modal */}
      {isOpenApprovals && (
        <HumanControlModal
          currentProject={currentProject}
          onApprove={handleApprove}
          onClose={() => setIsOpenApprovals(false)}
        />
      )}
    </div>
  );
}
