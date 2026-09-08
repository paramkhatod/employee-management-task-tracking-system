package com.employee.management.controller;

import com.employee.management.service.PdfReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Endpoints for downloading PDF task & employee reports")
@SecurityRequirement(name = "Bearer Authentication")
public class ReportController {

    private final PdfReportService pdfReportService;

    public ReportController(PdfReportService pdfReportService) {
        this.pdfReportService = pdfReportService;
    }

    @GetMapping("/tasks/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Download formatted PDF report of all tasks (Admin only)")
    public ResponseEntity<InputStreamResource> downloadAllTasksPdf() {
        ByteArrayInputStream bis = pdfReportService.generateAllTasksReport();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=tasks_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/employee/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Download formatted PDF performance summary sheet for an employee")
    public ResponseEntity<InputStreamResource> downloadEmployeeSummaryPdf(@PathVariable Long id) {
        ByteArrayInputStream bis = pdfReportService.generateEmployeeSummaryReport(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=employee_" + id + "_summary.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
