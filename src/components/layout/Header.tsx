import React, { useState } from 'react';
import { useServiceOps } from '../../context/ServiceOpsContext';
import { RoleBadge } from '../common/Badge';
import {
  ShieldAlert,
  Server,
  UserCheck,
  RefreshCw,
  LogOut,
  ChevronDown,
  Layers,
  Bell,
  Code2
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenArchitecture }) => {
  const { currentUser, switchRole, logout, resetToDemoData, metrics } = useServiceOps();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

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
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                ITIL v4 Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Enterprise IT Service Management Platform
            </p>
          </div>
        </div>

        {/* Center: Operational SLA Alert Pills */}
        <div className="hidden lg:flex items-center gap-3">
          {metrics.breachedSlaCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>{metrics.breachedSlaCount} SLA Breached</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SLA Target: {metrics.slaCompliancePercentage}% Met</span>
            </div>
          )}

          {metrics.criticalIncidents > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>{metrics.criticalIncidents} Critical P1 Active</span>
            </div>
          )}
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Architecture & API Docs Explorer Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
            title="Inspect Spring Boot Architecture, DB ERD, and REST API Catalog"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Architecture &amp; Docs</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset state to initial realistic ITIL demo dataset?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Reset dataset to default demo state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Data</span>
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
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Switch Active User Role (Demo)
                  </span>
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
                  <span className="text-slate-400 text-[11px]">Password: Demo123!</span>
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
    </header>
  );
};
