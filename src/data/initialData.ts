import {
  User,
  Incident,
  ServiceCatalogItem,
  ServiceRequest,
  Problem,
  ChangeRequest,
  KnowledgeArticle,
  Asset,
  SlaPolicy,
  IncidentComment,
  IncidentHistoryEntry
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Rohith',
    email: 'employee@serviceops.local',
    role: 'EMPLOYEE',
    department: 'Product & Design',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Bunny',
    email: 'agent@serviceops.local',
    role: 'SERVICE_AGENT',
    department: 'IT Support & Operations',
    team: 'Desktop Support L2',
    phone: '+1 (555) 876-5432',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Sai',
    email: 'manager@serviceops.local',
    role: 'SERVICE_MANAGER',
    department: 'IT Service Management',
    team: 'Service Desk Leadership',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Tagore',
    email: 'admin@serviceops.local',
    role: 'ADMIN',
    department: 'Enterprise Systems & Security',
    team: 'Infrastructure & SecOps',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SLA_POLICIES: SlaPolicy[] = [
  {
    priority: 'P1',
    name: 'P1 - Critical Priority SLA',
    responseMinutes: 15,
    resolutionMinutes: 240, // 4 hours
    businessHoursOnly: false,
    active: true
  },
  {
    priority: 'P2',
    name: 'P2 - High Priority SLA',
    responseMinutes: 30,
    resolutionMinutes: 480, // 8 hours
    businessHoursOnly: true,
    active: true
  },
  {
    priority: 'P3',
    name: 'P3 - Moderate Priority SLA',
    responseMinutes: 120, // 2 hours
    resolutionMinutes: 1440, // 24 hours
    businessHoursOnly: true,
    active: true
  },
  {
    priority: 'P4',
    name: 'P4 - Low Priority SLA',
    responseMinutes: 240, // 4 hours
    resolutionMinutes: 4320, // 72 hours
    businessHoursOnly: true,
    active: true
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    assetTag: 'AST-4001',
    name: 'MacBook Pro 16" M3 Max (64GB/1TB)',
    type: 'LAPTOP',
    status: 'IN_USE',
    ownerName: 'Rohith',
    department: 'Product & Design',
    location: 'Building A, Floor 3 (Desk 312)',
    serialNumber: 'C02G994XMD6R',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    description: 'Apple Silicon M3 Max workstation configured for UI/UX rendering and prototype compilation.',
    associatedService: 'Digital Workplace'
  },
  {
    id: 'ast-2',
    assetTag: 'AST-4002',
    name: 'Primary VPN Gateway Cluster (Palo Alto PA-5250)',
    type: 'NETWORK',
    status: 'IN_USE',
    department: 'Infrastructure & SecOps',
    location: 'Data Center US-East (Rack 14-B)',
    serialNumber: 'PA5250-9938102',
    purchaseDate: '2023-04-10',
    warrantyExpiry: '2028-04-10',
    description: 'GlobalProtect IPsec/SSL VPN gateway handling remote employee tunneling.',
    associatedService: 'Enterprise VPN Access'
  },
  {
    id: 'ast-3',
    assetTag: 'AST-4003',
    name: 'Production Core PostgreSQL Cluster (Multi-AZ)',
    type: 'SERVER',
    status: 'IN_USE',
    department: 'Cloud Platform Ops',
    location: 'AWS us-east-1 (VPC-Prod-Core)',
    serialNumber: 'RDS-PG15-PROD-01',
    purchaseDate: '2023-08-01',
    warrantyExpiry: '2026-08-01',
    description: 'High-availability primary transactional relational cluster with streaming replica.',
    associatedService: 'Core Banking & ERP Services'
  },
  {
    id: 'ast-4',
    assetTag: 'AST-4004',
    name: 'Okta Identity Cloud & Directory Bridge',
    type: 'APPLICATION',
    status: 'IN_USE',
    department: 'Enterprise Systems & Security',
    location: 'Cloud SaaS',
    serialNumber: 'OKTA-TENANT-SRVOPS',
    purchaseDate: '2022-11-20',
    warrantyExpiry: '2026-11-20',
    description: 'Centralized Single Sign-On (SSO) and adaptive MFA authentication provider.',
    associatedService: 'Identity & Access Management'
  },
  {
    id: 'ast-5',
    assetTag: 'AST-4005',
    name: 'HP Color LaserJet Enterprise Flow M682z',
    type: 'PRINTER',
    status: 'IN_REPAIR',
    department: 'Office Facilities',
    location: 'Building B, Floor 2 Print Room',
    serialNumber: 'HP-MFP-881293',
    purchaseDate: '2022-03-12',
    warrantyExpiry: '2025-03-12',
    description: 'Networked departmental high-volume multi-function secure printer.',
    associatedService: 'Printing & Scanning'
  }
];

export const INITIAL_CATALOG_ITEMS: ServiceCatalogItem[] = [
  {
    id: 'cat-1',
    name: 'High-Performance Developer Workstation',
    description: 'Order a 16-inch Apple Silicon M3/M4 or Dell XPS Precision laptop with docking station, dual 4K monitors, and ergonomic keyboard.',
    category: 'HARDWARE',
    icon: 'Laptop',
    approvalRequired: true,
    defaultAssignmentGroup: 'Desktop Support L2',
    expectedFulfillmentHours: 48,
    active: true,
    formFields: [
      {
        name: 'platform',
        label: 'Workstation Specification',
        type: 'select',
        options: ['MacBook Pro 16" (M3 Max, 64GB RAM)', 'Dell Precision 5680 (i9, 64GB RAM, RTX 4070)'],
        required: true
      },
      {
        name: 'shippingAddress',
        label: 'Desk Location or Home Delivery Address',
        type: 'textarea',
        required: true
      },
      {
        name: 'accessories',
        label: 'Additional Peripherals (Dual 27" 4K Displays + Dock)',
        type: 'checkbox',
        required: false
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Production VPN & Bastion Gateway Access',
    description: 'Request elevated cryptographic tunneling and SSH/Kubernetes bastion access into production VPCs.',
    category: 'ACCESS',
    icon: 'ShieldCheck',
    approvalRequired: true,
    defaultAssignmentGroup: 'CyberSecurity Operations',
    expectedFulfillmentHours: 24,
    active: true,
    formFields: [
      {
        name: 'environment',
        label: 'Target Environment',
        type: 'select',
        options: ['Production Staging (us-east-1)', 'Production Main (us-east-1 & eu-west-1)', 'PCI-DSS Regulated Enclave'],
        required: true
      },
      {
        name: 'roleNeeded',
        label: 'Requested Bastion Role',
        type: 'select',
        options: ['Read-Only Observability (kubectl read / metrics)', 'Deployment Engineer (kubectl apply)', 'Full Break-Glass Admin'],
        required: true
      },
      {
        name: 'businessReason',
        label: 'Business Reason & Project Code',
        type: 'textarea',
        required: true
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'JetBrains All Products Pack License',
    description: 'Enterprise yearly subscription for IntelliJ IDEA Ultimate, WebStorm, PyCharm, and GoLand for authorized engineering staff.',
    category: 'SOFTWARE',
    icon: 'Code',
    approvalRequired: false,
    defaultAssignmentGroup: 'Desktop Support L2',
    expectedFulfillmentHours: 4,
    active: true,
    formFields: [
      {
        name: 'primaryIDE',
        label: 'Primary IDE Tool',
        type: 'select',
        options: ['IntelliJ IDEA Ultimate', 'WebStorm', 'PyCharm Professional', 'GoLand'],
        required: true
      },
      {
        name: 'githubUsername',
        label: 'Company GitHub Handle',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'cat-4',
    name: 'Dedicated AWS Sandbox Cloud Account',
    description: 'Provision an isolated AWS account in the corporate AWS Organizations structure with budget alerts ($500/mo cap).',
    category: 'CLOUD',
    icon: 'Cloud',
    approvalRequired: true,
    defaultAssignmentGroup: 'Cloud Platform Ops',
    expectedFulfillmentHours: 24,
    active: true,
    formFields: [
      {
        name: 'projectTitle',
        label: 'Project or Initiative Title',
        type: 'text',
        required: true
      },
      {
        name: 'estimatedDuration',
        label: 'Duration Needed',
        type: 'select',
        options: ['30 Days POC', '90 Days Evaluation', 'Permanent R&D Sandbox'],
        required: true
      }
    ]
  },
  {
    id: 'cat-5',
    name: 'New Employee Identity & Hardware Onboarding',
    description: 'Kick off corporate account creation, Google Workspace, Slack, Okta SSO, and baseline security credentials.',
    category: 'ONBOARDING',
    icon: 'UserPlus',
    approvalRequired: true,
    defaultAssignmentGroup: 'Service Desk L1',
    expectedFulfillmentHours: 72,
    active: true,
    formFields: [
      {
        name: 'employeeLegalName',
        label: 'New Hire Legal Name',
        type: 'text',
        required: true
      },
      {
        name: 'department',
        label: 'Department & Reporting Manager',
        type: 'text',
        required: true
      },
      {
        name: 'startDate',
        label: 'Official Start Date (YYYY-MM-DD)',
        type: 'text',
        required: true
      }
    ]
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    requestNumber: 'REQ-5001',
    catalogItemId: 'cat-1',
    catalogItemName: 'High-Performance Developer Workstation',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Bunny',
    assignmentGroup: 'Desktop Support L2',
    status: 'PENDING_APPROVAL',
    approvalStatus: 'PENDING',
    justification: 'Current MacBook Pro battery has degraded and 32GB RAM is insufficient for local Figma + Docker test suites.',
    formData: {
      platform: 'MacBook Pro 16" (M3 Max, 64GB RAM)',
      shippingAddress: 'Desk 312, Building A, Floor 3 (Seattle HQ)',
      accessories: 'true'
    },
    expectedFulfillmentAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: 'req-2',
    requestNumber: 'REQ-5002',
    catalogItemId: 'cat-3',
    catalogItemName: 'JetBrains All Products Pack License',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Bunny',
    assignmentGroup: 'Desktop Support L2',
    status: 'FULFILLED',
    approvalStatus: 'NOT_REQUIRED',
    justification: 'Standard tooling for frontend TypeScript and UI styling architecture.',
    formData: {
      primaryIDE: 'WebStorm',
      githubUsername: 'rohith-dev'
    },
    expectedFulfillmentAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  },
  {
    id: 'req-3',
    requestNumber: 'REQ-5003',
    catalogItemId: 'cat-2',
    catalogItemName: 'Production VPN & Bastion Gateway Access',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-4',
    assignedAgentName: 'Tagore',
    assignmentGroup: 'CyberSecurity Operations',
    status: 'APPROVED',
    approvalStatus: 'APPROVED',
    approverId: 'usr-3',
    approverName: 'Sai',
    approvalDecisionAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    approvalComments: 'Approved for Q3 On-Call triage rotation.',
    justification: 'Promoted to primary on-call triage queue for core platform incident escalation.',
    formData: {
      environment: 'Production Staging (us-east-1)',
      roleNeeded: 'Read-Only Observability (kubectl read / metrics)',
      businessReason: 'Triage on-call rotation ticket assignments'
    },
    expectedFulfillmentAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    incidentNumber: 'INC-1001',
    title: 'Intermittent GlobalProtect VPN gateway timeouts for West Coast staff',
    description: 'Remote staff connecting through the US-West VPN profile report handshake drops every 10-15 minutes. Packet trace reveals MTU mismatch after upstream ISP routing change.',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterEmail: 'employee@serviceops.local',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Bunny',
    assignmentGroup: 'Infrastructure & Network L3',
    category: 'NETWORK',
    subcategory: 'VPN / Remote Access',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'P1',
    status: 'IN_PROGRESS',
    source: 'PORTAL',
    affectedAssetId: 'ast-2',
    affectedAssetName: 'Primary VPN Gateway Cluster (Palo Alto PA-5250)',
    affectedService: 'Enterprise VPN Access',
    relatedProblemId: 'prb-1',
    firstResponseAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    sla: {
      slaPolicyName: 'P1 - Critical Priority SLA',
      responseTargetMinutes: 15,
      resolutionTargetMinutes: 240,
      responseDeadline: new Date(Date.now() - 45 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(Date.now() + 195 * 60 * 1000).toISOString(),
      firstResponseAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      responseElapsedMinutes: 5,
      resolutionElapsedMinutes: 45,
      responseBreached: false,
      resolutionBreached: false,
      status: 'ON_TRACK'
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-2',
    incidentNumber: 'INC-1002',
    title: 'Developer workstation recurring kernel panics on macOS Sequoia update',
    description: 'MacBook Pro restarts spontaneously when connecting to DisplayLink USB-C multi-monitor dock. Crash logs point to third-party kernel driver conflict.',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterEmail: 'employee@serviceops.local',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Bunny',
    assignmentGroup: 'Desktop Support L2',
    category: 'HARDWARE',
    subcategory: 'Workstation / Laptop',
    impact: 'MEDIUM',
    urgency: 'HIGH',
    priority: 'P2',
    status: 'ASSIGNED',
    source: 'PORTAL',
    affectedAssetId: 'ast-1',
    affectedAssetName: 'MacBook Pro 16" M3 Max (64GB/1TB)',
    affectedService: 'Digital Workplace',
    sla: {
      slaPolicyName: 'P2 - High Priority SLA',
      responseTargetMinutes: 30,
      resolutionTargetMinutes: 480,
      responseDeadline: new Date(Date.now() - 90 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(Date.now() + 390 * 60 * 1000).toISOString(),
      firstResponseAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      responseElapsedMinutes: 15,
      resolutionElapsedMinutes: 90,
      responseBreached: false,
      resolutionBreached: false,
      status: 'ON_TRACK'
    },
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-3',
    incidentNumber: 'INC-1003',
    title: 'Okta SSO session cookie invalidation causing frequent re-authentications',
    description: 'Multiple users across departments report being prompted for Duo MFA push every 10 minutes instead of the standard 8-hour remember token.',
    requesterId: 'usr-3',
    requesterName: 'Sai',
    requesterEmail: 'manager@serviceops.local',
    requesterDepartment: 'IT Service Management',
    assignedAgentId: 'usr-4',
    assignedAgentName: 'Tagore',
    assignmentGroup: 'Infrastructure & SecOps',
    category: 'IDENTITY',
    subcategory: 'Single Sign-On (SSO)',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'P2',
    status: 'IN_PROGRESS',
    source: 'MONITORING',
    affectedAssetId: 'ast-4',
    affectedAssetName: 'Okta Identity Cloud & Directory Bridge',
    affectedService: 'Identity & Access Management',
    firstResponseAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    sla: {
      slaPolicyName: 'P2 - High Priority SLA',
      responseTargetMinutes: 30,
      resolutionTargetMinutes: 480,
      responseDeadline: new Date(Date.now() - 180 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(Date.now() + 300 * 60 * 1000).toISOString(),
      firstResponseAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      responseElapsedMinutes: 30,
      resolutionElapsedMinutes: 180,
      responseBreached: false,
      resolutionBreached: false,
      status: 'ON_TRACK'
    },
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-4',
    incidentNumber: 'INC-1004',
    title: 'PostgreSQL read-replica connection pool exhaustion during end-of-month reporting',
    description: 'Automated reporting batch queries held idle-in-transaction connections, bringing pool saturation to 100% and causing 504 Gateway Timeouts on executive dashboards.',
    requesterId: 'usr-4',
    requesterName: 'Tagore',
    requesterEmail: 'admin@serviceops.local',
    requesterDepartment: 'Enterprise Systems & Security',
    assignedAgentId: 'usr-4',
    assignedAgentName: 'Tagore',
    assignmentGroup: 'Cloud Platform Ops',
    category: 'DATABASE',
    subcategory: 'Connection Pool / Saturation',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'P1',
    status: 'RESOLVED',
    source: 'MONITORING',
    affectedAssetId: 'ast-3',
    affectedAssetName: 'Production Core PostgreSQL Cluster (Multi-AZ)',
    affectedService: 'Core Banking & ERP Services',
    resolutionNotes: 'Terminated leaked idle connections via pg_terminate_backend. Scaled PgBouncer pool ceiling to 150 connections and applied 30-second statement_timeout for analytics read-only role.',
    firstResponseAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sla: {
      slaPolicyName: 'P1 - Critical Priority SLA',
      responseTargetMinutes: 15,
      resolutionTargetMinutes: 240,
      responseDeadline: new Date(Date.now() - 310 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(Date.now() - 310 * 60 * 1000 + 240 * 60 * 1000).toISOString(),
      firstResponseAt: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      responseElapsedMinutes: 10,
      resolutionElapsedMinutes: 220,
      responseBreached: false,
      resolutionBreached: false,
      status: 'ON_TRACK'
    },
    createdAt: new Date(Date.now() - 310 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'inc-5',
    incidentNumber: 'INC-1005',
    title: 'Departmental badge printer paper jam and mechanical feed roller fault',
    description: 'Floor 2 multi-function badge and label printer is displaying error code 59.00.F0. Maintenance kit and roller replacement required.',
    requesterId: 'usr-1',
    requesterName: 'Rohith',
    requesterEmail: 'employee@serviceops.local',
    requesterDepartment: 'Product & Design',
    assignedAgentId: 'usr-2',
    assignedAgentName: 'Bunny',
    assignmentGroup: 'Desktop Support L2',
    category: 'HARDWARE',
    subcategory: 'Printers / Scanners',
    impact: 'LOW',
    urgency: 'LOW',
    priority: 'P4',
    status: 'PENDING',
    pendingReason: 'Awaiting replacement roller assembly shipment from vendor (ETA tomorrow morning).',
    source: 'PHONE',
    affectedAssetId: 'ast-5',
    affectedAssetName: 'HP Color LaserJet Enterprise Flow M682z',
    affectedService: 'Printing & Scanning',
    firstResponseAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    sla: {
      slaPolicyName: 'P4 - Low Priority SLA',
      responseTargetMinutes: 240,
      resolutionTargetMinutes: 4320,
      responseDeadline: new Date(Date.now() - 15 * 3600 * 1000 + 240 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(Date.now() + 57 * 3600 * 1000).toISOString(),
      firstResponseAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      responseElapsedMinutes: 60,
      resolutionElapsedMinutes: 900,
      responseBreached: false,
      resolutionBreached: false,
      status: 'PAUSED'
    },
    createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_COMMENTS: IncidentComment[] = [
  {
    id: 'cmt-1',
    incidentId: 'inc-1',
    authorId: 'usr-2',
    authorName: 'Bunny',
    authorRole: 'SERVICE_AGENT',
    content: 'Initial triage complete. Confirmed packet captures show MTU clamped at 1380 bytes along the Comcast Business transit gateway in San Jose.',
    isInternalWorkNote: true,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'cmt-2',
    incidentId: 'inc-1',
    authorId: 'usr-2',
    authorName: 'Bunny',
    authorRole: 'SERVICE_AGENT',
    content: 'Hi Rohith, our network operations engineers are actively troubleshooting the US-West VPN tunnel packet drop. In the interim, switching your client to the US-East VPN endpoint will restore stable connectivity.',
    isInternalWorkNote: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'cmt-3',
    incidentId: 'inc-1',
    authorId: 'usr-1',
    authorName: 'Rohith',
    authorRole: 'EMPLOYEE',
    content: 'Thanks Bunny! Connecting via US-East worked immediately. I will use that while the West gateway is being fixed.',
    isInternalWorkNote: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

export const INITIAL_HISTORY: IncidentHistoryEntry[] = [
  {
    id: 'hist-1',
    incidentId: 'inc-1',
    actorName: 'Rohith',
    action: 'Incident Created',
    fieldName: 'Status',
    oldValue: undefined,
    newValue: 'NEW',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'hist-2',
    incidentId: 'inc-1',
    actorName: 'Bunny',
    action: 'Ticket Assigned & Started Investigation',
    fieldName: 'Status',
    oldValue: 'NEW',
    newValue: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: 'hist-3',
    incidentId: 'inc-1',
    actorName: 'Bunny',
    action: 'Linked to Problem Record',
    fieldName: 'RelatedProblemId',
    oldValue: undefined,
    newValue: 'PRB-2001',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  }
];

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prb-1',
    problemNumber: 'PRB-2001',
    title: 'Palo Alto PA-5250 IPSec Tunnel MTU Degradation under High Traffic',
    description: 'High packet loss on remote VPN gateways during peak morning login windows caused by MSS clamping conflicts with BGP tier-1 carrier routing.',
    category: 'NETWORK',
    assignedTeam: 'Infrastructure & Network L3',
    assignedAgentName: 'Bunny',
    rootCause: 'Carrier transit path recently enabled strict 1420 MTU path while Palo Alto tunnel interface retained 1500 byte defaults without automatic TCP MSS clamping.',
    workaround: 'Instruct users to connect via US-East secondary endpoint or lower local interface MTU to 1380 bytes.',
    isKnownError: true,
    status: 'UNDER_INVESTIGATION',
    relatedIncidentIds: ['inc-1'],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'prb-2',
    problemNumber: 'PRB-2002',
    title: 'macOS Sequoia DisplayLink Dock Driver Kernel Instability',
    description: 'Repeated kernel panic crash loops when sleep/wake cycles occur while dual DisplayLink USB-C displays are connected.',
    category: 'HARDWARE',
    assignedTeam: 'Desktop Support L2',
    assignedAgentName: 'Bunny',
    rootCause: 'Vendor extension kext memory leak in DisplayLink Manager v1.10.0 on Darwin 24.0.0.',
    workaround: 'Downgrade DisplayLink driver to v1.9.2 or use single native Thunderbolt display connection.',
    isKnownError: true,
    status: 'KNOWN_ERROR',
    relatedIncidentIds: ['inc-2'],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_CHANGES: ChangeRequest[] = [
  {
    id: 'chg-1',
    changeNumber: 'CHG-3001',
    title: 'Upgrade Palo Alto PA-5250 PAN-OS to 11.1.2-h3 and Enable Dynamic MSS Clamping',
    description: 'Apply security maintenance patch and configure tunnel interface MTU clamping to resolve upstream carrier fragmentation and prevent VPN packet drops.',
    reason: 'Addresses root cause identified in PRB-2001 affecting remote workforce VPN stability.',
    changeType: 'NORMAL',
    risk: 'MEDIUM',
    impact: 'MEDIUM',
    affectedService: 'Enterprise VPN Access',
    implementationPlan: '1. Failover primary firewall traffic to standby passive cluster member. 2. Verify traffic stability. 3. Upgrade primary unit software image. 4. Reboot primary and verify health checks. 5. Failback and upgrade secondary unit.',
    rollbackPlan: 'Switch traffic back to unmodified passive node via VRRP priority election if packet loss exceeds 0.5% during post-maintenance validation.',
    testPlan: 'Run synthetic TCP/UDP iperf3 throughput tests and verify MTU negotiation across 10 test endpoints.',
    requesterName: 'Bunny',
    assignedOwnerName: 'Tagore',
    approvalStatus: 'PENDING',
    approverName: 'Sai',
    implementationStatus: 'SCHEDULED',
    scheduledStart: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    scheduledEnd: new Date(Date.now() + 27 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'chg-2',
    changeNumber: 'CHG-3002',
    title: 'Standard Monthly OS Security Patching for Production Bastion Enclave',
    description: 'Routine Linux kernel CVE updates and unattended-upgrades reboot for bastion host instances.',
    reason: 'Routine compliance and zero-day patch mitigation.',
    changeType: 'STANDARD',
    risk: 'LOW',
    impact: 'LOW',
    affectedService: 'Identity & Access Management',
    implementationPlan: 'Automated rolling replacement of ASG instances behind network load balancer with zero-downtime draining.',
    rollbackPlan: 'Re-deploy previous Golden AMI if health check fails within 5 minutes.',
    testPlan: 'Automated synthetic SSH connection smoke test and CloudWatch alarms monitoring.',
    requesterName: 'Tagore',
    assignedOwnerName: 'Tagore',
    approvalStatus: 'APPROVED',
    approverName: 'Pre-Approved Standard Change CAB Template',
    implementationStatus: 'COMPLETED',
    scheduledStart: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    scheduledEnd: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    articleNumber: 'KB-00101',
    title: 'Troubleshooting GlobalProtect VPN Connection and MTU Issues',
    summary: 'Step-by-step resolution for remote staff experiencing intermittent VPN disconnects or gateway timeouts.',
    category: 'Network & Connectivity',
    authorName: 'Bunny',
    status: 'PUBLISHED',
    viewCount: 428,
    helpfulCount: 89,
    content: `
### Symptom
When connected to GlobalProtect VPN, certain websites hang indefinitely, SSH connections drop after typing a command, or Zoom calls cut out periodically.

### Root Cause
Upstream internet service providers occasionally drop fragmented packets if path Maximum Transmission Unit (MTU) does not match the VPN tunnel overhead.

### Immediate Workaround
1. Open the **GlobalProtect** tray icon.
2. Click the hamburger menu (top right) and select **Settings**.
3. Under the **Gateways** tab, click **Switch Gateway**.
4. Choose **US-East (Virginia)** instead of US-West.
5. Re-authenticate with your Okta MFA token.

### CLI Workaround for macOS Developers
You can manually clamp your primary WiFi interface MTU:
\`\`\`bash
sudo networksetup -setMTU en0 1380
\`\`\`
To revert back to automatic:
\`\`\`bash
sudo networksetup -setMTU en0 1500
\`\`\`
`,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'kb-2',
    articleNumber: 'KB-00102',
    title: 'Resolving DisplayLink Dock Crashes on macOS Sequoia',
    summary: 'Fix for external multi-monitor kernel panics on Apple Silicon laptops.',
    category: 'Hardware & Peripherals',
    authorName: 'Bunny',
    status: 'PUBLISHED',
    viewCount: 312,
    helpfulCount: 64,
    content: `
### Overview
If your MacBook Pro experiences a sudden black screen and kernel reboot upon plugging into departmental dual-display docks, follow this certified driver fix.

### Instructions
1. Download certified driver package **DisplayLink Manager v1.9.2 (Legacy Stable)** from the Corporate Self-Service portal.
2. Run the uninstaller for DisplayLink Manager v1.10.
3. Restart your laptop before installing the replacement package.
4. In **System Settings > Privacy & Security > Screen Recording**, ensure DisplayLink is toggled ON.
`,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'kb-3',
    articleNumber: 'KB-00103',
    title: 'Okta FastPass & Passwordless Authentication Setup',
    summary: 'How to register your Touch ID or Windows Hello biometrics for instant SSO sign-in.',
    category: 'Identity & Security',
    authorName: 'Tagore',
    status: 'PUBLISHED',
    viewCount: 684,
    helpfulCount: 142,
    content: `
### Prerequisites
- Corporate managed device enrolled in Jamf or Intune.
- Okta Verify installed on device.

### Configuration
1. Navigate to \`https://identity.serviceops.local\`
2. Sign in with your corporate email and current password.
3. Click your profile avatar > **Settings > Extra Verification**.
4. Next to **Okta FastPass**, click **Set Up**.
5. When prompted by the browser, tap your device fingerprint reader or scan facial recognition.
6. Test by opening a new Incognito window: you will now sign in without typing passwords.
`,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  }
];
