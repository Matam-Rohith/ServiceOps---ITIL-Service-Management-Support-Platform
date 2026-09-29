import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ChangeRequest, ChangeType, ChangeRisk, ImpactLevel } from '../types';
import {
  GitPullRequest,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ChangesView: React.FC = () => {
  const { changes, createChange, approveChange, updateChangeStatus, currentUser } = useServiceOps();

  const [selectedChange, setSelectedChange] = useState<ChangeRequest | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [changeType, setChangeType] = useState<ChangeType>('NORMAL');
  const [risk, setRisk] = useState<ChangeRisk>('MEDIUM');
  const [impact, setImpact] = useState<ImpactLevel>('MEDIUM');
  const [affectedService, setAffectedService] = useState('Enterprise VPN Access');
  const [implementationPlan, setImplementationPlan] = useState('');
  const [rollbackPlan, setRollbackPlan] = useState('');
  const [testPlan, setTestPlan] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');

  const isManagerOrAdmin = currentUser.role === 'SERVICE_MANAGER' || currentUser.role === 'ADMIN';

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !implementationPlan.trim() || !rollbackPlan.trim()) return;

    createChange({
      title: title.trim(),
      description: description.trim(),
      reason: reason.trim(),
      changeType,
      risk,
      impact,
      affectedService,
      implementationPlan: implementationPlan.trim(),
      rollbackPlan: rollbackPlan.trim(),
      testPlan: testPlan.trim() || 'Synthetic health checks and user smoke testing.',
      scheduledStart: scheduledStart || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      scheduledEnd: scheduledEnd || new Date(Date.now() + 28 * 3600 * 1000).toISOString()
    });

    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Change Enablement &amp; CAB Control
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {changes.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ITIL v4 Change Management &bull; Risk Assessment &bull; Implementation &amp; Rollback Protocols
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New RFC Request</span>
        </button>
      </div>

      {/* Changes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">RFC Number</th>
                <th className="px-4 py-3">Title &amp; Affected Service</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">CAB Approval</th>
                <th className="px-4 py-3">Implementation Status</th>
                <th className="px-4 py-3">Scheduled Maintenance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {changes.map(chg => (
                <tr key={chg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {chg.changeNumber}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block max-w-sm">{chg.title}</span>
                    <span className="text-[10px] text-slate-400">Service: {chg.affectedService}</span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      chg.changeType === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                      chg.changeType === 'NORMAL' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {chg.changeType}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      chg.risk === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      chg.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {chg.risk} RISK
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {chg.approvalStatus === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Pending CAB
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={chg.implementationStatus} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                    <span className="font-medium block">{new Date(chg.scheduledStart).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(chg.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => setSelectedChange(chg)}
                      className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                    >
                      Inspect RFC
                    </button>
                    {isManagerOrAdmin && chg.approvalStatus === 'PENDING' && (
                      <button
                        onClick={() => approveChange(chg.id, 'CAB approved by Service Management')}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-2xs"
                      >
                        CAB Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect RFC Details Modal */}
      {selectedChange && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedChange(null)}
          title={`RFC Details: ${selectedChange.changeNumber} - ${selectedChange.title}`}
          subtitle={`Requested by ${selectedChange.requesterName} &bull; Owner: ${selectedChange.assignedOwnerName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block text-[11px]">Business Reason &amp; Description</span>
              <p className="text-slate-800 leading-relaxed">{selectedChange.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-white border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Change Type</span>
                <span className="font-bold text-slate-900">{selectedChange.changeType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Risk &amp; Impact</span>
                <span className="font-bold text-slate-900">Risk: {selectedChange.risk} &bull; Impact: {selectedChange.impact}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px] mb-1">
                  Step-by-Step Implementation Plan
                </span>
                <p className="text-slate-700 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                  {selectedChange.implementationPlan}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200">
                <span className="font-bold text-rose-950 block text-[11px] mb-1">
                  Rollback / Backout Strategy
                </span>
                <p className="text-rose-900 leading-relaxed whitespace-pre-line">
                  {selectedChange.rollbackPlan}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-[11px] mb-1">
                  Post-Implementation Test &amp; Verification Plan
                </span>
                <p className="text-emerald-900 leading-relaxed whitespace-pre-line">
                  {selectedChange.testPlan}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedChange(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create RFC Modal */}
      {createModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
          title="Submit Request for Change (RFC)"
          subtitle="Formulate an ITIL change proposal for CAB governance"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Change Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Upgrade PostgreSQL Aurora cluster to v16.2"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Change Type</label>
                <select
                  value={changeType}
                  onChange={(e) => setChangeType(e.target.value as ChangeType)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="NORMAL">NORMAL (CAB Approval Required)</option>
                  <option value="STANDARD">STANDARD (Pre-Approved)</option>
                  <option value="EMERGENCY">EMERGENCY (ECAB Expedited)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Risk Level</label>
                <select
                  value={risk}
                  onChange={(e) => setRisk(e.target.value as ChangeRisk)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Impact Scope</label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value as ImpactLevel)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Implementation Steps *
              </label>
              <textarea
                required
                rows={3}
                value={implementationPlan}
                onChange={(e) => setImplementationPlan(e.target.value)}
                placeholder="1. Drain traffic 2. Execute script 3. Verify health checks..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rollback / Backout Plan *
                </label>
                <textarea
                  required
                  rows={2}
                  value={rollbackPlan}
                  onChange={(e) => setRollbackPlan(e.target.value)}
                  placeholder="How to return system to original state if change fails..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Testing &amp; Validation Plan *
                </label>
                <textarea
                  required
                  rows={2}
                  value={testPlan}
                  onChange={(e) => setTestPlan(e.target.value)}
                  placeholder="Synthetic smoke tests to prove zero disruption..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Submit RFC for CAB Review
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
