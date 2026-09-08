package com.employee.management.service;

import com.employee.management.dto.PageResponse;
import com.employee.management.entity.AuditLog;
import com.employee.management.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    @Transactional
    public void logActivity(String action, String entityType, Long entityId, String performedBy, String details) {
        try {
            AuditLog log = AuditLog.builder()
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .performedBy(performedBy != null ? performedBy : "SYSTEM")
                    .details(details)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit log failure shouldn't break the main transaction
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLog> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logPage = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.fromPage(logPage);
    }
}
