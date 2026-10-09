package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.WarehouseZoneDto;
import com.dpworld.synapse.entity.WarehouseZone;
import com.dpworld.synapse.exception.ResourceNotFoundException;
import com.dpworld.synapse.repository.WarehouseZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarehouseService {

    private final WarehouseZoneRepository warehouseZoneRepository;

    public List<WarehouseZoneDto> getAllZones() {
        return warehouseZoneRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public WarehouseZoneDto getZoneById(Long id) {
        WarehouseZone zone = warehouseZoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse zone not found with ID: " + id));
        return mapToDto(zone);
    }

    public WarehouseZoneDto getZoneByCode(String zoneCode) {
        WarehouseZone zone = warehouseZoneRepository.findByZoneCode(zoneCode)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse zone not found with code: " + zoneCode));
        return mapToDto(zone);
    }

    public WarehouseZoneDto mapToDto(WarehouseZone zone) {
        return WarehouseZoneDto.builder()
                .id(zone.getId())
                .zoneCode(zone.getZoneCode())
                .zoneName(zone.getZoneName())
                .zoneType(zone.getZoneType())
                .totalCapacitySqm(zone.getTotalCapacitySqm())
                .totalCapacityTeu(zone.getTotalCapacityTeu())
                .currentOccupancyTeu(zone.getCurrentOccupancyTeu())
                .utilizationPercentage(zone.getUtilizationPercentage())
                .temperatureCelsius(zone.getTemperatureCelsius())
                .targetTempMin(zone.getTargetTempMin())
                .targetTempMax(zone.getTargetTempMax())
                .status(zone.getStatus())
                .supervisorName(zone.getSupervisorName())
                .updatedAt(zone.getUpdatedAt())
                .build();
    }
}
