package com.employee.management.controller;

import com.employee.management.dto.AdminDashboardResponse;
import com.employee.management.dto.EmployeeDashboardResponse;
import com.employee.management.security.UserPrincipal;
import com.employee.management.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dashboard Statistics & Metrics APIs")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @Operation(summary = "Get admin dashboard metrics and system-wide statistics")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        AdminDashboardResponse metrics = dashboardService.getAdminDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/employee")
    @Operation(summary = "Get logged-in employee dashboard metrics and upcoming deadlines")
    public ResponseEntity<EmployeeDashboardResponse> getEmployeeDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        EmployeeDashboardResponse metrics = dashboardService.getEmployeeDashboardMetrics(currentUser);
        return ResponseEntity.ok(metrics);
    }
}
