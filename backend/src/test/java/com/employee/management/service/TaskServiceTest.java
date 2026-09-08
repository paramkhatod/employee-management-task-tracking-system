package com.employee.management.service;

import com.employee.management.dto.TaskCreateRequest;
import com.employee.management.dto.TaskResponse;
import com.employee.management.dto.TaskStatusUpdateRequest;
import com.employee.management.entity.*;
import com.employee.management.exception.InvalidTaskStatusException;
import com.employee.management.exception.UnauthorizedAccessException;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.TaskRepository;
import com.employee.management.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskService taskService;

    private Employee employee;
    private Employee employee2;
    private Task task;

    @BeforeEach
    void setUp() {
        User user = User.builder().id(2L).email("emp@company.com").role(Role.EMPLOYEE).enabled(true).build();
        employee = Employee.builder().id(5L).user(user).firstName("Jane").lastName("Smith").email("emp@company.com").active(true).build();

        User user2 = User.builder().id(3L).email("emp2@company.com").role(Role.EMPLOYEE).enabled(true).build();
        employee2 = Employee.builder().id(6L).user(user2).firstName("Bob").lastName("Taylor").email("emp2@company.com").active(true).build();

        task = Task.builder()
                .id(100L)
                .title("Build Authentication")
                .description("Implement JWT")
                .assignedEmployee(employee)
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .dueDate(LocalDate.now().plusDays(5))
                .build();
    }

    @Test
    @DisplayName("Should create task successfully when employee is active")
    void testCreateTaskSuccess() {
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Build Authentication")
                .description("Implement JWT")
                .assignedEmployeeId(5L)
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.TODO)
                .dueDate(LocalDate.now().plusDays(5))
                .build();

        when(employeeRepository.findById(5L)).thenReturn(Optional.of(employee));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals("Build Authentication", response.getTitle());
        assertEquals(TaskPriority.HIGH, response.getPriority());
        assertEquals(TaskStatus.TODO, response.getStatus());
    }

    @Test
    @DisplayName("Should throw InvalidTaskStatusException when assigning task to inactive employee")
    void testCreateTaskInactiveEmployee() {
        employee.setActive(false);
        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("Test Task")
                .assignedEmployeeId(5L)
                .priority(TaskPriority.LOW)
                .status(TaskStatus.TODO)
                .dueDate(LocalDate.now())
                .build();

        when(employeeRepository.findById(5L)).thenReturn(Optional.of(employee));

        assertThrows(InvalidTaskStatusException.class, () -> taskService.createTask(request));
        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw UnauthorizedAccessException when employee updates task assigned to someone else")
    void testUpdateStatusUnauthorized() {
        UserPrincipal employee2User = new UserPrincipal(3L, "emp2@company.com", "pass",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLOYEE")), true);

        TaskStatusUpdateRequest request = TaskStatusUpdateRequest.builder().status(TaskStatus.IN_PROGRESS).build();

        when(taskRepository.findById(100L)).thenReturn(Optional.of(task));
        when(employeeRepository.findByUserId(3L)).thenReturn(Optional.of(employee2));

        assertThrows(UnauthorizedAccessException.class, () -> taskService.updateTaskStatus(100L, request, employee2User));
    }

    @Test
    @DisplayName("Should allow assigned employee to update status to IN_PROGRESS")
    void testUpdateStatusAssignedEmployeeSuccess() {
        UserPrincipal assignedEmployeeUser = new UserPrincipal(2L, "emp@company.com", "pass",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLOYEE")), true);

        TaskStatusUpdateRequest request = TaskStatusUpdateRequest.builder().status(TaskStatus.IN_PROGRESS).build();

        when(taskRepository.findById(100L)).thenReturn(Optional.of(task));
        when(employeeRepository.findByUserId(2L)).thenReturn(Optional.of(employee));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.updateTaskStatus(100L, request, assignedEmployeeUser);

        assertNotNull(response);
        assertEquals(TaskStatus.IN_PROGRESS, response.getStatus());
    }
}
