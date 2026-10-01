import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ServiceRequest } from '../types';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Check,
  Eye,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ServiceRequestsViewProps {
  onOpenCatalog: () => void;
}

export const ServiceRequestsView: React.FC<ServiceRequestsViewProps> = ({ onOpenCatalog }) => {
  const {
    serviceRequests,
    currentUser,
    approveServiceRequest,
    updateRequestStatus
  } = useServiceOps();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);

  // Approval Modal State
  const [approvalModalReq, setApprovalModalReq] = useState<ServiceRequest | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [isApproving, setIsApproving] = useState(true);

  const isStaff = currentUser.role !== 'EMPLOYEE';
  const isManagerOrAdmin = currentUser.role === 'SERVICE_MANAGER' || currentUser.role === 'ADMIN';

  const filteredRequests = serviceRequests.filter(req => {
    if (currentUser.role === 'EMPLOYEE' && req.requesterId !== currentUser.id) {
      return false;
    }
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!req.requestNumber.toLowerCase().includes(q) &&
          !req.catalogItemName.toLowerCase().includes(q) &&
          !req.requesterName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenApproval = (req: ServiceRequest, approve: boolean) => {
    setApprovalModalReq(req);
    setIsApproving(approve);
    setApprovalComments(approve ? 'Approved per departmental budget.' : 'Denied due to budget constraints.');
  };

  const handleSubmitApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalReq) return;
    approveServiceRequest(approvalModalReq.id, isApproving, approvalComments);
    setApprovalModalReq(null);
    setApprovalComments('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.role === 'EMPLOYEE' ? 'My Submitted Service Requests' : 'Service Fulfillment Queue'}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredRequests.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Service Catalog Orders &bull; Multi-tier Approval Workflows &bull; Fulfillment SLAs
          </p>
        </div>

        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs transition-all"
        >
          <span>Request New Service</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by REQ-XXXX, item, or requester..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 w-full md:w-auto"
        >
          <option value="ALL">All Request Statuses</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved (Ready to Fulfill)</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Request Number</th>
                <th className="px-4 py-3">Catalog Service Item</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Approval State</th>
                <th className="px-4 py-3">Fulfillment Status</th>
                <th className="px-4 py-3">Target Delivery</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No service requests match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {req.requestNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{req.catalogItemName}</span>
                      <span className="text-[10px] text-slate-400">{req.assignmentGroup}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">{req.requesterName}</span>
                      <span className="text-[10px] text-slate-400">{req.requesterDepartment}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {req.approvalStatus === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending Manager
                        </span>
                      )}
                      {req.approvalStatus === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {req.approvalStatus === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                      {req.approvalStatus === 'NOT_REQUIRED' && (
                        <span className="text-[10px] font-medium text-slate-400">
                          Auto-Approved
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      <span className="font-medium block">
                        {new Date(req.expectedFulfillmentAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(req.expectedFulfillmentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                      >
                        Inspect
                      </button>

                      {/* Manager / Admin Approval Controls */}
                      {isManagerOrAdmin && req.approvalStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleOpenApproval(req, true)}
                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenApproval(req, false)}
                            className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Staff Fulfillment Transitions */}
                      {isStaff && req.approvalStatus !== 'PENDING' && req.status === 'APPROVED' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold"
                        >
                          Start
                        </button>
                      )}

                      {isStaff && req.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'FULFILLED')}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-2xs"
                        >
                          Fulfill
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Request Details Modal */}
      {selectedReq && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReq(null)}
          title={`Order: ${selectedReq.requestNumber} - ${selectedReq.catalogItemName}`}
          subtitle={`Requested by ${selectedReq.requesterName} (${selectedReq.requesterDepartment})`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Approval Decision</span>
                <span className="font-bold text-slate-800">{selectedReq.approvalStatus}</span>
                {selectedReq.approverName && (
                  <span className="text-[10px] text-slate-500 block">
                    By {selectedReq.approverName}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lifecycle Status</span>
                <StatusBadge status={selectedReq.status} />
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 block mb-1">Business Justification</span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedReq.justification}
              </p>
            </div>

            {selectedReq.approvalComments && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-950 block text-[11px]">Manager Decision Comments</span>
                <p className="text-amber-800 mt-0.5">{selectedReq.approvalComments}</p>
              </div>
            )}

            <div>
              <span className="font-bold text-slate-700 block mb-1">Configured Parameters</span>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {Object.entries(selectedReq.formData).map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2.5 bg-white">
                    <span className="font-semibold text-slate-600">{k}</span>
                    <span className="text-slate-900 font-mono">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                {isStaff && selectedReq.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateRequestStatus(selectedReq.id, 'IN_PROGRESS');
                      setSelectedReq(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
                  >
                    Start Fulfillment
                  </button>
                )}
                {isStaff && selectedReq.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateRequestStatus(selectedReq.id, 'FULFILLED');
                      setSelectedReq(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                  >
                    Mark as Fulfilled
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Approval Decision Modal */}
      {approvalModalReq && (
        <Modal
          isOpen={true}
          onClose={() => setApprovalModalReq(null)}
          title={`${isApproving ? 'Approve' : 'Reject'} Request: ${approvalModalReq.requestNumber}`}
          subtitle={`Item: ${approvalModalReq.catalogItemName} &bull; Requester: ${approvalModalReq.requesterName}`}
        >
          <form onSubmit={handleSubmitApproval} className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block">Requester Justification:</span>
              <p className="text-slate-600 italic">"{approvalModalReq.justification}"</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approval Decision Notes *
              </label>
              <textarea
                required
                rows={3}
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Specify budgetary authorization code, cost center, or rejection rationale..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setApprovalModalReq(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white font-bold shadow-xs ${
                  isApproving ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isApproving ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
