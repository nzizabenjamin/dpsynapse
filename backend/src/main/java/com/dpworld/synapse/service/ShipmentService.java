package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.ShipmentDto;
import com.dpworld.synapse.entity.Shipment;
import com.dpworld.synapse.exception.ResourceNotFoundException;
import com.dpworld.synapse.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public Page<ShipmentDto> getShipments(String channel, String stage, String corridor, String search, Pageable pageable) {
        return shipmentRepository.findWithFilters(
                channel != null && !channel.isBlank() ? channel : null,
                stage != null && !stage.isBlank() ? stage : null,
                corridor != null && !corridor.isBlank() ? corridor : null,
                search != null && !search.isBlank() ? search : null,
                pageable
        ).map(this::mapToDto);
    }

    public List<ShipmentDto> getAllShipmentsList() {
        return shipmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ShipmentDto getShipmentById(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with ID: " + id));
        return mapToDto(shipment);
    }

    public ShipmentDto getShipmentByTrackingNumber(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with tracking number: " + trackingNumber));
        return mapToDto(shipment);
    }

    public Map<String, Integer> getCustomsChannelBreakdown() {
        Map<String, Integer> map = new HashMap<>();
        map.put("GREEN", 0);
        map.put("YELLOW", 0);
        map.put("RED", 0);
        map.put("BLUE", 0);
        List<Object[]> results = shipmentRepository.countByCustomsChannel();
        for (Object[] r : results) {
            if (r[0] != null && r[1] != null) {
                map.put((String) r[0], ((Long) r[1]).intValue());
            }
        }
        return map;
    }

    public Map<String, Integer> getStageBreakdown() {
        Map<String, Integer> map = new HashMap<>();
        List<Object[]> results = shipmentRepository.countByStage();
        for (Object[] r : results) {
            if (r[0] != null && r[1] != null) {
                map.put((String) r[0], ((Long) r[1]).intValue());
            }
        }
        return map;
    }

    public ShipmentDto mapToDto(Shipment shipment) {
        return ShipmentDto.builder()
                .id(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .containerNumber(shipment.getContainerNumber())
                .sealNumber(shipment.getSealNumber())
                .shippingLine(shipment.getShippingLine())
                .consigneeName(shipment.getConsigneeName())
                .consignorName(shipment.getConsignorName())
                .originPort(shipment.getOriginPort())
                .destinationHub(shipment.getDestinationHub())
                .corridor(shipment.getCorridor())
                .cargoType(shipment.getCargoType())
                .commodityDescription(shipment.getCommodityDescription())
                .weightKg(shipment.getWeightKg())
                .teuCount(shipment.getTeuCount())
                .customsChannel(shipment.getCustomsChannel())
                .customsStatus(shipment.getCustomsStatus())
                .customsDeclarationNumber(shipment.getCustomsDeclarationNumber())
                .stage(shipment.getStage())
                .warehouseZoneId(shipment.getWarehouseZone() != null ? shipment.getWarehouseZone().getId() : null)
                .warehouseZoneCode(shipment.getWarehouseZone() != null ? shipment.getWarehouseZone().getZoneCode() : null)
                .warehouseZoneName(shipment.getWarehouseZone() != null ? shipment.getWarehouseZone().getZoneName() : null)
                .eta(shipment.getEta())
                .gateInAt(shipment.getGateInAt())
                .customsClearedAt(shipment.getCustomsClearedAt())
                .gateOutAt(shipment.getGateOutAt())
                .dwellTimeHours(shipment.getDwellTimeHours())
                .isBonded(shipment.getIsBonded())
                .createdAt(shipment.getCreatedAt())
                .build();
    }
}
