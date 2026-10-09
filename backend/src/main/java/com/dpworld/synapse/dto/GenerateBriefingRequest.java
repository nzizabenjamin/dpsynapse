package com.dpworld.synapse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateBriefingRequest {
    @NotNull(message = "Briefing date is required")
    private LocalDate date;
    private String customFocus; // e.g. "Focus on Cold Chain & Rusumo Border delays"
}
