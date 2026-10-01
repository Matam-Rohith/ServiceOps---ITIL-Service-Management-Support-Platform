import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { RoleBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SlaPolicy, PriorityLevel } from '../types';
import {
  Settings,
  Users,
  Clock,
  ShieldCheck,
  RefreshCw,
  Edit2,
  CheckCircle,
  Database,
  Server,
  AlertTriangle
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    users,
    slaPolicies,
    updateSlaPolicy,
    resetToDemoData,
    incidents,
    serviceRequests,
    assets
  } = useServiceOps();

  const [editingPolicy, setEditingPolicy] = useState<SlaPolicy | null>(null);
  const [responseMins, setResponseMins] = useState(15);
  const [resolutionMins, setResolutionMins] = useState(240);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleEditPolicy = (p: SlaPolicy) => {
    setEditingPolicy(p);
    setResponseMins(p.responseMinutes);
    setResolutionMins(p.resolutionMinutes);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;

    updateSlaPolicy(editingPolicy.priority, {
      responseMinutes: Number(responseMins),
      resolutionMinutes: Number(resolutionMins)
    });
    setEditingPolicy(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          System Administration &amp; ITIL SLA Policies
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system users, authoritative SLA targets, and database configuration
        </p>
      </div>

      {/* SLA Policy Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Authoritative SLA Policies &amp; Targets (Service Level Agreements)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Background calculation engine evaluates tickets against these rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Policy Name</th>
                <th className="px-4 py-3">Response Target</th>
                <th className="px-4 py-3">Resolution Target</th>
                <th className="px-4 py-3">Operating Window</th>
                <th className="px-4 py-3">Active Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {slaPolicies.map(p => (
                <tr key={p.priority} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-bold font-mono text-indigo-600">
                    {p.priority}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {p.responseMinutes} minutes
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {p.resolutionMinutes >= 60 ? `${p.resolutionMinutes / 60} hours (${p.resolutionMinutes}m)` : `${p.resolutionMinutes} minutes`}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {p.businessHoursOnly ? '8:00 AM - 6:00 PM Business Hours' : '24x7x365 Continuous'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleEditPolicy(p)}
                      className="flex items-center gap-1 ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Configure</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Users &amp; Role-Based Access Control (RBAC)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Demo credentials: Password is <strong>Demo123!</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email (Login)</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assignment Group / Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border"
                    />
                    <span className="font-bold text-slate-900">{u.name}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">
                    {u.email}
                  </td>
                  <td className="px-4 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {u.department}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {u.team || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Diagnostics & Storage Maintenance */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          System Diagnostics &amp; Local Persistence State
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Database Incident Records</span>
            <span className="text-lg font-bold text-slate-800">{incidents.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Service Request Orders</span>
            <span className="text-lg font-bold text-slate-800">{serviceRequests.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">CMDB Configuration Items</span>
            <span className="text-lg font-bold text-slate-800">{assets.length}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[11px]">SLA Calculation Engine</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5 mt-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Active (10s intervals)
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Restore system state to initial verified dataset
          </span>
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Demo Data"
        subtitle="Restore system state to initial seed records"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This action will reset all active incidents, service requests, change requests, problems, and configuration records back to their baseline seed values.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetToDemoData();
                setResetModalOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Policy Modal */}
      {editingPolicy && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPolicy(null)}
          title={`Configure SLA Target: ${editingPolicy.name}`}
          subtitle={`Priority Level: ${editingPolicy.priority}`}
        >
          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Response Target (Minutes)
              </label>
              <input
                type="number"
                required
                min={1}
                value={responseMins}
                onChange={(e) => setResponseMins(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Time until ticket must be acknowledged and moved out of NEW status.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resolution Target (Minutes)
              </label>
              <input
                type="number"
                required
                min={1}
                value={resolutionMins}
                onChange={(e) => setResolutionMins(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Equivalent to {(resolutionMins / 60).toFixed(1)} hours.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingPolicy(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Save SLA Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
