import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  Box, 
  Eye,
  FileCheck,
  Send,
  Printer,
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function CustomsClearanceMatrix({ 
  shipments, 
  channelCounts, 
  loading,
  selectedChannel,
  onSelectChannel,
  searchTerm,
  onSearchChange,
  selectedStage,
  onSelectStage,
  selectedZoneCode,
  onResetZone,
  selectedCorridor,
  onResetCorridor,
  quickTab,
  onSelectQuickTab,
  onResetAllFilters,
  onSelectShipment,
  onTriggerAction
}) {
  const channels = [
    { key: '', label: 'All Channels', count: null, termKey: null, baseColor: 'bg-slate-100 text-slate-700 border-slate-300', activeColor: 'bg-[#002D56] text-white border-[#002D56]' },
    { key: 'GREEN', label: 'Green (Fast-Track)', count: channelCounts?.GREEN || 0, termKey: 'GREEN CHANNEL', baseColor: 'bg-emerald-50 text-emerald-800 border-emerald-200', activeColor: 'bg-emerald-700 text-white border-emerald-700' },
    { key: 'YELLOW', label: 'Yellow (Doc Audit)', count: channelCounts?.YELLOW || 0, termKey: 'YELLOW CHANNEL', baseColor: 'bg-amber-50 text-amber-800 border-amber-200', activeColor: 'bg-amber-700 text-white border-amber-700' },
    { key: 'RED', label: 'Red (Physical Scan)', count: channelCounts?.RED || 0, termKey: 'RED CHANNEL', baseColor: 'bg-rose-50 text-rose-800 border-rose-200', activeColor: 'bg-rose-700 text-white border-rose-700' },
    { key: 'BLUE', label: 'Blue (AEO Trusted)', count: channelCounts?.BLUE || 0, termKey: 'BLUE CHANNEL', baseColor: 'bg-blue-50 text-blue-800 border-blue-200', activeColor: 'bg-[#004B87] text-white border-[#004B87]' },
  ];

  const quickTabs = [
    { key: 'ALL', label: 'All Shipments' },
    { key: 'ACTION_REQUIRED', label: 'Action Required (Red Channel / Inspection)', icon: AlertTriangle },
    { key: 'DWELL_ALERT', label: 'Dwell Alert (>24h)', icon: Clock },
    { key: 'TRANSIT', label: 'In Corridor Transit' },
    { key: 'STORED', label: 'Warehouse Stored' },
  ];

  const stages = [
    { key: '', label: 'All Operational Stages' },
    { key: 'CORRIDOR_TRANSIT', label: 'In Corridor Transit' },
    { key: 'BORDER_CROSSING', label: 'At Border Crossing (OSBP)' },
    { key: 'YARD_GATE_IN', label: 'Yard Gate-In' },
    { key: 'INSPECTION_BAY', label: 'Inspection Bay' },
    { key: 'WAREHOUSE_STORED', label: 'Warehouse Stored' },
    { key: 'GATE_OUT_DELIVERED', label: 'Gate-Out Delivered' },
  ];

  const getChannelBadge = (ch) => {
    switch (ch) {
      case 'GREEN': return { text: 'Green (Fast-Track Released)', style: 'bg-emerald-50 text-emerald-800 border-emerald-200', term: 'GREEN CHANNEL' };
      case 'YELLOW': return { text: 'Yellow (Doc Audit)', style: 'bg-amber-50 text-amber-800 border-amber-200', term: 'YELLOW CHANNEL' };
      case 'RED': return { text: 'Red (Scan & Physical)', style: 'bg-rose-50 text-rose-800 border-rose-200 font-bold', term: 'RED CHANNEL' };
      case 'BLUE': return { text: 'Blue (AEO Post-Audit)', style: 'bg-blue-50 text-blue-800 border-blue-200', term: 'BLUE CHANNEL' };
      default: return { text: ch || 'Standard', style: 'bg-slate-100 text-slate-700 border-slate-200', term: 'SCT' };
    }
  };

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'INSPECTION_BAY': return { text: 'Inspection Bay', style: 'bg-rose-50 text-rose-800 border-rose-200 font-bold' };
      case 'WAREHOUSE_STORED': return { text: 'Warehouse Stored', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'YARD_GATE_IN': return { text: 'Yard Gate-In', style: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'BORDER_CROSSING': return { text: 'Border OSBP', style: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'CORRIDOR_TRANSIT': return { text: 'Corridor Transit', style: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default: return { text: stage?.replace(/_/g, ' ') || 'Active', style: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const hasActiveFilters = Boolean(
    selectedChannel || 
    selectedStage || 
    selectedZoneCode || 
    selectedCorridor || 
    searchTerm || 
    (quickTab && quickTab !== 'ALL')
  );

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      
      {/* Title & Top Channel Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RRA Customs Clearance Matrix & Shipment Manifest</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
            <span>Real-time Single Customs Territory (</span>
            <LogisticsTermTooltip termKey="SCT">
              <span className="font-semibold text-slate-700 underline decoration-dotted">SCT</span>
            </LogisticsTermTooltip>
            <span>) channel routing, scan queues, and container dwell tracking</span>
          </p>
        </div>

        {/* Channel Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {channels.map((ch) => {
            const isSelected = selectedChannel === ch.key;
            return (
              <button
                key={ch.key}
                type="button"
                onClick={() => onSelectChannel(ch.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition flex items-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? ch.activeColor + ' shadow-xs'
                    : ch.baseColor + ' hover:opacity-90'
                }`}
              >
                <span>{ch.label}</span>
                {ch.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-700'}`}>
                    {ch.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-Click Quick Toggle Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Quick Views:
        </span>
        {quickTabs.map((tab) => {
          const isActive = (quickTab || 'ALL') === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectQuickTab && onSelectQuickTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border shadow-2xs ${
                isActive
                  ? 'bg-[#002D56] text-white border-[#002D56]'
                  : 'bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Filter Bar if filtered */}
      {hasActiveFilters && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-md px-3.5 py-2 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#004B87]">Active Filters:</span>
            {quickTab && quickTab !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200">
                View: {quickTab.replace(/_/g, ' ')}
              </span>
            )}
            {selectedZoneCode && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200 flex items-center gap-1">
                Zone: {selectedZoneCode}
                {onResetZone && (
                  <button onClick={onResetZone} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
                )}
              </span>
            )}
            {selectedCorridor && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200 flex items-center gap-1">
                Corridor: {selectedCorridor === 'CENTRAL_CORRIDOR' ? 'Dar es Salaam' : 'Mombasa'}
                {onResetCorridor && (
                  <button onClick={onResetCorridor} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
                )}
              </span>
            )}
            {selectedChannel && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200 flex items-center gap-1">
                Channel: {selectedChannel}
                <button onClick={() => onSelectChannel('')} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
              </span>
            )}
            {selectedStage && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200 flex items-center gap-1">
                Stage: {selectedStage.replace(/_/g, ' ')}
                <button onClick={() => onSelectStage('')} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-0.5 rounded bg-white text-[#004B87] font-semibold border border-blue-200 flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={() => onSearchChange('')} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onResetAllFilters}
            className="flex items-center gap-1 font-semibold text-[#004B87] hover:text-[#002D56] bg-white px-2.5 py-1 rounded border border-blue-300 hover:border-blue-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracking, container, consignee, or commodity..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStage}
            onChange={(e) => onSelectStage(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-[#004B87] shadow-2xs"
          >
            {stages.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Tracking / Container</th>
              <th className="py-2.5 px-3">Consignee & Commodity</th>
              <th className="py-2.5 px-3">Corridor & Line</th>
              <th className="py-2.5 px-3">Customs Channel</th>
              <th className="py-2.5 px-3">Logistics Stage</th>
              <th className="py-2.5 px-3">Zone & Dwell</th>
              <th className="py-2.5 px-3 text-right">Actionable Triggers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  Loading container shipments manifest...
                </td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Box className="w-8 h-8 text-slate-300" />
                    <span className="font-semibold text-slate-600">No shipments match the current filters.</span>
                    <button
                      type="button"
                      onClick={onResetAllFilters}
                      className="text-xs text-[#004B87] hover:underline font-semibold mt-1"
                    >
                      Clear all filters to view full manifest
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              shipments.map((s) => {
                const channelBadge = getChannelBadge(s.customsChannel);
                const stageBadge = getStageBadge(s.stage);
                const isRedOrDelayed = s.customsChannel === 'RED' || s.dwellTimeHours > 24;
                const isStored = s.stage === 'WAREHOUSE_STORED';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    {/* Tracking & Container */}
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                        <span>{s.containerNumber}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                        {s.trackingNumber}
                      </div>
                    </td>

                    {/* Consignee & Commodity */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 max-w-[200px] truncate">
                        {s.consigneeName}
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-[200px] truncate">
                        {s.commodityDescription || s.cargoType}
                      </div>
                    </td>

                    {/* Corridor & Shipping Line */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">
                        {s.shippingLine}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {s.corridor === 'CENTRAL_CORRIDOR' ? 'Dar es Salaam (Central)' : 'Mombasa (Northern)'}
                      </div>
                    </td>

                    {/* Customs Channel */}
                    <td className="py-2.5 px-3">
                      <LogisticsTermTooltip termKey={channelBadge.term}>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border inline-block ${channelBadge.style}`}>
                          {channelBadge.text}
                        </span>
                      </LogisticsTermTooltip>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {s.customsDeclarationNumber || 'DECLARATION PENDING'}
                      </div>
                    </td>

                    {/* Stage */}
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border inline-block ${stageBadge.style}`}>
                        {stageBadge.text}
                      </span>
                    </td>

                    {/* Zone & Dwell */}
                    <td className="py-2.5 px-3 font-mono text-xs">
                      <div className="text-[#004B87] font-bold">
                        {s.warehouseZoneCode || '--'}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className={s.dwellTimeHours > 24 ? 'text-amber-700 font-bold' : ''}>
                          {s.dwellTimeHours > 0 ? `${s.dwellTimeHours}h dwell` : '0h (In transit)'}
                        </span>
                      </div>
                    </td>

                    {/* Actionable Trigger Buttons */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRedOrDelayed && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onTriggerAction) {
                                onTriggerAction('REQUEST_RRA_STATUS', {
                                  container: s.containerNumber,
                                  declaration: s.customsDeclarationNumber,
                                  consignee: s.consigneeName
                                });
                              }
                            }}
                            className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold transition shadow-2xs"
                            title="Send status inquiry to RRA Customs Officer"
                          >
                            Request RRA Update
                          </button>
                        )}

                        {isStored && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onTriggerAction) {
                                onTriggerAction('PRINT_GATE_PASS', {
                                  container: s.containerNumber,
                                  consignee: s.consigneeName,
                                  zone: s.warehouseZoneCode
                                });
                              }
                            }}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold transition shadow-2xs"
                            title="Generate Gate Pass for release"
                          >
                            Print Gate Pass
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectShipment(s)}
                          className="p-1.5 rounded-md bg-slate-100 hover:bg-[#004B87] text-slate-600 hover:text-white border border-slate-200 hover:border-[#004B87] transition shadow-2xs"
                          title="Inspect shipment details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
