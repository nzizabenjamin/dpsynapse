import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  AlertCircle,
  PhoneCall,
  Send,
  ArrowRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function CorridorFleetRadar({ 
  trips, 
  fleetStats, 
  loading, 
  onSelectCorridor,
  onSelectTruckShipment,
  onTriggerAction 
}) {
  if (loading || !trips) {
    return (
      <div className="bg-white border border-slate-200 p-5 rounded-md animate-pulse shadow-xs">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-slate-100 rounded-md"></div>
          <div className="h-40 bg-slate-100 rounded-md"></div>
        </div>
      </div>
    );
  }

  const centralTrips = trips.filter(t => t.corridor === 'CENTRAL_CORRIDOR');
  const northernTrips = trips.filter(t => t.corridor === 'NORTHERN_CORRIDOR');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BORDER_HOLD':
        return {
          label: 'Border Hold (Delayed)',
          style: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
          isDelayed: true
        };
      case 'GATE_IN_MASAKA':
        return {
          label: 'At Masaka Gate-In',
          style: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold',
          isDelayed: false
        };
      case 'UNLOADING':
        return {
          label: 'Unloading at CFS Bay',
          style: 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold',
          isDelayed: false
        };
      case 'DEPARTED':
        return {
          label: 'Completed & Departed',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
          isDelayed: false
        };
      default:
        return {
          label: 'Moving On-Highway (In Transit)',
          style: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
          isDelayed: false
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#004B87]" />
            <span>Corridor Fleet Transit Radar & Border Telematics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
            <span>Central Corridor (Dar es Salaam via </span>
            <LogisticsTermTooltip termKey="OSBP">
              <span className="font-semibold text-slate-700 underline decoration-dotted">Rusumo OSBP</span>
            </LogisticsTermTooltip>
            <span>) vs Northern Corridor (Mombasa via </span>
            <LogisticsTermTooltip termKey="OSBP">
              <span className="font-semibold text-slate-700 underline decoration-dotted">Kagitumba OSBP</span>
            </LogisticsTermTooltip>
            <span>)</span>
          </p>
        </div>

        {/* Interactive Fleet Stat Filter Chips */}
        {fleetStats && (
          <div className="flex items-center gap-1.5 text-xs font-mono flex-wrap">
            <button 
              onClick={() => onSelectCorridor && onSelectCorridor('')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition"
              title="View all fleet shipments"
            >
              <span className="text-slate-500 font-sans">Active In-Transit: </span>
              <span className="text-slate-900 font-bold">{fleetStats.activeTripsInTransit || 0}</span>
            </button>
            <button 
              onClick={() => onSelectCorridor && onSelectCorridor('CENTRAL_CORRIDOR')}
              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 transition"
              title="Filter to trucks delayed at border"
            >
              <span className="text-rose-700 font-sans">Border Hold: </span>
              <span className="text-rose-900 font-bold">{fleetStats.tripsAtBorderHold || 0}</span>
            </button>
            <button 
              onClick={() => onSelectCorridor && onSelectCorridor('NORTHERN_CORRIDOR')}
              className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition"
              title="Filter to gate arrivals"
            >
              <span className="text-blue-700 font-sans">Terminal Gate: </span>
              <span className="text-blue-900 font-bold">{fleetStats.tripsAtMasakaGate || 0}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2-Column Corridor Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Central Corridor Card (Dar -> Rusumo -> Masaka) */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-100 text-[#004B87] flex items-center justify-center font-bold text-xs">
                  CC
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Central Corridor (Tanzania • 68% Freight)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Dar es Salaam Port &rarr; Morogoro &rarr; Rusumo OSBP &rarr; Kigali Masaka
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectCorridor && onSelectCorridor('CENTRAL_CORRIDOR')}
                className="text-xs font-mono font-bold text-[#004B87] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition"
                title="Filter table to Central Corridor shipments"
              >
                {centralTrips.length} Trucks (Filter)
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
              {centralTrips.map((trip) => {
                const badge = getStatusBadge(trip.status);
                return (
                  <div 
                    key={trip.id}
                    onClick={() => onSelectTruckShipment && onSelectTruckShipment(trip)}
                    className="bg-white border border-slate-200 hover:border-[#004B87] p-3 rounded-md transition flex flex-col gap-1.5 shadow-2xs cursor-pointer group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {trip.truckPlate}
                        </span>
                        <span className="text-xs text-slate-700 font-medium">
                          {trip.transporterCompany}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                      <div className="flex items-center gap-1 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                        <span className="font-medium text-slate-800">{trip.currentCheckpoint}</span>
                      </div>
                      {trip.turnaroundTimeMinutes > 0 && (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{trip.turnaroundTimeMinutes} min TAT</span>
                        </div>
                      )}
                    </div>

                    {trip.delayReason && (
                      <div className="text-[11px] text-rose-900 bg-rose-50 p-2 rounded border border-rose-200 flex flex-col gap-1.5 mt-1">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                          <span><strong>Delay Reason:</strong> {trip.delayReason}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onTriggerAction) {
                                onTriggerAction('PING_BORDER_AGENT', {
                                  truckPlate: trip.truckPlate,
                                  checkpoint: trip.currentCheckpoint,
                                  driver: trip.driverName,
                                  driverPhone: trip.driverPhone
                                });
                              }
                            }}
                            className="text-[10px] font-bold text-rose-800 hover:text-rose-900 bg-white hover:bg-rose-100 border border-rose-300 px-2 py-0.5 rounded transition"
                          >
                            Ping OSBP Agent
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onTriggerAction) {
                                onTriggerAction('NOTIFY_DISPATCH', {
                                  truckPlate: trip.truckPlate,
                                  transporter: trip.transporterCompany
                                });
                              }
                            }}
                            className="text-[10px] font-bold text-slate-700 hover:text-[#004B87] bg-white hover:bg-slate-100 border border-slate-300 px-2 py-0.5 rounded transition"
                          >
                            Notify Dispatch
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Northern Corridor Card (Mombasa -> Kagitumba -> Masaka) */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                  NC
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Northern Corridor (Kenya • 32% Freight)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Mombasa Port &rarr; Eldoret &rarr; Kagitumba OSBP &rarr; Kigali Masaka
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectCorridor && onSelectCorridor('NORTHERN_CORRIDOR')}
                className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1 rounded border border-cyan-200 transition"
                title="Filter table to Northern Corridor shipments"
              >
                {northernTrips.length} Trucks (Filter)
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
              {northernTrips.map((trip) => {
                const badge = getStatusBadge(trip.status);
                return (
                  <div 
                    key={trip.id}
                    onClick={() => onSelectTruckShipment && onSelectTruckShipment(trip)}
                    className="bg-white border border-slate-200 hover:border-cyan-600 p-3 rounded-md transition flex flex-col gap-1.5 shadow-2xs cursor-pointer group text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {trip.truckPlate}
                        </span>
                        <span className="text-xs text-slate-700 font-medium">
                          {trip.transporterCompany}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                      <div className="flex items-center gap-1 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span className="font-medium text-slate-800">{trip.currentCheckpoint}</span>
                      </div>
                      {trip.turnaroundTimeMinutes > 0 && (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{trip.turnaroundTimeMinutes} min TAT</span>
                        </div>
                      )}
                    </div>

                    {trip.delayReason && (
                      <div className="text-[11px] text-rose-900 bg-rose-50 p-2 rounded border border-rose-200 flex flex-col gap-1.5 mt-1">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                          <span><strong>Delay Reason:</strong> {trip.delayReason}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60 justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onTriggerAction) {
                                onTriggerAction('PING_BORDER_AGENT', {
                                  truckPlate: trip.truckPlate,
                                  checkpoint: trip.currentCheckpoint,
                                  driver: trip.driverName,
                                  driverPhone: trip.driverPhone
                                });
                              }
                            }}
                            className="text-[10px] font-bold text-rose-800 hover:text-rose-900 bg-white hover:bg-rose-100 border border-rose-300 px-2 py-0.5 rounded transition"
                          >
                            Ping OSBP Agent
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}


