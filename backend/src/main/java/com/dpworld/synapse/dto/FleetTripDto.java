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
public class FleetTripDto {
    private Long id;
    private String tripNumber;
    private String truckPlate;
    private String trailerNumber;
    private String driverName;
    private String driverPhone;
    private String transporterCompany;
    private String corridor;
    private String originLocation;
    private String currentCheckpoint;
    private String destinationHub;
    private String status;
    private Long assignedShipmentId;
    private String assignedContainerNumber;
    private OffsetDateTime departureTime;
    private OffsetDateTime borderArrivalTime;
    private OffsetDateTime borderClearanceTime;
    private OffsetDateTime gateInTime;
    private OffsetDateTime gateOutTime;
    private Integer turnaroundTimeMinutes;
    private String delayReason;
    private BigDecimal gpsLatitude;
    private BigDecimal gpsLongitude;
    private OffsetDateTime createdAt;
}
