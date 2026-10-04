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
  AlertCircle,
  Database,
  CheckCircle2
} from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const {
    users,
    loginAs,
    loginWithEmail,
    loginWithGoogle
  } = useServiceOps();

  const [activeTab, setActiveTab] = useState<'personas' | 'standard'>('personas');
  const [email, setEmail] = useState('agent@serviceops.local');
  const [password, setPassword] = useState('Demo123!');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setErrorMessage('Invalid credentials. Please select one of the pre-configured demo personas or sign in with Google.');
    }
  };

  const handleQuickLogin = (user: User) => {
    loginAs(user);
    setErrorMessage('');
    onSuccess();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        onSuccess();
      } else {
        setErrorMessage('Google Authentication was cancelled or could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
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
          ITIL Service Management Platform &bull; Cloud SQL Database Connected
        </p>

        {/* Database Badge */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Database className="w-3 h-3" />
            Cloud SQL (PostgreSQL) Active
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200 space-y-5">
          
          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 font-medium text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google (Employee SSO)</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or choose persona</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('personas')}
              className={`py-1.5 px-2 rounded-md transition-all ${
                activeTab === 'personas'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demo Personas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`py-1.5 px-2 rounded-md transition-all ${
                activeTab === 'standard'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corporate Email Login
            </button>
          </div>

          {/* TAB 1: Demo Personas */}
          {activeTab === 'personas' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Employee / Agent Persona
                </span>
                <span className="text-[11px] text-slate-400">
                  Instant Access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {users.slice(0, 4).map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 text-left transition-all group"
                  >
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                          {u.name}
                        </span>
                        <RoleBadge role={u.role} className="text-[9px] py-0" />
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
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
          )}

          {/* TAB 2: Standard Corporate Login */}
          {activeTab === 'standard' && (
            <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Deployment & Info Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ITIL v4 &amp; SOC2 Compliant
            </span>
            <span>Vercel Deployable SPA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
