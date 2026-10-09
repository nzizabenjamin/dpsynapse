package com.dpworld.synapse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "executive_briefings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutiveBriefing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "briefing_date", nullable = false)
    private LocalDate briefingDate;

    @CreationTimestamp
    @Column(name = "generated_at", nullable = false, updatable = false)
    private OffsetDateTime generatedAt;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "executive_summary", nullable = false, columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "operational_highlights", nullable = false, columnDefinition = "TEXT")
    private String operationalHighlights; // JSON array string

    @Column(name = "critical_risks", nullable = false, columnDefinition = "TEXT")
    private String criticalRisks; // JSON array string

    @Column(name = "strategic_recommendations", nullable = false, columnDefinition = "TEXT")
    private String strategicRecommendations; // JSON array string

    @Column(name = "raw_kpi_snapshot", nullable = false, columnDefinition = "TEXT")
    private String rawKpiSnapshot; // JSON object string
}
