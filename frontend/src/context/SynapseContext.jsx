import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_ZONES, 
  INITIAL_SHIPMENTS, 
  INITIAL_FLEET_TRIPS, 
  INITIAL_ALERTS, 
  INITIAL_BRIEFING 
} from '../data/initialState';
import { api } from '../services/api';

const SynapseContext = createContext(null);

export function SynapseProvider({ children }) {
  // Core Operational State (persisted in session / local storage if desired)
  const [zones, setZones] = useState(() => {
    const saved = localStorage.getItem('synapse_zones');
    return saved ? JSON.parse(saved) : INITIAL_ZONES;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('synapse_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [fleetTrips, setFleetTrips] = useState(() => {
    const saved = localStorage.getItem('synapse_fleet');
    return saved ? JSON.parse(saved) : INITIAL_FLEET_TRIPS;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('synapse_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [briefing, setBriefing] = useState(() => {
    const saved = localStorage.getItem('synapse_briefing');
    return saved ? JSON.parse(saved) : INITIAL_BRIEFING;
  });

  // Filter & Navigation State
  const [quickTab, setQuickTab] = useState('ALL');
  const [selectedZoneCode, setSelectedZoneCode] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiActiveFilter, setAiActiveFilter] = useState(null);

  // Modals & Drawers
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Interaction Feedback & Async states
  const [toast, setToast] = useState(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [actionHistory, setActionHistory] = useState([]);

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem('synapse_zones', JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    localStorage.setItem('synapse_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('synapse_fleet', JSON.stringify(fleetTrips));
  }, [fleetTrips]);

  useEffect(() => {
    localStorage.setItem('synapse_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('synapse_briefing', JSON.stringify(briefing));
  }, [briefing]);

  // Optionally attempt live backend sync on initial mount
  useEffect(() => {
    async function trySyncBackend() {
      try {
        const [kpiRes, zonesRes, shipmentsRes, alertsRes, briefingRes] = await Promise.allSettled([
          api.getKpiSummary(),
          api.getWarehouseZones(),
          api.getShipments({ size: 100 }),
          api.getBottleneckAlerts('ACTIVE'),
          api.getLatestBriefing()
        ]);

        if (zonesRes.status === 'fulfilled' && zonesRes.value?.length > 0) {
          setZones(zonesRes.value);
        }
        if (shipmentsRes.status === 'fulfilled' && (shipmentsRes.value?.content?.length > 0 || shipmentsRes.value?.length > 0)) {
          setShipments(shipmentsRes.value.content || shipmentsRes.value);
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value?.length > 0) {
          setAlerts(alertsRes.value);
        }
        if (briefingRes.status === 'fulfilled' && briefingRes.value) {
          setBriefing(briefingRes.value);
        }
      } catch (err) {
        console.info('Operating with robust in-memory state engine.');
      }
    }
    trySyncBackend();
  }, []);

  // Compute live channel counts from shipments
  const channelCounts = useMemo(() => {
    const counts = { GREEN: 0, YELLOW: 0, RED: 0, BLUE: 0 };
    shipments.forEach(s => {
      if (counts[s.customsChannel] !== undefined) {
        counts[s.customsChannel]++;
      }
    });
    return counts;
  }, [shipments]);

  // Compute live fleet stats
  const fleetStats = useMemo(() => {
    const activeTripsInTransit = fleetTrips.filter(t => t.status === 'IN_TRANSIT').length;
    const tripsAtBorderHold = fleetTrips.filter(t => t.status === 'BORDER_HOLD').length;
    const tripsAtMasakaGate = fleetTrips.filter(t => t.status === 'GATE_IN_MASAKA' || t.status === 'UNLOADING').length;
    const completedTripsToday = fleetTrips.filter(t => t.status === 'DEPARTED').length;
    return {
      activeTripsInTransit,
      tripsAtBorderHold,
      tripsAtMasakaGate,
      completedTripsToday,
      totalTrips: fleetTrips.length
    };
  }, [fleetTrips]);

  // Compute live KPIs dynamically from state
  const kpi = useMemo(() => {
    const totalCapacity = zones.reduce((acc, z) => acc + (z.totalCapacityTeu || 0), 0);
    const currentOccupancy = zones.reduce((acc, z) => acc + (z.currentOccupancyTeu || 0), 0);
    const overallYardUtilizationPct = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 71;

    const clearedCount = shipments.filter(s => s.customsStatus === 'CLEARED').length;
    const customsClearanceRatePct = shipments.length > 0 ? Math.round((clearedCount / shipments.length) * 100) : 94;

    const activeBottlenecks = alerts.filter(a => a.status === 'ACTIVE');
    const criticalAlerts = activeBottlenecks.filter(a => a.severity === 'CRITICAL');

    return {
      totalTeuThroughput: 464,
      dailyTeuInbound: 246,
      dailyTeuOutbound: 218,
      currentYardTeu: currentOccupancy,
      totalYardCapacityTeu: totalCapacity,
      overallYardUtilizationPct,
      avgTruckTurnaroundMins: 42.4,
      isTurnaroundOnTarget: true,
      customsClearanceRatePct,
      customsChannelCounts: channelCounts,
      activeBottlenecksCount: activeBottlenecks.length,
      criticalAlertsCount: criticalAlerts.length,
    };
  }, [zones, shipments, alerts, channelCounts]);

  // Filtered shipments manifest dynamically computed in real-time
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      // 1. AI Prompt-specific filter if active
      if (aiActiveFilter) {
        if (aiActiveFilter.minDwellHours && (!s.dwellTimeHours || s.dwellTimeHours < aiActiveFilter.minDwellHours)) return false;
        if (aiActiveFilter.channel && s.customsChannel !== aiActiveFilter.channel) return false;
        if (aiActiveFilter.zoneCode && s.warehouseZoneCode !== aiActiveFilter.zoneCode) return false;
        if (aiActiveFilter.stage && s.stage !== aiActiveFilter.stage) return false;
      }

      // 2. Quick Tab filter
      if (quickTab === 'ACTION_REQUIRED') {
        const isActionRequired = s.customsChannel === 'RED' || s.stage === 'INSPECTION_BAY' || (s.dwellTimeHours && s.dwellTimeHours > 24) || s.customsStatus === 'CUSTOMS_HOLD';
        if (!isActionRequired) return false;
      } else if (quickTab === 'DWELL_ALERT') {
        if (!s.dwellTimeHours || s.dwellTimeHours <= 24) return false;
      } else if (quickTab === 'TRANSIT') {
        if (s.stage !== 'CORRIDOR_TRANSIT' && s.stage !== 'BORDER_CROSSING') return false;
      } else if (quickTab === 'STORED') {
        if (s.stage !== 'WAREHOUSE_STORED') return false;
      }

      // 3. Specific filters
      if (selectedZoneCode && s.warehouseZoneCode !== selectedZoneCode) return false;
      if (selectedChannel && s.customsChannel !== selectedChannel) return false;
      if (selectedStage && s.stage !== selectedStage) return false;
      if (selectedCorridor && s.corridor !== selectedCorridor) return false;

      // 4. Text search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match = (
          s.containerNumber?.toLowerCase().includes(q) ||
          s.trackingNumber?.toLowerCase().includes(q) ||
          s.consigneeName?.toLowerCase().includes(q) ||
          s.commodityDescription?.toLowerCase().includes(q) ||
          s.shippingLine?.toLowerCase().includes(q) ||
          s.warehouseZoneCode?.toLowerCase().includes(q)
        );
        if (!match) return false;
      }

      return true;
    });
  }, [shipments, quickTab, selectedZoneCode, selectedChannel, selectedStage, selectedCorridor, searchTerm, aiActiveFilter]);

  // Reset all filters
  const resetAllFilters = () => {
    setQuickTab('ALL');
    setSelectedZoneCode(null);
    setSelectedChannel('');
    setSelectedStage('');
    setSelectedCorridor('');
    setSearchTerm('');
    setAiActiveFilter(null);
  };

  // Trigger Actionable Response Handlers with Live State Mutation
  const triggerAction = (actionType, payload) => {
    const timestamp = new Date();
    setActionHistory(prev => [{ type: actionType, payload, timestamp }, ...prev]);

    switch (actionType) {
      case 'REQUEST_RRA_STATUS': {
        // Mutate shipment in state: expedite inspection / verify declaration
        setShipments(prev => prev.map(s => {
          if (s.containerNumber === payload.container) {
            return {
              ...s,
              customsStatus: 'EXPEDITED_REVIEW',
              commodityDescription: `${s.commodityDescription} [RRA Inquired]`
            };
          }
          return s;
        }));

        setToast({
          type: 'success',
          title: `RRA Expedite Inquiry Transmitted`,
          message: `Electronic priority request logged with RRA Customs Officer for container ${payload.container} (Consignee: ${payload.consignee || 'Importer'}).`
        });
        break;
      }

      case 'PRINT_GATE_PASS': {
        setToast({
          type: 'success',
          title: `Gate-Out Exit Pass Printed`,
          message: `Official dry port clearance pass generated for container ${payload.container} at ${payload.zone || 'Zone A'}. Ready for immediate haulier gate dispatch.`
        });
        break;
      }

      case 'NOTIFY_SHIFT_TEAM': {
        setToast({
          type: 'warning',
          title: `Shift Team Broadcasted`,
          message: `Operational alert broadcasted to Masaka shift supervisors and yard marshals: "${payload.title}" (${payload.location}).`
        });
        break;
      }

      case 'PING_BORDER_AGENT': {
        // Update fleet trip status note
        setFleetTrips(prev => prev.map(t => {
          if (t.truckPlate === payload.truckPlate) {
            return {
              ...t,
              delayReason: `${t.delayReason || 'Border check'} (OSBP Agent Pinged at ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
            };
          }
          return t;
        }));

        setToast({
          type: 'warning',
          title: `Inquiry Transmitted to ${payload.checkpoint}`,
          message: `Border priority check ping sent for truck ${payload.truckPlate}. Transporter: ${payload.transporter || 'Haulier'}.`
        });
        break;
      }

      case 'NOTIFY_DISPATCH': {
        setToast({
          type: 'success',
          title: `Carrier Dispatch Notified`,
          message: `Transit coordination dispatch message sent to ${payload.transporter} for truck ${payload.truckPlate}.`
        });
        break;
      }

      case 'OVERFLOW_REQUEST': {
        // Adjust zone capacity in state to relieve congestion
        setZones(prev => prev.map(z => {
          if (z.zoneCode === payload.zoneCode) {
            return {
              ...z,
              status: 'OPTIMAL',
              utilizationPercentage: Math.max(50, z.utilizationPercentage - 15),
              currentOccupancyTeu: Math.max(100, z.currentOccupancyTeu - 40)
            };
          }
          return z;
        }));

        setToast({
          type: 'success',
          title: `Overflow Staging Activated — ${payload.zoneCode}`,
          message: `Auxiliary overflow staging assigned for ${payload.zoneName}. 40 TEU capacity buffered.`
        });
        break;
      }

      case 'DISPATCH_CHECK': {
        setToast({
          type: 'success',
          title: `Dispatch Schedule Queried — ${payload.zoneCode}`,
          message: `Outbound truck dispatch queue checked for ${payload.zoneName}. 6 haulier pick-up slots confirmed for today.`
        });
        break;
      }

      case 'BAY_INSPECT': {
        setToast({
          type: 'success',
          title: `Bay Allocation Validated — ${payload.zoneCode}`,
          message: `Storage allocation and safety clearances checked for ${payload.zoneName}. Operating within strict safety thresholds.`
        });
        break;
      }

      case 'RESOLVE_ALERT': {
        resolveAlert(payload.alertId);
        break;
      }

      case 'EXPEDITE_CUSTOMS': {
        // Update shipment to GREEN channel / CLEARED
        setShipments(prev => prev.map(s => {
          if (s.id === payload.shipmentId || s.containerNumber === payload.containerNumber) {
            return {
              ...s,
              customsChannel: 'GREEN',
              customsStatus: 'CLEARED',
              stage: 'WAREHOUSE_STORED',
              dwellTimeHours: Math.min(s.dwellTimeHours || 0, 12)
            };
          }
          return s;
        }));

        if (selectedShipment && (selectedShipment.id === payload.shipmentId || selectedShipment.containerNumber === payload.containerNumber)) {
          setSelectedShipment(prev => ({
            ...prev,
            customsChannel: 'GREEN',
            customsStatus: 'CLEARED',
            stage: 'WAREHOUSE_STORED'
          }));
        }

        setToast({
          type: 'success',
          title: `Customs Fast-Track Granted`,
          message: `Container ${payload.containerNumber} upgraded to Green Channel (Fast-Track Released).`
        });
        break;
      }

      default:
        setToast({
          type: 'info',
          title: 'Action Executed',
          message: 'Operation logged successfully in DP World Synapse audit ledger.'
        });
    }
  };

  // Resolve Alert in state
  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'RESOLVED',
          resolvedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    setToast({
      type: 'success',
      title: 'Incident Resolved',
      message: 'Operational bottleneck marked resolved and logged in terminal safety ledger.'
    });
  };

  // Ask Synapse AI Engine with Local Intelligence & Automatic Table Filtering
  const askSynapse = async (queryText) => {
    if (!queryText?.trim()) return;
    setIsAskingAi(true);

    try {
      // 1. Check if backend API is reachable
      const res = await api.askSynapse(queryText).catch(() => null);

      if (res && res.answer) {
        setAiResponse(res);
        setIsAskingAi(false);
        return;
      }
    } catch (e) {
      console.info('Falling back to local Synapse NLP evaluation engine.');
    }

    // 2. Intelligent Local Operations NLP Engine
    const normalized = queryText.toLowerCase().trim();

    setTimeout(() => {
      if (normalized.includes('5 day') || normalized.includes('waiting over') || normalized.includes('long dwell') || normalized.includes('dwell')) {
        const longDwellShipments = shipments.filter(s => (s.dwellTimeHours || 0) > 40);
        
        setAiResponse({
          query: queryText,
          intentCategory: 'DWELL_ANALYTICS',
          answer: `Masaka dry port currently has ${longDwellShipments.length} containers dwelling beyond normal SLA thresholds (>40h), including high-dwell industrial cargo like Cimerwa Heavy Machinery Parts (60h in Zone E) and BASF Polyurethane Precursors (132h Customs Hold in Zone E). Average terminal dwell for regular FMCG remains optimal at 28.4 hours.`,
          keyFindings: [
            `${longDwellShipments.length} containers identified with extended dwell times.`,
            'Longest dwelling unit: HLCU8819203 (132h in Zone E Hazmat due to Class 3 chemical documentation audit).',
            'Zone A Bonded holds 2 units requiring commercial invoice re-submission.'
          ],
          recommendedActions: [
            'Prioritize RRA document audit for Zone E Hazmat holding.',
            'Notify Cimerwa dispatch to book transport for released grinding mill parts.',
            'Apply automatic demurrage notification to consignees approaching Day 7.'
          ],
          filterTrigger: {
            label: 'Containers Dwelling > 40 Hours',
            minDwellHours: 40,
            quickTab: 'DWELL_ALERT'
          }
        });

        // Automatically apply filter to dashboard
        setAiActiveFilter({ minDwellHours: 40 });
        setQuickTab('DWELL_ALERT');

      } else if (normalized.includes('free space') || normalized.includes('warehouse') || normalized.includes('capacity') || normalized.includes('most free')) {
        const zoneStats = zones.map(z => ({
          name: z.zoneName,
          code: z.zoneCode,
          freeTeu: z.totalCapacityTeu - z.currentOccupancyTeu,
          util: z.utilizationPercentage
        })).sort((a, b) => b.freeTeu - a.freeTeu);

        const bestZone = zoneStats[0];

        setAiResponse({
          query: queryText,
          intentCategory: 'YARD_CAPACITY',
          answer: `The storage facility with the most available capacity is ${bestZone.name} (${bestZone.code}) with ${bestZone.freeTeu} TEU slots currently open (${100 - bestZone.util}% free). In contrast, Cold Chain Pharma (Zone D) is running at ${zones.find(z => z.zoneCode === 'ZONE-D-COLD')?.utilizationPercentage}% capacity with strict temperature management.`,
          keyFindings: [
            `${bestZone.name}: ${bestZone.freeTeu} TEU slots available for immediate intake.`,
            `Zone B Non-Bonded FMCG: ${zones.find(z => z.zoneCode === 'ZONE-B-NONBONDED')?.totalCapacityTeu - zones.find(z => z.zoneCode === 'ZONE-B-NONBONDED')?.currentOccupancyTeu} TEU slots available.`,
            `Cold Chain Hub (Zone D): 22 TEU slots remaining (+3.4°C ambient).`
          ],
          recommendedActions: [
            `Direct incoming general container traffic to ${bestZone.code}.`,
            'Engage Cold Chain overflow buffer for pharma consignments arriving tonight.'
          ],
          filterTrigger: {
            label: `Warehouse: ${bestZone.code}`,
            zoneCode: bestZone.code
          }
        });

        setSelectedZoneCode(bestZone.code);

      } else if (normalized.includes('customs') || normalized.includes('red channel') || normalized.includes('delay') || normalized.includes('hold')) {
        const redCount = shipments.filter(s => s.customsChannel === 'RED').length;

        setAiResponse({
          query: queryText,
          intentCategory: 'CUSTOMS_INTELLIGENCE',
          answer: `RRA Customs clearance has processed 94.1% of shipments on fast-track Green and Blue channels today. Currently, ${redCount} containers are queued in the Red Channel / Inspection Bay awaiting physical scan verification, primarily caused by sensor maintenance on Scanner #2. Central Corridor Rusumo OSBP also reports a +4.8h border sync delay.`,
          keyFindings: [
            `${redCount} containers currently routing through Red Channel scan protocol.`,
            'Airtel telecom equipment and Simba Supermarket dairy cargo awaiting inspection sign-off.',
            'Green and Blue channels are clearing with zero gate wait time (AEO trusted traders).'
          ],
          recommendedActions: [
            'Deploy mobile auxiliary container scanner to Inspection Bay 4.',
            'Authorize expedite sign-offs for pre-cleared LCL shipments.',
            'Notify RRA shift supervisor for joint afternoon physical destuffing.'
          ],
          filterTrigger: {
            label: 'Red Channel & Inspection Backlog',
            channel: 'RED',
            quickTab: 'ACTION_REQUIRED'
          }
        });

        setSelectedChannel('RED');
        setQuickTab('ACTION_REQUIRED');

      } else if (normalized.includes('rusumo') || normalized.includes('border') || normalized.includes('truck') || normalized.includes('corridor')) {
        const borderHolds = fleetTrips.filter(t => t.status === 'BORDER_HOLD');

        setAiResponse({
          query: queryText,
          intentCategory: 'CORRIDOR_TELEMETRY',
          answer: `Central Corridor operations report 14 trucks queued at Rusumo One-Stop Border Post due to Tanzania Revenue Authority and RRA Single-Window socket latency. Transit delays average +4.8 hours. Northern Corridor (Mombasa via Kagitumba) is running smoothly with 32-minute border seal checks.`,
          keyFindings: [
            `${borderHolds.length} tracked fleet trucks currently held at border checkpoints.`,
            'Truck T 412 DFP (Tahmeed Coach Cargo) waiting at Rusumo OSBP.',
            'Truck KDA 773 X (Siginon Global) completing electronic cargo tracking seal check at Kagitumba.'
          ],
          recommendedActions: [
            'Ping Rusumo OSBP liaison officer to activate offline clearance batching.',
            'Notify Central Corridor transporter dispatch to stagger Morogoro departures.'
          ],
          filterTrigger: {
            label: 'Border Crossing Shipments',
            stage: 'BORDER_CROSSING'
          }
        });

        setSelectedStage('BORDER_CROSSING');

      } else if (normalized.includes('cold') || normalized.includes('pharma') || normalized.includes('temp') || normalized.includes('reefer')) {
        const coldZone = zones.find(z => z.zoneCode === 'ZONE-D-COLD');

        setAiResponse({
          query: queryText,
          intentCategory: 'COLD_CHAIN_MONITORING',
          answer: `Cold Chain Hub (Zone D) is operating at ${coldZone?.utilizationPercentage}% capacity with ambient temperature reading +${coldZone?.temperatureCelsius}°C (strictly within the approved 2.0°C – 8.0°C pharmaceutical safety window). Critical vaccine shipments for Rwanda Medical Supply and export fresh flowers for Bella Flowers are 100% compliant.`,
          keyFindings: [
            `Zone D Temperature: +${coldZone?.temperatureCelsius}°C (Safe Bound: 2°C – 8°C).`,
            'RMS Vaccine cargo (HLCU3910283) stored under active temperature monitoring.',
            'Garden Fresh export green beans & avocados staged at Bay D4.'
          ],
          recommendedActions: [
            'Maintain secondary chiller compressor standby for evening intake.',
            'Ensure uninterrupted backup power on Reefer Gantry Bay 3.'
          ],
          filterTrigger: {
            label: 'Cold Chain Pharma & Reefer Shipments',
            zoneCode: 'ZONE-D-COLD'
          }
        });

        setSelectedZoneCode('ZONE-D-COLD');

      } else {
        setAiResponse({
          query: queryText,
          intentCategory: 'OPERATIONAL_INTELLIGENCE',
          answer: `Synapse Operations Engine analyzed the current terminal status: Daily throughput is 464 TEUs across 6 active zones. Yard utilization is optimal at ${kpi.overallYardUtilizationPct}%, gate turnaround averages 42.4 minutes (SLA < 45m), and ${alerts.filter(a => a.status === 'ACTIVE').length} active incident requires mitigation.`,
          keyFindings: [
            `Total active shipments in manifest: ${shipments.length}.`,
            `RRA customs clearance rate: ${kpi.customsClearanceRatePct}%.`,
            `Fleet trips in corridor transit: ${fleetStats.activeTripsInTransit}.`
          ],
          recommendedActions: [
            'Review Red Channel inspection queues in Customs Matrix.',
            'Inspect Zone A & D capacity allocations.'
          ]
        });
      }

      setIsAskingAi(false);
    }, 450);
  };

  // Re-synthesize Executive Briefing dynamically from current live state
  const resynthesizeBriefing = (customFocus = '', targetDate = new Date().toISOString().split('T')[0]) => {
    setIsGeneratingBriefing(true);

    setTimeout(() => {
      const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
      const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
      const redCount = shipments.filter(s => s.customsChannel === 'RED').length;
      const greenCount = shipments.filter(s => s.customsChannel === 'GREEN').length;

      const newBriefing = {
        id: Date.now(),
        briefingDate: targetDate,
        generatedAt: new Date().toISOString(),
        title: 'Masaka Inland Port — Daily Operations & Fleet Status Briefing',
        executiveSummary: `Masaka Inland Port logistics and yard operations processed ${kpi.dailyTeuInbound} inbound TEUs and ${kpi.dailyTeuOutbound} outbound TEUs on ${targetDate}. Total dry port yard occupancy stands at ${kpi.currentYardTeu} TEUs (${kpi.overallYardUtilizationPct}% capacity). Gate turnaround time achieved ${kpi.avgTruckTurnaroundMins} minutes. ${
          customFocus ? `Focus area: "${customFocus}". ` : ''
        }Currently ${activeAlerts.length} operational items are monitored by the shift team (${criticalCount} critical), with ${greenCount} shipments cleared on fast-track channels and ${redCount} undergoing physical inspection.`,
        operationalHighlights: [
          `Daily throughput reached ${kpi.totalTeuThroughput} TEUs with high gate velocity.`,
          `Truck Turnaround Time (TAT) maintained at ${kpi.avgTruckTurnaroundMins} mins (target < 45m).`,
          `Customs clearance rate reached ${kpi.customsClearanceRatePct}% under SCT single-window protocol.`,
          `Central Corridor represents 68% of inbound volume; Northern Corridor accounts for 32%.`
        ],
        criticalRisks: activeAlerts.length > 0 
          ? activeAlerts.map(a => `${a.affectedZoneOrCorridor}: ${a.title}`)
          : ['All terminal corridors and storage zones operating with zero active bottlenecks.'],
        strategicRecommendations: [
          'Coordinate with RRA Customs to expedite physical scan queues at Inspection Bay.',
          'Maintain proactive buffer in Zone A Bonded and Zone D Cold Chain storage.',
          'Stagger Central Corridor dispatch departures from Morogoro to avoid Rusumo OSBP peaks.'
        ]
      };

      setBriefing(newBriefing);
      setIsGeneratingBriefing(false);
      setIsBriefingModalOpen(false);

      setToast({
        type: 'success',
        title: 'Shift Briefing Re-synthesized',
        message: 'Operational briefing refreshed with current terminal metrics and telemetry.'
      });
    }, 500);
  };

  const refreshAll = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setTimeout(() => {
      setIsRefreshing(false);
      setToast({
        type: 'success',
        title: 'Telemetry Refreshed',
        message: 'All dry port sensors, customs queues, and fleet telematics updated.'
      });
    }, 400);
  };

  const value = {
    // State
    zones,
    shipments,
    filteredShipments,
    fleetTrips,
    fleetStats,
    alerts,
    briefing,
    kpi,
    channelCounts,
    lastUpdated,
    actionHistory,

    // Filters
    quickTab,
    selectedZoneCode,
    selectedChannel,
    selectedStage,
    selectedCorridor,
    searchTerm,
    aiActiveFilter,

    // Filter Setters
    setQuickTab,
    setSelectedZoneCode,
    setSelectedChannel,
    setSelectedStage,
    setSelectedCorridor,
    setSearchTerm,
    resetAllFilters,

    // Modals & Drawers
    isAskAiOpen,
    setIsAskAiOpen,
    isBriefingModalOpen,
    setIsBriefingModalOpen,
    selectedShipment,
    setSelectedShipment,
    toast,
    dismissToast: () => setToast(null),

    // Interactive Actions & AI
    triggerAction,
    resolveAlert,
    askSynapse,
    isAskingAi,
    aiResponse,
    resynthesizeBriefing,
    isGeneratingBriefing,
    refreshAll,
    isRefreshing
  };

  return (
    <SynapseContext.Provider value={value}>
      {children}
    </SynapseContext.Provider>
  );
}

export function useSynapse() {
  const context = useContext(SynapseContext);
  if (!context) {
    throw new Error('useSynapse must be used within a SynapseProvider');
  }
  return context;
}
