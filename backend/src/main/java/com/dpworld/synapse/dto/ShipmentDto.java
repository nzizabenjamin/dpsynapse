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
public class ShipmentDto {
    private Long id;
    private String trackingNumber;
    private String containerNumber;
    private String sealNumber;
    private String shippingLine;
    private String consigneeName;
    private String consignorName;
    private String originPort;
    private String destinationHub;
    private String corridor;
    private String cargoType;
    private String commodityDescription;
    private BigDecimal weightKg;
    private Integer teuCount;
    private String customsChannel;
    private String customsStatus;
    private String customsDeclarationNumber;
    private String stage;
    private Long warehouseZoneId;
    private String warehouseZoneCode;
    private String warehouseZoneName;
    private OffsetDateTime eta;
    private OffsetDateTime gateInAt;
    private OffsetDateTime customsClearedAt;
    private OffsetDateTime gateOutAt;
    private BigDecimal dwellTimeHours;
    private Boolean isBonded;
    private OffsetDateTime createdAt;
}
