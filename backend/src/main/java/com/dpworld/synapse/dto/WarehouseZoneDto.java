package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseZoneDto {
    private Long id;
    private String zoneCode;
    private String zoneName;
    private String zoneType;
    private BigDecimal totalCapacitySqm;
    private Integer totalCapacityTeu;
    private Integer currentOccupancyTeu;
    private Double utilizationPercentage;
    private BigDecimal temperatureCelsius;
    private BigDecimal targetTempMin;
    private BigDecimal targetTempMax;
    private String status;
    private String supervisorName;
    private OffsetDateTime updatedAt;
}
