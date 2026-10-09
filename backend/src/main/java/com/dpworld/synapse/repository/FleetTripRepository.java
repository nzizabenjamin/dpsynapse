package com.dpworld.synapse.repository;

import com.dpworld.synapse.entity.FleetTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FleetTripRepository extends JpaRepository<FleetTrip, Long> {

    Optional<FleetTrip> findByTripNumber(String tripNumber);

    List<FleetTrip> findByCorridor(String corridor);

    List<FleetTrip> findByStatus(String status);

    @Query("SELECT f FROM FleetTrip f WHERE " +
           "(:corridor IS NULL OR f.corridor = :corridor) AND " +
           "(:status IS NULL OR f.status = :status) " +
           "ORDER BY f.createdAt DESC")
    List<FleetTrip> findWithFilters(@Param("corridor") String corridor, @Param("status") String status);

    @Query("SELECT COALESCE(AVG(f.turnaroundTimeMinutes), 0.0) FROM FleetTrip f WHERE f.turnaroundTimeMinutes > 0")
    Double calculateAverageTurnaroundMinutes();

    @Query("SELECT f.corridor, COUNT(f), COALESCE(AVG(f.turnaroundTimeMinutes), 0.0) FROM FleetTrip f GROUP BY f.corridor")
    List<Object[]> summarizeByCorridor();
}
