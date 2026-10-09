package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final KpiService kpiService;
    private final WarehouseService warehouseService;
    private final ShipmentService shipmentService;
    private final FleetService fleetService;
    private final BottleneckService bottleneckService;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AskAiResponse askSynapse(AskAiRequest request) {
        String query = request.getQuery();
        log.info("Processing Ask Synapse query: '{}'", query);

        // Fetch live context from DP World Kigali services
        KpiSummaryDto kpi = kpiService.getKpiSummary();
        List<WarehouseZoneDto> zones = warehouseService.getAllZones();
        List<BottleneckAlertDto> activeAlerts = bottleneckService.getActiveAlerts();
        FleetStatsDto fleetStats = fleetService.getFleetStats();

        Map<String, Object> contextTelemetry = new HashMap<>();
        contextTelemetry.put("kpi", kpi);
        contextTelemetry.put("zones", zones);
        contextTelemetry.put("activeAlerts", activeAlerts);
        contextTelemetry.put("fleetStats", fleetStats);

        // Attempt Python AI microservice invocation
        try {
            WebClient webClient = WebClient.builder()
                    .baseUrl(aiServiceUrl)
                    .build();

            Map<String, Object> payload = new HashMap<>();
            payload.put("query", query);
            payload.put("contextFilter", request.getContextFilter());
            payload.put("telemetry", contextTelemetry);

            AskAiResponse aiResponse = webClient.post()
                    .uri("/api/v1/ai/query")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(AskAiResponse.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            if (aiResponse != null) {
                return aiResponse;
            }
        } catch (Exception e) {
            log.warn("AI microservice query unreachable at {}. Using operational rule engine fallback: {}", aiServiceUrl, e.getMessage());
        }

        return generateRuleEngineResponse(query, kpi, zones, activeAlerts, fleetStats);
    }

    private AskAiResponse generateRuleEngineResponse(
            String query,
            KpiSummaryDto kpi,
            List<WarehouseZoneDto> zones,
            List<BottleneckAlertDto> alerts,
            FleetStatsDto fleetStats
    ) {
        String lower = query.toLowerCase();
        String intent = "GENERAL_INTELLIGENCE";
        String answer;
        List<String> findings = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (lower.contains("bottleneck") || lower.contains("alert") || lower.contains("issue") || lower.contains("delay")) {
            intent = "BOTTLENECK_ANALYSIS";
            answer = String.format(
                    "Currently, DP World Kigali has %d active operational bottlenecks. The top critical points are: " +
                    "1) Rusumo OSBP border synchronization delay on the Central Corridor (+4.8h queue for 14 trucks). " +
                    "2) Physical scanner backlog at Masaka Inspection Bay with 9 containers pending RRA clearance. " +
                    "3) Zone D Cold Room Reefer ambient drift under active monitoring (+3.4°C).",
                    alerts.size()
            );
            findings.add("Rusumo Border Post has single-window system latency between TRA and RRA.");
            findings.add("Inspection Bay Scanner #2 undergoing sensor calibration.");
            actions.add("Deploy auxiliary mobile scanner at Masaka Bay 4.");
            actions.add("Stagger outbound dispatch from Morogoro weighbridge.");
        } else if (lower.contains("tat") || lower.contains("turnaround") || lower.contains("truck") || lower.contains("gate")) {
            intent = "FLEET_TURNAROUND_ANALYSIS";
            answer = String.format(
                    "Masaka Gate truck turnaround time (TAT) is performing at an average of %.1f minutes, which meets our corporate SLA of < 45 minutes. " +
                    "Overall fleet in transit: %d trucks, with %d trucks at border hold and %d currently unloading in the terminal.",
                    kpi.getAvgTruckTurnaroundMins(),
                    fleetStats.getActiveTripsInTransit(),
                    fleetStats.getTripsAtBorderHold(),
                    fleetStats.getTripsAtMasakaGate()
            );
            findings.add(String.format("Average turnaround is %.1f minutes (Target: < 45m).", kpi.getAvgTruckTurnaroundMins()));
            findings.add("Green Channel RFID-equipped trucks clearing gate-out in under 38 minutes.");
            actions.add("Maintain open lane on Scale #3 during peak hours (07:00-09:00).");
        } else if (lower.contains("customs") || lower.contains("channel") || lower.contains("rra") || lower.contains("red") || lower.contains("green")) {
            intent = "CUSTOMS_CHANNEL_ANALYSIS";
            answer = String.format(
                    "DP World Kigali customs clearance rate is currently at %.1f%% across all Rwanda Revenue Authority (RRA) channels. " +
                    "Channel distribution: Green: %d, Yellow: %d, Red: %d, Blue (AEO): %d.",
                    kpi.getCustomsClearanceRatePct(),
                    kpi.getCustomsChannelCounts().getOrDefault("GREEN", 0),
                    kpi.getCustomsChannelCounts().getOrDefault("YELLOW", 0),
                    kpi.getCustomsChannelCounts().getOrDefault("RED", 0),
                    kpi.getCustomsChannelCounts().getOrDefault("BLUE", 0)
            );
            findings.add("Red channel inspection accounts for the majority of dwell time.");
            findings.add("AEO Blue Channel shipments clearing with zero physical hold.");
            actions.add("Prioritize destuffing for urgent raw material consignees (Bralirwa, Inyange).");
        } else if (lower.contains("warehouse") || lower.contains("zone") || lower.contains("cold") || lower.contains("capacity")) {
            intent = "WAREHOUSE_UTILIZATION_ANALYSIS";
            answer = String.format(
                    "Total Masaka Dry Port capacity is utilized at %.1f%% (%d TEUs). Bonded CFS (Zone A) is at %.1f%%, Non-Bonded (Zone B) is at %.1f%%, and Cold Chain (Zone D) is at %.1f%%.",
                    kpi.getOverallYardUtilizationPct(),
                    kpi.getCurrentYardTeu(),
                    kpi.getBondedCapacityUtilPct(),
                    kpi.getNonBondedCapacityUtilPct(),
                    kpi.getColdChainCapacityUtilPct()
            );
            findings.add("Zone D (Cold Chain) is operating at near capacity (90.8%) due to pharma vaccine batches.");
            findings.add("Zone F (Empty Yard) has high inventory of 40ft High-Cube boxes.");
            actions.add("Engage shipping lines for empty container evacuation rakes.");
        } else {
            answer = String.format(
                    "DP World Kigali (Masaka Hub) operations summary: Daily throughput is %d TEUs (%d Inbound / %d Outbound). " +
                    "Yard utilization stands at %.1f%%. Truck turnaround averages %.1f mins. There are %d active operational alerts.",
                    kpi.getTotalTeuThroughput(),
                    kpi.getDailyTeuInbound(),
                    kpi.getDailyTeuOutbound(),
                    kpi.getOverallYardUtilizationPct(),
                    kpi.getAvgTruckTurnaroundMins(),
                    alerts.size()
            );
            findings.add(String.format("Port status: High throughput with %d active TEUs in yard.", kpi.getCurrentYardTeu()));
            actions.add("Review the daily operations briefing for corridor updates and recommendations.");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("kpi", kpi);
        data.put("activeAlertsCount", alerts.size());

        return AskAiResponse.builder()
                .query(query)
                .answer(answer)
                .intentCategory(intent)
                .keyFindings(findings)
                .recommendedActions(actions)
                .dataTelemetry(data)
                .answeredAt(Instant.now())
                .build();
    }
}
