package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendMetricDto {
    private LocalDate date;
    private Integer inboundTeu;
    private Integer outboundTeu;
    private Integer yardTeu;
    private BigDecimal truckTurnaroundMins;
    private BigDecimal dwellTimeDays;
    private BigDecimal customsClearanceRatePct;
    private BigDecimal bondedUtilizationPct;
    private BigDecimal coldChainUtilizationPct;
    private Integer greenChannelCount;
    private Integer yellowChannelCount;
    private Integer redChannelCount;
    private Integer blueChannelCount;
}
