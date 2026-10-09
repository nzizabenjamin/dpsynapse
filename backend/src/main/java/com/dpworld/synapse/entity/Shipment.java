package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_number", unique = true, nullable = false, length = 64)
    private String trackingNumber;

    @Column(name = "container_number", nullable = false, length = 32)
    private String containerNumber;

    @Column(name = "seal_number", length = 32)
    private String sealNumber;

    @Column(name = "shipping_line", nullable = false, length = 50)
    private String shippingLine;

    @Column(name = "consignee_name", nullable = false, length = 150)
    private String consigneeName;

    @Column(name = "consignor_name", length = 150)
    private String consignorName;

    @Column(name = "origin_port", nullable = false, length = 100)
    private String originPort;

    @Column(name = "destination_hub", nullable = false, length = 100)
    private String destinationHub;

    @Column(name = "corridor", nullable = false, length = 50)
    private String corridor; // CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, REGIONAL_FEEDER

    @Column(name = "cargo_type", nullable = false, length = 50)
    private String cargoType; // FCL, LCL, BULK, COLD_CHAIN, HAZMAT, GENERAL_CARGO

    @Column(name = "commodity_description", columnDefinition = "TEXT")
    private String commodityDescription;

    @Column(name = "weight_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "teu_count", nullable = false)
    private Integer teuCount;

    @Column(name = "customs_channel", nullable = false, length = 20)
    private String customsChannel; // GREEN, YELLOW, RED, BLUE

    @Column(name = "customs_status", nullable = false, length = 40)
    private String customsStatus; // PENDING_DECLARATION, DOCUMENT_VERIFICATION, PHYSICAL_SCAN, CLEARED, CUSTOMS_HOLD

    @Column(name = "customs_declaration_number", length = 64)
    private String customsDeclarationNumber;

    @Column(name = "stage", nullable = false, length = 40)
    private String stage; // CORRIDOR_TRANSIT, BORDER_CROSSING, YARD_GATE_IN, INSPECTION_BAY, WAREHOUSE_STORED, GATE_OUT_DELIVERED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_zone_id")
    private WarehouseZone warehouseZone;

    @Column(name = "eta")
    private OffsetDateTime eta;

    @Column(name = "gate_in_at")
    private OffsetDateTime gateInAt;

    @Column(name = "customs_cleared_at")
    private OffsetDateTime customsClearedAt;

    @Column(name = "gate_out_at")
    private OffsetDateTime gateOutAt;

    @Column(name = "dwell_time_hours", precision = 8, scale = 2)
    private BigDecimal dwellTimeHours;

    @Column(name = "is_bonded", nullable = false)
    private Boolean isBonded;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
