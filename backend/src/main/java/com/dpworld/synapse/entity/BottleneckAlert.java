package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bottleneck_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BottleneckAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_type", nullable = false, length = 50)
    private String alertType; // CUSTOMS_RED_CHANNEL_SURGE, COLD_CHAIN_TEMP_ANOMALY, BORDER_CROSSING_CONGESTION, GATE_QUEUE_OVERFLOW, YARD_HIGH_DENSITY

    @Column(name = "severity", nullable = false, length = 20)
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "affected_zone_or_corridor", nullable = false, length = 100)
    private String affectedZoneOrCorridor;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // ACTIVE, INVESTIGATING, RESOLVED

    @Column(name = "impact_summary", columnDefinition = "TEXT")
    private String impactSummary;

    @Column(name = "suggested_action", columnDefinition = "TEXT")
    private String suggestedAction;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;
}
