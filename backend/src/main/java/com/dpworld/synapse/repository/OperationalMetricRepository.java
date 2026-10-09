package com.dpworld.synapse.repository;

import com.dpworld.synapse.entity.OperationalMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OperationalMetricRepository extends JpaRepository<OperationalMetric, Long> {

    Optional<OperationalMetric> findByMetricDate(LocalDate metricDate);

    Optional<OperationalMetric> findTopByOrderByMetricDateDesc();

    @Query("SELECT m FROM OperationalMetric m WHERE m.metricDate >= :startDate ORDER BY m.metricDate ASC")
    List<OperationalMetric> findTrendsSince(@Param("startDate") LocalDate startDate);
}
