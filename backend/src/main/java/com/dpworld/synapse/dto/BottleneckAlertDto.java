package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BottleneckAlertDto {
    private Long id;
    private String alertType;
    private String severity;
    private String title;
    private String description;
    private String affectedZoneOrCorridor;
    private String status;
    private String impactSummary;
    private String suggestedAction;
    private OffsetDateTime createdAt;
    private OffsetDateTime resolvedAt;
}
