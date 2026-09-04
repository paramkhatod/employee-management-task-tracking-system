package com.employee.management.service;

import com.employee.management.dto.LoginRequest;
import com.employee.management.dto.LoginResponse;
import com.employee.management.entity.Employee;
import com.employee.management.entity.Role;
import com.employee.management.entity.User;
import com.employee.management.repository.EmployeeRepository;
import com.employee.management.repository.UserRepository;
import com.employee.management.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;
    private User user;
    private Employee employee;

    @BeforeEach
    void setUp() {
        loginRequest = LoginRequest.builder()
                .email("admin@company.com")
                .password("Admin@123")
                .build();

        user = User.builder()
                .id(1L)
                .email("admin@company.com")
                .password("encoded_pass")
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        employee = Employee.builder()
                .id(10L)
                .user(user)
                .firstName("System")
                .lastName("Admin")
                .email("admin@company.com")
                .department("IT")
                .designation("Admin")
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should login successfully and return LoginResponse with JWT token")
    void testLoginSuccess() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("mock.jwt.token");
        when(userRepository.findByEmail("admin@company.com")).thenReturn(Optional.of(user));
        when(employeeRepository.findByUserId(1L)).thenReturn(Optional.of(employee));

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getAccessToken());
        assertEquals("admin@company.com", response.getEmail());
        assertEquals(Role.ADMIN, response.getRole());
        assertEquals("System Admin", response.getFullName());
        assertEquals(10L, response.getEmployeeId());
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when invalid credentials are provided")
    void testLoginFailureInvalidCredentials() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
        verify(tokenProvider, never()).generateToken(any());
    }
}
