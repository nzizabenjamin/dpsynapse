import React from 'react';
import { 
  X, 
  Box, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Truck,
  Printer,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function ShipmentDetailModal({ shipment, onClose, onTriggerAction }) {
  if (!shipment) return null;

  const getChannelBadge = (ch) => {
    switch (ch) {
      case 'GREEN': return { text: 'Green Channel (Fast-Track)', style: 'bg-emerald-50 text-emerald-800 border-emerald-200', term: 'GREEN CHANNEL' };
      case 'YELLOW': return { text: 'Yellow Channel (Documentary Audit)', style: 'bg-amber-50 text-amber-800 border-amber-200', term: 'YELLOW CHANNEL' };
      case 'RED': return { text: 'Red Channel (Physical & Scan Required)', style: 'bg-rose-50 text-rose-800 border-rose-200 font-bold', term: 'RED CHANNEL' };
      case 'BLUE': return { text: 'Blue Channel (AEO Trusted Trader)', style: 'bg-blue-50 text-blue-800 border-blue-200', term: 'BLUE CHANNEL' };
      default: return { text: ch || 'Standard', style: 'bg-slate-100 text-slate-700 border-slate-200', term: 'SCT' };
    }
  };

  const channelInfo = getChannelBadge(shipment.customsChannel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-[#002D56] text-white flex items-center justify-between border-b border-[#001D38]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#004B87] border border-blue-400/30 flex items-center justify-center text-white shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                  {shipment.containerNumber}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${channelInfo.style}`}>
                  {channelInfo.text}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Tracking: {shipment.trackingNumber} &bull; Shipping Line: {shipment.shippingLine}
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
        <div className="p-5 overflow-y-auto space-y-3.5 bg-white">
          
          {/* Key Grid Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Consignee</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">{shipment.consigneeName}</span>
            </div>
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <span>Capacity</span>
                <LogisticsTermTooltip termKey="TEU" />
              </span>
              <span className="text-xs font-bold text-[#004B87] block mt-0.5">{shipment.cargoType} ({shipment.teuCount} TEU)</span>
            </div>
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gross Weight</span>
              <span className="text-xs font-bold text-slate-900 font-mono block mt-0.5">{shipment.weightKg?.toLocaleString()} kg</span>
            </div>
            <div className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Terminal Dwell</span>
              <span className="text-xs font-bold text-amber-700 font-mono block mt-0.5">{shipment.dwellTimeHours || 0} hrs</span>
            </div>
          </div>

          {/* Commodity & Declaration */}
          <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Commodity Description:</span>
              <span className="text-slate-900 font-semibold">{shipment.commodityDescription}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <span>RRA Customs Declaration (</span>
                <LogisticsTermTooltip termKey="SCT">
                  <span className="underline decoration-dotted font-semibold">SCT</span>
                </LogisticsTermTooltip>
                <span>):</span>
              </span>
              <span className="text-[#004B87] font-mono font-bold">{shipment.customsDeclarationNumber || 'Awaiting Filing'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium">Customs Seal Number:</span>
              <span className="text-slate-800 font-mono">{shipment.sealNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-medium">Warehouse Storage Zone:</span>
              <span className="text-emerald-800 font-semibold">{shipment.warehouseZoneName} ({shipment.warehouseZoneCode})</span>
            </div>
          </div>

          {/* Corridor Checkpoints */}
          <div className="p-3.5 rounded-md bg-[#F8FAFC] border border-slate-200">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#004B87]" />
              <span>Corridor Transit & Route Checkpoints</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Origin Port:</span>
                <span className="text-slate-800 font-medium">{shipment.originPort}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Destination Hub:</span>
                <span className="text-slate-800 font-medium">{shipment.destinationHub}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Corridor Route:</span>
                <span className="text-[#004B87] font-semibold">{shipment.corridor?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Operational Status:</span>
                <span className="text-emerald-700 font-semibold">{shipment.stage?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer with One-Click Actions */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onTriggerAction) {
                  onTriggerAction('REQUEST_RRA_STATUS', {
                    container: shipment.containerNumber,
                    declaration: shipment.customsDeclarationNumber,
                    consignee: shipment.consigneeName
                  });
                }
              }}
              className="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition"
            >
              Request RRA Status Update
            </button>
            <button
              type="button"
              onClick={() => {
                if (onTriggerAction) {
                  onTriggerAction('PRINT_GATE_PASS', {
                    container: shipment.containerNumber,
                    consignee: shipment.consigneeName,
                    zone: shipment.warehouseZoneCode
                  });
                }
              }}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Gate Pass</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
