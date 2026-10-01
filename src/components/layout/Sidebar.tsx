import React from 'react';
import { useServiceOps } from '../../context/ServiceOpsContext';
import {
  LayoutDashboard,
  AlertOctagon,
  ShoppingBag,
  Inbox,
  FileQuestion,
  GitPullRequest,
  BookOpen,
  Database,
  CheckSquare,
  Settings,
  Code2,
  HelpCircle,
  FolderLock
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'incidents'
  | 'catalog'
  | 'requests'
  | 'problems'
  | 'changes'
  | 'knowledge'
  | 'assets'
  | 'approvals'
  | 'admin'
  | 'architecture';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { currentUser, metrics, incidents, serviceRequests, changes } = useServiceOps();

  // Role permissions
  const isEmployee = currentUser.role === 'EMPLOYEE';
  const isAgent = currentUser.role === 'SERVICE_AGENT';
  const isManager = currentUser.role === 'SERVICE_MANAGER';
  const isAdmin = currentUser.role === 'ADMIN';

  const myOpenIncidentsCount = incidents.filter(
    i => i.requesterId === currentUser.id && i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  const myOpenRequestsCount = serviceRequests.filter(
    r => r.requesterId === currentUser.id && r.status !== 'FULFILLED' && r.status !== 'CANCELLED'
  ).length;

  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    visible: boolean;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      visible: true
    },
    {
      id: 'incidents',
      label: isEmployee ? 'My Incidents' : 'Incident Queue',
      icon: AlertOctagon,
      badge: isEmployee ? myOpenIncidentsCount : metrics.openIncidents,
      badgeColor: 'bg-rose-100 text-rose-700',
      visible: true
    },
    {
      id: 'catalog',
      label: 'Service Catalog',
      icon: ShoppingBag,
      visible: true
    },
    {
      id: 'requests',
      label: isEmployee ? 'My Requests' : 'Service Requests',
      icon: Inbox,
      badge: isEmployee ? myOpenRequestsCount : metrics.openRequests,
      badgeColor: 'bg-indigo-100 text-indigo-700',
      visible: true
    },
    {
      id: 'approvals',
      label: 'Approvals Queue',
      icon: CheckSquare,
      badge: metrics.pendingApprovals,
      badgeColor: 'bg-amber-100 text-amber-800',
      visible: isManager || isAdmin
    },
    {
      id: 'problems',
      label: 'Problem Records',
      icon: FileQuestion,
      badge: metrics.activeProblems > 0 ? metrics.activeProblems : undefined,
      badgeColor: 'bg-purple-100 text-purple-700',
      visible: isAgent || isManager || isAdmin
    },
    {
      id: 'changes',
      label: 'Change Control (CAB)',
      icon: GitPullRequest,
      badge: metrics.scheduledChanges > 0 ? metrics.scheduledChanges : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
      visible: isAgent || isManager || isAdmin
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: BookOpen,
      visible: true
    },
    {
      id: 'assets',
      label: 'CMDB & Assets',
      icon: Database,
      visible: isAgent || isManager || isAdmin
    },
    {
      id: 'admin',
      label: 'System Admin & SLA',
      icon: Settings,
      visible: isAdmin
    },
    {
      id: 'architecture',
      label: 'Architecture & Specs',
      icon: Code2,
      visible: true
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] border-r border-slate-800">
      {/* Role Context Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/50">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
          Current Context
        </span>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-slate-200">
            {isEmployee ? 'Employee Self-Service' : isAgent ? 'Agent Service Desk' : isManager ? 'Management & SLA' : 'System Administration'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {navItems
          .filter(item => item.visible)
          .map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* Bottom Service Desk Info */}
      <div className="p-3.5 m-3 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Need IT Emergency?</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Dial <span className="font-mono text-slate-200">x4357</span> or page On-Call via PagerDuty for P1 outages.
        </p>
      </div>
    </aside>
  );
};
