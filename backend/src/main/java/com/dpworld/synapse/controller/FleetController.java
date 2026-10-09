package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.FleetStatsDto;
import com.dpworld.synapse.dto.FleetTripDto;
import com.dpworld.synapse.service.FleetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fleet")
@RequiredArgsConstructor
@Tag(name = "Fleet & Corridor Logistics", description = "Corridor fleet tracking (Central/Dar vs Northern/Mombasa), border checkpoints, and truck turnaround time (TAT)")
public class FleetController {

    private final FleetService fleetService;

    @GetMapping("/trips")
    @Operation(summary = "Get Fleet Trips", description = "Query active and completed fleet trips filtered by corridor and status.")
    public ResponseEntity<ApiResponse<List<FleetTripDto>>> getFleetTrips(
            @Parameter(description = "Corridor (CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, CROSS_BORDER_DRC)")
            @RequestParam(required = false) String corridor,
            @Parameter(description = "Status (DISPATCHED, IN_TRANSIT, BORDER_HOLD, GATE_IN_MASAKA, UNLOADING, DEPARTED)")
            @RequestParam(required = false) String status
    ) {
        List<FleetTripDto> trips = fleetService.getFleetTrips(corridor, status);
        return ResponseEntity.ok(ApiResponse.ok(trips));
    }

    @GetMapping("/trips/{id}")
    @Operation(summary = "Get Fleet Trip By ID", description = "Retrieves trip details including truck plate, GPS telemetry, driver contact, and border clearance.")
    public ResponseEntity<ApiResponse<FleetTripDto>> getTripById(@PathVariable Long id) {
        FleetTripDto trip = fleetService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.ok(trip));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get Fleet & Turnaround Stats", description = "Aggregated corridor statistics, truck turnaround distribution, and border wait counts.")
    public ResponseEntity<ApiResponse<FleetStatsDto>> getFleetStats() {
        FleetStatsDto stats = fleetService.getFleetStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
