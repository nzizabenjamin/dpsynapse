package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "operational_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperationalMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_date", unique = true, nullable = false)
    private LocalDate metricDate;

    @Column(name = "teu_inbound_today", nullable = false)
    private Integer teuInboundToday;

    @Column(name = "teu_outbound_today", nullable = false)
    private Integer teuOutboundToday;

    @Column(name = "teu_in_yard", nullable = false)
    private Integer teuInYard;

    @Column(name = "avg_truck_turnaround_mins", nullable = false, precision = 6, scale = 1)
    private BigDecimal avgTruckTurnaroundMins;

    @Column(name = "avg_dwell_time_days", nullable = false, precision = 5, scale = 2)
    private BigDecimal avgDwellTimeDays;

    @Column(name = "bonded_utilization_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal bondedUtilizationPct;

    @Column(name = "non_bonded_utilization_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal nonBondedUtilizationPct;

    @Column(name = "cold_chain_utilization_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal coldChainUtilizationPct;

    @Column(name = "customs_clearance_rate_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal customsClearanceRatePct;

    @Column(name = "green_channel_count", nullable = false)
    private Integer greenChannelCount;

    @Column(name = "yellow_channel_count", nullable = false)
    private Integer yellowChannelCount;

    @Column(name = "red_channel_count", nullable = false)
    private Integer redChannelCount;

    @Column(name = "blue_channel_count", nullable = false)
    private Integer blueChannelCount;

    @Column(name = "active_bottlenecks_count", nullable = false)
    private Integer activeBottlenecksCount;

    @CreationTimestamp
    @Column(name = "recorded_at", nullable = false, updatable = false)
    private OffsetDateTime recordedAt;
}
