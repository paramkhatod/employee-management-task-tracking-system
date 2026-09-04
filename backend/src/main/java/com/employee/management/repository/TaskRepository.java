package com.employee.management.repository;

import com.employee.management.entity.Task;
import com.employee.management.entity.TaskPriority;
import com.employee.management.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    Page<Task> findByAssignedEmployeeId(Long employeeId, Pageable pageable);

    Page<Task> findByAssignedEmployeeUserId(Long userId, Pageable pageable);

    long countByStatus(TaskStatus status);

    long countByPriority(TaskPriority priority);

    long countByAssignedEmployeeUserId(Long userId);

    long countByAssignedEmployeeUserIdAndStatus(Long userId, TaskStatus status);

    List<Task> findTop5ByAssignedEmployeeUserIdAndDueDateGreaterThanEqualOrderByDueDateAsc(Long userId, LocalDate date);
}
