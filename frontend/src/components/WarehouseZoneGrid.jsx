import React from 'react';
import { 
  Building2, 
  Snowflake, 
  User,
  ArrowRight,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function WarehouseZoneGrid({ 
  zones, 
  onSelectZone, 
  selectedZoneCode,
  onTriggerAction 
}) {
  if (!zones || zones.length === 0) {
    return (
      <div className="bg-white border border-slate-200 p-5 rounded-md animate-pulse shadow-xs">
        <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  const getZoneBadge = (type) => {
    switch (type) {
      case 'BONDED':
        return { label: 'Customs Bonded', termKey: 'BONDED', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'COLD_CHAIN':
        return { label: 'Cold Chain Pharma', termKey: 'REEFER', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'HAZMAT':
        return { label: 'DG / Heavy Goods', termKey: 'FCL', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'EMPTY_YARD':
        return { label: 'Empty Yard Storage', termKey: 'TEU', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'CFS':
        return { label: 'Export CFS Staging', termKey: 'CFS', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Non-Bonded FMCG', termKey: 'FCL', color: 'bg-blue-50 text-blue-800 border-blue-200' };
    }
  };

  const getStatusInfo = (status, util) => {
    if (status === 'CONGESTED' || util > 88) {
      return {
        label: 'Action Required',
        trafficLight: 'bg-rose-50 text-rose-800 border-rose-200',
        barColor: 'bg-rose-600',
        actionLabel: 'View Overflow Staging',
        actionType: 'OVERFLOW_REQUEST'
      };
    }
    if (status === 'NEAR_CAPACITY' || util > 78) {
      return {
        label: 'Near Capacity',
        trafficLight: 'bg-amber-50 text-amber-800 border-amber-200',
        barColor: 'bg-amber-500',
        actionLabel: 'Check Dispatch Schedule',
        actionType: 'DISPATCH_CHECK'
      };
    }
    return {
      label: 'Optimal Intake',
      trafficLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      barColor: 'bg-[#004B87]',
      actionLabel: 'Inspect Bay Allocation',
      actionType: 'BAY_INSPECT'
    };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#004B87]" />
            <span>Masaka Dry Port — Storage & Yard Zone Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time TEU density, free space counters, and cold-chain environmental sensors
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedZoneCode && (
            <button
              onClick={() => onSelectZone(null)}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#004B87] text-white hover:bg-[#003B6D] transition shadow-xs"
            >
              Showing Zone: {selectedZoneCode} (Click to Reset &times;)
            </button>
          )}
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            Click any zone card to filter the manifest table
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {zones.map((zone) => {
          const badge = getZoneBadge(zone.zoneType);
          const isSelected = selectedZoneCode === zone.zoneCode;
          const util = zone.utilizationPercentage || Math.round((zone.currentOccupancyTeu / zone.totalCapacityTeu) * 100) || 0;
          const statusInfo = getStatusInfo(zone.status, util);
          const slotsRemaining = Math.max(0, zone.totalCapacityTeu - zone.currentOccupancyTeu);

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(isSelected ? null : zone.zoneCode)}
              className={`p-4 rounded-md border transition cursor-pointer relative flex flex-col justify-between text-left group ${
                isSelected 
                  ? 'bg-blue-50/70 border-[#004B87] ring-2 ring-[#004B87]/30 shadow-sm' 
                  : 'bg-[#F8FAFC] border-slate-200 hover:border-[#004B87] hover:bg-slate-50'
              }`}
            >
              {/* Top Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#004B87]">
                        {zone.zoneCode}
                      </span>
                      <LogisticsTermTooltip termKey={badge.termKey}>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </LogisticsTermTooltip>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {zone.zoneName}
                    </h3>
                  </div>

                  {/* Status Indicator */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusInfo.trafficLight}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Plain-Language Capacity Metric & Progress Bar */}
                <div className="my-2.5">
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 text-[11px] font-sans">
                      <strong>{util}% Full</strong> — {slotsRemaining} TEU slots free
                    </span>
                    <span className="text-slate-900 font-bold text-xs font-mono">
                      {zone.currentOccupancyTeu} / {zone.totalCapacityTeu} TEU
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${statusInfo.barColor}`}
                      style={{ width: `${Math.min(100, util)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Telemetry Details */}
                <div className="flex items-center justify-between text-xs py-1.5 text-slate-500">
                  {zone.temperatureCelsius !== null && zone.temperatureCelsius !== undefined ? (
                    <div className="flex items-center gap-1 text-cyan-800 font-mono font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 text-[11px]">
                      <Snowflake className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                      <span>{zone.temperatureCelsius > 0 ? `+${zone.temperatureCelsius}` : zone.temperatureCelsius}°C</span>
                      <span className="text-[10px] text-cyan-700 font-normal">({zone.targetTempMin}° to {zone.targetTempMax}°)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{zone.totalCapacitySqm?.toLocaleString()} m² footprint</span>
                    </div>
                  )}

                  {zone.supervisorName && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[130px]">{zone.supervisorName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Trigger Button & Drill-down Link */}
              <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTriggerAction) {
                      onTriggerAction(statusInfo.actionType, {
                        zoneCode: zone.zoneCode,
                        zoneName: zone.zoneName,
                        supervisor: zone.supervisorName,
                        utilization: util
                      });
                    }
                  }}
                  className="text-[10px] font-semibold text-slate-700 hover:text-[#004B87] bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded transition shadow-2xs"
                >
                  {statusInfo.actionLabel}
                </button>

                <span className="text-[11px] font-semibold text-[#004B87] flex items-center gap-0.5 group-hover:underline">
                  <span>{isSelected ? 'Selected' : 'Filter Shipments'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}


