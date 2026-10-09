package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "fleet_trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FleetTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_number", unique = true, nullable = false, length = 50)
    private String tripNumber;

    @Column(name = "truck_plate", nullable = false, length = 30)
    private String truckPlate;

    @Column(name = "trailer_number", length = 30)
    private String trailerNumber;

    @Column(name = "driver_name", nullable = false, length = 100)
    private String driverName;

    @Column(name = "driver_phone", length = 30)
    private String driverPhone;

    @Column(name = "transporter_company", nullable = false, length = 100)
    private String transporterCompany;

    @Column(name = "corridor", nullable = false, length = 50)
    private String corridor; // CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, CROSS_BORDER_DRC

    @Column(name = "origin_location", nullable = false, length = 100)
    private String originLocation;

    @Column(name = "current_checkpoint", nullable = false, length = 100)
    private String currentCheckpoint; // Rusumo Border Post, Kagitumba, Kabanga, Masaka Gate

    @Column(name = "destination_hub", nullable = false, length = 100)
    private String destinationHub;

    @Column(name = "status", nullable = false, length = 40)
    private String status; // DISPATCHED, IN_TRANSIT, BORDER_HOLD, GATE_IN_MASAKA, UNLOADING, DEPARTED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_shipment_id")
    private Shipment assignedShipment;

    @Column(name = "departure_time")
    private OffsetDateTime departureTime;

    @Column(name = "border_arrival_time")
    private OffsetDateTime borderArrivalTime;

    @Column(name = "border_clearance_time")
    private OffsetDateTime borderClearanceTime;

    @Column(name = "gate_in_time")
    private OffsetDateTime gateInTime;

    @Column(name = "gate_out_time")
    private OffsetDateTime gateOutTime;

    @Column(name = "turnaround_time_minutes")
    private Integer turnaroundTimeMinutes;

    @Column(name = "delay_reason", columnDefinition = "TEXT")
    private String delayReason;

    @Column(name = "gps_latitude", precision = 9, scale = 6)
    private BigDecimal gpsLatitude;

    @Column(name = "gps_longitude", precision = 9, scale = 6)
    private BigDecimal gpsLongitude;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
