package com.employee.management.config;

import com.employee.management.entity.*;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.TaskRepository;
import com.employee.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, EmployeeRepository employeeRepository, TaskRepository taskRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized with seed data.");
            return;
        }

        logger.info("Initializing database with default admin, sample employees, and demo tasks...");

        // 1. Create Default Admin User & Employee Profile
        User adminUser = User.builder()
                .email("admin@company.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        Employee adminEmployee = Employee.builder()
                .user(adminUser)
                .firstName("System")
                .lastName("Admin")
                .email("admin@company.com")
                .phone("+1-555-0100")
                .department("IT")
                .designation("System Administrator")
                .joiningDate(LocalDate.of(2023, 1, 15))
                .active(true)
                .build();

        employeeRepository.save(adminEmployee);

        // 2. Create Employee 1 (John Doe)
        User emp1User = User.builder()
                .email("john.doe@company.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();

        Employee johnDoe = Employee.builder()
                .user(emp1User)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@company.com")
                .phone("+1-555-0199")
                .department("Engineering")
                .designation("Senior Full Stack Developer")
                .joiningDate(LocalDate.of(2023, 6, 1))
                .active(true)
                .build();

        Employee savedJohn = employeeRepository.save(johnDoe);

        // 3. Create Employee 2 (Jane Smith)
        User emp2User = User.builder()
                .email("jane.smith@company.com")
                .password(passwordEncoder.encode("Password@123"))
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();

        Employee janeSmith = Employee.builder()
                .user(emp2User)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@company.com")
                .phone("+1-555-0244")
                .department("Product")
                .designation("Lead Product Manager")
                .joiningDate(LocalDate.of(2024, 2, 10))
                .active(true)
                .build();

        Employee savedJane = employeeRepository.save(janeSmith);

        // 4. Create Demo Tasks
        Task task1 = Task.builder()
                .title("Architect JWT Spring Security Filter Chain")
                .description("Design stateless JWT authentication filter with role-based authorization for admin/employee endpoints.")
                .assignedEmployee(savedJohn)
                .priority(TaskPriority.URGENT)
                .status(TaskStatus.COMPLETED)
                .dueDate(LocalDate.now().plusDays(2))
                .build();

        Task task2 = Task.builder()
                .title("Implement React SPA Employee Dashboard")
                .description("Build responsive metrics dashboard with live status indicators and data table pagination.")
                .assignedEmployee(savedJohn)
                .priority(TaskPriority.HIGH)
                .status(TaskStatus.IN_PROGRESS)
                .dueDate(LocalDate.now().plusDays(5))
                .build();

        Task task3 = Task.builder()
                .title("Prepare Q4 Product Roadmap & API Specs")
                .description("Define OpenAPI specifications and feature timelines for upcoming quarterly deliverables.")
                .assignedEmployee(savedJane)
                .priority(TaskPriority.MEDIUM)
                .status(TaskStatus.TODO)
                .dueDate(LocalDate.now().plusDays(8))
                .build();

        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);

        logger.info("Database initialization completed successfully.");
    }
}
