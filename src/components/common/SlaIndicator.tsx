import React, { useState, useEffect } from 'react';
import { SlaTracking } from '../../types';
import { SlaBadge } from './Badge';
import { Clock, AlertTriangle, CheckCircle2, PauseCircle } from 'lucide-react';

interface SlaIndicatorProps {
  sla: SlaTracking;
  compact?: boolean;
}

export const SlaIndicator: React.FC<SlaIndicatorProps> = ({ sla, compact = false }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const resolutionDeadline = new Date(sla.resolutionDeadline).getTime();
  const diffMinutes = Math.round((resolutionDeadline - now) / 60000);
  const isBreached = sla.resolutionBreached || diffMinutes < 0;

  const formatRemaining = (minutes: number) => {
    if (minutes < 0) {
      const positive = Math.abs(minutes);
      const hrs = Math.floor(positive / 60);
      const mins = positive % 60;
      return `Breached by ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
    }
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 24) {
      const days = Math.floor(hrs / 24);
      return `${days}d ${hrs % 24}h remaining`;
    }
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m remaining`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <SlaBadge status={sla.status} breached={isBreached} />
        <span className={`${isBreached ? 'text-rose-600 font-bold' : diffMinutes < 60 ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
          {formatRemaining(diffMinutes)}
        </span>
      </div>
    );
  }

  // Expanded SLA Card for Detail View
  const targetTotal = sla.resolutionTargetMinutes;
  const elapsed = sla.resolutionElapsedMinutes;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / targetTotal) * 100)));

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {sla.slaPolicyName}
          </span>
        </div>
        <SlaBadge status={sla.status} breached={isBreached} />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Resolution Progress ({elapsed}m / {targetTotal}m)</span>
          <span className={`font-semibold ${isBreached ? 'text-rose-600' : 'text-slate-700'}`}>
            {formatRemaining(diffMinutes)}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBreached
                ? 'bg-rose-500'
                : sla.status === 'AT_RISK'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 text-slate-600">
        <div>
          <span className="text-slate-400 block">Response Target</span>
          <span className="font-semibold text-slate-700">
            {sla.responseTargetMinutes}m{' '}
            {sla.firstResponseAt ? (
              <span className="text-emerald-600 font-normal">
                (Met in {sla.responseElapsedMinutes}m)
              </span>
            ) : sla.responseBreached ? (
              <span className="text-rose-600 font-bold">(Breached)</span>
            ) : (
              <span className="text-slate-500 font-normal">(Pending)</span>
            )}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">Resolution Target</span>
          <span className="font-semibold text-slate-700">
            {sla.resolutionTargetMinutes >= 60
              ? `${sla.resolutionTargetMinutes / 60}h`
              : `${sla.resolutionTargetMinutes}m`}{' '}
            {sla.resolvedAt ? (
              <span className="text-emerald-600 font-normal">(Resolved)</span>
            ) : isBreached ? (
              <span className="text-rose-600 font-bold">(Overdue)</span>
            ) : (
              <span className="text-slate-500 font-normal">(Active)</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
