package com.dpworld.synapse.dto;

import jakarta.validation.constraints.NotBlank;
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
public class AskAiRequest {
    @NotBlank(message = "Query question cannot be blank")
    private String query;
    private String contextFilter; // e.g. "CUSTOMS", "FLEET", "WAREHOUSE", "GENERAL"
}
