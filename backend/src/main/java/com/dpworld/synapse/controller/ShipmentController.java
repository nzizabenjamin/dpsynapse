package com.dpworld.synapse.controller;

import com.dpworld.synapse.dto.ApiResponse;
import com.dpworld.synapse.dto.ShipmentDto;
import com.dpworld.synapse.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipments & Customs Manifest", description = "Container and bulk shipment tracking, customs channel filters, and dwell metrics")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    @Operation(summary = "Get Paginated Shipments", description = "Query shipments with filters for customs channel (GREEN, YELLOW, RED, BLUE), stage, corridor, and search query.")
    public ResponseEntity<ApiResponse<Page<ShipmentDto>>> getShipments(
            @Parameter(description = "Customs channel (GREEN, YELLOW, RED, BLUE)")
            @RequestParam(required = false) String channel,
            @Parameter(description = "Logistics stage (CORRIDOR_TRANSIT, BORDER_CROSSING, YARD_GATE_IN, INSPECTION_BAY, WAREHOUSE_STORED, GATE_OUT_DELIVERED)")
            @RequestParam(required = false) String stage,
            @Parameter(description = "Corridor (CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, REGIONAL_FEEDER)")
            @RequestParam(required = false) String corridor,
            @Parameter(description = "Search term for container number, tracking number, or consignee")
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = "desc".equalsIgnoreCase(direction) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<ShipmentDto> shipments = shipmentService.getShipments(channel, stage, corridor, search, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(shipments));
    }

    @GetMapping("/all")
    @Operation(summary = "Get All Shipments List", description = "Returns full list of shipments for client-side map/radar rendering.")
    public ResponseEntity<ApiResponse<List<ShipmentDto>>> getAllShipments() {
        List<ShipmentDto> list = shipmentService.getAllShipmentsList();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Shipment By ID", description = "Retrieves complete shipment tracking, customs checkpoints, and dwell time.")
    public ResponseEntity<ApiResponse<ShipmentDto>> getShipmentById(@PathVariable Long id) {
        ShipmentDto shipment = shipmentService.getShipmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(shipment));
    }

    @GetMapping("/tracking/{trackingNumber}")
    @Operation(summary = "Get Shipment By Tracking Number", description = "Lookup shipment by DP World tracking number.")
    public ResponseEntity<ApiResponse<ShipmentDto>> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        ShipmentDto shipment = shipmentService.getShipmentByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(ApiResponse.ok(shipment));
    }

    @GetMapping("/channels/breakdown")
    @Operation(summary = "Get Customs Channel Breakdown", description = "Returns count of shipments in Green, Yellow, Red, and Blue channels.")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getChannelBreakdown() {
        Map<String, Integer> counts = shipmentService.getCustomsChannelBreakdown();
        return ResponseEntity.ok(ApiResponse.ok(counts));
    }
}
