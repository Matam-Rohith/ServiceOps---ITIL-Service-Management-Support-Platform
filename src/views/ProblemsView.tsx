import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Problem, ProblemStatus } from '../types';
import {
  FileQuestion,
  AlertTriangle,
  PlusCircle,
  Link2,
  CheckCircle2,
  ExternalLink,
  Search,
  BookOpen,
  Edit3
} from 'lucide-react';

interface ProblemsViewProps {
  onSelectIncidentById: (incidentId: string) => void;
  selectedProblemId?: string;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({
  onSelectIncidentById,
  selectedProblemId
}) => {
  const { problems, incidents, createProblem, updateProblem, currentUser } = useServiceOps();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(() => {
    if (selectedProblemId) {
      return problems.find(p => p.id === selectedProblemId) || null;
    }
    return null;
  });

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('NETWORK');
  const [assignedTeam, setAssignedTeam] = useState('Infrastructure & Network L3');
  const [rootCause, setRootCause] = useState('');
  const [workaround, setWorkaround] = useState('');
  const [isKnownError, setIsKnownError] = useState(false);
  const [status, setStatus] = useState<ProblemStatus>('UNDER_INVESTIGATION');

  const filteredProblems = problems.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.problemNumber.toLowerCase().includes(q) ||
             p.title.toLowerCase().includes(q) ||
             p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setCategory('NETWORK');
    setAssignedTeam('Infrastructure & Network L3');
    setRootCause('');
    setWorkaround('');
    setIsKnownError(false);
    setStatus('UNDER_INVESTIGATION');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Problem) => {
    setSelectedProblem(p);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setAssignedTeam(p.assignedTeam);
    setRootCause(p.rootCause || '');
    setWorkaround(p.workaround || '');
    setIsKnownError(p.isKnownError);
    setStatus(p.status);
    setEditModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProblem({
      title: title.trim(),
      description: description.trim(),
      category,
      assignedTeam,
      rootCause: rootCause.trim() || undefined,
      workaround: workaround.trim() || undefined,
      isKnownError,
      status
    });

    setCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;

    updateProblem(selectedProblem.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      assignedTeam,
      rootCause: rootCause.trim() || undefined,
      workaround: workaround.trim() || undefined,
      isKnownError,
      status,
      resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date().toISOString() : selectedProblem.resolvedAt
    });

    setEditModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Problem Management &amp; Known Errors (KEDB)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredProblems.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify recurring incident root causes &bull; Document certified workarounds &bull; Maintain Known Error Database
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Problem Record</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by PRB-XXXX, title, root cause, or symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProblems.map(p => {
          const linkedIncs = incidents.filter(i => p.relatedIncidentIds.includes(i.id));

          return (
            <div
              key={p.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-xs">
                      {p.problemNumber}
                    </span>
                    <StatusBadge status={p.status} />
                    {p.isKnownError && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Known Error (KEDB)
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">&bull; {p.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {p.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEdit(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Problem</span>
                </button>
              </div>

              {/* Root Cause & Workaround Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px]">Root Cause Diagnosis</span>
                  <p className="text-slate-600 leading-relaxed">
                    {p.rootCause || <em className="text-slate-400">Under technical root-cause investigation</em>}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-950 block text-[11px]">Certified Temporary Workaround</span>
                  <p className="text-emerald-800 leading-relaxed">
                    {p.workaround || <em className="text-slate-400">No temporary workaround identified yet</em>}
                  </p>
                </div>
              </div>

              {/* Linked Incidents */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-600">
                    Linked Recurring Incidents ({linkedIncs.length}):
                  </span>
                  {linkedIncs.map(inc => (
                    <button
                      key={inc.id}
                      onClick={() => onSelectIncidentById(inc.id)}
                      className="font-mono text-xs font-bold text-indigo-600 hover:underline bg-slate-100 px-2 py-0.5 rounded"
                    >
                      {inc.incidentNumber}
                    </button>
                  ))}
                  {linkedIncs.length === 0 && (
                    <span className="text-slate-400 text-xs">No incidents currently linked</span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  Assigned Team: <strong className="text-slate-700">{p.assignedTeam}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Problem Modal */}
      {(createModalOpen || editModalOpen) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setCreateModalOpen(false);
            setEditModalOpen(false);
          }}
          title={createModalOpen ? 'Create ITIL Problem Record' : `Update Problem: ${selectedProblem?.problemNumber}`}
          subtitle="Document root cause analysis and publish certified workarounds to KEDB"
          maxWidth="xl"
        >
          <form onSubmit={createModalOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                placeholder="e.g. Cisco Core Switch packet loss under 10Gbps load"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Problem Description &amp; Incident Patterns *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProblemStatus)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
                  <option value="KNOWN_ERROR">KNOWN ERROR</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Team</label>
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Infrastructure & Network L3">Infrastructure &amp; Network L3</option>
                  <option value="Desktop Support L2">Desktop Support L2</option>
                  <option value="Cloud Platform Ops">Cloud Platform Ops</option>
                  <option value="CyberSecurity Operations">CyberSecurity Operations</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Root Cause Analysis (RCA)
              </label>
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200"
                placeholder="Describe the underlying technical fault or architectural bottleneck..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Certified Workaround (Published to Service Desk)
              </label>
              <textarea
                rows={2}
                value={workaround}
                onChange={(e) => setWorkaround(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200"
                placeholder="Steps service desk agents can instruct callers to take while permanent fix is engineered..."
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isKnownError"
                checked={isKnownError}
                onChange={(e) => setIsKnownError(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isKnownError" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Publish as Known Error in KEDB (root cause known or workaround available)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModalOpen(false);
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {createModalOpen ? 'Create Problem Record' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
