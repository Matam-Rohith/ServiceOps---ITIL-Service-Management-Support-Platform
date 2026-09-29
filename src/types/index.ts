/**
 * ServiceOps - Core Domain Models & Types
 * Conforms to ITIL v4 Service Management Standards
 */

export type UserRole = 'EMPLOYEE' | 'SERVICE_AGENT' | 'SERVICE_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  team?: string;
  phone?: string;
  avatarUrl?: string;
}

export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type IncidentStatus = 
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type IncidentSource = 'PORTAL' | 'EMAIL' | 'PHONE' | 'MONITORING';

export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'PAUSED';

export interface SlaTracking {
  slaPolicyName: string;
  responseTargetMinutes: number;
  resolutionTargetMinutes: number;
  responseDeadline: string; // ISO string
  resolutionDeadline: string; // ISO string
  firstResponseAt?: string;
  resolvedAt?: string;
  responseElapsedMinutes: number;
  resolutionElapsedMinutes: number;
  responseBreached: boolean;
  resolutionBreached: boolean;
  status: SlaStatus;
}

export interface IncidentComment {
  id: string;
  incidentId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  isInternalWorkNote: boolean;
  createdAt: string;
}

export interface IncidentHistoryEntry {
  id: string;
  incidentId: string;
  actorName: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. INC-1001
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignmentGroup: string; // e.g. Service Desk L1, Desktop Support L2
  category: string;
  subcategory: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  priority: PriorityLevel;
  status: IncidentStatus;
  source: IncidentSource;
  affectedAssetId?: string;
  affectedAssetName?: string;
  affectedService?: string;
  relatedProblemId?: string;
  resolutionNotes?: string;
  pendingReason?: string;
  sla: SlaTracking;
  createdAt: string;
  updatedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
}

// Service Catalog & Service Requests
export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'ACCESS' | 'ONBOARDING' | 'CLOUD' | 'GENERAL';
  icon: string;
  approvalRequired: boolean;
  defaultAssignmentGroup: string;
  expectedFulfillmentHours: number;
  active: boolean;
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    options?: string[];
    required: boolean;
  }>;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';

export interface ServiceRequest {
  id: string;
  requestNumber: string; // e.g. REQ-5001
  catalogItemId: string;
  catalogItemName: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignmentGroup: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'FULFILLED' | 'REJECTED' | 'CANCELLED';
  approvalStatus: ApprovalStatus;
  approverId?: string;
  approverName?: string;
  approvalDecisionAt?: string;
  approvalComments?: string;
  justification: string;
  formData: Record<string, string>;
  expectedFulfillmentAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Problem Management
export type ProblemStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'KNOWN_ERROR' | 'RESOLVED' | 'CLOSED';

export interface Problem {
  id: string;
  problemNumber: string; // e.g. PRB-2001
  title: string;
  description: string;
  category: string;
  assignedTeam: string;
  assignedAgentName?: string;
  rootCause?: string;
  workaround?: string;
  isKnownError: boolean;
  status: ProblemStatus;
  relatedIncidentIds: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Change Management
export type ChangeType = 'STANDARD' | 'NORMAL' | 'EMERGENCY';
export type ChangeRisk = 'LOW' | 'MEDIUM' | 'HIGH';
export type ChangeImplementationStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'ROLLED_BACK';

export interface ChangeRequest {
  id: string;
  changeNumber: string; // e.g. CHG-3001
  title: string;
  description: string;
  reason: string;
  changeType: ChangeType;
  risk: ChangeRisk;
  impact: ImpactLevel;
  affectedService: string;
  implementationPlan: string;
  rollbackPlan: string;
  testPlan: string;
  requesterName: string;
  assignedOwnerName: string;
  approvalStatus: ApprovalStatus;
  approverName?: string;
  approvalComments?: string;
  implementationStatus: ChangeImplementationStatus;
  scheduledStart: string;
  scheduledEnd: string;
  createdAt: string;
  updatedAt: string;
}

// Knowledge Base
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface KnowledgeArticle {
  id: string;
  articleNumber: string; // e.g. KB-00101
  title: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  status: ArticleStatus;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Asset / CMDB
export type AssetType = 'LAPTOP' | 'DESKTOP' | 'SERVER' | 'APPLICATION' | 'NETWORK' | 'PRINTER';
export type AssetStatus = 'IN_USE' | 'IN_STORAGE' | 'IN_REPAIR' | 'RETIRED';

export interface Asset {
  id: string;
  assetTag: string; // e.g. AST-4001
  name: string;
  type: AssetType;
  status: AssetStatus;
  ownerName?: string;
  department: string;
  location: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  description: string;
  associatedService?: string;
}

// SLA Policy Config
export interface SlaPolicy {
  priority: PriorityLevel;
  name: string;
  responseMinutes: number;
  resolutionMinutes: number;
  businessHoursOnly: boolean;
  active: boolean;
}

// Operational Dashboard Metrics
export interface OperationalMetrics {
  openIncidents: number;
  criticalIncidents: number;
  breachedSlaCount: number;
  atRiskSlaCount: number;
  slaCompliancePercentage: number;
  avgResolutionHours: number;
  avgFirstResponseMinutes: number;
  openRequests: number;
  pendingApprovals: number;
  activeProblems: number;
  scheduledChanges: number;
  byPriority: { priority: PriorityLevel; count: number }[];
  byStatus: { status: IncidentStatus; count: number }[];
  byCategory: { category: string; count: number }[];
  agentWorkload: { agentName: string; activeTickets: number }[];
  slaTrend: { date: string; met: number; breached: number }[];
}
