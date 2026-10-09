import React from 'react';
import { SynapseProvider, useSynapse } from './context/SynapseContext';
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

function DashboardContent() {
  const {
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
    dismissToast,

    // Actions & AI
    triggerAction,
    resolveAlert,
    askSynapse,
    isAskingAi,
    aiResponse,
    resynthesizeBriefing,
    isGeneratingBriefing,
    refreshAll,
    isRefreshing
  } = useSynapse();

  // 1-Click quick filter from KPI cards
  const handleQuickFilter = ({ channel, stage, quickTab: newQuickTab }) => {
    if (channel !== undefined) setSelectedChannel(channel);
    if (stage !== undefined) setSelectedStage(stage);
    if (newQuickTab) setQuickTab(newQuickTab);
  };

  // Quick filter from corridor radar
  const handleSelectCorridor = (corridor) => {
    setSelectedCorridor(corridor);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex flex-col antialiased">
      
      {/* Toast Notification Provider */}
      <ActionToast toast={toast} onDismiss={dismissToast} />

      {/* Corporate Top Navbar */}
      <Navbar 
        onOpenAskAi={() => setIsAskAiOpen(true)}
        onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        onRefreshAll={refreshAll}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Main Operational Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-5 space-y-4">
        
        {/* 1. Macro KPI Strip with Traffic Light Badges & Interactive Drilldowns */}
        <MacroKpiStrip 
          kpi={kpi} 
          loading={false} 
          onQuickFilter={handleQuickFilter}
        />

        {/* 2. Shift Operations Narrative Briefing */}
        <OperationsBriefingCard 
          briefing={briefing} 
          loading={false}
          onRegenerate={() => setIsBriefingModalOpen(true)}
          isRegenerating={isGeneratingBriefing}
        />

        {/* 3. Operational Bottlenecks & Incident Resolution Center */}
        <BottleneckAlertsCenter 
          alerts={alerts}
          onResolveAlert={resolveAlert}
          resolvingId={null}
          onTriggerAction={triggerAction}
        />

        {/* 4. Storage & Yard Zone Matrix with Free Capacity Counters & 1-Click Drilldown */}
        <WarehouseZoneGrid 
          zones={zones}
          onSelectZone={(code) => setSelectedZoneCode(selectedZoneCode === code ? null : code)}
          selectedZoneCode={selectedZoneCode}
          onTriggerAction={triggerAction}
        />

        {/* 5. Corridor Fleet Transit Radar & Border Telematics */}
        <CorridorFleetRadar 
          trips={fleetTrips}
          fleetStats={fleetStats}
          loading={false}
          onSelectCorridor={handleSelectCorridor}
          onTriggerAction={triggerAction}
          onSelectTruckShipment={(trip) => {
            const match = shipments.find(s => s.containerNumber === trip.containerNumber);
            if (match) {
              setSelectedShipment(match);
            } else {
              setSelectedShipment({
                id: trip.assignedShipmentId || trip.id,
                containerNumber: trip.containerNumber,
                trackingNumber: `TRK-${trip.id || 'FLEET'}`,
                shippingLine: trip.transporterCompany,
                consigneeName: trip.consignee || 'Consignee In-Transit',
                cargoType: 'Containerized Cargo',
                teuCount: 2,
                weightKg: 24500,
                dwellTimeHours: 0,
                commodityDescription: 'Commercial Cargo In-Transit',
                customsChannel: trip.status === 'BORDER_HOLD' ? 'RED' : 'GREEN',
                customsDeclarationNumber: `RRA-${trip.id}09`,
                originPort: trip.corridor === 'CENTRAL_CORRIDOR' ? 'Dar es Salaam Port' : 'Mombasa Port',
                destinationHub: 'DP World Masaka',
                corridor: trip.corridor,
                stage: trip.status === 'BORDER_HOLD' ? 'BORDER_CROSSING' : 'CORRIDOR_TRANSIT',
                warehouseZoneCode: 'ZONE-A-BONDED',
                warehouseZoneName: 'Bonded CFS & Import Holding'
              });
            }
          }}
        />

        {/* 6. RRA Customs Clearance Matrix & Shipment Manifest Table */}
        <CustomsClearanceMatrix 
          shipments={filteredShipments}
          channelCounts={channelCounts}
          loading={false}
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
          onResetAllFilters={resetAllFilters}
          onSelectShipment={setSelectedShipment}
          onTriggerAction={triggerAction}
        />

      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 lg:px-8 text-center text-xs text-slate-500 mt-6">
        <p>
          DP World Kigali &bull; Masaka Inland Container Depot & Warehousing Hub &bull; Synapse Operations Intelligence Platform &copy; 2026
        </p>
      </footer>

      {/* "Ask Synapse" AI Assistant Drawer */}
      <AskSynapseDrawer 
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        onAskAi={askSynapse}
        isAsking={isAskingAi}
        aiResponse={aiResponse}
        onApplyFilter={(filterTrigger) => {
          if (filterTrigger.channel) setSelectedChannel(filterTrigger.channel);
          if (filterTrigger.stage) setSelectedStage(filterTrigger.stage);
          if (filterTrigger.zoneCode) setSelectedZoneCode(filterTrigger.zoneCode);
          if (filterTrigger.quickTab) setQuickTab(filterTrigger.quickTab);
        }}
      />

      {/* Shipment Details Modal */}
      <ShipmentDetailModal 
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onTriggerAction={triggerAction}
      />

      {/* Shift Operations Briefing Modal */}
      <BriefingModal 
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        onGenerate={resynthesizeBriefing}
        isGenerating={isGeneratingBriefing}
      />

    </div>
  );
}

export default function App() {
  return (
    <SynapseProvider>
      <DashboardContent />
    </SynapseProvider>
  );
}
