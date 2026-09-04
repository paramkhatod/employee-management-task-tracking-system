package com.employee.management.dto;

import com.employee.management.entity.TaskPriority;
import com.employee.management.entity.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private String assignedEmployeeEmail;
    private String assignedEmployeeDepartment;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponse() {}

    public TaskResponse(Long id, String title, String description, Long assignedEmployeeId, String assignedEmployeeName, String assignedEmployeeEmail, String assignedEmployeeDepartment, TaskPriority priority, TaskStatus status, LocalDate dueDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedEmployeeId = assignedEmployeeId;
        this.assignedEmployeeName = assignedEmployeeName;
        this.assignedEmployeeEmail = assignedEmployeeEmail;
        this.assignedEmployeeDepartment = assignedEmployeeDepartment;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public String getAssignedEmployeeName() { return assignedEmployeeName; }
    public void setAssignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; }

    public String getAssignedEmployeeEmail() { return assignedEmployeeEmail; }
    public void setAssignedEmployeeEmail(String assignedEmployeeEmail) { this.assignedEmployeeEmail = assignedEmployeeEmail; }

    public String getAssignedEmployeeDepartment() { return assignedEmployeeDepartment; }
    public void setAssignedEmployeeDepartment(String assignedEmployeeDepartment) { this.assignedEmployeeDepartment = assignedEmployeeDepartment; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static TaskResponseBuilder builder() { return new TaskResponseBuilder(); }

    public static class TaskResponseBuilder {
        private Long id;
        private String title;
        private String description;
        private Long assignedEmployeeId;
        private String assignedEmployeeName;
        private String assignedEmployeeEmail;
        private String assignedEmployeeDepartment;
        private TaskPriority priority;
        private TaskStatus status;
        private LocalDate dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TaskResponseBuilder id(Long id) { this.id = id; return this; }
        public TaskResponseBuilder title(String title) { this.title = title; return this; }
        public TaskResponseBuilder description(String description) { this.description = description; return this; }
        public TaskResponseBuilder assignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; return this; }
        public TaskResponseBuilder assignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; return this; }
        public TaskResponseBuilder assignedEmployeeEmail(String assignedEmployeeEmail) { this.assignedEmployeeEmail = assignedEmployeeEmail; return this; }
        public TaskResponseBuilder assignedEmployeeDepartment(String assignedEmployeeDepartment) { this.assignedEmployeeDepartment = assignedEmployeeDepartment; return this; }
        public TaskResponseBuilder priority(TaskPriority priority) { this.priority = priority; return this; }
        public TaskResponseBuilder status(TaskStatus status) { this.status = status; return this; }
        public TaskResponseBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public TaskResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TaskResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TaskResponse build() {
            return new TaskResponse(id, title, description, assignedEmployeeId, assignedEmployeeName, assignedEmployeeEmail, assignedEmployeeDepartment, priority, status, dueDate, createdAt, updatedAt);
        }
    }
}
