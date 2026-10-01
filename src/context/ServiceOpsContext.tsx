import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  UserRole,
  Incident,
  IncidentStatus,
  ImpactLevel,
  UrgencyLevel,
  PriorityLevel,
  IncidentComment,
  IncidentHistoryEntry,
  ServiceCatalogItem,
  ServiceRequest,
  Problem,
  ChangeRequest,
  KnowledgeArticle,
  Asset,
  SlaPolicy,
  OperationalMetrics,
  SlaStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SLA_POLICIES,
  INITIAL_INCIDENTS,
  INITIAL_COMMENTS,
  INITIAL_HISTORY,
  INITIAL_CATALOG_ITEMS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_PROBLEMS,
  INITIAL_CHANGES,
  INITIAL_ARTICLES,
  INITIAL_ASSETS
} from '../data/initialData';

// Storage keys
const STORAGE_PREFIX = 'serviceops_v2_';
const KEY_USER = `${STORAGE_PREFIX}user`;
const KEY_TOKEN = `${STORAGE_PREFIX}token`;
const KEY_INCIDENTS = `${STORAGE_PREFIX}incidents`;
const KEY_COMMENTS = `${STORAGE_PREFIX}comments`;
const KEY_HISTORY = `${STORAGE_PREFIX}history`;
const KEY_REQUESTS = `${STORAGE_PREFIX}requests`;
const KEY_PROBLEMS = `${STORAGE_PREFIX}problems`;
const KEY_CHANGES = `${STORAGE_PREFIX}changes`;
const KEY_ARTICLES = `${STORAGE_PREFIX}articles`;
const KEY_ASSETS = `${STORAGE_PREFIX}assets`;
const KEY_POLICIES = `${STORAGE_PREFIX}policies`;

export interface PriorityMatrixResult {
  priority: PriorityLevel;
  label: string;
}

export function calculatePriority(impact: ImpactLevel, urgency: UrgencyLevel): PriorityLevel {
  if (impact === 'HIGH' && urgency === 'HIGH') return 'P1';
  if (impact === 'HIGH' && urgency === 'MEDIUM') return 'P2';
  if (impact === 'MEDIUM' && urgency === 'HIGH') return 'P2';
  if (impact === 'MEDIUM' && urgency === 'MEDIUM') return 'P3';
  if (impact === 'LOW' && urgency === 'HIGH') return 'P3';
  if (impact === 'HIGH' && urgency === 'LOW') return 'P3';
  if (impact === 'MEDIUM' && urgency === 'LOW') return 'P4';
  if (impact === 'LOW' && urgency === 'MEDIUM') return 'P4';
  return 'P4';
}

interface ServiceOpsContextType {
  currentUser: User;
  token: string | null;
  users: User[];
  slaPolicies: SlaPolicy[];
  incidents: Incident[];
  comments: IncidentComment[];
  history: IncidentHistoryEntry[];
  catalogItems: ServiceCatalogItem[];
  serviceRequests: ServiceRequest[];
  problems: Problem[];
  changes: ChangeRequest[];
  articles: KnowledgeArticle[];
  assets: Asset[];
  metrics: OperationalMetrics;
  
  // Auth & Role
  loginAs: (user: User) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Incident Operations
  createIncident: (data: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    impact: ImpactLevel;
    urgency: UrgencyLevel;
    source: Incident['source'];
    assignmentGroup?: string;
    assignedAgentId?: string;
    affectedAssetId?: string;
    affectedService?: string;
  }) => Incident;
  updateIncidentStatus: (id: string, newStatus: IncidentStatus, notes?: string) => void;
  assignIncident: (id: string, agentId?: string, group?: string) => void;
  updateIncidentPriority: (id: string, impact: ImpactLevel, urgency: UrgencyLevel) => void;
  addComment: (incidentId: string, content: string, isInternalWorkNote: boolean) => void;
  linkIncidentToProblem: (incidentId: string, problemId: string) => void;
  
  // Request Operations
  createServiceRequest: (catalogItemId: string, justification: string, formData: Record<string, string>) => ServiceRequest;
  approveServiceRequest: (requestId: string, approved: boolean, comments: string) => void;
  updateRequestStatus: (requestId: string, status: ServiceRequest['status']) => void;
  
  // Problem Operations
  createProblem: (data: Partial<Problem>) => Problem;
  updateProblem: (id: string, data: Partial<Problem>) => void;
  
  // Change Operations
  createChange: (data: Partial<ChangeRequest>) => ChangeRequest;
  approveChange: (changeId: string, comments: string) => void;
  updateChangeStatus: (changeId: string, status: ChangeRequest['implementationStatus']) => void;
  
  // Knowledge Base
  createArticle: (data: Partial<KnowledgeArticle>) => KnowledgeArticle;
  incrementArticleView: (articleId: string) => void;
  voteHelpful: (articleId: string) => void;
  
  // Asset Management
  createAsset: (data: Partial<Asset>) => Asset;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  
  // SLA Management
  updateSlaPolicy: (priority: PriorityLevel, policy: Partial<SlaPolicy>) => void;
  
  // Reset
  resetToDemoData: () => void;
}

const ServiceOpsContext = createContext<ServiceOpsContextType | undefined>(undefined);

function getStoredOrDefault<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return defaultVal;
  }
}

export const ServiceOpsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State definitions initialized from localStorage with fallback to rich seed dataset
  const [currentUser, setCurrentUser] = useState<User>(() =>
    getStoredOrDefault<User>(KEY_USER, INITIAL_USERS[1]) // Default to Service Agent Bunny
  );
  // Start unauthenticated so the application always presents the login screen first
  const [token, setToken] = useState<string | null>(null);
  const [users] = useState<User[]>(INITIAL_USERS);
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>(() =>
    getStoredOrDefault<SlaPolicy[]>(KEY_POLICIES, INITIAL_SLA_POLICIES)
  );
  const [incidents, setIncidents] = useState<Incident[]>(() =>
    getStoredOrDefault<Incident[]>(KEY_INCIDENTS, INITIAL_INCIDENTS)
  );
  const [comments, setComments] = useState<IncidentComment[]>(() =>
    getStoredOrDefault<IncidentComment[]>(KEY_COMMENTS, INITIAL_COMMENTS)
  );
  const [history, setHistory] = useState<IncidentHistoryEntry[]>(() =>
    getStoredOrDefault<IncidentHistoryEntry[]>(KEY_HISTORY, INITIAL_HISTORY)
  );
  const [catalogItems] = useState<ServiceCatalogItem[]>(INITIAL_CATALOG_ITEMS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() =>
    getStoredOrDefault<ServiceRequest[]>(KEY_REQUESTS, INITIAL_SERVICE_REQUESTS)
  );
  const [problems, setProblems] = useState<Problem[]>(() =>
    getStoredOrDefault<Problem[]>(KEY_PROBLEMS, INITIAL_PROBLEMS)
  );
  const [changes, setChanges] = useState<ChangeRequest[]>(() =>
    getStoredOrDefault<ChangeRequest[]>(KEY_CHANGES, INITIAL_CHANGES)
  );
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() =>
    getStoredOrDefault<KnowledgeArticle[]>(KEY_ARTICLES, INITIAL_ARTICLES)
  );
  const [assets, setAssets] = useState<Asset[]>(() =>
    getStoredOrDefault<Asset[]>(KEY_ASSETS, INITIAL_ASSETS)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(KEY_USER, JSON.stringify(currentUser));
    if (token) {
      localStorage.setItem(KEY_TOKEN, JSON.stringify(token));
    } else {
      localStorage.removeItem(KEY_TOKEN);
    }
  }, [currentUser, token]);

  useEffect(() => {
    localStorage.setItem(KEY_INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(KEY_COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(KEY_REQUESTS, JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem(KEY_PROBLEMS, JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem(KEY_CHANGES, JSON.stringify(changes));
  }, [changes]);

  useEffect(() => {
    localStorage.setItem(KEY_ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(KEY_ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(KEY_POLICIES, JSON.stringify(slaPolicies));
  }, [slaPolicies]);

  // SLA Authoritative Background Calculation Engine
  // Runs every 10 seconds to update SLA status, check breach status, and calculate elapsed times
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents(prevIncidents => {
        let changed = false;
        const now = Date.now();

        const updated = prevIncidents.map(inc => {
          if (inc.status === 'RESOLVED' || inc.status === 'CLOSED' || inc.status === 'CANCELLED') {
            return inc;
          }

          const createdTime = new Date(inc.createdAt).getTime();
          const resolutionDeadline = new Date(inc.sla.resolutionDeadline).getTime();
          const responseDeadline = new Date(inc.sla.responseDeadline).getTime();

          const totalResolutionDuration = resolutionDeadline - createdTime;
          const remainingResolutionTime = resolutionDeadline - now;

          const resolutionElapsedMinutes = Math.floor((now - createdTime) / (60 * 1000));
          const responseBreached = inc.firstResponseAt 
            ? new Date(inc.firstResponseAt).getTime() > responseDeadline
            : now > responseDeadline;
          
          const resolutionBreached = now > resolutionDeadline;

          let newStatus: SlaStatus = 'ON_TRACK';
          if (inc.status === 'PENDING') {
            newStatus = 'PAUSED';
          } else if (resolutionBreached || responseBreached) {
            newStatus = 'BREACHED';
          } else if (remainingResolutionTime < totalResolutionDuration * 0.25) {
            newStatus = 'AT_RISK';
          }

          if (
            newStatus !== inc.sla.status ||
            resolutionBreached !== inc.sla.resolutionBreached ||
            responseBreached !== inc.sla.responseBreached ||
            Math.abs(resolutionElapsedMinutes - inc.sla.resolutionElapsedMinutes) >= 1
          ) {
            changed = true;
            return {
              ...inc,
              sla: {
                ...inc.sla,
                resolutionElapsedMinutes,
                responseBreached,
                resolutionBreached,
                status: newStatus
              }
            };
          }
          return inc;
        });

        return changed ? updated : prevIncidents;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Authentication Handlers
  const loginAs = (user: User) => {
    setCurrentUser(user);
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role }))}.mock-sig`;
    setToken(mockJwt);
  };

  const loginWithEmail = (email: string): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      loginAs(matched);
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem(KEY_TOKEN);
    // Default to first user or unauthenticated view
    setCurrentUser(INITIAL_USERS[0]);
  };

  const switchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      loginAs(matched);
    }
  };

  // Incident Operations
  const createIncident = (data: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    impact: ImpactLevel;
    urgency: UrgencyLevel;
    source: Incident['source'];
    assignmentGroup?: string;
    assignedAgentId?: string;
    affectedAssetId?: string;
    affectedService?: string;
  }): Incident => {
    const priority = calculatePriority(data.impact, data.urgency);
    const policy = slaPolicies.find(p => p.priority === priority) || slaPolicies[2];

    const nextIncNum = `INC-${1000 + incidents.length + 1}`;
    const now = new Date();
    const responseDeadline = new Date(now.getTime() + policy.responseMinutes * 60 * 1000).toISOString();
    const resolutionDeadline = new Date(now.getTime() + policy.resolutionMinutes * 60 * 1000).toISOString();

    const assignedAgent = data.assignedAgentId ? users.find(u => u.id === data.assignedAgentId) : undefined;
    const affectedAsset = data.affectedAssetId ? assets.find(a => a.id === data.affectedAssetId) : undefined;

    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      incidentNumber: nextIncNum,
      title: data.title,
      description: data.description,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterDepartment: currentUser.department,
      assignedAgentId: assignedAgent?.id,
      assignedAgentName: assignedAgent?.name,
      assignmentGroup: data.assignmentGroup || 'Service Desk L1',
      category: data.category,
      subcategory: data.subcategory,
      impact: data.impact,
      urgency: data.urgency,
      priority,
      status: assignedAgent ? 'ASSIGNED' : 'NEW',
      source: data.source,
      affectedAssetId: affectedAsset?.id,
      affectedAssetName: affectedAsset?.name,
      affectedService: data.affectedService || affectedAsset?.associatedService,
      sla: {
        slaPolicyName: policy.name,
        responseTargetMinutes: policy.responseMinutes,
        resolutionTargetMinutes: policy.resolutionMinutes,
        responseDeadline,
        resolutionDeadline,
        responseElapsedMinutes: 0,
        resolutionElapsedMinutes: 0,
        responseBreached: false,
        resolutionBreached: false,
        status: 'ON_TRACK'
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Add Audit Log Entry
    const auditEntry: IncidentHistoryEntry = {
      id: `hist-${Date.now()}`,
      incidentId: newIncident.id,
      actorName: currentUser.name,
      action: 'Incident Created via Portal',
      fieldName: 'Priority',
      oldValue: undefined,
      newValue: `${priority} (Impact: ${data.impact}, Urgency: ${data.urgency})`,
      createdAt: now.toISOString()
    };
    setHistory(prev => [auditEntry, ...prev]);

    return newIncident;
  };

  const updateIncidentStatus = (id: string, newStatus: IncidentStatus, notes?: string) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;

    const now = new Date();
    const oldStatus = inc.status;

    let firstResponse = inc.firstResponseAt;
    let resolvedTime = inc.resolvedAt;
    let closedTime = inc.closedAt;

    if (!firstResponse && (newStatus === 'ASSIGNED' || newStatus === 'IN_PROGRESS')) {
      firstResponse = now.toISOString();
    }
    if (newStatus === 'RESOLVED') {
      resolvedTime = now.toISOString();
    }
    if (newStatus === 'CLOSED') {
      closedTime = now.toISOString();
    }

    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        return {
          ...i,
          status: newStatus,
          firstResponseAt: firstResponse,
          resolvedAt: resolvedTime,
          closedAt: closedTime,
          resolutionNotes: notes && newStatus === 'RESOLVED' ? notes : i.resolutionNotes,
          pendingReason: notes && newStatus === 'PENDING' ? notes : i.pendingReason,
          updatedAt: now.toISOString(),
          sla: {
            ...i.sla,
            firstResponseAt: firstResponse,
            resolvedAt: resolvedTime,
            status: newStatus === 'PENDING' ? 'PAUSED' : i.sla.status
          }
        };
      })
    );

    // Audit Log
    const audit: IncidentHistoryEntry = {
      id: `hist-${Date.now()}`,
      incidentId: id,
      actorName: currentUser.name,
      action: `Status Changed to ${newStatus}`,
      fieldName: 'Status',
      oldValue: oldStatus,
      newValue: newStatus,
      createdAt: now.toISOString()
    };
    setHistory(prev => [audit, ...prev]);

    // If resolution notes added, add as work note or public comment
    if (notes) {
      addComment(id, `Status transitioned to ${newStatus}: ${notes}`, newStatus !== 'RESOLVED');
    }
  };

  const assignIncident = (id: string, agentId?: string, group?: string) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;

    const now = new Date();
    const agent = agentId ? users.find(u => u.id === agentId) : undefined;
    const oldAssignee = inc.assignedAgentName || 'Unassigned';
    const newAssignee = agent ? agent.name : 'Unassigned';

    let firstResponse = inc.firstResponseAt;
    if (!firstResponse && agent) {
      firstResponse = now.toISOString();
    }

    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        return {
          ...i,
          assignedAgentId: agent?.id,
          assignedAgentName: agent?.name,
          assignmentGroup: group || i.assignmentGroup,
          status: i.status === 'NEW' && agent ? 'ASSIGNED' : i.status,
          firstResponseAt: firstResponse,
          updatedAt: now.toISOString(),
          sla: {
            ...i.sla,
            firstResponseAt: firstResponse
          }
        };
      })
    );

    const audit: IncidentHistoryEntry = {
      id: `hist-${Date.now()}`,
      incidentId: id,
      actorName: currentUser.name,
      action: 'Assignment Updated',
      fieldName: 'Assigned Agent',
      oldValue: oldAssignee,
      newValue: newAssignee,
      createdAt: now.toISOString()
    };
    setHistory(prev => [audit, ...prev]);
  };

  const updateIncidentPriority = (id: string, impact: ImpactLevel, urgency: UrgencyLevel) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc) return;

    const newPriority = calculatePriority(impact, urgency);
    const policy = slaPolicies.find(p => p.priority === newPriority) || slaPolicies[2];
    const now = new Date();

    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        return {
          ...i,
          impact,
          urgency,
          priority: newPriority,
          updatedAt: now.toISOString(),
          sla: {
            ...i.sla,
            slaPolicyName: policy.name,
            responseTargetMinutes: policy.responseMinutes,
            resolutionTargetMinutes: policy.resolutionMinutes,
            responseDeadline: new Date(new Date(i.createdAt).getTime() + policy.responseMinutes * 60 * 1000).toISOString(),
            resolutionDeadline: new Date(new Date(i.createdAt).getTime() + policy.resolutionMinutes * 60 * 1000).toISOString()
          }
        };
      })
    );

    const audit: IncidentHistoryEntry = {
      id: `hist-${Date.now()}`,
      incidentId: id,
      actorName: currentUser.name,
      action: 'Priority Recalculated',
      fieldName: 'Priority',
      oldValue: inc.priority,
      newValue: `${newPriority} (Impact: ${impact}, Urgency: ${urgency})`,
      createdAt: now.toISOString()
    };
    setHistory(prev => [audit, ...prev]);
  };

  const addComment = (incidentId: string, content: string, isInternalWorkNote: boolean) => {
    const newComment: IncidentComment = {
      id: `cmt-${Date.now()}`,
      incidentId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      isInternalWorkNote,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);

    // Touch incident updatedAt
    setIncidents(prev =>
      prev.map(i => (i.id === incidentId ? { ...i, updatedAt: new Date().toISOString() } : i))
    );
  };

  const linkIncidentToProblem = (incidentId: string, problemId: string) => {
    const prob = problems.find(p => p.id === problemId);
    if (!prob) return;

    setIncidents(prev =>
      prev.map(i => (i.id === incidentId ? { ...i, relatedProblemId: problemId, updatedAt: new Date().toISOString() } : i))
    );

    setProblems(prev =>
      prev.map(p => {
        if (p.id !== problemId) return p;
        if (p.relatedIncidentIds.includes(incidentId)) return p;
        return {
          ...p,
          relatedIncidentIds: [...p.relatedIncidentIds, incidentId],
          updatedAt: new Date().toISOString()
        };
      })
    );

    const audit: IncidentHistoryEntry = {
      id: `hist-${Date.now()}`,
      incidentId,
      actorName: currentUser.name,
      action: 'Linked to Problem Record',
      fieldName: 'RelatedProblemId',
      oldValue: undefined,
      newValue: prob.problemNumber,
      createdAt: new Date().toISOString()
    };
    setHistory(prev => [audit, ...prev]);
  };

  // Service Request Operations
  const createServiceRequest = (
    catalogItemId: string,
    justification: string,
    formData: Record<string, string>
  ): ServiceRequest => {
    const item = catalogItems.find(c => c.id === catalogItemId);
    const now = new Date();
    const reqNum = `REQ-${5000 + serviceRequests.length + 1}`;
    const expectedFulfillmentAt = new Date(now.getTime() + (item?.expectedFulfillmentHours || 24) * 3600 * 1000).toISOString();

    const requiresApproval = item ? item.approvalRequired : true;

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      requestNumber: reqNum,
      catalogItemId,
      catalogItemName: item?.name || 'Custom Service Request',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterDepartment: currentUser.department,
      assignedAgentId: undefined,
      assignedAgentName: undefined,
      assignmentGroup: item?.defaultAssignmentGroup || 'Service Desk L1',
      status: requiresApproval ? 'PENDING_APPROVAL' : 'APPROVED',
      approvalStatus: requiresApproval ? 'PENDING' : 'NOT_REQUIRED',
      justification,
      formData,
      expectedFulfillmentAt,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    setServiceRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const approveServiceRequest = (requestId: string, approved: boolean, commentsText: string) => {
    const now = new Date().toISOString();
    setServiceRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: approved ? 'APPROVED' : 'REJECTED',
          approvalStatus: approved ? 'APPROVED' : 'REJECTED',
          approverId: currentUser.id,
          approverName: currentUser.name,
          approvalDecisionAt: now,
          approvalComments: commentsText,
          updatedAt: now
        };
      })
    );
  };

  const updateRequestStatus = (requestId: string, status: ServiceRequest['status']) => {
    const now = new Date().toISOString();
    setServiceRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status,
          updatedAt: now,
          resolvedAt: status === 'FULFILLED' ? now : r.resolvedAt
        };
      })
    );
  };

  // Problem Operations
  const createProblem = (data: Partial<Problem>): Problem => {
    const now = new Date().toISOString();
    const probNum = `PRB-${2000 + problems.length + 1}`;
    const newProb: Problem = {
      id: `prb-${Date.now()}`,
      problemNumber: probNum,
      title: data.title || 'Untitled Problem',
      description: data.description || '',
      category: data.category || 'INFRASTRUCTURE',
      assignedTeam: data.assignedTeam || 'Infrastructure & Network L3',
      assignedAgentName: currentUser.name,
      rootCause: data.rootCause,
      workaround: data.workaround,
      isKnownError: !!data.isKnownError,
      status: data.status || 'UNDER_INVESTIGATION',
      relatedIncidentIds: data.relatedIncidentIds || [],
      createdAt: now,
      updatedAt: now
    };
    setProblems(prev => [newProb, ...prev]);
    return newProb;
  };

  const updateProblem = (id: string, data: Partial<Problem>) => {
    const now = new Date().toISOString();
    setProblems(prev =>
      prev.map(p => (p.id === id ? { ...p, ...data, updatedAt: now } : p))
    );
  };

  // Change Operations
  const createChange = (data: Partial<ChangeRequest>): ChangeRequest => {
    const now = new Date().toISOString();
    const chgNum = `CHG-${3000 + changes.length + 1}`;
    const newChange: ChangeRequest = {
      id: `chg-${Date.now()}`,
      changeNumber: chgNum,
      title: data.title || 'Untitled Change',
      description: data.description || '',
      reason: data.reason || '',
      changeType: data.changeType || 'NORMAL',
      risk: data.risk || 'MEDIUM',
      impact: data.impact || 'MEDIUM',
      affectedService: data.affectedService || 'Enterprise Services',
      implementationPlan: data.implementationPlan || '',
      rollbackPlan: data.rollbackPlan || '',
      testPlan: data.testPlan || '',
      requesterName: currentUser.name,
      assignedOwnerName: data.assignedOwnerName || currentUser.name,
      approvalStatus: data.changeType === 'STANDARD' ? 'APPROVED' : 'PENDING',
      approverName: data.changeType === 'STANDARD' ? 'Pre-Approved Standard Template' : undefined,
      implementationStatus: 'SCHEDULED',
      scheduledStart: data.scheduledStart || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      scheduledEnd: data.scheduledEnd || new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now
    };
    setChanges(prev => [newChange, ...prev]);
    return newChange;
  };

  const approveChange = (changeId: string, approvalNotes: string) => {
    const now = new Date().toISOString();
    setChanges(prev =>
      prev.map(c =>
        c.id === changeId
          ? {
              ...c,
              approvalStatus: 'APPROVED',
              approverName: currentUser.name,
              approvalComments: approvalNotes,
              updatedAt: now
            }
          : c
      )
    );
  };

  const updateChangeStatus = (changeId: string, status: ChangeRequest['implementationStatus']) => {
    const now = new Date().toISOString();
    setChanges(prev =>
      prev.map(c => (c.id === changeId ? { ...c, implementationStatus: status, updatedAt: now } : c))
    );
  };

  // Knowledge Base Operations
  const createArticle = (data: Partial<KnowledgeArticle>): KnowledgeArticle => {
    const now = new Date().toISOString();
    const num = `KB-${String(100 + articles.length + 1).padStart(5, '0')}`;
    const newArt: KnowledgeArticle = {
      id: `kb-${Date.now()}`,
      articleNumber: num,
      title: data.title || 'Untitled Article',
      summary: data.summary || '',
      content: data.content || '',
      category: data.category || 'General Support',
      authorName: currentUser.name,
      status: data.status || 'PUBLISHED',
      viewCount: 1,
      helpfulCount: 0,
      createdAt: now,
      updatedAt: now
    };
    setArticles(prev => [newArt, ...prev]);
    return newArt;
  };

  const incrementArticleView = (articleId: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === articleId ? { ...a, viewCount: a.viewCount + 1 } : a))
    );
  };

  const voteHelpful = (articleId: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === articleId ? { ...a, helpfulCount: a.helpfulCount + 1 } : a))
    );
  };

  // Asset Operations
  const createAsset = (data: Partial<Asset>): Asset => {
    const tag = `AST-${4000 + assets.length + 1}`;
    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      assetTag: tag,
      name: data.name || 'New Hardware Asset',
      type: data.type || 'LAPTOP',
      status: data.status || 'IN_STORAGE',
      ownerName: data.ownerName,
      department: data.department || 'IT Operations',
      location: data.location || 'Headquarters IT Depot',
      serialNumber: data.serialNumber || `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
      warrantyExpiry: data.warrantyExpiry || new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: data.description || '',
      associatedService: data.associatedService
    };
    setAssets(prev => [newAsset, ...prev]);
    return newAsset;
  };

  const updateAsset = (id: string, data: Partial<Asset>) => {
    setAssets(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
  };

  const updateSlaPolicy = (priority: PriorityLevel, policy: Partial<SlaPolicy>) => {
    setSlaPolicies(prev =>
      prev.map(p => (p.priority === priority ? { ...p, ...policy } : p))
    );
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setIncidents(INITIAL_INCIDENTS);
    setComments(INITIAL_COMMENTS);
    setHistory(INITIAL_HISTORY);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setProblems(INITIAL_PROBLEMS);
    setChanges(INITIAL_CHANGES);
    setArticles(INITIAL_ARTICLES);
    setAssets(INITIAL_ASSETS);
    setSlaPolicies(INITIAL_SLA_POLICIES);
    setCurrentUser(INITIAL_USERS[1]); // Bunny (Agent)
  };

  // Operational Metrics Calculation
  const metrics = useMemo<OperationalMetrics>(() => {
    const openIncs = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'CANCELLED');
    const criticalIncs = openIncs.filter(i => i.priority === 'P1');
    const breachedIncs = incidents.filter(i => i.sla.resolutionBreached || i.sla.responseBreached);
    const atRiskIncs = openIncs.filter(i => i.sla.status === 'AT_RISK');

    // SLA Compliance = (Total - Breached) / Total * 100
    const totalWithSla = incidents.length;
    const compliantCount = totalWithSla - breachedIncs.length;
    const slaCompliance = totalWithSla > 0 ? Math.round((compliantCount / totalWithSla) * 100) : 100;

    // MTTR calculation for resolved incidents
    const resolvedIncs = incidents.filter(i => i.resolvedAt);
    let totalResolutionHours = 0;
    resolvedIncs.forEach(i => {
      const created = new Date(i.createdAt).getTime();
      const resolved = new Date(i.resolvedAt!).getTime();
      totalResolutionHours += (resolved - created) / (3600 * 1000);
    });
    const avgResolutionHours = resolvedIncs.length > 0 ? Number((totalResolutionHours / resolvedIncs.length).toFixed(1)) : 4.2;

    // MTTA (First Response)
    const acknowledgedIncs = incidents.filter(i => i.firstResponseAt);
    let totalResponseMinutes = 0;
    acknowledgedIncs.forEach(i => {
      const created = new Date(i.createdAt).getTime();
      const resp = new Date(i.firstResponseAt!).getTime();
      totalResponseMinutes += (resp - created) / (60 * 1000);
    });
    const avgFirstResponseMinutes = acknowledgedIncs.length > 0 ? Math.round(totalResponseMinutes / acknowledgedIncs.length) : 18;

    // Priority counts
    const priorityCounts: Record<PriorityLevel, number> = { P1: 0, P2: 0, P3: 0, P4: 0 };
    openIncs.forEach(i => {
      priorityCounts[i.priority] = (priorityCounts[i.priority] || 0) + 1;
    });

    // Status counts
    const statusCounts: Record<IncidentStatus, number> = {
      NEW: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      PENDING: 0,
      RESOLVED: 0,
      CLOSED: 0,
      CANCELLED: 0
    };
    incidents.forEach(i => {
      statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
    });

    // Category counts
    const categoryCounts: Record<string, number> = {};
    incidents.forEach(i => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });

    // Agent workload
    const agentWorkloadMap: Record<string, number> = {};
    openIncs.forEach(i => {
      const name = i.assignedAgentName || 'Unassigned';
      agentWorkloadMap[name] = (agentWorkloadMap[name] || 0) + 1;
    });

    return {
      openIncidents: openIncs.length,
      criticalIncidents: criticalIncs.length,
      breachedSlaCount: breachedIncs.length,
      atRiskSlaCount: atRiskIncs.length,
      slaCompliancePercentage: slaCompliance,
      avgResolutionHours,
      avgFirstResponseMinutes,
      openRequests: serviceRequests.filter(r => r.status !== 'FULFILLED' && r.status !== 'CANCELLED' && r.status !== 'REJECTED').length,
      pendingApprovals: serviceRequests.filter(r => r.approvalStatus === 'PENDING').length + changes.filter(c => c.approvalStatus === 'PENDING').length,
      activeProblems: problems.filter(p => p.status !== 'RESOLVED' && p.status !== 'CLOSED').length,
      scheduledChanges: changes.filter(c => c.implementationStatus === 'SCHEDULED' || c.implementationStatus === 'IN_PROGRESS').length,
      byPriority: [
        { priority: 'P1', count: priorityCounts.P1 },
        { priority: 'P2', count: priorityCounts.P2 },
        { priority: 'P3', count: priorityCounts.P3 },
        { priority: 'P4', count: priorityCounts.P4 }
      ],
      byStatus: Object.entries(statusCounts).map(([status, count]) => ({
        status: status as IncidentStatus,
        count
      })),
      byCategory: Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      })),
      agentWorkload: Object.entries(agentWorkloadMap).map(([agentName, activeTickets]) => ({
        agentName,
        activeTickets
      })),
      slaTrend: [
        { date: 'Mon', met: 18, breached: 1 },
        { date: 'Tue', met: 22, breached: 0 },
        { date: 'Wed', met: 19, breached: 2 },
        { date: 'Thu', met: 25, breached: 1 },
        { date: 'Fri', met: 21, breached: 0 },
        { date: 'Sat', met: 8, breached: 0 },
        { date: 'Sun', met: 11, breached: 1 }
      ]
    };
  }, [incidents, serviceRequests, changes, problems]);

  return (
    <ServiceOpsContext.Provider
      value={{
        currentUser,
        token,
        users,
        slaPolicies,
        incidents,
        comments,
        history,
        catalogItems,
        serviceRequests,
        problems,
        changes,
        articles,
        assets,
        metrics,
        loginAs,
        loginWithEmail,
        logout,
        switchRole,
        createIncident,
        updateIncidentStatus,
        assignIncident,
        updateIncidentPriority,
        addComment,
        linkIncidentToProblem,
        createServiceRequest,
        approveServiceRequest,
        updateRequestStatus,
        createProblem,
        updateProblem,
        createChange,
        approveChange,
        updateChangeStatus,
        createArticle,
        incrementArticleView,
        voteHelpful,
        createAsset,
        updateAsset,
        updateSlaPolicy,
        resetToDemoData
      }}
    >
      {children}
    </ServiceOpsContext.Provider>
  );
};

export const useServiceOps = () => {
  const context = useContext(ServiceOpsContext);
  if (!context) {
    throw new Error('useServiceOps must be used within a ServiceOpsProvider');
  }
  return context;
};
