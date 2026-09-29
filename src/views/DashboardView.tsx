import React from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { PriorityBadge, StatusBadge, SlaBadge } from '../components/common/Badge';
import { SlaIndicator } from '../components/common/SlaIndicator';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  TrendingUp,
  Inbox,
  ArrowRight,
  PlusCircle,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  Flame,
  Users
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab, params?: any) => void;
  onOpenCreateIncident: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCreateIncident
}) => {
  const { currentUser, metrics, incidents, serviceRequests, catalogItems, articles } = useServiceOps();

  const isEmployee = currentUser.role === 'EMPLOYEE';
  const myIncidents = incidents.filter(i => i.requesterId === currentUser.id);
  const myRequests = serviceRequests.filter(r => r.requesterId === currentUser.id);

  const PRIORITY_COLORS: Record<string, string> = {
    P1: '#ef4444', // Red
    P2: '#f59e0b', // Amber
    P3: '#3b82f6', // Blue
    P4: '#94a3b8'  // Slate
  };

  // If Employee view: Show simplified, actionable self-service portal
  if (isEmployee) {
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300 block mb-1">
              IT Employee Self-Service Portal
            </span>
            <h1 className="text-2xl font-black tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
              Report equipment issues, submit hardware &amp; software requests, or browse self-help guides.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={onOpenCreateIncident}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4 text-indigo-700" />
                <span>Report an Incident</span>
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 border border-indigo-400/40 text-white font-semibold text-xs hover:bg-indigo-600 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-200" />
                <span>Request IT Services</span>
              </button>
              <button
                onClick={() => onNavigate('knowledge')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 border border-indigo-400/40 text-white font-semibold text-xs hover:bg-indigo-600 transition-all"
              >
                <BookOpen className="w-4 h-4 text-indigo-200" />
                <span>Search Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>

        {/* Employee Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block">My Active Incidents</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {myIncidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {myIncidents.length} total submitted
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block">My Service Requests</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {myRequests.filter(r => r.status !== 'FULFILLED' && r.status !== 'CANCELLED').length}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {myRequests.length} total orders
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block">Knowledge Solutions</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {articles.filter(a => a.status === 'PUBLISHED').length}
              </span>
              <button
                onClick={() => onNavigate('knowledge')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Browse Guides</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* My Open Tickets Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Active Incident Tickets</h2>
              <p className="text-xs text-slate-500">Live progress tracking on your reported technical issues</p>
            </div>
            <button
              onClick={() => onNavigate('incidents')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All Incidents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active incidents submitted. Everything is running smoothly!
              </div>
            ) : (
              myIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => onNavigate('incidents', { selectedId: inc.id })}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        {inc.incidentNumber}
                      </span>
                      <PriorityBadge priority={inc.priority} />
                      <StatusBadge status={inc.status} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{inc.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <SlaIndicator sla={inc.sla} compact />
                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">Assigned Specialist</span>
                      <span className="font-medium text-slate-700">
                        {inc.assignedAgentName || 'Queue Triage'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Service Catalog Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Featured Service Catalog Items</h2>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View Full Catalog &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catalogItems.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate('catalog', { selectedItemId: item.id })}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">{item.expectedFulfillmentHours}h SLA</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Submit Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // IT Service Desk Management & Operational Dashboard (Agent / Manager / Admin)
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            ITIL Service Operations Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time incident response, SLA compliance tracking, and workload metrics
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCreateIncident}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Incident</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Open Incidents */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Open Incidents
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{metrics.openIncidents}</span>
            <span className="text-xs font-semibold text-slate-400">Queue</span>
          </div>
        </div>

        {/* Critical P1 */}
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs bg-rose-50/20">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
            Critical (P1)
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-rose-600">{metrics.criticalIncidents}</span>
            {metrics.criticalIncidents > 0 ? (
              <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            ) : (
              <span className="text-xs text-emerald-600 font-bold">Clear</span>
            )}
          </div>
        </div>

        {/* SLA Compliance % */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            SLA Compliance
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-black ${metrics.slaCompliancePercentage >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {metrics.slaCompliancePercentage}%
            </span>
            <span className="text-xs font-semibold text-slate-400">Target 95%</span>
          </div>
        </div>

        {/* Breached SLAs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            SLA Breached
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-black ${metrics.breachedSlaCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {metrics.breachedSlaCount}
            </span>
            <span className="text-xs font-medium text-slate-400">Tickets</span>
          </div>
        </div>

        {/* MTTR (Mean Time to Resolution) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Avg MTTR
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{metrics.avgResolutionHours}h</span>
            <span className="text-xs font-medium text-slate-400">Resolution</span>
          </div>
        </div>

        {/* MTTA (First Response) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Avg MTTA
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900">{metrics.avgFirstResponseMinutes}m</span>
            <span className="text-xs font-medium text-slate-400">First Touch</span>
          </div>
        </div>
      </div>

      {/* Operational Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ticket Volume by Priority */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Queue by Priority
            </h2>
            <span className="text-xs text-slate-400 font-medium">ITIL Severity Matrix</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.byPriority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {metrics.byPriority.map((entry) => (
                    <Cell key={`cell-${entry.priority}`} fill={PRIORITY_COLORS[entry.priority] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Performance Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              7-Day SLA Trend
            </h2>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Met
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Breached
              </span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.slaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="met" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                <Area type="monotone" dataKey="breached" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Workload Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Agent Workload
            </h2>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {metrics.agentWorkload.map(item => (
              <div key={item.agentName} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.agentName}</span>
                  <span className="text-slate-500 font-mono">{item.activeTickets} tickets</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, (item.activeTickets / Math.max(...metrics.agentWorkload.map(w => w.activeTickets), 1)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Queue Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Urgent Incident Dispatch Queue</h2>
            <p className="text-xs text-slate-500">Unresolved tickets prioritized by authoritative SLA urgency</p>
          </div>
          <button
            onClick={() => onNavigate('incidents')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Open Incident Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Assignment</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {incidents.slice(0, 5).map(inc => (
                <tr
                  key={inc.id}
                  onClick={() => onNavigate('incidents', { selectedId: inc.id })}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-indigo-600">{inc.incidentNumber}</span>
                    <span className="block font-medium text-slate-900 mt-0.5 line-clamp-1 max-w-xs">
                      {inc.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={inc.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-medium block">{inc.requesterName}</span>
                    <span className="text-[11px] text-slate-400">{inc.requesterDepartment}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800 block">
                      {inc.assignedAgentName || 'Unassigned'}
                    </span>
                    <span className="text-[10px] text-slate-400">{inc.assignmentGroup}</span>
                  </td>
                  <td className="px-4 py-3">
                    <SlaIndicator sla={inc.sla} compact />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                      Manage &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
