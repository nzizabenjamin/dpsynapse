package com.dpworld.synapse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FleetStatsDto {
    private Double overallAvgTurnaroundMinutes;
    private Long activeTripsInTransit;
    private Long tripsAtBorderHold;
    private Long tripsAtMasakaGate;
    private Long tripsCompletedToday;
    private Map<String, CorridorStat> corridorBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CorridorStat {
        private String corridor;
        private Long totalTrips;
        private Double avgTurnaroundMinutes;
        private Long activeAtBorder;
    }
}
