package com.employee.management.service;

import com.employee.management.dto.AdminDashboardResponse;
import com.employee.management.dto.EmployeeDashboardResponse;
import com.employee.management.dto.TaskResponse;
import com.employee.management.entity.Task;
import com.employee.management.entity.TaskPriority;
import com.employee.management.entity.TaskStatus;
import com.employee.management.mapper.TaskMapper;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.TaskRepository;
import com.employee.management.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;

    public DashboardService(EmployeeRepository employeeRepository, TaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboardMetrics() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByActiveTrue();
        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long cancelledTasks = taskRepository.countByStatus(TaskStatus.CANCELLED);
        long highPriorityCount = taskRepository.countByPriority(TaskPriority.HIGH);
        long urgentPriorityCount = taskRepository.countByPriority(TaskPriority.URGENT);

        return AdminDashboardResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .cancelledTasks(cancelledTasks)
                .highPriorityTasks(highPriorityCount + urgentPriorityCount)
                .build();
    }

    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getEmployeeDashboardMetrics(UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        long totalAssignedTasks = taskRepository.countByAssignedEmployeeUserId(userId);
        long pendingTasks = taskRepository.countByAssignedEmployeeUserIdAndStatus(userId, TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByAssignedEmployeeUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByAssignedEmployeeUserIdAndStatus(userId, TaskStatus.COMPLETED);

        List<Task> upcomingTasks = taskRepository.findTop5ByAssignedEmployeeUserIdAndDueDateGreaterThanEqualOrderByDueDateAsc(
                userId, LocalDate.now());

        List<TaskResponse> upcomingDtos = upcomingTasks.stream()
                .map(TaskMapper::toDto)
                .collect(Collectors.toList());

        return EmployeeDashboardResponse.builder()
                .totalAssignedTasks(totalAssignedTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .upcomingDeadlines(upcomingDtos)
                .build();
    }
}
