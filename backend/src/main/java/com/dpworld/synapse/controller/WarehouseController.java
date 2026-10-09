package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.WarehouseZoneDto;
import com.dpworld.synapse.service.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouse-zones")
@RequiredArgsConstructor
@Tag(name = "Warehouse & Yard Management", description = "Zone-by-zone capacity, occupancy tracking, and cold-chain environmental monitors")
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    @Operation(summary = "Get All Warehouse Zones", description = "Lists all dry port and warehouse storage zones (Bonded CFS, FMCG, Cold Chain, Agri, Hazmat, Empty Yard).")
    public ResponseEntity<ApiResponse<List<WarehouseZoneDto>>> getAllZones() {
        List<WarehouseZoneDto> zones = warehouseService.getAllZones();
        return ResponseEntity.ok(ApiResponse.ok(zones));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Zone By ID", description = "Retrieves specific warehouse zone telemetry by ID.")
    public ResponseEntity<ApiResponse<WarehouseZoneDto>> getZoneById(@PathVariable Long id) {
        WarehouseZoneDto zone = warehouseService.getZoneById(id);
        return ResponseEntity.ok(ApiResponse.ok(zone));
    }

    @GetMapping("/code/{zoneCode}")
    @Operation(summary = "Get Zone By Code", description = "Retrieves specific warehouse zone telemetry by zone code (e.g., ZONE-A-BONDED).")
    public ResponseEntity<ApiResponse<WarehouseZoneDto>> getZoneByCode(@PathVariable String zoneCode) {
        WarehouseZoneDto zone = warehouseService.getZoneByCode(zoneCode);
        return ResponseEntity.ok(ApiResponse.ok(zone));
    }
}
