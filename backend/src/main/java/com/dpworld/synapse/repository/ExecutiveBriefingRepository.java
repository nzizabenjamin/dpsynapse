package com.dpworld.synapse.repository;

import com.dpworld.synapse.entity.ExecutiveBriefing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExecutiveBriefingRepository extends JpaRepository<ExecutiveBriefing, Long> {

    Optional<ExecutiveBriefing> findTopByOrderByGeneratedAtDesc();

    List<ExecutiveBriefing> findByBriefingDateOrderByGeneratedAtDesc(LocalDate briefingDate);
}
