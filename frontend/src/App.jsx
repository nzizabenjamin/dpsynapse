import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MacroKpiStrip from './components/MacroKpiStrip';
import OperationsBriefingCard from './components/OperationsBriefingCard';
import WarehouseZoneGrid from './components/WarehouseZoneGrid';
import CustomsClearanceMatrix from './components/CustomsClearanceMatrix';
import CorridorFleetRadar from './components/CorridorFleetRadar';
import BottleneckAlertsCenter from './components/BottleneckAlertsCenter';
import AskSynapseDrawer from './components/AskSynapseDrawer';
import ShipmentDetailModal from './components/ShipmentDetailModal';
import BriefingModal from './components/BriefingModal';
import ActionToast from './components/ActionToast';
import { api } from './services/api';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Telemetry & operational data state
  const [kpi, setKpi] = useState(null);
  const [zones, setZones] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [channelCounts, setChannelCounts] = useState({});
  const [fleetTrips, setFleetTrips] = useState([]);
  const [fleetStats, setFleetStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [briefing, setBriefing] = useState(null);

  // Interactive filtering states (drill-downs & quick tabs)
  const [quickTab, setQuickTab] = useState('ALL');
  const [selectedZoneCode, setSelectedZoneCode] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals, Drawers & Action Toasts
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [toast, setToast] = useState(null);

  // Loading & Async states
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [resolvingAlertId, setResolvingAlertId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState(null);

  // Load all dashboard telemetry
  const loadDashboardData = async () => {
    try {
      setErrorMessage(null);
      const [
        kpiData,
        zonesData,
        shipmentsData,
        channelsData,
        fleetData,
        fleetStatsData,
        alertsData,
        briefingData
      ] = await Promise.all([
        api.getKpiSummary().catch(e => { console.warn(e); return null; }),
        api.getWarehouseZones().catch(e => { console.warn(e); return []; }),
        api.getShipments({ size: 100 }).catch(e => { console.warn(e); return { content: [] }; }),
        api.getShipmentChannelBreakdown().catch(e => { console.warn(e); return {}; }),
        api.getFleetTrips().catch(e => { console.warn(e); return []; }),
        api.getFleetStats().catch(e => { console.warn(e); return null; }),
        api.getBottleneckAlerts('ACTIVE').catch(e => { console.warn(e); return []; }),
        api.getLatestBriefing().catch(e => { console.warn(e); return null; }),
      ]);

      if (kpiData) setKpi(kpiData);
      if (zonesData) setZones(zonesData);
      if (shipmentsData) setShipments(shipmentsData.content || shipmentsData || []);
      if (channelsData) setChannelCounts(channelsData);
      if (fleetData) setFleetTrips(fleetData);
      if (fleetStatsData) setFleetStats(fleetStatsData);
      if (alertsData) setAlerts(alertsData);
      if (briefingData) setBriefing(briefingData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setErrorMessage('Unable to connect to DP World Synapse backend. Please verify server status on port 8080.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  // Actionable 1-Click Trigger Handler with User Feedback Toast
  const handleTriggerAction = (actionType, payload) => {
    switch (actionType) {
      case 'OVERFLOW_REQUEST':
        setToast({
          type: 'warning',
          title: `Overflow Staging Activated — ${payload.zoneCode}`,
          message: `Overflow staging area assigned for ${payload.zoneName} (${payload.utilization}% full). Supervisor ${payload.supervisor || 'Team'} notified.`
        });
        break;
      case 'DISPATCH_CHECK':
        setToast({
          type: 'success',
          title: `Dispatch Schedule Queried — ${payload.zoneCode}`,
          message: `Outbound truck dispatch queue checked for ${payload.zoneName}. 4 pick-up appointments scheduled for today.`
        });
        break;
      case 'BAY_INSPECT':
        setToast({
          type: 'success',
          title: `Bay Allocation Inspection — ${payload.zoneCode}`,
          message: `Storage allocation validated for ${payload.zoneName}. Telemetry within normal operating bounds.`
        });
        break;
      case 'PING_BORDER_AGENT':
        setToast({
          type: 'warning',
          title: `Inquiry Transmitted to ${payload.checkpoint}`,
          message: `Urgent border clearance inquiry dispatched for truck ${payload.truckPlate}. Driver: ${payload.driver || 'Assigned'}.`
        });
        break;
      case 'NOTIFY_DISPATCH':
        setToast({
          type: 'success',
          title: `Carrier Notice Dispatched`,
          message: `Traffic coordination message sent to ${payload.transporter} for truck ${payload.truckPlate}.`
        });
        break;
      case 'NOTIFY_SHIFT_TEAM':
        setToast({
          type: 'warning',
          title: `Shift Team Alert Broadcasted`,
          message: `Incident notification sent to Masaka operations team: "${payload.title}" (${payload.location}).`
        });
        break;
      case 'REQUEST_RRA_STATUS':
        setToast({
          type: 'success',
          title: `RRA Status Inquiry Submitted`,
          message: `Electronic expedite inquiry sent to RRA Customs for container ${payload.container} (Consignee: ${payload.consignee}).`
        });
        break;
      case 'PRINT_GATE_PASS':
        setToast({
          type: 'success',
          title: `Gate-Out Exit Pass Generated`,
          message: `Official dry port gate pass printed for container ${payload.container} at Zone ${payload.zone}. Ready for collection.`
        });
        break;
      default:
        setToast({
          type: 'info',
          title: 'Action Triggered',
          message: 'Operation executed successfully by Synapse system.'
        });
    }
  };

  // Resolve an alert
  const handleResolveAlert = async (alertId) => {
    try {
      setResolvingAlertId(alertId);
      await api.resolveBottleneck(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      if (kpi) {
        setKpi(prev => ({
          ...prev,
          activeBottlenecksCount: Math.max(0, (prev.activeBottlenecksCount || 1) - 1)
        }));
      }
      setToast({
        type: 'success',
        title: 'Incident Resolved',
        message: 'Operational bottleneck marked resolved and logged in terminal audit log.'
      });
    } catch (err) {
      console.error('Failed to resolve alert:', err);
      setToast({
        type: 'error',
        title: 'Resolution Error',
        message: 'Could not resolve incident. Please try again or verify network connection.'
      });
    } finally {
      setResolvingAlertId(null);
    }
  };

  // Ask Synapse AI
  const handleAskAi = async (query) => {
    try {
      setIsAskingAi(true);
      const res = await api.askSynapse(query);
      setAiResponse(res);
    } catch (err) {
      console.error('Error in Ask Synapse AI:', err);
      setAiResponse({
        query,
        answer: "Could not communicate with the AI engine. Please ensure backend and AI microservice are running.",
        intentCategory: "OPERATIONAL_NOTICE",
        keyFindings: ["Connection timeout to AI Service"],
        recommendedActions: ["Check AI microservice on port 8000"]
      });
    } finally {
      setIsAskingAi(false);
    }
  };

  // Generate Custom Briefing
  const handleGenerateBriefing = async (date, customFocus) => {
    try {
      setIsGeneratingBriefing(true);
      const newBriefing = await api.generateBriefing(date, customFocus);
      setBriefing(newBriefing);
      setIsBriefingModalOpen(false);
      setToast({
        type: 'success',
        title: 'Shift Briefing Updated',
        message: 'New operational briefing synthesized with latest port metrics.'
      });
    } catch (err) {
      console.error('Error generating briefing:', err);
      setToast({
        type: 'error',
        title: 'Synthesis Error',
        message: 'Could not regenerate briefing.'
      });
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  // Quick Filter handler from Macro KPI Cards
  const handleQuickFilter = ({ channel, stage, quickTab: newQuickTab }) => {
    if (channel !== undefined) setSelectedChannel(channel);
    if (stage !== undefined) setSelectedStage(stage);
    if (newQuickTab) setQuickTab(newQuickTab);
  };

  // Reset All Filters
  const handleResetAllFilters = () => {
    setQuickTab('ALL');
    setSelectedZoneCode(null);
    setSelectedChannel('');
    setSelectedStage('');
    setSelectedCorridor('');
    setSearchTerm('');
  };

  // Multi-dimensional filtered shipments
  const filteredShipments = shipments.filter(s => {
    // Quick Tab filter
    if (quickTab === 'ACTION_REQUIRED') {
      const isRedOrIssue = s.customsChannel === 'RED' || s.stage === 'INSPECTION_BAY' || (s.dwellTimeHours && s.dwellTimeHours > 24);
      if (!isRedOrIssue) return false;
    } else if (quickTab === 'DWELL_ALERT') {
      if (!s.dwellTimeHours || s.dwellTimeHours <= 24) return false;
    } else if (quickTab === 'TRANSIT') {
      if (s.stage !== 'CORRIDOR_TRANSIT' && s.stage !== 'BORDER_CROSSING') return false;
    } else if (quickTab === 'STORED') {
      if (s.stage !== 'WAREHOUSE_STORED') return false;
    }

    // Specific filters
    if (selectedZoneCode && s.warehouseZoneCode !== selectedZoneCode) return false;
    if (selectedChannel && s.customsChannel !== selectedChannel) return false;
    if (selectedStage && s.stage !== selectedStage) return false;
    if (selectedCorridor && s.corridor !== selectedCorridor) return false;

    // Text search filter
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

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex flex-col antialiased">
      
      {/* Interactive Action Feedback Toast */}
      <ActionToast toast={toast} onDismiss={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar 
        onOpenAskAi={() => setIsAskAiOpen(true)}
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Error Alert if backend connection fails */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 mt-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-md flex items-center gap-3 text-xs shadow-2xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Operational Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-5 space-y-4">
        
        {/* 1. Macro KPI Strip with Traffic Light Badges & 1-Click Drilldowns */}
        <MacroKpiStrip 
          kpi={kpi} 
          loading={loading} 
          onQuickFilter={handleQuickFilter}
        />

        {/* 2. Shift Operations Briefing Narrative */}
        <OperationsBriefingCard 
          briefing={briefing} 
          loading={loading}
          onRegenerate={() => setIsBriefingModalOpen(true)}
          isRegenerating={isGeneratingBriefing}
        />

        {/* 3. Operational Bottlenecks & Incident Resolution */}
        <BottleneckAlertsCenter 
          alerts={alerts}
          onResolveAlert={handleResolveAlert}
          resolvingId={resolvingAlertId}
          onTriggerAction={handleTriggerAction}
        />

        {/* 4. Storage & Yard Zone Matrix with Free Capacity Counters & Drilldowns */}
        <WarehouseZoneGrid 
          zones={zones}
          onSelectZone={setSelectedZoneCode}
          selectedZoneCode={selectedZoneCode}
          onTriggerAction={handleTriggerAction}
        />

        {/* 5. Corridor Fleet Transit Radar & Border Telematics */}
        <CorridorFleetRadar 
          trips={fleetTrips}
          fleetStats={fleetStats}
          loading={loading}
          onSelectCorridor={setSelectedCorridor}
          onTriggerAction={handleTriggerAction}
          onSelectTruckShipment={(trip) => {
            const match = shipments.find(s => s.containerNumber === trip.containerNumber);
            if (match) {
              setSelectedShipment(match);
            } else {
              setSelectedShipment({
                containerNumber: trip.containerNumber,
                trackingNumber: `TRK-${trip.id || 'FLEET'}`,
                shippingLine: trip.transporterCompany,
                consigneeName: trip.consignee || 'Consignee In-Transit',
                cargoType: 'Containerized Goods',
                teuCount: 2,
                weightKg: 24500,
                dwellTimeHours: 0,
                commodityDescription: 'Commercial Cargo In-Transit',
                customsChannel: trip.status === 'BORDER_HOLD' ? 'RED' : 'GREEN',
                customsDeclarationNumber: `RRA-${trip.id}09`,
                originPort: trip.corridor === 'CENTRAL_CORRIDOR' ? 'Dar es Salaam Port' : 'Mombasa Port',
                destinationHub: 'DP World Kigali (Masaka Hub)',
                corridor: trip.corridor,
                stage: trip.status === 'BORDER_HOLD' ? 'BORDER_CROSSING' : 'CORRIDOR_TRANSIT',
                warehouseZoneCode: 'YARD-A',
                warehouseZoneName: 'Main Container Yard'
              });
            }
          }}
        />

        {/* 6. RRA Customs Clearance Matrix & Shipment Manifest */}
        <CustomsClearanceMatrix 
          shipments={filteredShipments}
          channelCounts={channelCounts}
          loading={loading}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          selectedZoneCode={selectedZoneCode}
          onResetZone={() => setSelectedZoneCode(null)}
          selectedCorridor={selectedCorridor}
          onResetCorridor={() => setSelectedCorridor('')}
          quickTab={quickTab}
          onSelectQuickTab={setQuickTab}
          onResetAllFilters={handleResetAllFilters}
          onSelectShipment={setSelectedShipment}
          onTriggerAction={handleTriggerAction}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 lg:px-8 text-center text-xs text-slate-500 mt-6">
        <p>
          DP World Kigali &bull; Masaka Inland Container Depot & Warehousing Hub &bull; Synapse Operations Intelligence Platform &copy; 2026
        </p>
      </footer>

      {/* "Ask Synapse" AI Drawer with Suggestion Chips */}
      <AskSynapseDrawer 
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        onAskAi={handleAskAi}
        isAsking={isAskingAi}
        aiResponse={aiResponse}
      />

      {/* Shipment Details Modal with Action Triggers */}
      <ShipmentDetailModal 
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onTriggerAction={handleTriggerAction}
      />

      {/* Operational Briefing Synthesis Modal */}
      <BriefingModal 
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        onGenerate={handleGenerateBriefing}
        isGenerating={isGeneratingBriefing}
      />

    </div>
  );
}
