package com.employee.management.dto;

import com.employee.management.entity.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private boolean active;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeResponse() {}

    public EmployeeResponse(Long id, Long userId, String firstName, String lastName, String fullName, String email, String phone, String department, String designation, LocalDate joiningDate, boolean active, Role role, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.active = active;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static EmployeeResponseBuilder builder() { return new EmployeeResponseBuilder(); }

    public static class EmployeeResponseBuilder {
        private Long id;
        private Long userId;
        private String firstName;
        private String lastName;
        private String fullName;
        private String email;
        private String phone;
        private String department;
        private String designation;
        private LocalDate joiningDate;
        private boolean active;
        private Role role;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public EmployeeResponseBuilder id(Long id) { this.id = id; return this; }
        public EmployeeResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public EmployeeResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public EmployeeResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public EmployeeResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public EmployeeResponseBuilder email(String email) { this.email = email; return this; }
        public EmployeeResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public EmployeeResponseBuilder department(String department) { this.department = department; return this; }
        public EmployeeResponseBuilder designation(String designation) { this.designation = designation; return this; }
        public EmployeeResponseBuilder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public EmployeeResponseBuilder active(boolean active) { this.active = active; return this; }
        public EmployeeResponseBuilder role(Role role) { this.role = role; return this; }
        public EmployeeResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public EmployeeResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public EmployeeResponse build() {
            return new EmployeeResponse(id, userId, firstName, lastName, fullName, email, phone, department, designation, joiningDate, active, role, createdAt, updatedAt);
        }
    }
}
