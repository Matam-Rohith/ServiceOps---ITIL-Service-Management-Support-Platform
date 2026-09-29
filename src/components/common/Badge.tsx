import React from 'react';
import { IncidentStatus, PriorityLevel, SlaStatus, ApprovalStatus, UserRole } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const PriorityBadge: React.FC<{ priority: PriorityLevel; className?: string }> = ({ priority, className = '' }) => {
  const configs: Record<PriorityLevel, { bg: string; dot: string; label: string }> = {
    P1: { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500 animate-pulse', label: 'P1 - Critical' },
    P2: { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500', label: 'P2 - High' },
    P3: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'P3 - Moderate' },
    P4: { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400', label: 'P4 - Low' }
  };

  const c = configs[priority] || configs.P4;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus | string; className?: string }> = ({ status, className = '' }) => {
  const configs: Record<string, { bg: string; text: string; border: string }> = {
    NEW: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    ASSIGNED: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    IN_PROGRESS: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    PENDING: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    RESOLVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    CLOSED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    // Service Request / Change statuses
    PENDING_APPROVAL: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    FULFILLED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    OPEN: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    UNDER_INVESTIGATION: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    KNOWN_ERROR: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  const c = configs[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border} ${className}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export const SlaBadge: React.FC<{ status: SlaStatus; breached?: boolean; className?: string }> = ({
  status,
  breached,
  className = ''
}) => {
  if (breached || status === 'BREACHED') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
        BREACHED
      </span>
    );
  }

  if (status === 'AT_RISK') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        AT RISK
      </span>
    );
  }

  if (status === 'PAUSED') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 ${className}`}>
        PAUSED
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      ON TRACK
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole; className?: string }> = ({ role, className = '' }) => {
  const configs: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
    EMPLOYEE: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', label: 'Employee' },
    SERVICE_AGENT: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', label: 'Service Agent (L2)' },
    SERVICE_MANAGER: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', label: 'Service Manager' },
    ADMIN: { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300', label: 'System Admin' }
  };

  const c = configs[role];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${c.bg} ${c.text} ${c.border} ${className}`}>
      {c.label}
    </span>
  );
};
