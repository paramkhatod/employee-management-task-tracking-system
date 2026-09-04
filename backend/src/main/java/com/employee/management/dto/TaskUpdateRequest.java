package com.employee.management.dto;

import com.employee.management.entity.TaskPriority;
import com.employee.management.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class TaskUpdateRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    private String description;

    @NotNull(message = "Assigned employee ID is required")
    private Long assignedEmployeeId;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    public TaskUpdateRequest() {}

    public TaskUpdateRequest(String title, String description, Long assignedEmployeeId, TaskPriority priority, TaskStatus status, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.assignedEmployeeId = assignedEmployeeId;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public static TaskUpdateRequestBuilder builder() { return new TaskUpdateRequestBuilder(); }

    public static class TaskUpdateRequestBuilder {
        private String title;
        private String description;
        private Long assignedEmployeeId;
        private TaskPriority priority;
        private TaskStatus status;
        private LocalDate dueDate;

        public TaskUpdateRequestBuilder title(String title) { this.title = title; return this; }
        public TaskUpdateRequestBuilder description(String description) { this.description = description; return this; }
        public TaskUpdateRequestBuilder assignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; return this; }
        public TaskUpdateRequestBuilder priority(TaskPriority priority) { this.priority = priority; return this; }
        public TaskUpdateRequestBuilder status(TaskStatus status) { this.status = status; return this; }
        public TaskUpdateRequestBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }

        public TaskUpdateRequest build() {
            return new TaskUpdateRequest(title, description, assignedEmployeeId, priority, status, dueDate);
        }
    }
}
