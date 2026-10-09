package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiSummaryDto {

    private LocalDate date;
    private Integer dailyTeuInbound;
    private Integer dailyTeuOutbound;
    private Integer totalTeuThroughput;
    private Integer currentYardTeu;
    private Double overallYardUtilizationPct;

    private BigDecimal avgTruckTurnaroundMins;
    private String truckTurnaroundTarget; // e.g. "< 45.0 mins"
    private Boolean isTurnaroundOnTarget;

    private BigDecimal avgDwellDays;
    private BigDecimal customsClearanceRatePct;

    private Map<String, Integer> customsChannelCounts; // GREEN, YELLOW, RED, BLUE
    private Map<String, Integer> shipmentStageCounts;

    private Integer activeBottlenecksCount;
    private Integer criticalAlertsCount;

    private Double bondedCapacityUtilPct;
    private Double nonBondedCapacityUtilPct;
    private Double coldChainCapacityUtilPct;
}
