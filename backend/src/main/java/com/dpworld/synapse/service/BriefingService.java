package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.ExecutiveBriefingDto;
import com.dpworld.synapse.dto.GenerateBriefingRequest;
import com.dpworld.synapse.dto.KpiSummaryDto;
import com.dpworld.synapse.entity.ExecutiveBriefing;
import com.dpworld.synapse.exception.ResourceNotFoundException;
import com.dpworld.synapse.repository.ExecutiveBriefingRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BriefingService {

    private final ExecutiveBriefingRepository executiveBriefingRepository;
    private final KpiService kpiService;
    private final ObjectMapper objectMapper;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Transactional(readOnly = true)
    public ExecutiveBriefingDto getLatestBriefing() {
        ExecutiveBriefing briefing = executiveBriefingRepository.findTopByOrderByGeneratedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No executive briefings available. Please generate one."));
        return mapToDto(briefing);
    }

    @Transactional
    public ExecutiveBriefingDto generateBriefing(GenerateBriefingRequest request) {
        LocalDate targetDate = request.getDate() != null ? request.getDate() : LocalDate.now();
        KpiSummaryDto kpi = kpiService.getKpiSummary();

        // Attempt to call Python AI Microservice
        ExecutiveBriefingDto aiGenerated = null;
        try {
            WebClient webClient = WebClient.builder()
                    .baseUrl(aiServiceUrl)
                    .build();

            Map<String, Object> payload = new HashMap<>();
            payload.put("date", targetDate.toString());
            payload.put("customFocus", request.getCustomFocus());
            payload.put("kpiSnapshot", kpi);

            aiGenerated = webClient.post()
                    .uri("/api/v1/ai/briefing/generate")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(ExecutiveBriefingDto.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            log.info("Successfully received briefing from AI Microservice for date: {}", targetDate);
        } catch (Exception e) {
            log.warn("AI microservice unreachable at {}. Generating intelligent heuristic briefing fallback: {}", aiServiceUrl, e.getMessage());
        }

        if (aiGenerated == null) {
            aiGenerated = generateHeuristicBriefing(targetDate, kpi, request.getCustomFocus());
        }

        // Persist briefing in PostgreSQL database
        ExecutiveBriefing entity = ExecutiveBriefing.builder()
                .briefingDate(targetDate)
                .title(aiGenerated.getTitle())
                .executiveSummary(aiGenerated.getExecutiveSummary())
                .operationalHighlights(toJson(aiGenerated.getOperationalHighlights()))
                .criticalRisks(toJson(aiGenerated.getCriticalRisks()))
                .strategicRecommendations(toJson(aiGenerated.getStrategicRecommendations()))
                .rawKpiSnapshot(toJson(kpi))
                .build();

        ExecutiveBriefing saved = executiveBriefingRepository.save(entity);
        return mapToDto(saved);
    }

    private ExecutiveBriefingDto generateHeuristicBriefing(LocalDate date, KpiSummaryDto kpi, String customFocus) {
        String title = "Masaka Inland Port — Daily Operations & Fleet Status Briefing — " + date;
        String summary = String.format(
                "DP World Kigali terminal operations report: Inbound TEU throughput reached %d, with %d outbound TEUs processed. " +
                "Overall yard density is at %.1f%% (%d TEUs in yard). Masaka Gate truck turnaround averaged %.1f minutes (%s target). " +
                "Customs clearance rate is %.1f%% across RRA channels.",
                kpi.getDailyTeuInbound(),
                kpi.getDailyTeuOutbound(),
                kpi.getOverallYardUtilizationPct(),
                kpi.getCurrentYardTeu(),
                kpi.getAvgTruckTurnaroundMins(),
                kpi.getIsTurnaroundOnTarget() ? "meeting" : "exceeding",
                kpi.getCustomsClearanceRatePct()
        );

        List<String> highlights = List.of(
                String.format("Combined daily freight throughput hit %d TEUs across Central and Northern corridors.", kpi.getTotalTeuThroughput()),
                String.format("Truck turnaround time registered at %.1f mins against the standard 45-minute KPI.", kpi.getAvgTruckTurnaroundMins()),
                String.format("Cold Chain Hub (Zone D) running at %.1f%% capacity with stabilized pharma and perishable thermal control.", kpi.getColdChainCapacityUtilPct()),
                String.format("Green & Blue Authorized Economic Operator (AEO) channels represent fast-track clearances.")
        );

        List<String> risks = List.of(
                "Central Corridor (Rusumo OSBP): Border electronic single-window latency causing truck clearance queues.",
                "Inspection Bay (Zone A): Red Channel cargo undergoing thorough physical inspection scan.",
                String.format("Yard stacking density at %.1f%% requires sustained empty container evacuation to port corridors.", kpi.getOverallYardUtilizationPct())
        );

        List<String> recommendations = List.of(
                "Maintain coordination with Rwanda Revenue Authority (RRA) customs teams for expedited Red Channel shifts.",
                "Encourage shipping line regional reps (Maersk, CMA CGM) to reposition empty reefers and dry boxes from Zone F.",
                "Monitor Central Corridor truck flow and dispatch real-time traffic updates via Masaka Gate telematics."
        );

        return ExecutiveBriefingDto.builder()
                .briefingDate(date)
                .title(title)
                .executiveSummary(summary)
                .operationalHighlights(highlights)
                .criticalRisks(risks)
                .strategicRecommendations(recommendations)
                .rawKpiSnapshot(kpi)
                .build();
    }

    public ExecutiveBriefingDto mapToDto(ExecutiveBriefing entity) {
        return ExecutiveBriefingDto.builder()
                .id(entity.getId())
                .briefingDate(entity.getBriefingDate())
                .generatedAt(entity.getGeneratedAt())
                .title(entity.getTitle())
                .executiveSummary(entity.getExecutiveSummary())
                .operationalHighlights(parseList(entity.getOperationalHighlights()))
                .criticalRisks(parseList(entity.getCriticalRisks()))
                .strategicRecommendations(parseList(entity.getStrategicRecommendations()))
                .rawKpiSnapshot(parseObject(entity.getRawKpiSnapshot()))
                .build();
    }

    private List<String> parseList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of(json);
        }
    }

    private Object parseObject(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }
}
