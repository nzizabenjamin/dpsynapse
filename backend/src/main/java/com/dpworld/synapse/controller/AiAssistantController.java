package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.AskAiRequest;
import com.dpworld.synapse.dto.AskAiResponse;
import com.dpworld.synapse.service.AiAssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "Ask Synapse - AI Intelligence Assistant", description = "Natural language operational querying and instant logistics intelligence for port executives")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/ask")
    @Operation(summary = "Ask Synapse Natural Language Query", description = "Answers executive questions grounded on live dry port telemetry, customs backlog, and corridor fleet delays.")
    public ResponseEntity<ApiResponse<AskAiResponse>> askSynapse(
            @Valid @RequestBody AskAiRequest request
    ) {
        AskAiResponse response = aiAssistantService.askSynapse(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
