package com.dpworld.synapse.service;

import com.dpworld.synapse.dto.BottleneckAlertDto;
import com.dpworld.synapse.entity.BottleneckAlert;
import com.dpworld.synapse.exception.ResourceNotFoundException;
import com.dpworld.synapse.repository.BottleneckAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BottleneckService {

    private final BottleneckAlertRepository bottleneckAlertRepository;

    public List<BottleneckAlertDto> getAlerts(String status) {
        List<BottleneckAlert> alerts;
        if (status != null && !status.isBlank()) {
            alerts = bottleneckAlertRepository.findByStatus(status);
        } else {
            alerts = bottleneckAlertRepository.findByStatusInOrderByCreatedAtDesc(List.of("ACTIVE", "INVESTIGATING", "RESOLVED"));
        }
        return alerts.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<BottleneckAlertDto> getActiveAlerts() {
        return bottleneckAlertRepository.findByStatusInOrderByCreatedAtDesc(List.of("ACTIVE", "INVESTIGATING"))
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BottleneckAlertDto getAlertById(Long id) {
        BottleneckAlert alert = bottleneckAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bottleneck alert not found with ID: " + id));
        return mapToDto(alert);
    }

    @Transactional
    public BottleneckAlertDto resolveAlert(Long id) {
        BottleneckAlert alert = bottleneckAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bottleneck alert not found with ID: " + id));
        alert.setStatus("RESOLVED");
        alert.setResolvedAt(OffsetDateTime.now());
        return mapToDto(bottleneckAlertRepository.save(alert));
    }

    public BottleneckAlertDto mapToDto(BottleneckAlert alert) {
        return BottleneckAlertDto.builder()
                .id(alert.getId())
                .alertType(alert.getAlertType())
                .severity(alert.getSeverity())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .affectedZoneOrCorridor(alert.getAffectedZoneOrCorridor())
                .status(alert.getStatus())
                .impactSummary(alert.getImpactSummary())
                .suggestedAction(alert.getSuggestedAction())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}
