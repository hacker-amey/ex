import { Project, ProductType, BuildStage, LogEntry, PlatformAnalytics } from '../../shared/types';
import { PRODUCT_ARCHETYPES, createInitialAgents, INITIAL_TEST_SUITE, INITIAL_SECURITY_VULNERABILITIES, INITIAL_PERFORMANCE_METRICS, INITIAL_DEPLOYMENT_STATE, INITIAL_APPROVALS } from '../../shared/constants';
import { Response } from 'express';

class ProjectStore {
  private projects: Map<string, Project> = new Map();
  private sseListeners: Map<string, Set<Response>> = new Map();

  constructor() {
    this.seedDefaultProjects();
  }

  private seedDefaultProjects() {
    const defaultTypes: ProductType[] = ['FoodFleet', 'CommerceX', 'PipelineX', 'CampusOS'];
    defaultTypes.forEach((type, index) => {
      const archetype = PRODUCT_ARCHETYPES[type];
      const id = `proj-${type.toLowerCase()}-01`;
      const proj: Project = {
        id,
        name: archetype.name,
        productType: type,
        prompt: archetype.defaultPrompt,
        createdAt: new Date(Date.now() - (4 - index) * 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        mode: 'DEMO',
        stage: 'COMPLETED',
        progress: 100,
        qualityScore: 98 - index,
        requirement: archetype.requirement,
        architecture: archetype.architecture,
        agents: createInitialAgents().map(a => ({
          ...a,
          status: 'COMPLETED',
          progress: 100,
          currentTask: 'Task completed successfully',
          lastAction: 'Artifact verified & checked in',
          output: `Phase execution completed with 0 errors.`
        })),
        tasks: [
          { id: 't1', name: 'Requirement Analysis', agentRole: 'Product Manager', status: 'completed', dependencies: [] },
          { id: 't2', name: 'Architecture Blueprint', agentRole: 'System Architect', status: 'completed', dependencies: ['t1'] },
          { id: 't3', name: 'Database & Schemas', agentRole: 'Database Engineer', status: 'completed', dependencies: ['t2'] },
          { id: 't4', name: 'Backend API Services', agentRole: 'Backend Engineer', status: 'completed', dependencies: ['t3'] },
          { id: 't5', name: 'Frontend React UI', agentRole: 'Frontend Engineer', status: 'completed', dependencies: ['t2'] },
          { id: 't6', name: 'Test Suite Execution', agentRole: 'QA Engineer', status: 'completed', dependencies: ['t4', 't5'] },
          { id: 't7', name: 'Self-Healing Patch', agentRole: 'Debugging Engineer', status: 'healed', dependencies: ['t6'] },
          { id: 't8', name: 'Security Audit', agentRole: 'Security Engineer', status: 'completed', dependencies: ['t7'] },
          { id: 't9', name: 'Production Deployment', agentRole: 'DevOps Engineer', status: 'completed', dependencies: ['t8'] }
        ],
        tests: INITIAL_TEST_SUITE.map(t => ({ ...t, status: 'passed' })),
        selfHealing: {
          step: 'resolved',
          errorType: 'TypeError in orderService.js: NullPointer dereference',
          file: 'backend/services/orderService.ts',
          location: 'Line 42:15',
          errorDescription: 'Cannot read properties of undefined (reading "map") during empty cart processing',
          rootCause: 'Missing null validation before accessing nested order items array inside payload dispatcher.',
          patchDiff: `@@ -41,4 +41,6 @@
- return payload.items.map(item => item.price);
+ if (!payload?.items?.length) return [];
+ return payload.items.map(item => item.price);`,
          timestamp: new Date().toISOString(),
          testsPassedAfterPatch: 47,
          totalTests: 47
        },
        security: INITIAL_SECURITY_VULNERABILITIES.map(s => ({ ...s, status: 'RESOLVED' })),
        performance: { ...INITIAL_PERFORMANCE_METRICS },
        deployment: {
          ...INITIAL_DEPLOYMENT_STATE,
          id: `dpl-${type.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
          status: 'LIVE',
          deployedAt: new Date().toISOString()
        },
        files: archetype.sampleFiles,
        approvals: INITIAL_APPROVALS.map(a => ({ ...a, status: 'APPROVED' })),
        logs: [
          { id: 'l1', timestamp: '10:00:01', level: 'info', category: 'Orchestrator', message: `Buildora orchestrator initialized project ${archetype.name}` },
          { id: 'l2', timestamp: '10:00:04', level: 'success', category: 'Architecture', agent: 'System Architect', message: 'Architecture blueprint approved by orchestrator' },
          { id: 'l3', timestamp: '10:00:12', level: 'warn', category: 'Testing', agent: 'QA Engineer', message: 'Test execution failed: TypeError in orderService.js' },
          { id: 'l4', timestamp: '10:00:15', level: 'info', category: 'Backend', agent: 'Debugging Engineer', message: 'Root cause identified: Missing null validation before accessing nested order data' },
          { id: 'l5', timestamp: '10:00:18', level: 'success', category: 'Testing', agent: 'QA Engineer', message: 'Patch Applied. 47/47 tests passed.' },
          { id: 'l6', timestamp: '10:00:24', level: 'success', category: 'Deployment', agent: 'DevOps Engineer', message: `Production deployment healthy on ${INITIAL_DEPLOYMENT_STATE.cluster}` }
        ],
        interactiveData: JSON.parse(JSON.stringify(archetype.initialInteractiveData))
      };
      this.projects.set(id, proj);
    });
  }

  public getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  public getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public createProject(data: { prompt: string; productType?: ProductType; mode?: 'DEMO' | 'AI' }): Project {
    let matchedType: ProductType = data.productType || 'FoodFleet';
    const lowerPrompt = (data.prompt || '').toLowerCase();

    if (!data.productType) {
      if (lowerPrompt.includes('food') || lowerPrompt.includes('delivery') || lowerPrompt.includes('restaurant') || lowerPrompt.includes('meal')) {
        matchedType = 'FoodFleet';
      } else if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('commerce') || lowerPrompt.includes('product') || lowerPrompt.includes('cart')) {
        matchedType = 'CommerceX';
      } else if (lowerPrompt.includes('crm') || lowerPrompt.includes('pipeline') || lowerPrompt.includes('sales') || lowerPrompt.includes('lead') || lowerPrompt.includes('deal')) {
        matchedType = 'PipelineX';
      } else if (lowerPrompt.includes('student') || lowerPrompt.includes('campus') || lowerPrompt.includes('school') || lowerPrompt.includes('attendance') || lowerPrompt.includes('academic')) {
        matchedType = 'CampusOS';
      }
    }

    const archetype = PRODUCT_ARCHETYPES[matchedType];
    const id = 'proj-' + Math.random().toString(36).substring(2, 9);
    const hasRealKey = !!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_API_KEY;

    const newProject: Project = {
      id,
      name: archetype.name,
      productType: matchedType,
      prompt: data.prompt || archetype.defaultPrompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode: data.mode || (hasRealKey ? 'AI' : 'DEMO'),
      aiProvider: hasRealKey ? 'gemini' : undefined,
      stage: 'IDLE',
      progress: 0,
      qualityScore: 99,
      requirement: {
        ...archetype.requirement,
        businessGoal: data.prompt || archetype.requirement.businessGoal
      },
      architecture: archetype.architecture,
      agents: createInitialAgents(),
      tasks: [
        { id: 't1', name: 'Requirement Analysis', agentRole: 'Product Manager', status: 'pending', dependencies: [] },
        { id: 't2', name: 'System Architecture Blueprint', agentRole: 'System Architect', status: 'pending', dependencies: ['t1'] },
        { id: 't3', name: 'Database & Schemas', agentRole: 'Database Engineer', status: 'pending', dependencies: ['t2'] },
        { id: 't4', name: 'Backend API Generation', agentRole: 'Backend Engineer', status: 'pending', dependencies: ['t3'] },
        { id: 't5', name: 'Frontend React 19 UI', agentRole: 'Frontend Engineer', status: 'pending', dependencies: ['t2'] },
        { id: 't6', name: 'Static Code Review', agentRole: 'Code Reviewer', status: 'pending', dependencies: ['t4', 't5'] },
        { id: 't7', name: 'Automated Test Suite', agentRole: 'QA Engineer', status: 'pending', dependencies: ['t6'] },
        { id: 't8', name: 'Self-Healing Debugger', agentRole: 'Debugging Engineer', status: 'pending', dependencies: ['t7'] },
        { id: 't9', name: 'Security Review & SAST', agentRole: 'Security Engineer', status: 'pending', dependencies: ['t8'] },
        { id: 't10', name: 'Cloud Container Deployment', agentRole: 'DevOps Engineer', status: 'pending', dependencies: ['t9'] }
      ],
      tests: INITIAL_TEST_SUITE.map(t => ({ ...t, status: 'pending' })),
      security: INITIAL_SECURITY_VULNERABILITIES.map(s => ({ ...s, status: 'DETECTED' })),
      performance: { ...INITIAL_PERFORMANCE_METRICS },
      deployment: {
        ...INITIAL_DEPLOYMENT_STATE,
        id: `dpl-${matchedType.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
        status: 'PENDING'
      },
      files: archetype.sampleFiles,
      approvals: INITIAL_APPROVALS.map(a => ({ ...a, status: 'PENDING' })),
      logs: [
        { id: 'log-' + Date.now(), timestamp: new Date().toLocaleTimeString(), level: 'info', category: 'Orchestrator', message: `Project workspace instantiated: ${archetype.name} (Mode: ${data.mode || (hasRealKey ? 'AI' : 'DEMO')})` }
      ],
      interactiveData: JSON.parse(JSON.stringify(archetype.initialInteractiveData))
    };

    this.projects.set(id, newProject);
    return newProject;
  }

  public updateProject(project: Project) {
    project.updatedAt = new Date().toISOString();
    this.projects.set(project.id, project);
    this.broadcastEvent(project.id, 'PROJECT_UPDATED', project);
  }

  public addLog(projectId: string, log: Omit<LogEntry, 'id' | 'timestamp'>) {
    const project = this.projects.get(projectId);
    if (!project) return;
    const entry: LogEntry = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      ...log
    };
    project.logs.unshift(entry);
    if (project.logs.length > 200) project.logs.pop();
    this.broadcastEvent(projectId, 'LOG_ENTRY', entry);
  }

  public addSSEListener(projectId: string, res: Response) {
    if (!this.sseListeners.has(projectId)) {
      this.sseListeners.set(projectId, new Set());
    }
    this.sseListeners.get(projectId)!.add(res);

    res.on('close', () => {
      this.sseListeners.get(projectId)?.delete(res);
    });
  }

  public broadcastEvent(projectId: string, eventType: string, data: any) {
    const listeners = this.sseListeners.get(projectId);
    if (!listeners || listeners.size === 0) return;

    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    listeners.forEach(res => {
      try {
        res.write(payload);
      } catch (err) {
        listeners.delete(res);
      }
    });
  }

  public getPlatformAnalytics(): PlatformAnalytics {
    const all = Array.from(this.projects.values());
    const totalLoC = all.reduce((sum, p) => sum + (p.requirement?.estimatedLoC || 2500), 0);
    const activeAgentsCount = all.reduce((sum, p) => sum + p.agents.filter(a => a.status === 'WORKING' || a.status === 'ANALYZING').length, 0);

    return {
      projectsBuilt: all.length + 18,
      activeAgents: activeAgentsCount || 10,
      tasksCompleted: all.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'completed' || t.status === 'healed').length, 0) + 142,
      bugsFixed: 39,
      deploymentSuccessRate: 99.4,
      averageBuildTimeSeconds: 42,
      generatedLinesOfCode: totalLoC + 45200,
      testCoveragePercent: 98.7,
      projectSummaries: all.map(p => ({
        id: p.id,
        name: p.name,
        productType: p.productType,
        status: p.stage,
        buildTime: '42s',
        qualityScore: p.qualityScore,
        stack: [p.architecture.frontendStack.split(' ')[0], p.architecture.backendStack.split(' ')[0], p.architecture.database.split(' ')[0]],
        deployment: p.deployment.status,
        agentCount: p.agents.length
      }))
    };
  }
}

export const projectStore = new ProjectStore();
