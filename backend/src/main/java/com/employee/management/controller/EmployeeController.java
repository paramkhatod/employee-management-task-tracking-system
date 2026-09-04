package com.employee.management.controller;

import com.employee.management.dto.EmployeeRequest;
import com.employee.management.dto.EmployeeResponse;
import com.employee.management.dto.EmployeeUpdateRequest;
import com.employee.management.dto.PageResponse;
import com.employee.management.security.UserPrincipal;
import com.employee.management.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees", description = "Employee Management APIs")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "Get all employees with pagination, search and filtering")
    public ResponseEntity<PageResponse<EmployeeResponse>> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        PageResponse<EmployeeResponse> response = employeeService.getAllEmployees(
                search, department, active, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated employee profile")
    public ResponseEntity<EmployeeResponse> getCurrentEmployeeProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        EmployeeResponse employee = employeeService.getEmployeeByUserId(userPrincipal.getId());
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    @Operation(summary = "Create new employee and user account (Admin only)")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse createdEmployee = employeeService.createEmployee(request);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee details (Admin only)")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request) {
        EmployeeResponse updatedEmployee = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updatedEmployee);
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate employee (Admin only)")
    public ResponseEntity<EmployeeResponse> deactivateEmployee(@PathVariable Long id) {
        EmployeeResponse deactivatedEmployee = employeeService.deactivateEmployee(id);
        return ResponseEntity.ok(deactivatedEmployee);
    }
}
