package com.employee.management.service;

import com.employee.management.dto.*;
import com.employee.management.entity.Employee;
import com.employee.management.entity.Task;
import com.employee.management.entity.TaskPriority;
import com.employee.management.entity.TaskStatus;
import com.employee.management.exception.InvalidTaskStatusException;
import com.employee.management.exception.ResourceNotFoundException;
import com.employee.management.exception.UnauthorizedAccessException;
import com.employee.management.mapper.TaskMapper;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.TaskRepository;
import com.employee.management.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository,
                       AuditLogService auditLogService, EmailService emailService,
                       NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getAllTasks(
            String search, TaskStatus status, TaskPriority priority, Long assignedEmployeeId,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Task> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority));
            }

            if (assignedEmployeeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("assignedEmployee").get("id"), assignedEmployeeId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Task> taskPage = taskRepository.findAll(spec, pageable);
        Page<TaskResponse> dtoPage = taskPage.map(TaskMapper::toDto);

        return PageResponse.fromPage(dtoPage);
    }

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getMyTasks(
            UserPrincipal currentUser, int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Task> taskPage = taskRepository.findByAssignedEmployeeUserId(currentUser.getId(), pageable);
        Page<TaskResponse> dtoPage = taskPage.map(TaskMapper::toDto);

        return PageResponse.fromPage(dtoPage);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user", "userId", currentUser.getId()));

            if (!task.getAssignedEmployee().getId().equals(employee.getId())) {
                throw new UnauthorizedAccessException("You are not authorized to view tasks assigned to other employees");
            }
        }

        return TaskMapper.toDto(task);
    }

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getAssignedEmployeeId()));

        if (!employee.isActive()) {
            throw new InvalidTaskStatusException("Cannot assign tasks to an inactive employee");
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .assignedEmployee(employee)
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .build();

        Task savedTask = taskRepository.save(task);

        // Trigger Audit Log
        auditLogService.logActivity("TASK_CREATED", "TASK", savedTask.getId(), "ADMIN",
                "Created task: '" + savedTask.getTitle() + "' assigned to " + employee.getFirstName() + " " + employee.getLastName());

        // Trigger Email Notification
        emailService.sendTaskAssignmentEmail(
                employee.getEmail(),
                employee.getFirstName() + " " + employee.getLastName(),
                savedTask.getTitle(),
                savedTask.getPriority().name(),
                savedTask.getDueDate() != null ? savedTask.getDueDate().toString() : "Not specified"
        );

        // Trigger WebSocket Live Notification
        Long targetUserId = employee.getUser() != null ? employee.getUser().getId() : null;
        notificationService.sendTaskNotification(
                targetUserId,
                "New Task Assigned",
                "You have been assigned a new task: " + savedTask.getTitle(),
                "TASK_ASSIGNED"
        );

        return TaskMapper.toDto(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        Employee employee = employeeRepository.findById(request.getAssignedEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getAssignedEmployeeId()));

        if (!employee.isActive()) {
            throw new InvalidTaskStatusException("Cannot assign tasks to an inactive employee");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedEmployee(employee);
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);

        auditLogService.logActivity("TASK_UPDATED", "TASK", updatedTask.getId(), "ADMIN",
                "Updated task details for: '" + updatedTask.getTitle() + "'");

        return TaskMapper.toDto(updatedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatusUpdateRequest request, UserPrincipal currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user", "userId", currentUser.getId()));

            if (!task.getAssignedEmployee().getId().equals(employee.getId())) {
                throw new UnauthorizedAccessException("You can only update the status of tasks assigned to you");
            }
        }

        TaskStatus currentStatus = task.getStatus();
        TaskStatus newStatus = request.getStatus();

        if (currentStatus == TaskStatus.COMPLETED && newStatus == TaskStatus.IN_PROGRESS && !isAdmin) {
            throw new InvalidTaskStatusException("Completed tasks cannot be reverted back to In Progress by employees");
        }

        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        // Trigger Audit Log
        auditLogService.logActivity("TASK_STATUS_UPDATED", "TASK", updatedTask.getId(), currentUser.getUsername(),
                "Task status changed from " + currentStatus + " to " + newStatus + " for task: '" + updatedTask.getTitle() + "'");

        // Trigger WebSocket Live Notification
        Long recipientUserId = updatedTask.getAssignedEmployee().getUser() != null ? updatedTask.getAssignedEmployee().getUser().getId() : null;
        notificationService.sendTaskNotification(
                recipientUserId,
                "Task Status Updated",
                "Task '" + updatedTask.getTitle() + "' status changed to " + newStatus,
                "TASK_UPDATED"
        );

        return TaskMapper.toDto(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);

        auditLogService.logActivity("TASK_DELETED", "TASK", id, "ADMIN", "Deleted task #" + id + ": '" + task.getTitle() + "'");
    }
}
