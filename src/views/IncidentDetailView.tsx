import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { PriorityBadge, StatusBadge, RoleBadge } from '../components/common/Badge';
import { SlaIndicator } from '../components/common/SlaIndicator';
import { Modal } from '../components/common/Modal';
import { Incident, IncidentStatus, ImpactLevel, UrgencyLevel } from '../types';
import {
  ArrowLeft,
  UserCheck,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Link2,
  Send,
  Lock,
  MessageSquare,
  History,
  HardDrive,
  AlertCircle,
  FileQuestion,
  RefreshCw
} from 'lucide-react';

interface IncidentDetailViewProps {
  incident: Incident;
  onBack: () => void;
  onSelectProblem?: (problemId: string) => void;
  onSelectAsset?: (assetId: string) => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incident,
  onBack,
  onSelectProblem,
  onSelectAsset
}) => {
  const {
    currentUser,
    users,
    assets,
    problems,
    comments,
    history,
    updateIncidentStatus,
    assignIncident,
    updateIncidentPriority,
    addComment,
    linkIncidentToProblem
  } = useServiceOps();

  // Active Tab: 'discussion' | 'history'
  const [activeTab, setActiveTab] = useState<'discussion' | 'history'>('discussion');

  // Comment Box State
  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(currentUser.role !== 'EMPLOYEE');

  // Modals State
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [pendingReason, setPendingReason] = useState('');
  const [linkProblemModalOpen, setLinkProblemModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState('');

  const isStaff = currentUser.role !== 'EMPLOYEE';
  const isAssignedToMe = incident.assignedAgentId === currentUser.id;

  // Filter comments for this incident
  const ticketComments = comments.filter(c => {
    if (c.incidentId !== incident.id) return false;
    // Employees cannot see internal work notes
    if (currentUser.role === 'EMPLOYEE' && c.isInternalWorkNote) return false;
    return true;
  });

  const ticketHistory = history.filter(h => h.incidentId === incident.id);
  const affectedAsset = assets.find(a => a.id === incident.affectedAssetId);
  const linkedProblem = problems.find(p => p.id === incident.relatedProblemId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(incident.id, commentText.trim(), isStaff ? isInternalNote : false);
    setCommentText('');
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    updateIncidentStatus(incident.id, 'RESOLVED', resolutionNotes.trim());
    setResolveModalOpen(false);
    setResolutionNotes('');
  };

  const handlePendingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingReason.trim()) return;
    updateIncidentStatus(incident.id, 'PENDING', pendingReason.trim());
    setPendingModalOpen(false);
    setPendingReason('');
  };

  const handleLinkProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId) return;
    linkIncidentToProblem(incident.id, selectedProblemId);
    setLinkProblemModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {incident.incidentNumber}
              </span>
              <PriorityBadge priority={incident.priority} />
              <StatusBadge status={incident.status} />
            </div>
            <h1 className="text-base font-extrabold text-slate-900 mt-1">
              {incident.title}
            </h1>
          </div>
        </div>

        {/* Staff Quick Action Workflow Buttons */}
        {isStaff && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Assign To Me */}
            {!isAssignedToMe && incident.status !== 'RESOLVED' && incident.status !== 'CLOSED' && (
              <button
                onClick={() => assignIncident(incident.id, currentUser.id, currentUser.team)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign to Me</span>
              </button>
            )}

            {/* Start Investigation / In Progress */}
            {(incident.status === 'NEW' || incident.status === 'ASSIGNED') && (
              <button
                onClick={() => updateIncidentStatus(incident.id, 'IN_PROGRESS')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-amber-600" />
                <span>Start Investigation</span>
              </button>
            )}

            {/* Put on Hold (Pending) */}
            {incident.status === 'IN_PROGRESS' && (
              <button
                onClick={() => setPendingModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors"
              >
                <Pause className="w-3.5 h-3.5 text-purple-600" />
                <span>Put On Hold (Pause SLA)</span>
              </button>
            )}

            {/* Resume from Pending */}
            {incident.status === 'PENDING' && (
              <button
                onClick={() => updateIncidentStatus(incident.id, 'IN_PROGRESS')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume SLA / In Progress</span>
              </button>
            )}

            {/* Resolve Incident */}
            {incident.status !== 'RESOLVED' && incident.status !== 'CLOSED' && (
              <button
                onClick={() => setResolveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Resolve Incident</span>
              </button>
            )}

            {/* Close Incident */}
            {incident.status === 'RESOLVED' && (
              <button
                onClick={() => updateIncidentStatus(incident.id, 'CLOSED', 'Customer confirmed resolution.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Close Ticket</span>
              </button>
            )}

            {/* Link to Problem */}
            {!incident.relatedProblemId && (
              <button
                onClick={() => setLinkProblemModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link Problem</span>
              </button>
            )}
          </div>
        )}

        {/* Employee Close / Confirm Resolution Button */}
        {!isStaff && incident.status === 'RESOLVED' && (
          <button
            onClick={() => updateIncidentStatus(incident.id, 'CLOSED', 'Employee confirmed issue is resolved.')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirm Resolution &amp; Close</span>
          </button>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Incident Details, Comments, Audit Log */}
        <div className="lg:col-span-2 space-y-5">
          {/* Incident Description Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Incident Investigation Brief
            </h2>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {incident.description}
            </div>

            {/* Pending Reason Banner */}
            {incident.status === 'PENDING' && incident.pendingReason && (
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
                <Pause className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">Ticket On Hold / SLA Clock Paused:</span>
                  <span className="text-purple-800">{incident.pendingReason}</span>
                </div>
              </div>
            )}

            {/* Resolution Notes Banner */}
            {incident.resolutionNotes && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Official Resolution Notes</span>
                </div>
                <p className="text-emerald-800 leading-relaxed pl-5 whitespace-pre-line">
                  {incident.resolutionNotes}
                </p>
                {incident.resolvedAt && (
                  <span className="text-[10px] text-emerald-600 block pl-5">
                    Resolved at {new Date(incident.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-100 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-800">{incident.category}</span>
                <span className="text-[10px] text-slate-400 block">{incident.subcategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Intake Source</span>
                <span className="font-semibold text-slate-800">{incident.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reported At</span>
                <span className="font-semibold text-slate-800">
                  {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {new Date(incident.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Last Updated</span>
                <span className="font-semibold text-slate-800">
                  {new Date(incident.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Activity / Communications Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'discussion'
                    ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussion &amp; Work Notes ({ticketComments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'history'
                    ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Trail ({ticketHistory.length})</span>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Tab 1: Discussion & Work Notes */}
              {activeTab === 'discussion' && (
                <div className="space-y-4">
                  {/* Comments Timeline */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {ticketComments.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No comments or work notes yet.
                      </div>
                    ) : (
                      ticketComments.map(c => (
                        <div
                          key={c.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                            c.isInternalWorkNote
                              ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{c.authorName}</span>
                              <RoleBadge role={c.authorRole} className="text-[9px] py-0" />
                              {c.isInternalWorkNote && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                                  <Lock className="w-2.5 h-2.5" />
                                  Internal Work Note
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-line pl-1">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Box */}
                  <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-200 space-y-2.5">
                    {/* Work Note vs Public Customer Toggle (Staff only) */}
                    {isStaff && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsInternalNote(false)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              !isInternalNote
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Customer Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsInternalNote(true)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                              isInternalNote
                                ? 'bg-amber-600 text-white'
                                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            Internal Work Note
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {isInternalNote ? 'Hidden from requester' : 'Visible to requester in portal'}
                        </span>
                      </div>
                    )}

                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder={
                          isInternalNote
                            ? 'Add internal technical diagnosis, root cause analysis, or handoff notes...'
                            : 'Reply to customer with status update or troubleshooting instructions...'
                        }
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className={`w-full text-xs p-3 rounded-lg border focus:outline-hidden focus:ring-2 ${
                          isInternalNote
                            ? 'border-amber-300 bg-amber-50/30 focus:ring-amber-500/20 focus:border-amber-500'
                            : 'border-slate-200 bg-white focus:ring-indigo-500/20 focus:border-indigo-500'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="absolute right-2.5 bottom-3 p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 2: Audit Trail Timeline */}
              {activeTab === 'history' && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ticketHistory.map(h => (
                    <div key={h.id} className="flex items-start gap-3 text-xs p-2.5 rounded-lg hover:bg-slate-50">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{h.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(h.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          By <strong className="text-slate-700">{h.actorName}</strong>
                          {h.fieldName && (
                            <span>
                              {' '}&bull; {h.fieldName}: {h.oldValue || 'None'} &rarr; {h.newValue}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): SLA Tracker, Assignment & Asset Cards */}
        <div className="space-y-5">
          {/* Authoritative SLA Tracking Widget */}
          <SlaIndicator sla={incident.sla} />

          {/* Requester Profile Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Caller / Requester
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                {incident.requesterName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{incident.requesterName}</span>
                <span className="text-slate-500 block">{incident.requesterDepartment}</span>
                <span className="text-slate-400 font-mono text-[10px]">{incident.requesterEmail}</span>
              </div>
            </div>
          </div>

          {/* Assignment & Urgency Controls (Staff editable) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assignment &amp; Triage Group
            </h2>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block">Assignment Group</label>
                {isStaff ? (
                  <select
                    value={incident.assignmentGroup}
                    onChange={(e) => assignIncident(incident.id, incident.assignedAgentId, e.target.value)}
                    className="w-full text-xs mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                  >
                    <option value="Service Desk L1">Service Desk L1</option>
                    <option value="Desktop Support L2">Desktop Support L2</option>
                    <option value="Infrastructure & Network L3">Infrastructure &amp; Network L3</option>
                    <option value="Cloud Platform Ops">Cloud Platform Ops</option>
                    <option value="CyberSecurity Operations">CyberSecurity Operations</option>
                  </select>
                ) : (
                  <span className="font-semibold text-slate-800">{incident.assignmentGroup}</span>
                )}
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block">Assigned Specialist</label>
                {isStaff ? (
                  <select
                    value={incident.assignedAgentId || ''}
                    onChange={(e) => assignIncident(incident.id, e.target.value || undefined, incident.assignmentGroup)}
                    className="w-full text-xs mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
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
                ) : (
                  <span className="font-semibold text-slate-800">
                    {incident.assignedAgentName || 'Unassigned'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Priority & Triage Assessment */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ITIL Priority Matrix
              </h2>
              <PriorityBadge priority={incident.priority} />
            </div>

            {isStaff ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Impact</label>
                  <select
                    value={incident.impact}
                    onChange={(e) => updateIncidentPriority(incident.id, e.target.value as ImpactLevel, incident.urgency)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                  >
                    <option value="HIGH">High (Enterprise)</option>
                    <option value="MEDIUM">Medium (Dept)</option>
                    <option value="LOW">Low (Single)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-0.5">Urgency</label>
                  <select
                    value={incident.urgency}
                    onChange={(e) => updateIncidentPriority(incident.id, incident.impact, e.target.value as UrgencyLevel)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                  >
                    <option value="HIGH">High (Work Blocked)</option>
                    <option value="MEDIUM">Medium (Degraded)</option>
                    <option value="LOW">Low (Minor)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Impact: <strong>{incident.impact}</strong></span>
                <span>Urgency: <strong>{incident.urgency}</strong></span>
              </div>
            )}
          </div>

          {/* Affected CMDB Asset Card */}
          {affectedAsset && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                  Configuration Item (CMDB)
                </span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {affectedAsset.assetTag}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{affectedAsset.name}</span>
                <span className="text-slate-500 block text-[11px]">{affectedAsset.location}</span>
                <span className="text-slate-400 font-mono text-[10px] block">SN: {affectedAsset.serialNumber}</span>
              </div>
              {onSelectAsset && (
                <button
                  onClick={() => onSelectAsset(affectedAsset.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1 block"
                >
                  Inspect Asset in CMDB &rarr;
                </button>
              )}
            </div>
          )}

          {/* Linked Problem Record */}
          {linkedProblem && (
            <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5 text-purple-700" />
                  Associated Problem
                </span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                  {linkedProblem.problemNumber}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{linkedProblem.title}</span>
                {linkedProblem.workaround && (
                  <p className="text-[11px] text-purple-800 bg-white/80 p-2 rounded border border-purple-100">
                    <strong>Certified Workaround:</strong> {linkedProblem.workaround}
                  </p>
                )}
              </div>
              {onSelectProblem && (
                <button
                  onClick={() => onSelectProblem(linkedProblem.id)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 pt-1 block"
                >
                  View Problem Record &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resolve Incident Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Incident Ticket"
        subtitle="Document root cause and technical resolution notes before notifying caller"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resolution Summary &amp; Corrective Action *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detail what technical changes or repairs resolved the symptom..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
            >
              Confirm &amp; Resolve Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* Put on Hold / Pending Modal */}
      <Modal
        isOpen={pendingModalOpen}
        onClose={() => setPendingModalOpen(false)}
        title="Place Ticket On Hold (Pause SLA)"
        subtitle="Specify justification for pausing resolution timer"
      >
        <form onSubmit={handlePendingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pending Justification *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Awaiting customer reproduction steps, hardware parts shipment, or vendor tier-3 callback..."
              value={pendingReason}
              onChange={(e) => setPendingReason(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setPendingModalOpen(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-xs"
            >
              Pause SLA &amp; Set Pending
            </button>
          </div>
        </form>
      </Modal>

      {/* Link to Problem Record Modal */}
      <Modal
        isOpen={linkProblemModalOpen}
        onClose={() => setLinkProblemModalOpen(false)}
        title="Associate Incident with Problem Record"
        subtitle="Group this incident under a recurring root-cause problem investigation"
      >
        <form onSubmit={handleLinkProblemSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Problem Record
            </label>
            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="">Choose an existing problem...</option>
              {problems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.problemNumber}: {p.title} ({p.status})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setLinkProblemModalOpen(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProblemId}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40"
            >
              Link Problem Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
