import React, { useState, useMemo } from 'react';
import { useServiceOps, calculatePriority } from '../context/ServiceOpsContext';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { SlaIndicator } from '../components/common/SlaIndicator';
import { Modal } from '../components/common/Modal';
import {
  Incident,
  ImpactLevel,
  UrgencyLevel,
  IncidentStatus,
  PriorityLevel
} from '../types';
import {
  Search,
  Filter,
  PlusCircle,
  AlertTriangle,
  ArrowUpDown,
  Laptop,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';

interface IncidentsViewProps {
  onSelectIncident: (incident: Incident) => void;
  openCreateModal?: boolean;
  onCloseCreateModal?: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  onSelectIncident,
  openCreateModal = false,
  onCloseCreateModal
}) => {
  const {
    incidents,
    currentUser,
    users,
    assets,
    slaPolicies,
    createIncident
  } = useServiceOps();

  // Filters & Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'sla'>('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(openCreateModal);

  // New Incident Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HARDWARE');
  const [subcategory, setSubcategory] = useState('Workstation / Laptop');
  const [impact, setImpact] = useState<ImpactLevel>('MEDIUM');
  const [urgency, setUrgency] = useState<UrgencyLevel>('MEDIUM');
  const [source, setSource] = useState<Incident['source']>('PORTAL');
  const [affectedAssetId, setAffectedAssetId] = useState('');
  const [affectedService, setAffectedService] = useState('Digital Workplace');
  const [assignmentGroup, setAssignmentGroup] = useState('Desktop Support L2');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [formError, setFormError] = useState('');

  // Dynamically calculate priority and SLA target in real-time as user changes inputs!
  const computedPriority = useMemo(() => {
    return calculatePriority(impact, urgency);
  }, [impact, urgency]);

  const targetSla = useMemo(() => {
    return slaPolicies.find(p => p.priority === computedPriority) || slaPolicies[2];
  }, [computedPriority, slaPolicies]);

  // Categories list
  const categories = [
    { id: 'HARDWARE', label: 'Hardware & Devices' },
    { id: 'SOFTWARE', label: 'Software & OS' },
    { id: 'NETWORK', label: 'Network & VPN' },
    { id: 'IDENTITY', label: 'Identity & SSO' },
    { id: 'DATABASE', label: 'Database & Cloud' },
    { id: 'FACILITIES', label: 'Facilities & Printing' }
  ];

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Role filtering: Employees see their own tickets unless searching
      if (currentUser.role === 'EMPLOYEE' && inc.requesterId !== currentUser.id) {
        return false;
      }

      if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false;
      if (categoryFilter !== 'ALL' && inc.category !== categoryFilter) return false;
      if (assignmentFilter === 'ASSIGNED_TO_ME' && inc.assignedAgentId !== currentUser.id) return false;
      if (assignmentFilter === 'UNASSIGNED' && inc.assignedAgentId) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = inc.incidentNumber.toLowerCase().includes(q);
        const matchesTitle = inc.title.toLowerCase().includes(q);
        const matchesDesc = inc.description.toLowerCase().includes(q);
        const matchesRequester = inc.requesterName.toLowerCase().includes(q);
        if (!matchesNum && !matchesTitle && !matchesDesc && !matchesRequester) return false;
      }

      return true;
    });
  }, [incidents, currentUser, statusFilter, priorityFilter, categoryFilter, assignmentFilter, searchQuery]);

  const sortedIncidents = useMemo(() => {
    return [...filteredIncidents].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<PriorityLevel, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      }
      if (sortBy === 'sla') {
        return new Date(a.sla.resolutionDeadline).getTime() - new Date(b.sla.resolutionDeadline).getTime();
      }
      return 0;
    });
  }, [filteredIncidents, sortBy]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError('Please enter both an incident title and detailed description.');
      return;
    }

    const created = createIncident({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory,
      impact,
      urgency,
      source,
      assignmentGroup,
      assignedAgentId: assignedAgentId || undefined,
      affectedAssetId: affectedAssetId || undefined,
      affectedService
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setFormError('');
    setIsModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();

    // Directly open the created incident detail!
    onSelectIncident(created);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.role === 'EMPLOYEE' ? 'My Reported Incidents' : 'Incident Management Queue'}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredIncidents.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ITIL v4 Incident Lifecycle &bull; Authoritative SLA Tracking &bull; Priority Matrix
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by INC-XXXX, title, requester, or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Moderate</option>
              <option value="P4">P4 - Low</option>
            </select>

            {/* Assignment Filter for Staff */}
            {currentUser.role !== 'EMPLOYEE' && (
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All Assignments</option>
                <option value="ASSIGNED_TO_ME">Assigned to Me</option>
                <option value="UNASSIGNED">Unassigned</option>
              </select>
            )}

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 pl-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="priority">Sort: Highest Priority</option>
                <option value="sla">Sort: SLA Urgency</option>
                <option value="oldest">Sort: Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Incident Number</th>
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Authoritative SLA</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">No incident records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying your filter parameters or submit a new incident ticket.</p>
                  </td>
                </tr>
              ) : (
                sortedIncidents.map(inc => (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {inc.incidentNumber}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(inc.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block line-clamp-1 max-w-sm">
                        {inc.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          {inc.category}
                        </span>
                        {inc.affectedAssetName && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            &bull; {inc.affectedAssetName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <PriorityBadge priority={inc.priority} />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={inc.status} />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">{inc.requesterName}</span>
                      <span className="text-[10px] text-slate-400">{inc.requesterDepartment}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">
                        {inc.assignedAgentName || 'Unassigned'}
                      </span>
                      <span className="text-[10px] text-slate-400">{inc.assignmentGroup}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <SlaIndicator sla={inc.sla} compact />
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                        View Details &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Incident Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        title="Report New Incident"
        subtitle="Submit a service disruption or degraded asset event for ITIL triage"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. VPN gateway connection dropped on macOS client"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Symptoms &amp; Steps to Reproduce *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Include error codes, affected users, frequency, and any troubleshooting already attempted..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Live Priority Matrix Calculator Box */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                ITIL Priority Matrix &amp; SLA Target Calculation
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={computedPriority} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Impact (Scope of Users / Services Affected)
                </label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value as ImpactLevel)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value="HIGH">High (Enterprise / Multi-Department Outage)</option>
                  <option value="MEDIUM">Medium (Single Department / Critical Team)</option>
                  <option value="LOW">Low (Single User / Non-critical)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Urgency (Speed at which business requires fix)
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value="HIGH">High (Work Completely Blocked)</option>
                  <option value="MEDIUM">Medium (Degraded Performance / Workaround Exists)</option>
                  <option value="LOW">Low (Convenience / Minor Inconvenience)</option>
                </select>
              </div>
            </div>

            {/* SLA Preview Banner */}
            <div className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-lg border border-indigo-100 text-slate-700">
              <span className="font-medium text-[11px]">
                Target SLA Policy: <strong className="text-slate-900">{targetSla.name}</strong>
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-indigo-700 font-semibold">Response: {targetSla.responseMinutes}m</span>
                <span className="text-indigo-700 font-semibold">
                  Resolution: {targetSla.resolutionMinutes >= 60 ? `${targetSla.resolutionMinutes / 60}h` : `${targetSla.resolutionMinutes}m`}
                </span>
              </div>
            </div>
          </div>

          {/* Category & Asset Association */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Affected CMDB Asset (Optional)
              </label>
              <select
                value={affectedAssetId}
                onChange={(e) => setAffectedAssetId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="">None / Unlisted Asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.assetTag} - {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Staff Assignment Fields (visible to Agents, Managers, Admins) */}
          {currentUser.role !== 'EMPLOYEE' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Group
                </label>
                <select
                  value={assignmentGroup}
                  onChange={(e) => setAssignmentGroup(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Service Desk L1">Service Desk L1</option>
                  <option value="Desktop Support L2">Desktop Support L2</option>
                  <option value="Infrastructure & Network L3">Infrastructure &amp; Network L3</option>
                  <option value="Cloud Platform Ops">Cloud Platform Ops</option>
                  <option value="CyberSecurity Operations">CyberSecurity Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Specialist
                </label>
                <select
                  value={assignedAgentId}
                  onChange={(e) => setAssignedAgentId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">Unassigned (Queue Triage)</option>
                  {users
                    .filter(u => u.role !== 'EMPLOYEE')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.team || u.role})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                if (onCloseCreateModal) onCloseCreateModal();
              }}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
            >
              Submit Incident Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
