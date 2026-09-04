package com.employee.management.mapper;

import com.employee.management.dto.TaskResponse;
import com.employee.management.entity.Task;

public class TaskMapper {

    public static TaskResponse toDto(Task task) {
        if (task == null) {
            return null;
        }

        String assignedName = null;
        String assignedEmail = null;
        String assignedDepartment = null;
        Long assignedId = null;

        if (task.getAssignedEmployee() != null) {
            assignedId = task.getAssignedEmployee().getId();
            assignedName = task.getAssignedEmployee().getFullName();
            assignedEmail = task.getAssignedEmployee().getEmail();
            assignedDepartment = task.getAssignedEmployee().getDepartment();
        }

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignedEmployeeId(assignedId)
                .assignedEmployeeName(assignedName)
                .assignedEmployeeEmail(assignedEmail)
                .assignedEmployeeDepartment(assignedDepartment)
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
