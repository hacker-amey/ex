export type ProductType = 'FoodFleet' | 'CommerceX' | 'PipelineX' | 'CampusOS' | 'Custom';

export type AgentRole =
  | 'Product Manager'
  | 'System Architect'
  | 'Frontend Engineer'
  | 'Backend Engineer'
  | 'Database Engineer'
  | 'QA Engineer'
  | 'Debugging Engineer'
  | 'Security Engineer'
  | 'DevOps Engineer'
  | 'Code Reviewer';

export type AgentStatus =
  | 'QUEUED'
  | 'ANALYZING'
  | 'WORKING'
  | 'WAITING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRYING';

export type BuildStage =
  | 'IDLE'
  | 'REQUIREMENT_ANALYSIS'
  | 'PRODUCT_PLANNING'
  | 'ARCHITECTURE'
  | 'AGENT_ASSIGNMENT'
  | 'CODE_GENERATION'
  | 'DATABASE_API_GENERATION'
  | 'TESTING'
  | 'FAILURE_DETECTION'
  | 'AUTONOMOUS_DEBUGGING'
  | 'SECURITY_REVIEW'
  | 'PERFORMANCE_OPTIMIZATION'
  | 'DEPLOYMENT'
  | 'COMPLETED'
  | 'FAILED';

export interface AgentState {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  status: AgentStatus;
  progress: number;
  currentTask: string;
  lastAction: string;
  output: string;
  specialty: string;
  assignedFiles: string[];
}

export interface TaskNode {
  id: string;
  name: string;
  agentRole: AgentRole;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'healed';
  dependencies: string[];
  durationMs?: number;
  outputSummary?: string;
}

export interface RequirementAnalysis {
  businessGoal: string;
  users: string[];
  coreFeatures: string[];
  technicalRequirements: string[];
  databaseRequirements: string[];
  securityRequirements: string[];
  deploymentRequirements: string[];
  estimatedLoC: number;
  complexity: 'Standard' | 'Medium' | 'Enterprise';
}

export interface ArchitectureSpec {
  pattern: string;
  frontendStack: string;
  backendStack: string;
  database: string;
  caching: string;
  apiProtocol: string;
  components: { name: string; type: string; description: string }[];
  schemas: { table: string; fields: string[] }[];
}

export interface TestItem {
  id: string;
  name: string;
  suite: 'Unit' | 'Integration' | 'API' | 'Security' | 'Performance';
  status: 'passed' | 'failed' | 'running' | 'pending' | 'healed';
  durationMs: number;
  error?: string;
  file: string;
}

export interface SelfHealingEvent {
  step: 'detected' | 'analyzing' | 'patching' | 'verifying' | 'resolved';
  errorType: string;
  file: string;
  location: string;
  errorDescription: string;
  rootCause: string;
  patchDiff: string;
  timestamp: string;
  testsPassedAfterPatch: number;
  totalTests: number;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  category: 'SQL Injection' | 'XSS' | 'Authentication' | 'Authorization' | 'Secrets Exposure' | 'Dependency Vulnerabilities' | 'API Security';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  description: string;
  status: 'DETECTED' | 'FIXING' | 'RESOLVED';
  remediation?: string;
}

export interface PerformanceMetrics {
  apiLatencyMs: number;
  bundleSizeBytes: number;
  databaseQueryMs: number;
  memoryMb: number;
  cpuPercent: number;
  requestsPerSec: number;
  lighthouseScore: number;
  timeToInteractiveMs: number;
  history: { time: string; latency: number; rps: number; memory: number }[];
}

export interface DeploymentState {
  id: string;
  status: 'PENDING' | 'BUILDING' | 'CONTAINERIZING' | 'PROVISIONING' | 'CONFIGURING' | 'DEPLOYING' | 'HEALTH_CHECK' | 'LIVE';
  cluster: string;
  region: string;
  endpointUrl: string;
  containerId: string;
  replicas: number;
  healthScore: number;
  deployedAt?: string;
  commitHash: string;
}

export interface GeneratedFile {
  path: string;
  language: string;
  content: string;
  size: number;
  agent: AgentRole;
}

export interface ProjectApproval {
  id: string;
  type: 'architecture' | 'destructive_database' | 'production_deployment' | 'security_policy';
  title: string;
  description: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedAt?: string;
  recommendedAction: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'debug';
  category: 'Architecture' | 'Frontend' | 'Backend' | 'Database' | 'Testing' | 'Security' | 'Deployment' | 'Orchestrator';
  agent?: AgentRole;
  message: string;
}

export interface Project {
  id: string;
  name: string;
  productType: ProductType;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  mode: 'DEMO' | 'AI';
  aiProvider?: 'gemini' | 'openai' | 'anthropic';
  stage: BuildStage;
  progress: number;
  qualityScore: number;
  requirement: RequirementAnalysis;
  architecture: ArchitectureSpec;
  agents: AgentState[];
  tasks: TaskNode[];
  tests: TestItem[];
  selfHealing?: SelfHealingEvent;
  security: SecurityVulnerability[];
  performance: PerformanceMetrics;
  deployment: DeploymentState;
  files: GeneratedFile[];
  approvals: ProjectApproval[];
  logs: LogEntry[];
  interactiveData: Record<string, any>;
}

export interface PlatformAnalytics {
  projectsBuilt: number;
  activeAgents: number;
  tasksCompleted: number;
  bugsFixed: number;
  deploymentSuccessRate: number;
  averageBuildTimeSeconds: number;
  generatedLinesOfCode: number;
  testCoveragePercent: number;
  projectSummaries: {
    id: string;
    name: string;
    productType: ProductType;
    status: string;
    buildTime: string;
    qualityScore: number;
    stack: string[];
    deployment: string;
    agentCount: number;
  }[];
}
