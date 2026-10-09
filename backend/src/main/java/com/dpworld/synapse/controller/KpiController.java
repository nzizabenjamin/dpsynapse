package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.KpiSummaryDto;
import com.dpworld.synapse.dto.TrendMetricDto;
import com.dpworld.synapse.service.KpiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kpi")
@RequiredArgsConstructor
@Tag(name = "Executive KPIs", description = "Executive macro operations metrics, throughput counters, and historical trends")
public class KpiController {

    private final KpiService kpiService;

    @GetMapping("/summary")
    @Operation(summary = "Get Executive KPI Summary", description = "Retrieves current day macro metrics including TEU throughput, yard utilization %, truck turnaround, and customs rate.")
    public ResponseEntity<ApiResponse<KpiSummaryDto>> getKpiSummary() {
        KpiSummaryDto summary = kpiService.getKpiSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get Historical Trend Metrics", description = "Retrieves multi-day time-series telemetry for throughput, dwell time, and turnaround.")
    public ResponseEntity<ApiResponse<List<TrendMetricDto>>> getTrends(
            @Parameter(description = "Number of historical days to fetch (default: 14)")
            @RequestParam(defaultValue = "14") int days
    ) {
        List<TrendMetricDto> trends = kpiService.getTrends(days);
        return ResponseEntity.ok(ApiResponse.ok(trends));
    }
}
