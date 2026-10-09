import React from 'react';
import { 
  Boxes, 
  Clock, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function MacroKpiStrip({ kpi, loading, onQuickFilter }) {
  if (loading || !kpi) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-md animate-pulse h-32 flex flex-col justify-between shadow-xs">
            <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
            <div className="h-7 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const freeYardTeu = Math.max(0, 4870 - (kpi.currentYardTeu || 3260));

  const cards = [
    {
      id: 'throughput',
      title: 'Daily Throughput',
      termKey: 'TEU',
      termLabel: 'TEU',
      value: kpi.totalTeuThroughput?.toLocaleString() || '0',
      unit: 'TEUs',
      plainContext: `${kpi.dailyTeuInbound || 0} Inbound • ${kpi.dailyTeuOutbound || 0} Outbound`,
      actionHint: 'View all active shipments',
      filterAction: () => onQuickFilter && onQuickFilter({ channel: '', stage: '', quickTab: 'ALL' }),
      icon: Boxes,
      color: 'blue',
      badge: 'Flow: Optimal (On Schedule)',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'tat',
      title: 'Truck Turnaround',
      termKey: 'TAT',
      termLabel: 'TAT',
      value: kpi.avgTruckTurnaroundMins ? `${kpi.avgTruckTurnaroundMins}` : '--',
      unit: 'mins',
      plainContext: `Average truck departs in ${kpi.avgTruckTurnaroundMins || 42}m (SLA < 45m)`,
      actionHint: 'Inspect fleet corridor transit',
      filterAction: () => onQuickFilter && onQuickFilter({ stage: 'CORRIDOR_TRANSIT', quickTab: 'TRANSIT' }),
      icon: Clock,
      color: kpi.isTurnaroundOnTarget ? 'emerald' : 'amber',
      badge: kpi.isTurnaroundOnTarget ? 'Target Met (<45m)' : 'Attention: SLA Delay',
      badgeStyle: kpi.isTurnaroundOnTarget ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'yard',
      title: 'Yard Capacity Density',
      termKey: 'TEU',
      termLabel: 'Yard TEU',
      value: `${kpi.overallYardUtilizationPct || 0}%`,
      unit: 'occupied',
      plainContext: `${freeYardTeu.toLocaleString()} TEU slots available for intake`,
      actionHint: 'Filter to warehouse stored cargo',
      filterAction: () => onQuickFilter && onQuickFilter({ stage: 'WAREHOUSE_STORED', quickTab: 'STORED' }),
      icon: Layers,
      color: (kpi.overallYardUtilizationPct || 0) > 80 ? 'amber' : 'blue',
      badge: (kpi.overallYardUtilizationPct || 0) > 85 ? 'Heavy Density' : (kpi.overallYardUtilizationPct || 0) > 75 ? 'Moderate Density' : 'Optimal Capacity',
      badgeStyle: (kpi.overallYardUtilizationPct || 0) > 85 ? 'bg-rose-50 text-rose-800 border-rose-200' : (kpi.overallYardUtilizationPct || 0) > 75 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
      progress: kpi.overallYardUtilizationPct || 0,
    },
    {
      id: 'customs',
      title: 'RRA Customs Clearance',
      termKey: 'SCT',
      termLabel: 'SCT',
      value: `${kpi.customsClearanceRatePct || 0}%`,
      unit: 'cleared',
      plainContext: `${(kpi.customsChannelCounts?.GREEN || 0) + (kpi.customsChannelCounts?.BLUE || 0)} Fast-track • ${kpi.customsChannelCounts?.RED || 0} In Inspection`,
      actionHint: 'Filter to Red Channel scans',
      filterAction: () => onQuickFilter && onQuickFilter({ channel: 'RED', quickTab: 'ACTION_REQUIRED' }),
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'SCT Fast-Track Active',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'bottlenecks',
      title: 'Active Bottlenecks',
      termKey: 'OSBP',
      termLabel: 'Bottlenecks',
      value: kpi.activeBottlenecksCount?.toString() || '0',
      unit: 'issues',
      plainContext: `${kpi.criticalAlertsCount || 0} Priority issues require attention`,
      actionHint: 'Filter to delayed cargo',
      filterAction: () => onQuickFilter && onQuickFilter({ stage: 'INSPECTION_BAY', quickTab: 'ACTION_REQUIRED' }),
      icon: AlertTriangle,
      color: kpi.activeBottlenecksCount > 0 ? 'rose' : 'emerald',
      badge: kpi.activeBottlenecksCount > 0 ? 'Action Required' : 'All Terminals Clear',
      badgeStyle: kpi.activeBottlenecksCount > 0 ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id} 
            onClick={card.filterAction}
            role="button"
            tabIndex={0}
            title={`Click to filter table: ${card.actionHint}`}
            className="bg-white border border-slate-200 hover:border-[#004B87] hover:shadow-md p-4 rounded-md relative flex flex-col justify-between shadow-xs transition group cursor-pointer text-left"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-600 tracking-wider uppercase flex items-center gap-1">
                  <span>{card.title}</span>
                  {card.termKey && (
                    <LogisticsTermTooltip termKey={card.termKey}>
                      <span className="text-[10px] text-slate-400 font-mono">({card.termLabel})</span>
                    </LogisticsTermTooltip>
                  )}
                </span>
                <div className={`p-1.5 rounded-md ${
                  card.color === 'blue' ? 'bg-blue-50 text-[#004B87]' :
                  card.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                  card.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                  'bg-rose-50 text-rose-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Value Counter */}
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                  {card.value}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {card.unit}
                </span>
              </div>

              {/* Progress bar if present */}
              {card.progress !== undefined && (
                <div className="w-full bg-slate-100 rounded-full h-1.5 my-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      card.progress > 85 ? 'bg-rose-600' : card.progress > 75 ? 'bg-amber-500' : 'bg-[#004B87]'
                    }`}
                    style={{ width: `${Math.min(100, card.progress)}%` }}
                  ></div>
                </div>
              )}

              {/* Plain English context explanation */}
              <p className="text-[11px] text-slate-600 font-normal leading-tight mt-1">
                {card.plainContext}
              </p>
            </div>

            {/* Bottom Status & Drill-Down Trigger */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mt-2.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${card.badgeStyle}`}>
                {card.badge}
              </span>
              <span className="text-[11px] text-[#004B87] font-semibold flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition">
                <span>Filter</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}


