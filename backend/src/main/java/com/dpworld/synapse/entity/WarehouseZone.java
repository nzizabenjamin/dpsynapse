package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "warehouse_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zone_code", unique = true, nullable = false, length = 50)
    private String zoneCode;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    @Column(name = "zone_type", nullable = false, length = 50)
    private String zoneType; // BONDED, NON_BONDED, COLD_CHAIN, CFS, EMPTY_YARD, HAZMAT

    @Column(name = "total_capacity_sqm", precision = 10, scale = 2)
    private BigDecimal totalCapacitySqm;

    @Column(name = "total_capacity_teu", nullable = false)
    private Integer totalCapacityTeu;

    @Column(name = "current_occupancy_teu", nullable = false)
    private Integer currentOccupancyTeu;

    @Column(name = "temperature_celsius", precision = 4, scale = 1)
    private BigDecimal temperatureCelsius;

    @Column(name = "target_temp_min", precision = 4, scale = 1)
    private BigDecimal targetTempMin;

    @Column(name = "target_temp_max", precision = 4, scale = 1)
    private BigDecimal targetTempMax;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // OPTIMAL, NEAR_CAPACITY, CONGESTED, MAINTENANCE

    @Column(name = "supervisor_name", length = 100)
    private String supervisorName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public double getUtilizationPercentage() {
        if (totalCapacityTeu == null || totalCapacityTeu == 0) return 0.0;
        return Math.round(((double) currentOccupancyTeu / totalCapacityTeu * 100.0) * 10.0) / 10.0;
    }
}
