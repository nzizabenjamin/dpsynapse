package com.dpworld.synapse.repository;

import com.dpworld.synapse.entity.BottleneckAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BottleneckAlertRepository extends JpaRepository<BottleneckAlert, Long> {

    List<BottleneckAlert> findByStatus(String status);

    List<BottleneckAlert> findByStatusInOrderByCreatedAtDesc(List<String> statuses);

    Long countByStatus(String status);
}
