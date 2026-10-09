package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutiveBriefingDto {
    private Long id;
    private LocalDate briefingDate;
    private OffsetDateTime generatedAt;
    private String title;
    private String executiveSummary;
    private List<String> operationalHighlights;
    private List<String> criticalRisks;
    private List<String> strategicRecommendations;
    private Object rawKpiSnapshot;
}
