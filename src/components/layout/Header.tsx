import React, { useState } from 'react';
import { useServiceOps } from '../../context/ServiceOpsContext';
import { RoleBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  ShieldAlert,
  Server,
  UserCheck,
  RefreshCw,
  LogOut,
  ChevronDown,
  Layers,
  Bell,
  Code2,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture }) => {
  const { currentUser, switchRole, logout, resetToDemoData, metrics } = useServiceOps();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const rolesList: { role: UserRole; name: string; title: string; email: string }[] = [
    { role: 'EMPLOYEE', name: 'Rohith', title: 'Senior Product Designer', email: 'employee@serviceops.local' },
    { role: 'SERVICE_AGENT', name: 'Bunny', title: 'L2 Support Specialist', email: 'agent@serviceops.local' },
    { role: 'SERVICE_MANAGER', name: 'Sai', title: 'IT Service Desk Manager', email: 'manager@serviceops.local' },
    { role: 'ADMIN', name: 'Tagore', title: 'Enterprise Systems Admin', email: 'admin@serviceops.local' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-2.5">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-xs font-black tracking-tight text-lg">
            SO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                ServiceOps
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                IT Service Desk &amp; Operations
              </span>
            </div>
          </div>
        </div>

        {/* Center: Operational SLA Target Overview */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          {metrics.breachedSlaCount > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{metrics.breachedSlaCount} SLA Breached</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>SLA Target: {metrics.slaCompliancePercentage}% Met</span>
            </div>
          )}

          {metrics.criticalIncidents > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>{metrics.criticalIncidents} Critical P1 Open</span>
            </div>
          )}
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Architecture & Engineering Docs */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
            title="Inspect System Architecture, PostgreSQL Schema, and REST API Catalog"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">System Architecture</span>
          </button>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-white shadow-2xs"
              />
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <RoleBadge role={currentUser.role} className="text-[10px] py-0" />
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  {currentUser.department}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800">
                <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Active Persona
                  </span>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      setResetModalOpen(true);
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                    title="Reset to default seed data"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Reset Data</span>
                  </button>
                </div>
                <div className="py-1">
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors ${
                        currentUser.role === r.role ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 mt-0.5 ${
                          currentUser.role === r.role ? 'text-indigo-600' : 'text-slate-300'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{r.name}</span>
                          <RoleBadge role={r.role} className="text-[9px] py-0" />
                        </div>
                        <span className="text-[11px] text-slate-500 block">{r.title}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{r.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Department: {currentUser.department}</span>
                  <button
                    onClick={() => {
                      logout();
                      setRoleMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
              This action will reset all active incidents, service requests, change requests, problems, and configuration records back to their baseline seed values. Any modifications made in this session will be replaced.
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
    </header>
  );
};
