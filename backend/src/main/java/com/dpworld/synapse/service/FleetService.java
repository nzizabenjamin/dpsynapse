package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.FleetStatsDto;
import com.dpworld.synapse.dto.FleetTripDto;
import com.dpworld.synapse.entity.FleetTrip;
import com.dpworld.synapse.exception.ResourceNotFoundException;
import com.dpworld.synapse.repository.FleetTripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FleetService {

    private final FleetTripRepository fleetTripRepository;

    public List<FleetTripDto> getFleetTrips(String corridor, String status) {
        return fleetTripRepository.findWithFilters(
                corridor != null && !corridor.isBlank() ? corridor : null,
                status != null && !status.isBlank() ? status : null
        ).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public FleetTripDto getTripById(Long id) {
        FleetTrip trip = fleetTripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fleet trip not found with ID: " + id));
        return mapToDto(trip);
    }

    public FleetStatsDto getFleetStats() {
        List<FleetTrip> allTrips = fleetTripRepository.findAll();

        long inTransit = allTrips.stream().filter(t -> "IN_TRANSIT".equalsIgnoreCase(t.getStatus())).count();
        long borderHold = allTrips.stream().filter(t -> "BORDER_HOLD".equalsIgnoreCase(t.getStatus())).count();
        long atGate = allTrips.stream().filter(t -> "GATE_IN_MASAKA".equalsIgnoreCase(t.getStatus()) || "UNLOADING".equalsIgnoreCase(t.getStatus())).count();
        long departed = allTrips.stream().filter(t -> "DEPARTED".equalsIgnoreCase(t.getStatus())).count();

        Double avgTat = fleetTripRepository.calculateAverageTurnaroundMinutes();

        Map<String, FleetStatsDto.CorridorStat> breakdown = new HashMap<>();
        List<Object[]> corridorSummaries = fleetTripRepository.summarizeByCorridor();
        for (Object[] row : corridorSummaries) {
            String corr = (String) row[0];
            Long total = (Long) row[1];
            Double avgMins = (Double) row[2];
            long borderCount = allTrips.stream()
                    .filter(t -> corr != null && corr.equalsIgnoreCase(t.getCorridor()) && "BORDER_HOLD".equalsIgnoreCase(t.getStatus()))
                    .count();

            breakdown.put(corr, FleetStatsDto.CorridorStat.builder()
                    .corridor(corr)
                    .totalTrips(total)
                    .avgTurnaroundMinutes(Math.round(avgMins * 10.0) / 10.0)
                    .activeAtBorder(borderCount)
                    .build());
        }

        return FleetStatsDto.builder()
                .overallAvgTurnaroundMinutes(Math.round(avgTat * 10.0) / 10.0)
                .activeTripsInTransit(inTransit)
                .tripsAtBorderHold(borderHold)
                .tripsAtMasakaGate(atGate)
                .tripsCompletedToday(departed)
                .corridorBreakdown(breakdown)
                .build();
    }

    public FleetTripDto mapToDto(FleetTrip trip) {
        return FleetTripDto.builder()
                .id(trip.getId())
                .tripNumber(trip.getTripNumber())
                .truckPlate(trip.getTruckPlate())
                .trailerNumber(trip.getTrailerNumber())
                .driverName(trip.getDriverName())
                .driverPhone(trip.getDriverPhone())
                .transporterCompany(trip.getTransporterCompany())
                .corridor(trip.getCorridor())
                .originLocation(trip.getOriginLocation())
                .currentCheckpoint(trip.getCurrentCheckpoint())
                .destinationHub(trip.getDestinationHub())
                .status(trip.getStatus())
                .assignedShipmentId(trip.getAssignedShipment() != null ? trip.getAssignedShipment().getId() : null)
                .assignedContainerNumber(trip.getAssignedShipment() != null ? trip.getAssignedShipment().getContainerNumber() : null)
                .departureTime(trip.getDepartureTime())
                .borderArrivalTime(trip.getBorderArrivalTime())
                .borderClearanceTime(trip.getBorderClearanceTime())
                .gateInTime(trip.getGateInTime())
                .gateOutTime(trip.getGateOutTime())
                .turnaroundTimeMinutes(trip.getTurnaroundTimeMinutes())
                .delayReason(trip.getDelayReason())
                .gpsLatitude(trip.getGpsLatitude())
                .gpsLongitude(trip.getGpsLongitude())
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
