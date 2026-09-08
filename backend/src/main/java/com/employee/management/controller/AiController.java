package com.employee.management.controller;

import com.employee.management.dto.AiDTOs.*;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.TaskRepository;
import com.employee.management.service.GeminiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Features", description = "Endpoints powered by Google Gemini AI")
@SecurityRequirement(name = "Bearer Authentication")
public class AiController {

    private final GeminiService geminiService;
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public AiController(GeminiService geminiService, TaskRepository taskRepository, EmployeeRepository employeeRepository) {
        this.geminiService = geminiService;
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/task-breakdown")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Generate AI-driven sub-task breakdown using Gemini API")
    public ResponseEntity<TaskBreakdownResponse> generateTaskBreakdown(@RequestBody TaskBreakdownRequest request) {
        return ResponseEntity.ok(geminiService.generateTaskBreakdown(request));
    }

    @GetMapping("/workload-summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate AI workload and performance insights for team management")
    public ResponseEntity<WorkloadInsightResponse> getWorkloadSummary() {
        long totalTasks = taskRepository.count();
        long activeEmployees = employeeRepository.countByActiveTrue();
        // Fallback or count overdue
        long overdue = 0; // Simple query count
        return ResponseEntity.ok(geminiService.generateWorkloadInsights(totalTasks, overdue, activeEmployees));
    }
}
