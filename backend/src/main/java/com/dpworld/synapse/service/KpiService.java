package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.KpiSummaryDto;
import com.dpworld.synapse.dto.TrendMetricDto;
import com.dpworld.synapse.dto.WarehouseZoneDto;
import com.dpworld.synapse.entity.OperationalMetric;
import com.dpworld.synapse.repository.BottleneckAlertRepository;
import com.dpworld.synapse.repository.OperationalMetricRepository;
import com.dpworld.synapse.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KpiService {

    private final OperationalMetricRepository operationalMetricRepository;
    private final ShipmentRepository shipmentRepository;
    private final BottleneckAlertRepository bottleneckAlertRepository;
    private final WarehouseService warehouseService;
    private final ShipmentService shipmentService;

    public KpiSummaryDto getKpiSummary() {
        Optional<OperationalMetric> latestOpt = operationalMetricRepository.findTopByOrderByMetricDateDesc();
        LocalDate today = LocalDate.now();

        Integer inbound = latestOpt.map(OperationalMetric::getTeuInboundToday).orElse(246);
        Integer outbound = latestOpt.map(OperationalMetric::getTeuOutboundToday).orElse(218);
        Integer yardTeu = latestOpt.map(OperationalMetric::getTeuInYard).orElse(3260);

        BigDecimal avgTat = latestOpt.map(OperationalMetric::getAvgTruckTurnaroundMins).orElse(BigDecimal.valueOf(42.4));
        BigDecimal avgDwell = latestOpt.map(OperationalMetric::getAvgDwellTimeDays).orElse(BigDecimal.valueOf(2.9));
        BigDecimal clearanceRate = latestOpt.map(OperationalMetric::getCustomsClearanceRatePct).orElse(BigDecimal.valueOf(94.1));

        Map<String, Integer> channelCounts = shipmentService.getCustomsChannelBreakdown();
        Map<String, Integer> stageCounts = shipmentService.getStageBreakdown();

        List<WarehouseZoneDto> zones = warehouseService.getAllZones();
        double totalCapacity = zones.stream().mapToInt(WarehouseZoneDto::getTotalCapacityTeu).sum();
        double currentOccupancy = zones.stream().mapToInt(WarehouseZoneDto::getCurrentOccupancyTeu).sum();
        double overallYardUtil = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity * 100.0) * 10.0) / 10.0 : 71.2;

        double bondedUtil = zones.stream()
                .filter(z -> "BONDED".equalsIgnoreCase(z.getZoneType()))
                .mapToDouble(WarehouseZoneDto::getUtilizationPercentage)
                .average().orElse(84.0);

        double nonBondedUtil = zones.stream()
                .filter(z -> "NON_BONDED".equalsIgnoreCase(z.getZoneType()))
                .mapToDouble(WarehouseZoneDto::getUtilizationPercentage)
                .average().orElse(68.3);

        double coldChainUtil = zones.stream()
                .filter(z -> "COLD_CHAIN".equalsIgnoreCase(z.getZoneType()))
                .mapToDouble(WarehouseZoneDto::getUtilizationPercentage)
                .average().orElse(90.8);

        long activeBottlenecks = bottleneckAlertRepository.countByStatus("ACTIVE");
        long criticalAlerts = bottleneckAlertRepository.findByStatus("ACTIVE").stream()
                .filter(a -> "CRITICAL".equalsIgnoreCase(a.getSeverity()) || "HIGH".equalsIgnoreCase(a.getSeverity()))
                .count();

        boolean isTatOnTarget = avgTat.compareTo(BigDecimal.valueOf(45.0)) <= 0;

        return KpiSummaryDto.builder()
                .date(latestOpt.map(OperationalMetric::getMetricDate).orElse(today))
                .dailyTeuInbound(inbound)
                .dailyTeuOutbound(outbound)
                .totalTeuThroughput(inbound + outbound)
                .currentYardTeu(yardTeu)
                .overallYardUtilizationPct(overallYardUtil)
                .avgTruckTurnaroundMins(avgTat)
                .truckTurnaroundTarget("< 45.0 mins")
                .isTurnaroundOnTarget(isTatOnTarget)
                .avgDwellDays(avgDwell)
                .customsClearanceRatePct(clearanceRate)
                .customsChannelCounts(channelCounts)
                .shipmentStageCounts(stageCounts)
                .activeBottlenecksCount((int) activeBottlenecks)
                .criticalAlertsCount((int) criticalAlerts)
                .bondedCapacityUtilPct(Math.round(bondedUtil * 10.0) / 10.0)
                .nonBondedCapacityUtilPct(Math.round(nonBondedUtil * 10.0) / 10.0)
                .coldChainCapacityUtilPct(Math.round(coldChainUtil * 10.0) / 10.0)
                .build();
    }

    public List<TrendMetricDto> getTrends(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return operationalMetricRepository.findTrendsSince(startDate).stream()
                .map(this::mapToTrendDto)
                .collect(Collectors.toList());
    }

    private TrendMetricDto mapToTrendDto(OperationalMetric m) {
        return TrendMetricDto.builder()
                .date(m.getMetricDate())
                .inboundTeu(m.getTeuInboundToday())
                .outboundTeu(m.getTeuOutboundToday())
                .yardTeu(m.getTeuInYard())
                .truckTurnaroundMins(m.getAvgTruckTurnaroundMins())
                .dwellTimeDays(m.getAvgDwellTimeDays())
                .customsClearanceRatePct(m.getCustomsClearanceRatePct())
                .bondedUtilizationPct(m.getBondedUtilizationPct())
                .coldChainUtilizationPct(m.getColdChainUtilizationPct())
                .greenChannelCount(m.getGreenChannelCount())
                .yellowChannelCount(m.getYellowChannelCount())
                .redChannelCount(m.getRedChannelCount())
                .blueChannelCount(m.getBlueChannelCount())
                .build();
    }
}
