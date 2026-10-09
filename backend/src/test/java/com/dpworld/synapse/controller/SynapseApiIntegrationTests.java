package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.AskAiRequest;
import com.dpworld.synapse.dto.GenerateBriefingRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SynapseApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/kpi/summary - should return executive macro KPIs")
    void testGetKpiSummary() throws Exception {
        mockMvc.perform(get("/api/v1/kpi/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.dailyTeuInbound", greaterThan(0)))
                .andExpect(jsonPath("$.data.dailyTeuOutbound", greaterThan(0)))
                .andExpect(jsonPath("$.data.currentYardTeu", greaterThan(0)))
                .andExpect(jsonPath("$.data.avgTruckTurnaroundMins", notNullValue()))
                .andExpect(jsonPath("$.data.customsClearanceRatePct", notNullValue()))
                .andExpect(jsonPath("$.data.customsChannelCounts.GREEN", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/kpi/trends - should return multi-day time-series telemetry")
    void testGetKpiTrends() throws Exception {
        mockMvc.perform(get("/api/v1/kpi/trends").param("days", "14"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(10))));
    }

    @Test
    @DisplayName("GET /api/v1/warehouse-zones - should return all warehouse & yard zones")
    void testGetWarehouseZones() throws Exception {
        mockMvc.perform(get("/api/v1/warehouse-zones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(6)))
                .andExpect(jsonPath("$.data[?(@.zoneCode == 'ZONE-A-BONDED')].zoneName", contains("Bonded CFS & Import Holding")))
                .andExpect(jsonPath("$.data[?(@.zoneCode == 'ZONE-D-COLD')].temperatureCelsius", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/shipments - should return filterable paginated shipments manifest")
    void testGetShipments() throws Exception {
        mockMvc.perform(get("/api/v1/shipments")
                        .param("channel", "GREEN")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", not(empty())));
    }

    @Test
    @DisplayName("GET /api/v1/shipments/channels/breakdown - should return channel distribution")
    void testGetShipmentChannelBreakdown() throws Exception {
        mockMvc.perform(get("/api/v1/shipments/channels/breakdown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.GREEN", greaterThan(0)));
    }

    @Test
    @DisplayName("GET /api/v1/fleet/trips and /stats - should return corridor fleet tracking")
    void testGetFleetTripsAndStats() throws Exception {
        mockMvc.perform(get("/api/v1/fleet/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));

        mockMvc.perform(get("/api/v1/fleet/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overallAvgTurnaroundMinutes", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/bottlenecks/active - should return active operational alerts")
    void testGetActiveBottlenecks() throws Exception {
        mockMvc.perform(get("/api/v1/bottlenecks/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    @Test
    @DisplayName("GET /api/v1/briefings/latest - should return MD executive briefing")
    void testGetLatestBriefing() throws Exception {
        mockMvc.perform(get("/api/v1/briefings/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title", containsString("Masaka")))
                .andExpect(jsonPath("$.data.executiveSummary", notNullValue()))
                .andExpect(jsonPath("$.data.operationalHighlights", not(empty())));
    }

    @Test
    @DisplayName("POST /api/v1/briefings/generate - should trigger briefing compilation")
    void testGenerateBriefing() throws Exception {
        GenerateBriefingRequest request = GenerateBriefingRequest.builder()
                .date(LocalDate.now())
                .customFocus("Cold Chain and Rusumo Border Latency")
                .build();

        mockMvc.perform(post("/api/v1/briefings/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.executiveSummary", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/v1/ai/ask - should answer natural language operational question")
    void testAskSynapseAi() throws Exception {
        AskAiRequest request = AskAiRequest.builder()
                .query("What is the current truck turnaround time at Masaka?")
                .build();

        mockMvc.perform(post("/api/v1/ai/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.answer", containsString("turnaround")))
                .andExpect(jsonPath("$.data.keyFindings", not(empty())));
    }
}
