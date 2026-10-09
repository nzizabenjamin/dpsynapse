package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.BottleneckAlertDto;
import com.dpworld.synapse.service.BottleneckService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bottlenecks")
@RequiredArgsConstructor
@Tag(name = "Bottleneck Alerts & Incident Management", description = "Real-time congestion alerts, thermal anomalies, scanner maintenance, and mitigation actions")
public class BottleneckController {

    private final BottleneckService bottleneckService;

    @GetMapping
    @Operation(summary = "Get Bottleneck Alerts", description = "List bottleneck alerts filtered optionally by status (ACTIVE, INVESTIGATING, RESOLVED).")
    public ResponseEntity<ApiResponse<List<BottleneckAlertDto>>> getAlerts(
            @RequestParam(required = false) String status
    ) {
        List<BottleneckAlertDto> alerts = bottleneckService.getAlerts(status);
        return ResponseEntity.ok(ApiResponse.ok(alerts));
    }

    @GetMapping("/active")
    @Operation(summary = "Get Active Bottleneck Alerts", description = "Returns only currently active and investigating operational bottlenecks.")
    public ResponseEntity<ApiResponse<List<BottleneckAlertDto>>> getActiveAlerts() {
        List<BottleneckAlertDto> alerts = bottleneckService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.ok(alerts));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Alert By ID", description = "Retrieves details and mitigation actions for a specific alert.")
    public ResponseEntity<ApiResponse<BottleneckAlertDto>> getAlertById(@PathVariable Long id) {
        BottleneckAlertDto alert = bottleneckService.getAlertById(id);
        return ResponseEntity.ok(ApiResponse.ok(alert));
    }

    @PatchMapping("/{id}/resolve")
    @Operation(summary = "Resolve Bottleneck Alert", description = "Marks an active operational alert as resolved.")
    public ResponseEntity<ApiResponse<BottleneckAlertDto>> resolveAlert(@PathVariable Long id) {
        BottleneckAlertDto alert = bottleneckService.resolveAlert(id);
        return ResponseEntity.ok(ApiResponse.ok("Alert marked as resolved", alert));
    }
}
