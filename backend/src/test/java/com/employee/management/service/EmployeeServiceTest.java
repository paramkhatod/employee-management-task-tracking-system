package com.employee.management.service;

import com.employee.management.dto.EmployeeRequest;
import com.employee.management.dto.EmployeeResponse;
import com.employee.management.entity.Employee;
import com.employee.management.entity.Role;
import com.employee.management.entity.User;
import com.employee.management.exception.DuplicateResourceException;
import com.employee.management.exception.ResourceNotFoundException;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeService employeeService;

    private EmployeeRequest employeeRequest;
    private Employee employee;
    private User user;

    @BeforeEach
    void setUp() {
        employeeRequest = EmployeeRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@company.com")
                .phone("+1234567890")
                .department("Engineering")
                .designation("Software Engineer")
                .joiningDate(LocalDate.now())
                .role(Role.EMPLOYEE)
                .password("Password@123")
                .build();

        user = User.builder()
                .id(2L)
                .email("john.doe@company.com")
                .password("hashed_password")
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();

        employee = Employee.builder()
                .id(5L)
                .user(user)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@company.com")
                .phone("+1234567890")
                .department("Engineering")
                .designation("Software Engineer")
                .joiningDate(LocalDate.now())
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should create employee successfully when email is unique")
    void testCreateEmployeeSuccess() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(employeeRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        EmployeeResponse response = employeeService.createEmployee(employeeRequest);

        assertNotNull(response);
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@company.com", response.getEmail());
        assertTrue(response.isActive());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void testCreateEmployeeDuplicateEmail() {
        when(userRepository.existsByEmail("john.doe@company.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(employeeRequest));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should deactivate employee successfully")
    void testDeactivateEmployee() {
        when(employeeRepository.findById(5L)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeResponse response = employeeService.deactivateEmployee(5L);

        assertNotNull(response);
        assertFalse(response.isActive());
        assertFalse(employee.getUser().isEnabled());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when employee ID does not exist")
    void testGetEmployeeByIdNotFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.getEmployeeById(99L));
    }
}
