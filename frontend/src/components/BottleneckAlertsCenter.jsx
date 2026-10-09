import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock,
  Send,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function BottleneckAlertsCenter({ 
  alerts, 
  onResolveAlert, 
  resolvingId,
  onTriggerAction 
}) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">All Terminals & Corridors Clear</h3>
            <p className="text-xs text-emerald-700">Zero active critical operational bottlenecks reported across Masaka Hub and transit corridors.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
          Status: Optimal
        </span>
      </div>
    );
  }

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          label: 'Critical — Immediate Action Required',
          style: 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
        };
      case 'HIGH':
        return {
          label: 'High Risk — Priority Resolution',
          style: 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
        };
      case 'MEDIUM':
        return {
          label: 'Warning — Monitor Closely',
          style: 'bg-yellow-50 text-yellow-800 border-yellow-200 font-medium'
        };
      default:
        return {
          label: 'Operational Notice',
          style: 'bg-blue-50 text-blue-800 border-blue-200 font-medium'
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Operational Bottlenecks & Incident Resolution
            </h2>
            <p className="text-xs text-slate-500">
              Active disruptions requiring shift supervisor intervention, RRA coordination, and tactical mitigation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            {alerts.length} Active Incident{alerts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const sevInfo = getSeverityBadge(alert.severity);

          return (
            <div
              key={alert.id}
              className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${sevInfo.style}`}>
                    {sevInfo.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.affectedZoneOrCorridor}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • Logged {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 mb-1">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                  {alert.description}
                </p>

                {alert.suggestedAction && (
                  <div className="text-xs text-amber-900 bg-amber-50/90 p-2.5 rounded-md border border-amber-200/90 flex items-start gap-2">
                    <strong className="text-amber-800 shrink-0">Recommended Action:</strong>
                    <span>{alert.suggestedAction}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onTriggerAction) {
                      onTriggerAction('NOTIFY_SHIFT_TEAM', {
                        title: alert.title,
                        location: alert.affectedZoneOrCorridor,
                        severity: alert.severity
                      });
                    }
                  }}
                  className="w-full sm:w-auto lg:w-44 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-[#004B87] text-xs font-semibold border border-slate-300 transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Notify Shift Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => onResolveAlert(alert.id)}
                  disabled={resolvingId === alert.id}
                  className="w-full sm:w-auto lg:w-44 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>{resolvingId === alert.id ? 'Resolving...' : 'Resolve Incident'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
