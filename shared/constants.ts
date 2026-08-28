import { AgentRole, AgentState, ProductType, RequirementAnalysis, ArchitectureSpec, TestItem, SecurityVulnerability, PerformanceMetrics, DeploymentState, GeneratedFile, ProjectApproval } from './types';

export const AGENT_ROSTER_DEFS: { role: AgentRole; name: string; avatar: string; specialty: string }[] = [
  { role: 'Product Manager', name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', specialty: 'PRDs, User Stories, Acceptance Criteria' },
  { role: 'System Architect', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', specialty: 'Distributed Systems, Microservices, API Schema' },
  { role: 'Frontend Engineer', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', specialty: 'React 19, Tailwind, Motion UI, Web Vitals' },
  { role: 'Backend Engineer', name: 'Devon Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', specialty: 'Node.js, Express, Async Pipelines, ORMs' },
  { role: 'Database Engineer', name: 'Aisha Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', specialty: 'PostgreSQL, Query Optimization, Migrations, Indexing' },
  { role: 'QA Engineer', name: 'Liam O\'Connor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', specialty: 'Automated E2E, Unit Tests, Edge Coverage, Fuzzing' },
  { role: 'Debugging Engineer', name: 'Kaito Tanaka', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', specialty: 'AST Patching, Memory Leaks, Stack Trace Resolution' },
  { role: 'Security Engineer', name: 'Zoe Thorne', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', specialty: 'OWASP Top 10, SAST/DAST, Token Auth, Secret Sanitization' },
  { role: 'DevOps Engineer', name: 'Nikoletta Kovacs', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', specialty: 'Kubernetes, Docker OCI, Envoy Ingress, Observability' },
  { role: 'Code Reviewer', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', specialty: 'Clean Architecture, Static Analysis, Type Safety' }
];

export function createInitialAgents(): AgentState[] {
  return AGENT_ROSTER_DEFS.map((agent, index) => ({
    id: `agent-${index + 1}`,
    name: agent.name,
    role: agent.role,
    avatar: agent.avatar,
    status: 'QUEUED',
    progress: 0,
    currentTask: 'Awaiting orchestrator DAG assignment',
    lastAction: 'Standing by in standby pool',
    output: `Agent ${agent.name} (${agent.role}) ready. Specialization: ${agent.specialty}.`,
    specialty: agent.specialty,
    assignedFiles: []
  }));
}

export const PRODUCT_ARCHETYPES: Record<ProductType, {
  name: string;
  tagline: string;
  defaultPrompt: string;
  requirement: RequirementAnalysis;
  architecture: ArchitectureSpec;
  sampleFiles: GeneratedFile[];
  initialInteractiveData: Record<string, any>;
}> = {
  FoodFleet: {
    name: 'FoodFleet Delivery Ecosystem',
    tagline: 'Autonomous On-Demand Multi-Restaurant Food Logistics Platform',
    defaultPrompt: 'Build a food delivery platform with restaurant discovery, menus, interactive cart, checkout, live order tracking, and kitchen admin dashboard.',
    requirement: {
      businessGoal: 'Deliver hyper-local food ordering with live courier telemetry and zero-latency cart synchronization.',
      users: ['Hungry Customers', 'Restaurant Kitchen Staff', 'Fleet Couriers', 'Platform Dispatch Admins'],
      coreFeatures: [
        'Real-time restaurant discovery & cuisine tags',
        'Dynamic item customization & modifier modal',
        'Stateful cart with delivery fee & tax engine',
        'Live multi-stage order tracking (Received -> Kitchen -> Courier -> Delivered)',
        'Kitchen admin console with live status toggling'
      ],
      technicalRequirements: [
        'React 19 single-page high performance client',
        'Express REST + SSE order dispatcher',
        'Optimistic cart updates with localStorage backup',
        'Sub-50ms order status broadcast'
      ],
      databaseRequirements: [
        'Restaurants table with geo-coordinates and open status',
        'Menu items with price, inventory, dietary tags',
        'Orders with relational line items & courier telemetry'
      ],
      securityRequirements: [
        'JWT bearer authentication on admin actions',
        'Input sanitization against payload injection',
        'Rate-limited checkout endpoint (10 req/min)'
      ],
      deploymentRequirements: [
        'Multi-region container cluster with load balancing',
        'SSL termination and HTTP/2 multiplexing'
      ],
      estimatedLoC: 2840,
      complexity: 'Enterprise'
    },
    architecture: {
      pattern: 'Event-Driven Micro-Service Modular Monolith',
      frontendStack: 'React 19 + TypeScript + Tailwind CSS + Framer Motion',
      backendStack: 'Node.js + Express + TypeScript Router',
      database: 'PostgreSQL Relational Schema with JSONB support',
      caching: 'Redis Memory Cache for Menu Queries',
      apiProtocol: 'REST API + SSE Live Dispatch Stream',
      components: [
        { name: 'RestaurantCatalog', type: 'Frontend UI', description: 'Filterable grid with live availability indicators' },
        { name: 'OrderTelemetryEngine', type: 'Backend Service', description: 'Simulates courier dispatch steps in real-time' },
        { name: 'KitchenAdminGateway', type: 'Admin Portal', description: 'Allows restaurant partners to accept/fulfill orders' }
      ],
      schemas: [
        { table: 'restaurants', fields: ['id (UUID)', 'name', 'cuisine', 'rating', 'delivery_time_mins', 'is_open'] },
        { table: 'menu_items', fields: ['id', 'restaurant_id', 'name', 'price', 'description', 'category', 'image'] },
        { table: 'orders', fields: ['id', 'customer_name', 'total_amount', 'status', 'delivery_address', 'created_at'] }
      ]
    },
    sampleFiles: [
      {
        path: 'src/services/orderService.ts',
        language: 'typescript',
        agent: 'Backend Engineer',
        size: 3420,
        content: `// FoodFleet Order Management Service
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class OrderService {
  private orders: Map<string, any> = new Map();

  public createOrder(payload: { items: OrderItem[]; address: string; customer: string }) {
    if (!payload?.items || payload.items.length === 0) {
      throw new Error("Cannot checkout empty cart");
    }
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const subtotal = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = +(subtotal * 0.08).toFixed(2);
    const deliveryFee = 2.99;
    const total = +(subtotal + tax + deliveryFee).toFixed(2);

    const order = {
      id: orderId,
      customer: payload.customer,
      items: payload.items,
      address: payload.address,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'RECEIVED',
      createdAt: new Date().toISOString()
    };
    this.orders.set(orderId, order);
    return order;
  }
}`
      },
      {
        path: 'src/components/RestaurantDiscovery.tsx',
        language: 'typescript',
        agent: 'Frontend Engineer',
        size: 4210,
        content: `// Interactive Restaurant Discovery Grid
import React, { useState } from 'react';

export const RestaurantDiscovery: React.FC = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Live filtered culinary options */}
    </div>
  );
};`
      }
    ],
    initialInteractiveData: {
      restaurants: [
        {
          id: 'rest-1',
          name: 'Umami Ramen & Izakaya',
          cuisine: 'Japanese',
          rating: 4.9,
          deliveryTime: '20-30 min',
          deliveryFee: 1.99,
          minOrder: 15,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
          featured: true,
          menu: [
            { id: 'm-101', name: 'Tonkotsu Black Garlic Ramen', price: 16.50, desc: 'Rich 18hr pork broth, chashu pork belly, ajitsuke tamago, roasted black garlic oil', tag: 'Chef Favorite' },
            { id: 'm-102', name: 'Spicy Miso Tantanmen', price: 15.75, desc: 'Ground sesame chili pork, bok choy, scallions, rich miso broth', tag: 'Spicy' },
            { id: 'm-103', name: 'Truffle Pork Gyoza (6pcs)', price: 9.25, desc: 'Pan-seared dumplings with black truffle ponzu dipping sauce', tag: 'Popular' }
          ]
        },
        {
          id: 'rest-2',
          name: 'Bella Forno Wood-Fired Pizza',
          cuisine: 'Italian',
          rating: 4.8,
          deliveryTime: '25-35 min',
          deliveryFee: 2.49,
          minOrder: 20,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
          featured: true,
          menu: [
            { id: 'm-201', name: 'Burrata Margherita D.O.P.', price: 18.00, desc: 'San Marzano tomatoes, fresh artisan burrata, sweet basil, cold-pressed olive oil', tag: 'Vegetarian' },
            { id: 'm-202', name: 'Diavola & Hot Honey', price: 19.50, desc: 'Calabrian spicy soppressata, smoked mozzarella, chili-infused organic honey', tag: 'Signature' },
            { id: 'm-203', name: 'Truffle Mushroom Arancini', price: 11.00, desc: 'Crispy carnaroli rice balls stuffed with fontina cheese & wild mushrooms', tag: 'Appetizer' }
          ]
        },
        {
          id: 'rest-3',
          name: 'The Green Haven Bowls',
          cuisine: 'Healthy',
          rating: 4.7,
          deliveryTime: '15-25 min',
          deliveryFee: 0.99,
          minOrder: 12,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
          featured: false,
          menu: [
            { id: 'm-301', name: 'Wild Salmon & Avocado Poke', price: 17.25, desc: 'Sashimi-grade salmon, yuzu ponzu, organic quinoa, edamame, sesame crunch', tag: 'High Protein' },
            { id: 'm-302', name: 'Roasted Tahini Harvest Bowl', price: 14.50, desc: 'Spiced sweet potatoes, kale, chickpeas, avocado, creamy garlic tahini', tag: 'Vegan' }
          ]
        }
      ],
      orders: [
        {
          id: 'ORD-892144',
          customer: 'Sarah Jenkins',
          restaurant: 'Umami Ramen & Izakaya',
          items: [{ id: 'm-101', name: 'Tonkotsu Black Garlic Ramen', price: 16.50, quantity: 2 }],
          total: 38.61,
          status: 'ON_THE_WAY',
          stepIndex: 2,
          etaMinutes: 8,
          courier: 'Michael R. (Toyota Prius - Plate #7XYZ)',
          createdAt: 'Just now'
        }
      ]
    }
  },
  CommerceX: {
    name: 'CommerceX Headless Storefront',
    tagline: 'High-Conversion Next-Gen E-Commerce Suite',
    defaultPrompt: 'Build an enterprise e-commerce platform with multi-category product catalog, search filters, cart, dynamic checkout, order receipts, and inventory admin.',
    requirement: {
      businessGoal: 'Enable lightning-fast luxury product transactions with real-time stock deductions and instant checkout confirmation.',
      users: ['Shoppers', 'Store Managers', 'Fulfillment Admins'],
      coreFeatures: [
        'Faceted search & multi-tier category filtering',
        'Real-time price calculations with coupon codes',
        'Stateful cart and instant mock payment checkout',
        'Order invoice generator with downloadable receipts',
        'Admin inventory manager to add/edit products & stock'
      ],
      technicalRequirements: [
        'React 19 with instant filter state',
        'Optimistic stock decrements',
        'Secure order tokenization'
      ],
      databaseRequirements: [
        'Products with SKU, pricing, stock levels, attributes',
        'Orders and Order Items with tracking status',
        'Inventory audit trail'
      ],
      securityRequirements: [
        'CSRF protection on mutation endpoints',
        'Input validation on payment simulation'
      ],
      deploymentRequirements: [
        'CDN caching for product images',
        'Automated DB read replicas'
      ],
      estimatedLoC: 3120,
      complexity: 'Enterprise'
    },
    architecture: {
      pattern: 'Clean Architecture with Repository Pattern',
      frontendStack: 'React 19 + TypeScript + Tailwind CSS',
      backendStack: 'Node.js Express REST API',
      database: 'PostgreSQL Relational Storage',
      caching: 'Redis Product Catalog Cache',
      apiProtocol: 'RESTful JSON API',
      components: [
        { name: 'ProductCatalog', type: 'Frontend UI', description: 'Grid with instant faceted search' },
        { name: 'CartEngine', type: 'State Layer', description: 'Persistent cart with promo codes' },
        { name: 'InventoryManager', type: 'Admin Service', description: 'Real-time stock adjustment portal' }
      ],
      schemas: [
        { table: 'products', fields: ['id', 'name', 'price', 'stock', 'category', 'rating', 'image'] },
        { table: 'orders', fields: ['id', 'user_id', 'items', 'total', 'status', 'created_at'] }
      ]
    },
    sampleFiles: [
      {
        path: 'src/services/catalogService.ts',
        language: 'typescript',
        agent: 'Backend Engineer',
        size: 2900,
        content: `// CommerceX Product Catalog & Inventory Service
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  image: string;
}

export class CatalogService {
  private products: Product[] = [];
  // Catalog queries with indexing
}`
      }
    ],
    initialInteractiveData: {
      products: [
        { id: 'p-1', name: 'AeroGlide Pro Active Headphones', price: 299.00, category: 'Electronics', stock: 24, rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80' },
        { id: 'p-2', name: 'Minimalist Titanium Automatic Watch', price: 450.00, category: 'Accessories', stock: 12, rating: 4.8, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80' },
        { id: 'p-3', name: 'Ultra-Ergonomic Mechanical Keyboard', price: 189.00, category: 'Electronics', stock: 38, rating: 4.95, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80' },
        { id: 'p-4', name: 'Full-Grain Leather Executive Bag', price: 220.00, category: 'Accessories', stock: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80' },
        { id: 'p-5', name: 'Studio Grade USB-C Microphone', price: 149.00, category: 'Audio', stock: 45, rating: 4.85, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80' }
      ],
      orders: [
        { id: 'ORD-CX-9021', customer: 'David Miller', total: 488.00, itemsCount: 2, status: 'PAID', date: 'Today' },
        { id: 'ORD-CX-9018', customer: 'Emma Watson', total: 299.00, itemsCount: 1, status: 'SHIPPED', date: 'Yesterday' }
      ]
    }
  },
  PipelineX: {
    name: 'PipelineX SaaS CRM',
    tagline: 'Autonomous Sales Pipeline & Account Acceleration OS',
    defaultPrompt: 'Build a SaaS CRM platform with leads management, interactive sales pipeline Kanban board, contact directory, deal revenue analytics, and role-based views.',
    requirement: {
      businessGoal: 'Accelerate enterprise B2B sales cycles with automated stage transitions and real-time ARR forecasting.',
      users: ['Account Executives', 'Sales Development Reps', 'VP of Sales', 'Revenue Ops'],
      coreFeatures: [
        'Interactive Drag-and-Drop / Stage switch Kanban board',
        'Lead qualification scoring and company discovery',
        'Contacts database with activity logging',
        'Deal revenue forecasting & win rate analytics',
        'Role-based permissions (Sales Rep vs VP Sales view)'
      ],
      technicalRequirements: [
        'React 19 with fluid Kanban physics',
        'Deal stage state machine with validation',
        'Real-time aggregation engine for pipeline value'
      ],
      databaseRequirements: [
        'Accounts & Contacts relational model',
        'Deals with stage history, expected close date, ARR',
        'Activities log'
      ],
      securityRequirements: [
        'Row-level security per sales team',
        'Audit trail on deal amount changes'
      ],
      deploymentRequirements: [
        'Zero-downtime blue/green deployment',
        'Automated database backups'
      ],
      estimatedLoC: 3450,
      complexity: 'Enterprise'
    },
    architecture: {
      pattern: 'Domain-Driven Micro-Architecture',
      frontendStack: 'React 19 + Tailwind CSS + Lucide Icons + Recharts',
      backendStack: 'Node.js Express Router + Domain Services',
      database: 'PostgreSQL with Row Level Security',
      caching: 'In-Memory Pipeline Aggregations',
      apiProtocol: 'REST + Webhooks',
      components: [
        { name: 'KanbanPipeline', type: 'Frontend UI', description: 'Visual deal stages with ARR tallies' },
        { name: 'RevenueAnalytics', type: 'Analytics Module', description: 'Forecast graphs and quota attainment' },
        { name: 'ContactDirectory', type: 'Data View', description: 'Customer profiles and communication logs' }
      ],
      schemas: [
        { table: 'deals', fields: ['id', 'title', 'company', 'value', 'stage', 'owner', 'probability'] },
        { table: 'contacts', fields: ['id', 'name', 'company', 'role', 'email', 'phone', 'status'] }
      ]
    },
    sampleFiles: [
      {
        path: 'src/services/crmService.ts',
        language: 'typescript',
        agent: 'Backend Engineer',
        size: 3200,
        content: `// PipelineX Deal and Account State Engine
export class CrmService {
  // Real-time stage progression & ARR forecast
}`
      }
    ],
    initialInteractiveData: {
      deals: [
        { id: 'd-1', title: 'Global Cloud Migration', company: 'Acme Enterprise Corp', value: 125000, stage: 'Qualified', owner: 'Devon Vance', probability: 40 },
        { id: 'd-2', title: 'Security AI Integration', company: 'Starlight Fintech', value: 85000, stage: 'Demo Scheduled', owner: 'Sophia Chen', probability: 60 },
        { id: 'd-3', title: 'Enterprise SSO Rollout', company: 'Nova Health Systems', value: 210000, stage: 'Proposal Sent', owner: 'Devon Vance', probability: 80 },
        { id: 'd-4', title: 'Automated CI/CD Fleet', company: 'Apex Logistics', value: 65000, stage: 'Closed Won', owner: 'Elena Rostova', probability: 100 },
        { id: 'd-5', title: 'Workforce AI Licensing', company: 'Zenith Retail Group', value: 180000, stage: 'Lead', owner: 'Sophia Chen', probability: 20 }
      ],
      contacts: [
        { id: 'c-1', name: 'Jonathan Pierce', company: 'Acme Enterprise Corp', role: 'Chief Information Officer', email: 'j.pierce@acme.io', phone: '+1 (555) 392-1092', status: 'Hot' },
        { id: 'c-2', name: 'Claire Dubois', company: 'Starlight Fintech', role: 'VP of Engineering', email: 'claire@starlight.co', phone: '+1 (555) 829-4411', status: 'Active' },
        { id: 'c-3', name: 'Rajesh Sharma', company: 'Nova Health Systems', role: 'Director of Infrastructure', email: 'rsharma@novahealth.org', phone: '+1 (555) 710-9923', status: 'Hot' }
      ]
    }
  },
  CampusOS: {
    name: 'CampusOS Student & Academic Platform',
    tagline: 'Next-Gen University Information & Faculty Management System',
    defaultPrompt: 'Build a student management system with student directory, GPA tracking, attendance recording, faculty course portal, and academic analytics.',
    requirement: {
      businessGoal: 'Streamline campus academic records, automate attendance tracking, and provide faculty insights into student performance.',
      users: ['Faculty Professors', 'Academic Advisors', 'Students', 'University Registrar'],
      coreFeatures: [
        'Filterable student directory with major, semester, and GPA status',
        'One-click student attendance logging with immediate percentage calculation',
        'Faculty course dashboard with assignment submissions',
        'Academic department performance & retention analytics',
        'Student profile details with course transcript history'
      ],
      technicalRequirements: [
        'React 19 with tabular data visualization',
        'Instant GPA re-calculation engine',
        'Secure attendance audit records'
      ],
      databaseRequirements: [
        'Students table with enrollments and grade logs',
        'Courses with faculty assignments and schedules',
        'Attendance logs table with timestamped marks'
      ],
      securityRequirements: [
        'FERPA compliance & student privacy guardrails',
        'Role-based course editing permissions'
      ],
      deploymentRequirements: [
        'High availability during semester registration spikes',
        'Nightly automated transcript snapshots'
      ],
      estimatedLoC: 2980,
      complexity: 'Enterprise'
    },
    architecture: {
      pattern: 'Tiered Academic Registry Service Pattern',
      frontendStack: 'React 19 + TypeScript + Tailwind + Recharts',
      backendStack: 'Node.js Express + TypeScript',
      database: 'PostgreSQL Relational Schema',
      caching: 'Campus Directory Fast Cache',
      apiProtocol: 'RESTful Secure API',
      components: [
        { name: 'StudentDirectory', type: 'Frontend UI', description: 'Searchable grid of university scholars' },
        { name: 'AttendanceTracker', type: 'Operational Tool', description: 'Daily presence marker with instant metrics' },
        { name: 'AcademicAnalytics', type: 'Dean Portal', description: 'Retention and grade distribution charts' }
      ],
      schemas: [
        { table: 'students', fields: ['id', 'name', 'major', 'gpa', 'attendance_rate', 'status', 'email'] },
        { table: 'courses', fields: ['id', 'code', 'name', 'professor', 'credits', 'enrolled'] }
      ]
    },
    sampleFiles: [
      {
        path: 'src/services/academicService.ts',
        language: 'typescript',
        agent: 'Backend Engineer',
        size: 3100,
        content: `// CampusOS Academic Registry Service
export class AcademicService {
  // Student record calculations & attendance aggregation
}`
      }
    ],
    initialInteractiveData: {
      students: [
        { id: 'STU-1001', name: 'Maya Lin', major: 'Computer Science', gpa: 3.94, attendance: 98, semester: 'Junior', email: 'm.lin@campus.edu', status: 'Dean\'s List' },
        { id: 'STU-1002', name: 'Ethan Rodriguez', major: 'Electrical Engineering', gpa: 3.78, attendance: 94, semester: 'Senior', email: 'e.rodriguez@campus.edu', status: 'Good Standing' },
        { id: 'STU-1003', name: 'Aaliyah Washington', major: 'Data Science & AI', gpa: 3.89, attendance: 96, semester: 'Sophomore', email: 'a.washington@campus.edu', status: 'Dean\'s List' },
        { id: 'STU-1004', name: 'Lucas Chang', major: 'Biomedical Informatics', gpa: 3.65, attendance: 91, semester: 'Junior', email: 'l.chang@campus.edu', status: 'Good Standing' },
        { id: 'STU-1005', name: 'Chloe Dubois', major: 'Cognitive Science', gpa: 3.82, attendance: 95, semester: 'Senior', email: 'c.dubois@campus.edu', status: 'Dean\'s List' }
      ],
      courses: [
        { id: 'CS-401', code: 'CS401', name: 'Distributed Systems & Cloud Computing', professor: 'Dr. Marcus Vance', enrolled: 42, capacity: 45, averageGrade: 'A-' },
        { id: 'AI-302', code: 'AI302', name: 'Neural Networks & Deep Learning', professor: 'Dr. Sophia Chen', enrolled: 58, capacity: 60, averageGrade: 'B+' },
        { id: 'EE-205', code: 'EE205', name: 'Embedded Systems & Robotics', professor: 'Prof. Devon Patel', enrolled: 35, capacity: 40, averageGrade: 'B' }
      ]
    }
  },
  Custom: {
    name: 'Custom Software Solution',
    tagline: 'Autonomous AI Engineering Pipeline for Bespoke Enterprise Solutions',
    defaultPrompt: 'Build a bespoke enterprise dashboard with real-time telemetry, automated tasks, and analytics.',
    requirement: {
      businessGoal: 'Deliver a custom automated software workflow with enterprise reliability.',
      users: ['Enterprise Users', 'Operators', 'Administrators'],
      coreFeatures: ['Dynamic Data Pipeline', 'Real-Time Telemetry', 'Role-Based Control', 'Autonomous Optimization'],
      technicalRequirements: ['Modern High-Efficiency Client', 'Scalable Node.js Backend', 'Robust Database'],
      databaseRequirements: ['Flexible Data Models', 'Transactional Safety'],
      securityRequirements: ['Zero-Trust Architecture', 'End-to-End Encryption'],
      deploymentRequirements: ['Cloud Native Scalability'],
      estimatedLoC: 3000,
      complexity: 'Enterprise'
    },
    architecture: {
      pattern: 'Modular Monolith Service Pattern',
      frontendStack: 'React 19 + TypeScript + Tailwind CSS',
      backendStack: 'Node.js Express + TypeScript',
      database: 'PostgreSQL Relational Database',
      caching: 'Redis Memory Cache',
      apiProtocol: 'REST + SSE Stream',
      components: [{ name: 'CustomGateway', type: 'Service', description: 'Central API router' }],
      schemas: [{ table: 'records', fields: ['id', 'payload', 'created_at'] }]
    },
    sampleFiles: [],
    initialInteractiveData: {}
  }
};

export const INITIAL_TEST_SUITE: TestItem[] = [
  { id: 't-1', name: 'Component Render & State Hydration', suite: 'Unit', status: 'pending', durationMs: 42, file: 'src/components/App.spec.tsx' },
  { id: 't-2', name: 'Cart / Item Price Tax Calculations', suite: 'Unit', status: 'pending', durationMs: 28, file: 'src/utils/pricing.spec.ts' },
  { id: 't-3', name: 'Order State Machine Transitions', suite: 'Unit', status: 'pending', durationMs: 35, file: 'src/services/orderService.spec.ts' },
  { id: 't-4', name: 'API Route Authorization Headers', suite: 'API', status: 'pending', durationMs: 85, file: 'tests/api/auth.spec.ts' },
  { id: 't-5', name: 'Database Query Indexing & Response Times', suite: 'Integration', status: 'pending', durationMs: 110, file: 'tests/db/queryPerf.spec.ts' },
  { id: 't-6', name: 'Cross-Site Scripting (XSS) Sanitization', suite: 'Security', status: 'pending', durationMs: 64, file: 'tests/security/xss.spec.ts' },
  { id: 't-7', name: 'SQL Injection Guard Verification', suite: 'Security', status: 'pending', durationMs: 72, file: 'tests/security/sqli.spec.ts' },
  { id: 't-8', name: 'Concurrency & Load Spike Stress Test', suite: 'Performance', status: 'pending', durationMs: 140, file: 'tests/perf/load.spec.ts' }
];

export const INITIAL_SECURITY_VULNERABILITIES: SecurityVulnerability[] = [
  {
    id: 'SEC-101',
    title: 'Unsanitized query parameters in search endpoint',
    category: 'SQL Injection',
    severity: 'HIGH',
    file: 'backend/services/catalogService.ts',
    description: 'Direct concatenation of search term into SQL template literal detected by AST analyzer.',
    status: 'DETECTED',
    remediation: 'Parameterized query with Prepared Statements implemented by Security Agent.'
  },
  {
    id: 'SEC-102',
    title: 'Missing CSRF token on checkout mutation',
    category: 'Authentication',
    severity: 'MEDIUM',
    file: 'backend/routes/orderRoutes.ts',
    description: 'POST /checkout endpoint accepts unverified origin headers.',
    status: 'DETECTED',
    remediation: 'Added SameSite=Strict secure cookie and CSRF verification middleware.'
  },
  {
    id: 'SEC-103',
    title: 'Potential XSS in rich text rendering',
    category: 'XSS',
    severity: 'HIGH',
    file: 'src/components/ProductDescription.tsx',
    description: 'dangerouslySetInnerHTML invoked without DOMPurify pass.',
    status: 'DETECTED',
    remediation: 'Wrapped with sanitizeHtml parser prior to node rendering.'
  }
];

export const INITIAL_PERFORMANCE_METRICS: PerformanceMetrics = {
  apiLatencyMs: 42,
  bundleSizeBytes: 142000,
  databaseQueryMs: 12,
  memoryMb: 86,
  cpuPercent: 14,
  requestsPerSec: 1280,
  lighthouseScore: 98,
  timeToInteractiveMs: 240,
  history: [
    { time: '10:00', latency: 68, rps: 840, memory: 92 },
    { time: '10:05', latency: 54, rps: 980, memory: 89 },
    { time: '10:10', latency: 46, rps: 1120, memory: 87 },
    { time: '10:15', latency: 42, rps: 1280, memory: 86 }
  ]
};

export const INITIAL_DEPLOYMENT_STATE: DeploymentState = {
  id: 'dpl-bld-' + Math.random().toString(36).substring(2, 9),
  status: 'PENDING',
  cluster: 'buildora-prod-sea-cluster-01',
  region: 'asia-southeast1',
  endpointUrl: 'https://buildora-app.run.app',
  containerId: 'oci://buildora.internal/v1/engine:' + Math.random().toString(36).substring(2, 8),
  replicas: 3,
  healthScore: 100,
  commitHash: 'git-a4f91b'
};

export const INITIAL_APPROVALS: ProjectApproval[] = [
  {
    id: 'appr-1',
    type: 'architecture',
    title: 'Microservices vs Modular Monolith Selection',
    description: 'System Architect recommends Modular Monolith with clean boundary domains for optimal latency and low overhead.',
    details: 'Pattern: Event-driven Modular Monolith. Caching: In-Memory Redis. Protocol: REST + SSE.',
    status: 'PENDING',
    requestedAt: '10:01:14',
    recommendedAction: 'Approve Modular Monolith Architecture Blueprint'
  },
  {
    id: 'appr-2',
    type: 'destructive_database',
    title: 'Database Schema Migration & Index Provisioning',
    description: 'Database Engineer requested authorization to execute zero-downtime schema migrations and create composite foreign keys.',
    details: 'Target Tables: orders, menu_items, restaurant_telemetry. Strategy: Concurrent Indexing.',
    status: 'PENDING',
    requestedAt: '10:03:45',
    recommendedAction: 'Authorize Migration Execution'
  },
  {
    id: 'appr-3',
    type: 'production_deployment',
    title: 'Deploy to Cloud Run Cluster (Live Ingress)',
    description: 'DevOps Engineer requests production promotion after all 47/47 automated unit, API, and security tests pass.',
    details: 'Target Cluster: buildora-prod-sea-01. Replicas: 3. Health Probe: /api/health.',
    status: 'PENDING',
    requestedAt: '10:06:20',
    recommendedAction: 'Authorize Production Traffic Route'
  }
];
