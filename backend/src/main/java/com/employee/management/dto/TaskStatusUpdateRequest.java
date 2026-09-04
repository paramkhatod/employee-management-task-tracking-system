package com.employee.management.dto;

import com.employee.management.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    public TaskStatusUpdateRequest() {}

    public TaskStatusUpdateRequest(TaskStatus status) {
        this.status = status;
    }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public static TaskStatusUpdateRequestBuilder builder() { return new TaskStatusUpdateRequestBuilder(); }

    public static class TaskStatusUpdateRequestBuilder {
        private TaskStatus status;

        public TaskStatusUpdateRequestBuilder status(TaskStatus status) { this.status = status; return this; }

        public TaskStatusUpdateRequest build() {
            return new TaskStatusUpdateRequest(status);
        }
    }
}
