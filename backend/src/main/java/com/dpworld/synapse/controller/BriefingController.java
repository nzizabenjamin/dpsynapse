package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.ExecutiveBriefingDto;
import com.dpworld.synapse.dto.GenerateBriefingRequest;
import com.dpworld.synapse.service.BriefingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/briefings")
@RequiredArgsConstructor
@Tag(name = "Operational Intelligence Briefings", description = "Daily morning operational briefs, narrative syntheses, and tactical recommendations for terminal management")
public class BriefingController {

    private final BriefingService briefingService;

    @GetMapping("/latest")
    @Operation(summary = "Get Latest Operations Briefing", description = "Fetches the latest compiled operational intelligence briefing for Masaka Dry Port.")

    public ResponseEntity<ApiResponse<ExecutiveBriefingDto>> getLatestBriefing() {
        ExecutiveBriefingDto briefing = briefingService.getLatestBriefing();
        return ResponseEntity.ok(ApiResponse.ok(briefing));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate Operations Briefing", description = "Triggers AI narrative synthesis for the specified date and operational focus areas.")
    public ResponseEntity<ApiResponse<ExecutiveBriefingDto>> generateBriefing(
            @Valid @RequestBody GenerateBriefingRequest request
    ) {
        ExecutiveBriefingDto briefing = briefingService.generateBriefing(request);
        return ResponseEntity.ok(ApiResponse.ok("Operational briefing generated successfully", briefing));
    }
}

