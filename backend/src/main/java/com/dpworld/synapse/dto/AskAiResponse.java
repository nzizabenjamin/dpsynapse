package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AskAiResponse {
    private String query;
    private String answer;
    private String intentCategory; // e.g. "BOTTLENECK_ANALYSIS", "FLEET_TRACKING", "CUSTOMS_STATUS"
    private List<String> keyFindings;
    private List<String> recommendedActions;
    private Map<String, Object> dataTelemetry;
    @Builder.Default
    private Instant answeredAt = Instant.now();
}
