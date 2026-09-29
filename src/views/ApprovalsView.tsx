import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  CheckSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  GitPullRequest,
  Inbox
} from 'lucide-react';
import { ServiceRequest, ChangeRequest } from '../types';

export const ApprovalsView: React.FC = () => {
  const {
    currentUser,
    serviceRequests,
    changes,
    approveServiceRequest,
    approveChange
  } = useServiceOps();

  const isAuthorized = currentUser.role === 'SERVICE_MANAGER' || currentUser.role === 'ADMIN';

  // State for Review Modals
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);
  const [selectedChange, setSelectedChange] = useState<ChangeRequest | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isApproving, setIsApproving] = useState(true);

  const pendingRequests = serviceRequests.filter(r => r.approvalStatus === 'PENDING');
  const pendingChanges = changes.filter(c => c.approvalStatus === 'PENDING');

  if (!isAuthorized) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center max-w-lg mx-auto my-12 space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <h2 className="text-base font-bold text-amber-900">Restricted Authorization</h2>
        <p className="text-xs text-amber-800 leading-relaxed">
          The Approvals Queue is restricted to <strong>Service Managers</strong> and <strong>Administrators</strong> under ITIL governance rules.
        </p>
        <span className="text-[11px] text-amber-700 block">
          Use the role switcher in the top right to switch to <strong>Sai (Manager)</strong> to review approvals.
        </span>
      </div>
    );
  }

  const handleOpenReqApproval = (req: ServiceRequest, approve: boolean) => {
    setSelectedReq(req);
    setIsApproving(approve);
    setDecisionNotes(approve ? 'Approved per departmental budget and headcount allocation.' : 'Rejected due to budget reallocation.');
  };

  const handleOpenChangeApproval = (chg: ChangeRequest) => {
    setSelectedChange(chg);
    setDecisionNotes('CAB Review completed. Rollback plan and testing window approved.');
  };

  const handleSubmitReqApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    approveServiceRequest(selectedReq.id, isApproving, decisionNotes);
    setSelectedReq(null);
  };

  const handleSubmitChangeApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChange) return;
    approveChange(selectedChange.id, decisionNotes);
    setSelectedChange(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Governance &amp; Approvals Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review pending service catalog requests and Change Advisory Board (CAB) releases
        </p>
      </div>

      {/* Section 1: Pending Service Requests */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Pending Service Request Authorizations ({pendingRequests.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No pending service requests awaiting your approval.
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {req.requestNumber}
                    </span>
                    <span className="font-bold text-slate-900">{req.catalogItemName}</span>
                  </div>
                  <p className="text-slate-600 italic">
                    Justification: "{req.justification}"
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Requester: <strong className="text-slate-700">{req.requesterName}</strong> ({req.requesterDepartment})</span>
                    <span>&bull; Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenReqApproval(req, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleOpenReqApproval(req, false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2: Pending Normal Changes (CAB) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Change Advisory Board (CAB) Authorizations ({pendingChanges.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {pendingChanges.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No normal changes pending CAB review.
            </div>
          ) : (
            pendingChanges.map(chg => (
              <div key={chg.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {chg.changeNumber}
                    </span>
                    <span className="font-bold text-slate-900">{chg.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      Risk: {chg.risk}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                    {chg.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Service: <strong className="text-slate-700">{chg.affectedService}</strong></span>
                    <span>&bull; Lead: <strong className="text-slate-700">{chg.assignedOwnerName}</strong></span>
                    <span>&bull; Window: {new Date(chg.scheduledStart).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenChangeApproval(chg)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Authorize RFC</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Service Request Decision Modal */}
      {selectedReq && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReq(null)}
          title={`${isApproving ? 'Authorize' : 'Decline'} Service Request: ${selectedReq.requestNumber}`}
          subtitle={`${selectedReq.catalogItemName} for ${selectedReq.requesterName}`}
        >
          <form onSubmit={handleSubmitReqApproval} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Formal Decision Comments *
              </label>
              <textarea
                required
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white font-bold ${
                  isApproving ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isApproving ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Change Decision Modal */}
      {selectedChange && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedChange(null)}
          title={`CAB Approval: ${selectedChange.changeNumber} - ${selectedChange.title}`}
          subtitle={`Affected Service: ${selectedChange.affectedService} &bull; Owner: ${selectedChange.assignedOwnerName}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitChangeApproval} className="space-y-4 text-xs">
            <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block text-[11px]">Rollback Safety Plan:</span>
                <p className="text-slate-600">{selectedChange.rollbackPlan}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block text-[11px]">Post-Change Testing Plan:</span>
                <p className="text-slate-600">{selectedChange.testPlan}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CAB Review Authorization Comments *
              </label>
              <textarea
                required
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedChange(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Authorize Change Execution
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
