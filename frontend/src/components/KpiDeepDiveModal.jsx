import React from 'react';
import { 
  X, 
  Boxes, 
  Clock, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Truck, 
  Building2,
  ExternalLink,
  Filter
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function KpiDeepDiveModal({ 
  activeKpiId, 
  onClose, 
  kpi, 
  zones, 
  shipments, 
  fleetTrips, 
  alerts, 
  onFilterAndNavigate 
}) {
  if (!activeKpiId) return null;

  const getKpiDetails = () => {
    switch (activeKpiId) {
      case 'throughput':
        return {
          title: 'Daily TEU Throughput & Cargo Velocity',
          termKey: 'TEU',
          icon: Boxes,
          color: 'blue',
          headline: `${kpi?.totalTeuThroughput || 464} Total TEUs Handled Today`,
          summary: 'Aggregate freight intake and dispatch across Masaka Inland Port container gantries and railway siding.',
          targetSectionId: 'customs-matrix',
          filterPayload: { channel: '', stage: '', quickTab: 'ALL' },
          filterLabel: 'All Active Shipments',
          breakdowns: [
            { label: 'Inbound Ingest', value: `${kpi?.dailyTeuInbound || 246} TEUs`, desc: 'Maritime corridors (Dar es Salaam / Mombasa)' },
            { label: 'Outbound Dispatch', value: `${kpi?.dailyTeuOutbound || 218} TEUs`, desc: 'Kigali commercial distribution & export tea/minerals' },
            { label: 'Gate-In Velocity', value: '18.2 TEU/hr', desc: 'Peak intake between 07:00 – 11:30' },
            { label: 'Shipping Line Split', value: '5 Carriers', desc: 'Maersk (38%), MSC (28%), CMA CGM (18%), PIL (10%), Hapag (6%)' }
          ]
        };

      case 'tat':
        return {
          title: 'Truck Turnaround Time (TAT) Telematics',
          termKey: 'TAT',
          icon: Clock,
          color: 'emerald',
          headline: `${kpi?.avgTruckTurnaroundMins || 42.4} Mins Average Gate-to-Gate`,
          summary: 'Total vehicle transit duration from Masaka inbound weighbridge to cargo discharge and outbound gate pass clearance (Target: Under 45 mins).',
          targetSectionId: 'fleet-radar',
          filterPayload: { stage: 'CORRIDOR_TRANSIT', quickTab: 'TRANSIT' },
          filterLabel: 'In-Transit Corridor Fleet',
          breakdowns: [
            { label: 'Inbound Scales & Gate-In', value: '6.2 mins', desc: 'RFID badge & biometric driver check' },
            { label: 'CFS & Yard Destuffing', value: '18.4 mins', desc: 'Crane and forklift offload staging' },
            { label: 'Customs & Physical Check', value: '13.8 mins', desc: 'RRA single-window seal inspection' },
            { label: 'Outbound Gate Exit', value: '4.0 mins', desc: 'Automated barcode gate pass check' }
          ]
        };

      case 'yard':
        return {
          title: 'Dry Port Yard Capacity & Zone Density',
          termKey: 'TEU',
          icon: Layers,
          color: 'amber',
          headline: `${kpi?.overallYardUtilizationPct || 75}% Overall Yard Utilization`,
          summary: 'Storage density across 6 specialized warehousing zones. 1,211 TEU slots remain available for intake.',
          targetSectionId: 'zone-matrix',
          filterPayload: { stage: 'WAREHOUSE_STORED', quickTab: 'STORED' },
          filterLabel: 'Warehouse Stored Units',
          breakdowns: zones?.map(z => ({
            label: z.zoneName,
            value: `${z.utilizationPercentage}% (${z.currentOccupancyTeu}/${z.totalCapacityTeu} TEU)`,
            desc: `${z.totalCapacityTeu - z.currentOccupancyTeu} slots remaining • Sup: ${z.supervisorName}`
          })) || []
        };

      case 'customs':
        return {
          title: 'RRA Single Customs Territory (SCT) Clearance Rate',
          termKey: 'SCT',
          icon: ShieldCheck,
          color: 'emerald',
          headline: `${kpi?.customsClearanceRatePct || 94.1}% Clearance Compliance Rate`,
          summary: 'Real-time routing breakdown under Rwanda Revenue Authority Single Customs Territory protocol.',
          targetSectionId: 'customs-matrix',
          filterPayload: { channel: 'RED', quickTab: 'ACTION_REQUIRED' },
          filterLabel: 'Red Channel Scan Queue',
          breakdowns: [
            { label: 'Green Channel (Fast-Track)', value: `${kpi?.customsChannelCounts?.GREEN || 11} Units (52%)`, desc: 'Zero-inspection instant release' },
            { label: 'Yellow Channel (Doc Audit)', value: `${kpi?.customsChannelCounts?.YELLOW || 5} Units (24%)`, desc: 'Commercial invoice & packing list review' },
            { label: 'Red Channel (Physical Scan)', value: `${kpi?.customsChannelCounts?.RED || 7} Units (18%)`, desc: 'Inspection bay scanner queue' },
            { label: 'Blue Channel (AEO Post-Audit)', value: `${kpi?.customsChannelCounts?.BLUE || 2} Units (6%)`, desc: 'Trusted trader immediate release' }
          ]
        };

      case 'bottlenecks':
        return {
          title: 'Active Terminal Bottlenecks & Incident Resolution',
          termKey: 'OSBP',
          icon: AlertTriangle,
          color: 'rose',
          headline: `${alerts?.filter(a => a.status === 'ACTIVE').length || 0} Active Operational Incidents`,
          summary: 'High-priority logistical bottlenecks requiring shift manager coordination and field intervention.',
          targetSectionId: 'bottlenecks-center',
          filterPayload: { stage: 'INSPECTION_BAY', quickTab: 'ACTION_REQUIRED' },
          filterLabel: 'Inspection Bay Disruptions',
          breakdowns: alerts?.filter(a => a.status === 'ACTIVE').map(a => ({
            label: a.title,
            value: `${a.severity} PRIORITY`,
            desc: `${a.affectedZoneOrCorridor} — ${a.suggestedAction}`
          })) || []
        };

      default:
        return null;
    }
  };

  const details = getKpiDetails();
  if (!details) return null;

  const Icon = details.icon;

  const handleActionClick = () => {
    if (onFilterAndNavigate) {
      onFilterAndNavigate(details.filterPayload, details.targetSectionId, details.filterLabel);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-[#002D56] text-white flex items-center justify-between border-b border-[#001D38]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#004B87] border border-blue-400/30 flex items-center justify-center text-white shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {details.title}
                </h3>
                {details.termKey && (
                  <LogisticsTermTooltip termKey={details.termKey}>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20 uppercase font-mono">
                      {details.termKey}
                    </span>
                  </LogisticsTermTooltip>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                DP World Kigali Operational Intelligence Deep-Dive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 bg-white">
          
          {/* Main Headline Banner */}
          <div className="p-4 rounded-md bg-[#F8FAFC] border border-slate-200">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metric Status</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Telemetry
              </span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 font-mono">
              {details.headline}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {details.summary}
            </p>
          </div>

          {/* Granular Telemetry Breakdown Grid */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#004B87]" />
              <span>Operational Sub-Metrics & Breakdown</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {details.breakdowns.map((item, idx) => (
                <div key={idx} className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-[#004B87] font-mono mt-0.5 block">
                      {item.value}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block leading-snug">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer with Action & Redirection Trigger */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleActionClick}
            className="px-4 py-2 rounded-md bg-[#004B87] hover:bg-[#003B6D] text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Manifest to "{details.filterLabel}" & Jump to Section &darr;</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
