package com.dpworld.synapse.config;

import com.dpworld.synapse.entity.*;
import com.dpworld.synapse.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final WarehouseZoneRepository warehouseZoneRepository;
    private final ShipmentRepository shipmentRepository;
    private final FleetTripRepository fleetTripRepository;
    private final OperationalMetricRepository operationalMetricRepository;
    private final BottleneckAlertRepository bottleneckAlertRepository;
    private final ExecutiveBriefingRepository executiveBriefingRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (warehouseZoneRepository.count() == 0) {
            log.info("Initializing DP World Synapse database with Kigali Logistics Hub seed data...");
            seedData();
            log.info("Database successfully seeded with realistic dry port operational data.");
        } else {
            log.info("Database already contains operational data. Skipping initialization.");
        }
    }

    private void seedData() {
        OffsetDateTime now = OffsetDateTime.now();
        LocalDate today = LocalDate.now();

        // 1. Warehouse Zones
        WarehouseZone zoneA = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-A-BONDED")
                .zoneName("Bonded CFS & Import Holding")
                .zoneType("BONDED")
                .totalCapacitySqm(BigDecimal.valueOf(12500.00))
                .totalCapacityTeu(850)
                .currentOccupancyTeu(714)
                .status("NEAR_CAPACITY")
                .supervisorName("Jean-Paul Mugisha")
                .build());

        WarehouseZone zoneB = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-B-NONBONDED")
                .zoneName("Non-Bonded FMCG & Retail Distribution")
                .zoneType("NON_BONDED")
                .totalCapacitySqm(BigDecimal.valueOf(18000.00))
                .totalCapacityTeu(1200)
                .currentOccupancyTeu(820)
                .status("OPTIMAL")
                .supervisorName("Aline Uwase")
                .build());

        WarehouseZone zoneC = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-C-AGRI")
                .zoneName("Agri-Commodities & Mineral Export Hub")
                .zoneType("CFS")
                .totalCapacitySqm(BigDecimal.valueOf(9500.00))
                .totalCapacityTeu(600)
                .currentOccupancyTeu(495)
                .status("OPTIMAL")
                .supervisorName("Emmanuel Habimana")
                .build());

        WarehouseZone zoneD = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-D-COLD")
                .zoneName("Cold Chain Pharma & Fresh Produce Hub")
                .zoneType("COLD_CHAIN")
                .totalCapacitySqm(BigDecimal.valueOf(4200.00))
                .totalCapacityTeu(240)
                .currentOccupancyTeu(218)
                .temperatureCelsius(BigDecimal.valueOf(3.4))
                .targetTempMin(BigDecimal.valueOf(2.0))
                .targetTempMax(BigDecimal.valueOf(8.0))
                .status("NEAR_CAPACITY")
                .supervisorName("Dr. Diane Keza")
                .build());

        WarehouseZone zoneE = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-E-HAZMAT")
                .zoneName("Dangerous Goods & Project Heavy Cargo")
                .zoneType("HAZMAT")
                .totalCapacitySqm(BigDecimal.valueOf(3500.00))
                .totalCapacityTeu(180)
                .currentOccupancyTeu(72)
                .status("OPTIMAL")
                .supervisorName("Claude Ndayisaba")
                .build());

        WarehouseZone zoneF = warehouseZoneRepository.save(WarehouseZone.builder()
                .zoneCode("ZONE-F-EMPTY")
                .zoneName("Empty Container Yard & Reefer Gantry")
                .zoneType("EMPTY_YARD")
                .totalCapacitySqm(BigDecimal.valueOf(22000.00))
                .totalCapacityTeu(1800)
                .currentOccupancyTeu(1340)
                .temperatureCelsius(BigDecimal.valueOf(-18.2))
                .targetTempMin(BigDecimal.valueOf(-22.0))
                .targetTempMax(BigDecimal.valueOf(-15.0))
                .status("OPTIMAL")
                .supervisorName("Patrick Nshimiyimana")
                .build());

        // 2. Shipments
        Shipment s1 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1001")
                .containerNumber("MSKU7829104")
                .sealNumber("SL-MSK-9912")
                .shippingLine("Maersk")
                .consigneeName("Bralirwa Plc")
                .consignorName("Heineken Supply BV")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("Barley Malt & Brewing Raw Materials")
                .weightKg(BigDecimal.valueOf(26400.00))
                .teuCount(2)
                .customsChannel("GREEN")
                .customsStatus("CLEARED")
                .customsDeclarationNumber("RRA-2026-DEC-09812")
                .stage("WAREHOUSE_STORED")
                .warehouseZone(zoneA)
                .eta(now.minusDays(3))
                .gateInAt(now.minusHours(48))
                .customsClearedAt(now.minusHours(24))
                .dwellTimeHours(BigDecimal.valueOf(48.0))
                .isBonded(true)
                .build());

        Shipment s2 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1002")
                .containerNumber("CMAU8192031")
                .sealNumber("SL-CMA-4421")
                .shippingLine("CMA CGM")
                .consigneeName("Inyange Industries Ltd")
                .consignorName("Tetra Pak Arabia")
                .originPort("Mombasa Port")
                .destinationHub("DP World Masaka")
                .corridor("NORTHERN_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("Aseptic Beverage Packaging Rolls")
                .weightKg(BigDecimal.valueOf(21500.00))
                .teuCount(1)
                .customsChannel("YELLOW")
                .customsStatus("CLEARED")
                .customsDeclarationNumber("RRA-2026-DEC-09844")
                .stage("WAREHOUSE_STORED")
                .warehouseZone(zoneB)
                .eta(now.minusDays(2))
                .gateInAt(now.minusHours(36))
                .customsClearedAt(now.minusHours(12))
                .dwellTimeHours(BigDecimal.valueOf(36.0))
                .isBonded(false)
                .build());

        Shipment s3 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1003")
                .containerNumber("MSCU9102834")
                .sealNumber("SL-MSC-1109")
                .shippingLine("MSC")
                .consigneeName("Rwanda Tea Authority (NAEB)")
                .consignorName("Twinings Global")
                .originPort("DP World Masaka")
                .destinationHub("Mombasa Port")
                .corridor("NORTHERN_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("Highland Premium Black Tea (Export)")
                .weightKg(BigDecimal.valueOf(24000.00))
                .teuCount(2)
                .customsChannel("GREEN")
                .customsStatus("CLEARED")
                .customsDeclarationNumber("RRA-2026-EXP-00412")
                .stage("WAREHOUSE_STORED")
                .warehouseZone(zoneC)
                .eta(now.minusDays(1))
                .gateInAt(now.minusHours(20))
                .customsClearedAt(now.minusHours(18))
                .dwellTimeHours(BigDecimal.valueOf(20.0))
                .isBonded(true)
                .build());

        Shipment s4 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1004")
                .containerNumber("HLCU3910283")
                .sealNumber("SL-HLC-7732")
                .shippingLine("Hapag-Lloyd")
                .consigneeName("Rwanda Medical Supply (RMS)")
                .consignorName("Sanofi Pasteur France")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("COLD_CHAIN")
                .commodityDescription("Temperature-Controlled Vaccines & Insulin")
                .weightKg(BigDecimal.valueOf(12800.00))
                .teuCount(1)
                .customsChannel("BLUE")
                .customsStatus("CLEARED")
                .customsDeclarationNumber("RRA-2026-AEO-0012")
                .stage("WAREHOUSE_STORED")
                .warehouseZone(zoneD)
                .eta(now.minusDays(2))
                .gateInAt(now.minusHours(28))
                .customsClearedAt(now.minusHours(26))
                .dwellTimeHours(BigDecimal.valueOf(28.0))
                .isBonded(true)
                .build());

        Shipment s5 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1005")
                .containerNumber("TEMU4401928")
                .sealNumber("SL-TEM-6619")
                .shippingLine("PIL")
                .consigneeName("Cimerwa Cement Ltd")
                .consignorName("Sinoma Equipment Beijing")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("BULK")
                .commodityDescription("Grinding Mill Heavy Machinery Parts")
                .weightKg(BigDecimal.valueOf(42000.00))
                .teuCount(2)
                .customsChannel("YELLOW")
                .customsStatus("CLEARED")
                .customsDeclarationNumber("RRA-2026-DEC-10023")
                .stage("WAREHOUSE_STORED")
                .warehouseZone(zoneE)
                .eta(now.minusDays(4))
                .gateInAt(now.minusHours(60))
                .customsClearedAt(now.minusHours(30))
                .dwellTimeHours(BigDecimal.valueOf(60.0))
                .isBonded(false)
                .build());

        Shipment s6 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1006")
                .containerNumber("MSKU9918234")
                .sealNumber("SL-MSK-3341")
                .shippingLine("Maersk")
                .consigneeName("Airtel Rwanda Ltd")
                .consignorName("Huawei Tech Shenzhen")
                .originPort("Mombasa Port")
                .destinationHub("DP World Masaka")
                .corridor("NORTHERN_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("Telecom Transmission Base Stations & Antennas")
                .weightKg(BigDecimal.valueOf(18500.00))
                .teuCount(1)
                .customsChannel("RED")
                .customsStatus("PHYSICAL_SCAN")
                .customsDeclarationNumber("RRA-2026-DEC-10119")
                .stage("INSPECTION_BAY")
                .warehouseZone(zoneA)
                .eta(now.minusDays(1))
                .gateInAt(now.minusHours(16))
                .dwellTimeHours(BigDecimal.valueOf(16.0))
                .isBonded(true)
                .build());

        Shipment s7 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1007")
                .containerNumber("MSCU3019284")
                .sealNumber("SL-MSC-8821")
                .shippingLine("MSC")
                .consigneeName("Simba Supermarket Holdings")
                .consignorName("Nestle Middle East")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("Confectionery & Dairy Packaged Goods")
                .weightKg(BigDecimal.valueOf(23000.00))
                .teuCount(2)
                .customsChannel("RED")
                .customsStatus("PHYSICAL_SCAN")
                .customsDeclarationNumber("RRA-2026-DEC-10140")
                .stage("INSPECTION_BAY")
                .warehouseZone(zoneA)
                .eta(now.minusDays(1))
                .gateInAt(now.minusHours(14))
                .dwellTimeHours(BigDecimal.valueOf(14.0))
                .isBonded(true)
                .build());

        Shipment s8 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1010")
                .containerNumber("MSKU2201948")
                .sealNumber("SL-MSK-7718")
                .shippingLine("Maersk")
                .consigneeName("Africa Improved Foods (AIF)")
                .consignorName("Archer Daniels Midland")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("BULK")
                .commodityDescription("Non-GMO Fortified Soybeans")
                .weightKg(BigDecimal.valueOf(28000.00))
                .teuCount(2)
                .customsChannel("YELLOW")
                .customsStatus("DOCUMENT_VERIFICATION")
                .customsDeclarationNumber("RRA-2026-DEC-10201")
                .stage("YARD_GATE_IN")
                .warehouseZone(zoneC)
                .eta(now.minusHours(6))
                .gateInAt(now.minusHours(4))
                .dwellTimeHours(BigDecimal.valueOf(4.0))
                .isBonded(true)
                .build());

        Shipment s9 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1012")
                .containerNumber("CMAU9938102")
                .sealNumber("SL-CMA-9941")
                .shippingLine("CMA CGM")
                .consigneeName("Minapharm Laboratories Ltd")
                .consignorName("Novartis Basel")
                .originPort("Mombasa Port")
                .destinationHub("DP World Masaka")
                .corridor("NORTHERN_CORRIDOR")
                .cargoType("COLD_CHAIN")
                .commodityDescription("Specialized Cold-Stored Oncology Therapeutics")
                .weightKg(BigDecimal.valueOf(9400.00))
                .teuCount(1)
                .customsChannel("BLUE")
                .customsStatus("DOCUMENT_VERIFICATION")
                .customsDeclarationNumber("RRA-2026-AEO-0034")
                .stage("YARD_GATE_IN")
                .warehouseZone(zoneD)
                .eta(now.minusHours(3))
                .gateInAt(now.minusHours(1))
                .dwellTimeHours(BigDecimal.valueOf(1.0))
                .isBonded(true)
                .build());

        Shipment s10 = shipmentRepository.save(Shipment.builder()
                .trackingNumber("DPW-KGL-2026-1013")
                .containerNumber("MSKU4491029")
                .sealNumber("SL-MSK-6623")
                .shippingLine("Maersk")
                .consigneeName("MTN Rwanda Ltd")
                .consignorName("Ericsson Sweden Hub")
                .originPort("Dar es Salaam Port")
                .destinationHub("DP World Masaka")
                .corridor("CENTRAL_CORRIDOR")
                .cargoType("FCL")
                .commodityDescription("5G Core Network Racks & Optical Fiber")
                .weightKg(BigDecimal.valueOf(17800.00))
                .teuCount(1)
                .customsChannel("YELLOW")
                .customsStatus("DOCUMENT_VERIFICATION")
                .customsDeclarationNumber("RRA-2026-DEC-10331")
                .stage("CORRIDOR_TRANSIT")
                .warehouseZone(zoneA)
                .eta(now.plusHours(14))
                .dwellTimeHours(BigDecimal.ZERO)
                .isBonded(true)
                .build());

        // 3. Fleet Trips
        fleetTripRepository.save(FleetTrip.builder()
                .tripNumber("TRIP-2026-8801")
                .truckPlate("RAD 492 K")
                .trailerNumber("RL 3901")
                .driverName("Jean-Claude Bizimana")
                .driverPhone("+250 788 123 456")
                .transporterCompany("Bollore Africa Logistics")
                .corridor("CENTRAL_CORRIDOR")
                .originLocation("Dar es Salaam Port")
                .currentCheckpoint("Morogoro Weighbridge")
                .destinationHub("DP World Masaka")
                .status("IN_TRANSIT")
                .assignedShipment(s10)
                .departureTime(now.minusHours(36))
                .gpsLatitude(BigDecimal.valueOf(-6.823490))
                .gpsLongitude(BigDecimal.valueOf(37.663340))
                .build());

        fleetTripRepository.save(FleetTrip.builder()
                .tripNumber("TRIP-2026-8804")
                .truckPlate("T 412 DFP")
                .trailerNumber("TZ 9912")
                .driverName("Juma Rashid Bakari")
                .driverPhone("+255 754 332 110")
                .transporterCompany("Tahmeed Coach Cargo Dar")
                .corridor("CENTRAL_CORRIDOR")
                .originLocation("Dar es Salaam Port")
                .currentCheckpoint("Rusumo One-Stop Border Post")
                .destinationHub("DP World Masaka")
                .status("BORDER_HOLD")
                .assignedShipment(s8)
                .departureTime(now.minusHours(50))
                .borderArrivalTime(now.minusHours(10))
                .delayReason("Tanzania Revenue Authority OSBP single-window sync delay")
                .gpsLatitude(BigDecimal.valueOf(-2.382760))
                .gpsLongitude(BigDecimal.valueOf(30.785210))
                .build());

        fleetTripRepository.save(FleetTrip.builder()
                .tripNumber("TRIP-2026-8806")
                .truckPlate("RAD 772 P")
                .trailerNumber("RL 8810")
                .driverName("Alexandre Munyaneza")
                .driverPhone("+250 788 667 890")
                .transporterCompany("Spedag Interfreight Rwanda")
                .corridor("CENTRAL_CORRIDOR")
                .originLocation("Dar es Salaam Port")
                .currentCheckpoint("Masaka Terminal Gate")
                .destinationHub("DP World Masaka")
                .status("GATE_IN_MASAKA")
                .assignedShipment(s8)
                .departureTime(now.minusHours(54))
                .borderArrivalTime(now.minusHours(14))
                .borderClearanceTime(now.minusHours(10))
                .gateInTime(now.minusHours(4))
                .gpsLatitude(BigDecimal.valueOf(-1.996120))
                .gpsLongitude(BigDecimal.valueOf(30.198420))
                .build());

        fleetTripRepository.save(FleetTrip.builder()
                .tripNumber("TRIP-2026-8810")
                .truckPlate("RAD 118 T")
                .trailerNumber("RL 2205")
                .driverName("Eric Ndikubwimana")
                .driverPhone("+250 788 334 556")
                .transporterCompany("Bollore Africa Logistics")
                .corridor("CENTRAL_CORRIDOR")
                .originLocation("Dar es Salaam Port")
                .currentCheckpoint("Outbound Gate 2")
                .destinationHub("DP World Masaka")
                .status("DEPARTED")
                .assignedShipment(s1)
                .departureTime(now.minusHours(60))
                .gateInTime(now.minusHours(48))
                .gateOutTime(now.minusHours(47).minusMinutes(18))
                .turnaroundTimeMinutes(42)
                .gpsLatitude(BigDecimal.valueOf(-1.996800))
                .gpsLongitude(BigDecimal.valueOf(30.196900))
                .build());

        // 4. Operational Metrics (Past 14 Days)
        for (int i = 13; i >= 0; i--) {
            LocalDate metricDate = today.minusDays(i);
            int inbound = 140 + (14 - i) * 8 + (i % 3) * 4;
            int outbound = 125 + (14 - i) * 7 + (i % 2) * 5;
            int yard = 3050 + (14 - i) * 15;
            double tat = 48.5 - (14 - i) * 0.45;
            double dwell = 3.8 - (14 - i) * 0.06;
            double customsRate = 91.0 + (14 - i) * 0.25;

            operationalMetricRepository.save(OperationalMetric.builder()
                    .metricDate(metricDate)
                    .teuInboundToday(inbound)
                    .teuOutboundToday(outbound)
                    .teuInYard(yard)
                    .avgTruckTurnaroundMins(BigDecimal.valueOf(Math.round(tat * 10.0) / 10.0))
                    .avgDwellTimeDays(BigDecimal.valueOf(Math.round(dwell * 100.0) / 100.0))
                    .bondedUtilizationPct(BigDecimal.valueOf(76.0 + (14 - i) * 0.6))
                    .nonBondedUtilizationPct(BigDecimal.valueOf(62.0 + (14 - i) * 0.45))
                    .coldChainUtilizationPct(BigDecimal.valueOf(78.0 + (14 - i) * 0.95))
                    .customsClearanceRatePct(BigDecimal.valueOf(Math.min(96.5, Math.round(customsRate * 10.0) / 10.0)))
                    .greenChannelCount(28 + (14 - i) * 2)
                    .yellowChannelCount(14 + (14 - i))
                    .redChannelCount(6 + (i % 4))
                    .blueChannelCount(4 + (14 - i) / 2)
                    .activeBottlenecksCount(i < 3 ? 3 : 1)
                    .build());
        }

        // 5. Bottleneck Alerts
        bottleneckAlertRepository.save(BottleneckAlert.builder()
                .alertType("BORDER_CROSSING_CONGESTION")
                .severity("HIGH")
                .title("Rusumo OSBP Single-Window Synchronization Latency")
                .description("Tanzania Revenue Authority and Rwanda Revenue Authority clearance interface encountering intermittent socket timeouts, causing 14-truck queue at Rusumo border entry.")
                .affectedZoneOrCorridor("CENTRAL_CORRIDOR (Rusumo Post)")
                .status("ACTIVE")
                .impactSummary("Average border crossing transit time increased by +4.8 hours for Dar es Salaam inbound fleet.")
                .suggestedAction("Authorize manual clearance verification fallback and notify dispatch fleet to schedule staggered departures from Morogoro.")
                .build());

        bottleneckAlertRepository.save(BottleneckAlert.builder()
                .alertType("CUSTOMS_RED_CHANNEL_SURGE")
                .severity("HIGH")
                .title("Physical Scan Queue Surge at Masaka Inspection Bay")
                .description("9 containers assigned to RRA Red Channel inspection awaiting physical examination. Scanner #2 undergoing optical sensor calibration.")
                .affectedZoneOrCorridor("ZONE-A-BONDED / Inspection Bay")
                .status("ACTIVE")
                .impactSummary("Yard dwell time for imported high-value electronics and telecoms cargo increased to 16.4 hours.")
                .suggestedAction("Divert LCL shipments to Bay 4 manual destuffing and expedite RRA customs officer shift rotation.")
                .build());

        bottleneckAlertRepository.save(BottleneckAlert.builder()
                .alertType("COLD_CHAIN_TEMP_ANOMALY")
                .severity("MEDIUM")
                .title("Zone D Reefer Bay 3 Temperature Warning (+3.4°C)")
                .description("Cold room ambient reading drifted to 3.4°C (upper target bound: 4.0°C) following rapid destuffing of 2 reefer container boxes.")
                .affectedZoneOrCorridor("ZONE-D-COLD (Pharma Section)")
                .status("INVESTIGATING")
                .impactSummary("No pharmaceutical product breach yet, but threshold alert triggered for proactive containment.")
                .suggestedAction("Engage secondary HVAC chiller compressor and verify air curtain seal integrity at Bay D3.")
                .build());

        // 6. Operational Intelligence Briefing
        executiveBriefingRepository.save(ExecutiveBriefing.builder()
                .briefingDate(today)
                .title("Masaka Inland Port — Daily Operations & Fleet Status Briefing — " + today)
                .executiveSummary("DP World Kigali terminal operations report sustained throughput with 246 inbound TEUs and 218 outbound TEUs processed over the last 24-hour cycle. Total dry port yard occupancy stands at 3,260 TEUs (71.2% capacity). Masaka Gate truck turnaround time (TAT) averaged 42.4 minutes against the 45-minute target SLA. Shift teams should monitor two active operational bottlenecks: border clearance queue synchronization at Rusumo OSBP (Central Corridor) and physical scanner lane backlog at the Masaka Inspection Bay.")
                .operationalHighlights("[\"Daily throughput reached 464 TEUs combined across Central and Northern corridors, an increase of 5.2%.\", \"Truck Turnaround Time (TAT) reached 42.4 minutes (Target < 45m), aided by fast-track Green Channel AEO releases.\", \"Cold Chain Hub (Zone D) maintains 90.8% capacity with strict thermal control for pharmaceutical vaccines and export horticulture.\", \"Central Corridor freight represents 68% of inbound volume, with Northern Corridor handling 32%.\"]")
                .criticalRisks("[\"Rusumo OSBP customs single-window sync delay: 14 trucks currently queued awaiting data handshake (+4.8h delay).\", \"Inspection Bay Red Channel backlog: 9 containers queued awaiting scan completion during Scanner #2 sensor maintenance.\", \"Empty Yard Density (Zone F) at 74.4% capacity with rising 40ft container accumulation.\"]")
                .strategicRecommendations("[\"Coordinate with RRA Customs Directorate to deploy mobile container inspection scanner at Masaka Bay 4.\", \"Request Tanzania Port Authority & TRA liaison to activate offline contingency clearing at Rusumo.\", \"Trigger empty container repositioning incentive for tea and mineral export hauliers to evacuate Zone F empties to Mombasa.\"]")
                .rawKpiSnapshot("{\"teuInbound\":246,\"teuOutbound\":218,\"teuInYard\":3260,\"truckTurnaroundMins\":42.4,\"avgDwellDays\":2.9,\"bondedUtilPct\":84.0,\"nonBondedUtilPct\":68.3,\"coldChainUtilPct\":90.8,\"customsClearanceRatePct\":94.1,\"activeBottlenecks\":3}")
                .build());
    }
}
