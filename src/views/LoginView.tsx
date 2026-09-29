import React, { useState } from 'react';
import { useServiceOps } from '../context/ServiceOpsContext';
import { RoleBadge } from '../components/common/Badge';
import { UserRole, User } from '../types';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { users, loginAs, loginWithEmail } = useServiceOps();

  const [email, setEmail] = useState('agent@serviceops.local');
  const [password, setPassword] = useState('Demo123!');
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    const success = loginWithEmail(email.trim());
    if (success) {
      setErrorMessage('');
      onSuccess();
    } else {
      setErrorMessage('Invalid credentials. Please select one of the pre-configured demo personas below.');
    }
  };

  const handleQuickLogin = (user: User) => {
    loginAs(user);
    setErrorMessage('');
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-2xl shadow-lg">
          SO
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          ServiceOps ITSM
        </h2>
        <p className="text-xs text-slate-400">
          ITIL Service Management &amp; Enterprise Support Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-6">
          {/* Quick Demo Sign-In Personas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Role Login (Demo Personas)
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                Password: Demo123!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group"
                >
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                        {u.name}
                      </span>
                      <RoleBadge role={u.role} className="text-[9px] py-0" />
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {u.team || u.department}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {u.email}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or sign in manually</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <span>Authenticate with JWT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
