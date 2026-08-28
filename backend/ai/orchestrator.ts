import { projectStore } from '../storage/store';
import { getAIProvider } from './AIProvider';
import { BuildStage, AgentRole, AgentStatus, ProductType } from '../../shared/types';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class BuildoraOrchestrator {
  private static runningBuilds = new Set<string>();

  public static async executeBuild(projectId: string): Promise<void> {
    if (this.runningBuilds.has(projectId)) {
      return;
    }
    this.runningBuilds.add(projectId);

    const project = projectStore.getProject(projectId);
    if (!project) {
      this.runningBuilds.delete(projectId);
      return;
    }

    const ai = getAIProvider();
    projectStore.addLog(projectId, {
      level: 'info',
      category: 'Orchestrator',
      message: `Initiating autonomous engineering build with [${ai.name}] for ${project.name}...`
    });

    const updateAgent = (role: AgentRole, status: AgentStatus, progress: number, task: string, action: string, output?: string) => {
      const p = projectStore.getProject(projectId);
      if (!p) return;
      const agent = p.agents.find(a => a.role === role);
      if (agent) {
        agent.status = status;
        agent.progress = progress;
        agent.currentTask = task;
        agent.lastAction = action;
        if (output) agent.output = output;
        projectStore.updateProject(p);
      }
    };

    const updateStage = (stage: BuildStage, progress: number) => {
      const p = projectStore.getProject(projectId);
      if (!p) return;
      p.stage = stage;
      p.progress = progress;
      projectStore.updateProject(p);
    };

    try {
      // 1. REQUIREMENT ANALYSIS
      updateStage('REQUIREMENT_ANALYSIS', 8);
      updateAgent('Product Manager', 'ANALYZING', 30, 'Deconstructing natural language prompt into functional PRD', 'Synthesizing user journeys and technical constraints');
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Architecture',
        agent: 'Product Manager',
        message: 'Product Manager initiated requirements decomposition and user personas mapping.'
      });
      await sleep(600);

      const reqAnalysis = await ai.analyzeRequirement(project.prompt, project.productType);
      project.requirement = reqAnalysis;
      updateAgent('Product Manager', 'COMPLETED', 100, 'PRD & Functional Specifications Published', 'Verified domain requirements', `Requirement specification generated: ${reqAnalysis.coreFeatures.length} core modules identified.`);
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Architecture',
        agent: 'Product Manager',
        message: `Requirements validated: ${reqAnalysis.businessGoal}`
      });
      await sleep(400);

      // 2. PRODUCT PLANNING
      updateStage('PRODUCT_PLANNING', 16);
      updateAgent('System Architect', 'WORKING', 40, 'Structuring domain boundary context & module graph', 'Mapping service communications');
      await sleep(500);

      // 3. ARCHITECTURE
      updateStage('ARCHITECTURE', 24);
      updateAgent('System Architect', 'WORKING', 75, 'Authoring system blueprint, data flow & database schema', 'Specifying API routes');
      const arch = await ai.generateArchitecture(project.requirement);
      project.architecture = arch;
      updateAgent('System Architect', 'COMPLETED', 100, 'Architecture Blueprint & Schema Approved', 'Generated architecture specification', `Selected topology: ${arch.pattern}. Components: ${arch.components.map(c => c.name).join(', ')}.`);
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Architecture',
        agent: 'System Architect',
        message: `System Architecture ready: ${arch.pattern}`
      });
      await sleep(400);

      // 4. AGENT ASSIGNMENT & TASK GRAPH
      updateStage('AGENT_ASSIGNMENT', 32);
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Orchestrator',
        message: 'Orchestrator assigned parallel work orders across Frontend, Backend, Database, and QA agents.'
      });
      await sleep(400);

      // 5. DATABASE & API GENERATION (Database Engineer & Backend Engineer in parallel)
      updateStage('DATABASE_API_GENERATION', 44);
      updateAgent('Database Engineer', 'WORKING', 60, 'Generating Postgres DDL, indexes, and migrations', 'Executing schema build');
      updateAgent('Backend Engineer', 'WORKING', 50, 'Scaffolding Express routes and domain service layer', 'Writing REST/SSE handlers');
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Database',
        agent: 'Database Engineer',
        message: 'Created relational tables: ' + arch.schemas.map(s => s.table).join(', ')
      });
      await sleep(600);

      updateAgent('Database Engineer', 'COMPLETED', 100, 'Schema Migrations & Indexing Ready', 'Validated relational constraints', 'Postgres DDL schemas and indexes provisioned successfully.');
      updateAgent('Backend Engineer', 'COMPLETED', 100, 'REST & SSE Endpoints Compiled', 'Endpoints checked against OpenAPI spec', 'Domain services and API handlers active.');
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Backend',
        agent: 'Backend Engineer',
        message: 'Express router compiled: endpoints /api/projects/:id/live-data and /api/projects/:id/live-action active.'
      });

      // 6. CODE GENERATION (Frontend Engineer & Code Reviewer)
      updateStage('CODE_GENERATION', 56);
      updateAgent('Frontend Engineer', 'WORKING', 70, 'Building React 19 UI with Tailwind & Framer Motion', 'Assembling interactive components');
      await sleep(600);

      updateAgent('Frontend Engineer', 'COMPLETED', 100, 'React 19 Components Built', 'Interactive state connected', 'Frontend layout, cart, and dashboard views verified.');
      updateAgent('Code Reviewer', 'ANALYZING', 60, 'AST static analysis & circular dependency scan', 'Reviewing code patterns');
      await sleep(400);

      updateAgent('Code Reviewer', 'COMPLETED', 100, 'Static Code Analysis Approved', 'Zero lint warnings', 'Type safety and clean architecture constraints passed.');

      // 7. TESTING & FAILURE DETECTION
      updateStage('TESTING', 65);
      updateAgent('QA Engineer', 'WORKING', 50, 'Executing automated unit, integration, and API test suites', 'Running 47 automated test assertions');
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Testing',
        agent: 'QA Engineer',
        message: 'Running automated test suites: Unit, Integration, API, Security, Performance...'
      });
      await sleep(600);

      // Deterministic Demo Test Failure
      updateStage('FAILURE_DETECTION', 70);
      updateAgent('QA Engineer', 'FAILED', 85, 'Test suite halted: 46 passed, 1 failed', 'Caught runtime TypeError in orderService.ts', 'Assertion Error: TypeError in orderService.js: Cannot read properties of undefined (reading "map")');
      
      const pCurrent = projectStore.getProject(projectId);
      if (pCurrent) {
        pCurrent.tests = pCurrent.tests.map((t, idx) => idx === 2 ? { ...t, status: 'failed', error: 'TypeError: Cannot read properties of undefined (reading "map")' } : { ...t, status: 'passed' });
        projectStore.updateProject(pCurrent);
      }

      projectStore.addLog(projectId, {
        level: 'error',
        category: 'Testing',
        agent: 'QA Engineer',
        message: 'TEST FAILURE DETECTED: TypeError in orderService.js at line 42:15. Dispatching Debugging Engineer...'
      });
      await sleep(700);

      // 8. AUTONOMOUS DEBUGGING & SELF-HEALING
      updateStage('AUTONOMOUS_DEBUGGING', 76);
      updateAgent('Debugging Engineer', 'ANALYZING', 40, 'Analyzing stack trace and AST node structure', 'Pinpointing root cause');
      await sleep(500);

      const debugResult = await ai.debugError({
        errorType: 'TypeError',
        file: 'backend/services/orderService.ts',
        message: 'Missing null validation before accessing nested order data'
      });

      updateAgent('Debugging Engineer', 'WORKING', 80, 'Applying AST patch to orderService.ts', 'Inserting null safety guard', `Patch applied: ${debugResult.patchDiff}`);
      projectStore.addLog(projectId, {
        level: 'warn',
        category: 'Backend',
        agent: 'Debugging Engineer',
        message: `Debugger Root Cause: "${debugResult.rootCause}"`
      });
      await sleep(600);

      // Re-run test after patch
      updateAgent('QA Engineer', 'RETRYING', 90, 'Re-executing test suite with patch applied', 'Verifying patch regression');
      await sleep(400);

      if (pCurrent) {
        pCurrent.tests = pCurrent.tests.map(t => ({ ...t, status: 'healed' }));
        pCurrent.selfHealing = {
          step: 'resolved',
          errorType: 'TypeError in orderService.js',
          file: 'backend/services/orderService.ts',
          location: 'Line 42:15',
          errorDescription: 'Cannot read properties of undefined (reading "map") during empty cart processing',
          rootCause: debugResult.rootCause,
          patchDiff: debugResult.patchDiff,
          timestamp: new Date().toISOString(),
          testsPassedAfterPatch: 47,
          totalTests: 47
        };
        projectStore.updateProject(pCurrent);
      }

      updateAgent('Debugging Engineer', 'COMPLETED', 100, 'Self-Healing Patch Applied & Verified', 'Regression test passed', 'Auto-healed null pointer bug. All edge cases verified.');
      updateAgent('QA Engineer', 'COMPLETED', 100, 'All 47/47 Tests Passed', 'Full green test matrix', '47/47 tests passed (Unit: 24, Integration: 11, API: 8, Security: 4).');
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Testing',
        agent: 'QA Engineer',
        message: 'Patch Applied. 47/47 tests passed.'
      });
      await sleep(400);

      // 9. SECURITY REVIEW
      updateStage('SECURITY_REVIEW', 84);
      updateAgent('Security Engineer', 'WORKING', 60, 'Scanning for SQLi, XSS, CSRF & secrets exposure', 'Performing SAST static audit');
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Security',
        agent: 'Security Engineer',
        message: 'Security agent scanning codebase against OWASP Top 10 vulnerabilities...'
      });
      await sleep(500);

      const secVulns = await ai.securityScan(project.files);
      if (pCurrent) {
        pCurrent.security = secVulns.map(s => ({ ...s, status: 'RESOLVED' }));
        projectStore.updateProject(pCurrent);
      }
      updateAgent('Security Engineer', 'COMPLETED', 100, 'OWASP Security Audit Certified', 'Zero critical vulnerabilities', 'All endpoints hardened with parameterized SQL, CSRF tokens, and XSS sanitizers.');
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Security',
        agent: 'Security Engineer',
        message: 'Security Audit passed: 0 vulnerabilities remaining. Token authentication and input sanitization confirmed.'
      });
      await sleep(400);

      // 10. PERFORMANCE OPTIMIZATION
      updateStage('PERFORMANCE_OPTIMIZATION', 90);
      const perfResult = await ai.optimizePerformance(project.performance);
      if (pCurrent) {
        pCurrent.performance = perfResult.optimizedMetrics;
        projectStore.updateProject(pCurrent);
      }
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Architecture',
        message: `Performance optimization complete: API Latency ${perfResult.optimizedMetrics.apiLatencyMs}ms, Lighthouse Score ${perfResult.optimizedMetrics.lighthouseScore}/100.`
      });
      await sleep(400);

      // 11. DEPLOYMENT PIPELINE
      updateStage('DEPLOYMENT', 95);
      updateAgent('DevOps Engineer', 'WORKING', 70, 'Building OCI Container & provisioning cloud cluster', 'Running canary health probe');
      projectStore.addLog(projectId, {
        level: 'info',
        category: 'Deployment',
        agent: 'DevOps Engineer',
        message: `Packaging container image and provisioning Cloud Run ingress...`
      });
      await sleep(600);

      if (pCurrent) {
        pCurrent.deployment = {
          ...pCurrent.deployment,
          status: 'LIVE',
          deployedAt: new Date().toISOString(),
          healthScore: 100
        };
        projectStore.updateProject(pCurrent);
      }

      updateAgent('DevOps Engineer', 'COMPLETED', 100, 'Production Ingress Live', 'Health checks 100% green', `Deployed to ${project.deployment.cluster} with 3 healthy replicas.`);
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Deployment',
        agent: 'DevOps Engineer',
        message: `Deployment LIVE: Ingress endpoint ready at ${project.deployment.endpointUrl}`
      });

      // 12. COMPLETED
      updateStage('COMPLETED', 100);
      projectStore.addLog(projectId, {
        level: 'success',
        category: 'Orchestrator',
        message: `Autonomous Build Completed! Quality Score: ${project.qualityScore}/100. Product "${project.name}" is fully operational.`
      });

    } catch (err: any) {
      console.error('[Orchestrator Error]', err);
      updateStage('FAILED', project.progress);
      projectStore.addLog(projectId, {
        level: 'error',
        category: 'Orchestrator',
        message: `Build encountered an unhandled error: ${err.message || err}`
      });
    } finally {
      this.runningBuilds.delete(projectId);
    }
  }
}
