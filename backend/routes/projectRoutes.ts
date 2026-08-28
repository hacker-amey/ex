import { Router, Request, Response } from 'express';
import { projectStore } from '../storage/store';
import { BuildoraOrchestrator } from '../ai/orchestrator';

export const projectRouter = Router();

// GET /api/health
projectRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Buildora Autonomous AI Workforce Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ? 'Google Gemini 3.7 Flash' : 'Deterministic Neural Demo Engine',
    activeProjects: projectStore.getAllProjects().length
  });
});

// GET /api/analytics
projectRouter.get('/analytics', (req: Request, res: Response) => {
  const analytics = projectStore.getPlatformAnalytics();
  res.json(analytics);
});

// GET /api/projects
projectRouter.get('/projects', (req: Request, res: Response) => {
  const projects = projectStore.getAllProjects();
  res.json(projects);
});

// POST /api/projects
projectRouter.post('/projects', (req: Request, res: Response) => {
  const { prompt, productType, mode } = req.body;
  const project = projectStore.createProject({
    prompt: prompt || '',
    productType,
    mode
  });
  res.status(201).json(project);
});

// GET /api/projects/:id
projectRouter.get('/projects/:id', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
});

// POST /api/projects/:id/build
projectRouter.post('/projects/:id/build', async (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Trigger build in background asynchronously
  BuildoraOrchestrator.executeBuild(project.id).catch(err => {
    console.error('Async build error:', err);
  });

  res.json({
    status: 'BUILD_STARTED',
    projectId: project.id,
    message: `Autonomous engineering build started for ${project.name}`
  });
});

// GET /api/projects/:id/agents
projectRouter.get('/projects/:id/agents', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ agents: project.agents, tasks: project.tasks });
});

// GET /api/projects/:id/logs
projectRouter.get('/projects/:id/logs', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ logs: project.logs });
});

// GET /api/projects/:id/tests
projectRouter.get('/projects/:id/tests', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ tests: project.tests, selfHealing: project.selfHealing });
});

// GET /api/projects/:id/security
projectRouter.get('/projects/:id/security', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ security: project.security });
});

// GET /api/projects/:id/performance
projectRouter.get('/projects/:id/performance', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ performance: project.performance });
});

// POST /api/projects/:id/approve
projectRouter.post('/projects/:id/approve', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  const { approvalId, status } = req.body;
  const approval = project.approvals.find(a => a.id === approvalId);
  if (approval) {
    approval.status = status === 'REJECTED' ? 'REJECTED' : 'APPROVED';
    approval.approvedAt = new Date().toLocaleTimeString();
    projectStore.updateProject(project);
    projectStore.addLog(project.id, {
      level: 'success',
      category: 'Orchestrator',
      message: `Human approval decision logged: "${approval.title}" -> ${approval.status}`
    });
  }
  res.json({ success: true, approvals: project.approvals });
});

// POST /api/projects/:id/deploy
projectRouter.post('/projects/:id/deploy', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const deployId = 'dpl-' + project.productType.toLowerCase() + '-' + Math.random().toString(36).substring(2, 7);
  project.deployment = {
    id: deployId,
    status: 'LIVE',
    cluster: 'buildora-prod-sea-cluster-01',
    region: 'asia-southeast1',
    endpointUrl: `https://${project.productType.toLowerCase()}-app.run.app`,
    containerId: `oci://buildora.internal/v1/engine:${Math.random().toString(36).substring(2, 8)}`,
    replicas: 3,
    healthScore: 100,
    deployedAt: new Date().toISOString(),
    commitHash: 'git-' + Math.random().toString(36).substring(2, 8)
  };
  projectStore.updateProject(project);
  projectStore.addLog(project.id, {
    level: 'success',
    category: 'Deployment',
    message: `Manual deploy triggered: ID ${deployId} live on ${project.deployment.cluster}`
  });

  res.json({ success: true, deployment: project.deployment });
});

// GET /api/projects/:id/events (Server-Sent Events)
projectRouter.get('/projects/:id/events', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write(`event: INITIAL_STATE\ndata: ${JSON.stringify(project)}\n\n`);
  projectStore.addSSEListener(project.id, res);
});

// GET /api/projects/:id/live-data
projectRouter.get('/projects/:id/live-data', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project.interactiveData || {});
});

// POST /api/projects/:id/live-action
projectRouter.post('/projects/:id/live-action', (req: Request, res: Response) => {
  const project = projectStore.getProject(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const { action, payload } = req.body;
  const data = project.interactiveData;

  switch (action) {
    // FoodFleet actions
    case 'FOODFLEET_ADD_ORDER': {
      const newOrder = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        customer: payload.customer || 'Alex Mercer',
        restaurant: payload.restaurant || 'Umami Ramen & Izakaya',
        items: payload.items || [],
        total: payload.total || 34.50,
        status: 'RECEIVED',
        stepIndex: 0,
        etaMinutes: 25,
        courier: 'Assigned upon preparation',
        createdAt: 'Just now'
      };
      data.orders = [newOrder, ...(data.orders || [])];
      projectStore.addLog(project.id, {
        level: 'info',
        category: 'Backend',
        message: `[FoodFleet] New order ${newOrder.id} received for $${newOrder.total}. Kitchen notified.`
      });
      break;
    }
    case 'FOODFLEET_ADVANCE_ORDER': {
      const order = (data.orders || []).find((o: any) => o.id === payload.orderId);
      if (order) {
        if (order.status === 'RECEIVED') {
          order.status = 'PREPARING';
          order.stepIndex = 1;
          order.courier = 'David K. (Honda Civic - #4ABC)';
          order.etaMinutes = 18;
        } else if (order.status === 'PREPARING') {
          order.status = 'ON_THE_WAY';
          order.stepIndex = 2;
          order.etaMinutes = 8;
        } else if (order.status === 'ON_THE_WAY') {
          order.status = 'DELIVERED';
          order.stepIndex = 3;
          order.etaMinutes = 0;
        }
      }
      break;
    }

    // CommerceX actions
    case 'COMMERCEX_PLACE_ORDER': {
      const newOrder = {
        id: 'ORD-CX-' + Math.floor(1000 + Math.random() * 9000),
        customer: payload.customer || 'Jennifer Hayes',
        total: payload.total || 299.00,
        itemsCount: payload.itemsCount || 1,
        status: 'PAID',
        date: 'Just now'
      };
      data.orders = [newOrder, ...(data.orders || [])];
      projectStore.addLog(project.id, {
        level: 'info',
        category: 'Backend',
        message: `[CommerceX] Order ${newOrder.id} authorized. Inventory deducted.`
      });
      break;
    }
    case 'COMMERCEX_ADD_PRODUCT': {
      const newProd = {
        id: 'p-' + Date.now(),
        name: payload.name || 'New Premium Gadget',
        price: payload.price || 99.00,
        category: payload.category || 'Electronics',
        stock: payload.stock || 50,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80'
      };
      data.products = [newProd, ...(data.products || [])];
      break;
    }

    // PipelineX actions
    case 'PIPELINEX_ADVANCE_DEAL': {
      const deal = (data.deals || []).find((d: any) => d.id === payload.dealId);
      if (deal) {
        deal.stage = payload.newStage;
        if (payload.newStage === 'Closed Won') deal.probability = 100;
        projectStore.addLog(project.id, {
          level: 'success',
          category: 'Backend',
          message: `[PipelineX] Deal "${deal.title}" advanced to [${deal.stage}] - ARR $${deal.value.toLocaleString()}`
        });
      }
      break;
    }
    case 'PIPELINEX_ADD_CONTACT': {
      const newContact = {
        id: 'c-' + Date.now(),
        name: payload.name || 'Alex Morgan',
        company: payload.company || 'Enterprise Corp',
        role: payload.role || 'Director of Product',
        email: payload.email || 'alex@enterprise.com',
        phone: payload.phone || '+1 (555) 019-2834',
        status: 'Hot'
      };
      data.contacts = [newContact, ...(data.contacts || [])];
      break;
    }

    // CampusOS actions
    case 'CAMPUSOS_TOGGLE_ATTENDANCE': {
      const student = (data.students || []).find((s: any) => s.id === payload.studentId);
      if (student) {
        student.attendance = Math.min(100, Math.max(70, student.attendance + (payload.present ? 1 : -2)));
        projectStore.addLog(project.id, {
          level: 'info',
          category: 'Backend',
          message: `[CampusOS] Attendance marked for ${student.name}: ${student.attendance}%`
        });
      }
      break;
    }
    case 'CAMPUSOS_ADD_STUDENT': {
      const newStudent = {
        id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        name: payload.name || 'Samantha Reed',
        major: payload.major || 'Computer Science',
        gpa: payload.gpa || 3.85,
        attendance: 98,
        semester: payload.semester || 'Freshman',
        email: (payload.name || 'student').toLowerCase().replace(' ', '.') + '@campus.edu',
        status: 'Good Standing'
      };
      data.students = [newStudent, ...(data.students || [])];
      break;
    }
  }

  projectStore.updateProject(project);
  res.json({ success: true, interactiveData: data });
});
