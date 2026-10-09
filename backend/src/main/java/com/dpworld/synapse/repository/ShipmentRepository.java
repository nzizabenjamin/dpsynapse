package com.dpworld.synapse.repository;

import com.dpworld.synapse.entity.Shipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    Optional<Shipment> findByContainerNumber(String containerNumber);

    List<Shipment> findByCustomsChannel(String customsChannel);

    List<Shipment> findByStage(String stage);

    List<Shipment> findByCorridor(String corridor);

    @Query("SELECT s FROM Shipment s WHERE " +
           "(:channel IS NULL OR s.customsChannel = :channel) AND " +
           "(:stage IS NULL OR s.stage = :stage) AND " +
           "(:corridor IS NULL OR s.corridor = :corridor) AND " +
           "(:search IS NULL OR LOWER(s.trackingNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.containerNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.consigneeName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.commodityDescription) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Shipment> findWithFilters(
            @Param("channel") String channel,
            @Param("stage") String stage,
            @Param("corridor") String corridor,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("SELECT s.customsChannel, COUNT(s) FROM Shipment s GROUP BY s.customsChannel")
    List<Object[]> countByCustomsChannel();

    @Query("SELECT s.stage, COUNT(s) FROM Shipment s GROUP BY s.stage")
    List<Object[]> countByStage();

    @Query("SELECT COALESCE(SUM(s.teuCount), 0) FROM Shipment s WHERE s.stage IN ('YARD_GATE_IN', 'INSPECTION_BAY', 'WAREHOUSE_STORED')")
    Integer calculateCurrentYardTeu();

    @Query("SELECT COALESCE(AVG(s.dwellTimeHours), 0.0) FROM Shipment s WHERE s.dwellTimeHours > 0")
    Double calculateAverageDwellHours();
}
