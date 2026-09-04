package com.employee.management.dto;

import com.employee.management.entity.Role;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class EmployeeRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String email;

    @Pattern(regexp = "^$|^[+]*[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Password is required for user account creation")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    public EmployeeRequest() {}

    public EmployeeRequest(String firstName, String lastName, String email, String phone, String department, String designation, LocalDate joiningDate, Role role, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.role = role;
        this.password = password;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

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

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public static EmployeeRequestBuilder builder() { return new EmployeeRequestBuilder(); }

    public static class EmployeeRequestBuilder {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String department;
        private String designation;
        private LocalDate joiningDate;
        private Role role;
        private String password;

        public EmployeeRequestBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public EmployeeRequestBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public EmployeeRequestBuilder email(String email) { this.email = email; return this; }
        public EmployeeRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public EmployeeRequestBuilder department(String department) { this.department = department; return this; }
        public EmployeeRequestBuilder designation(String designation) { this.designation = designation; return this; }
        public EmployeeRequestBuilder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public EmployeeRequestBuilder role(Role role) { this.role = role; return this; }
        public EmployeeRequestBuilder password(String password) { this.password = password; return this; }

        public EmployeeRequest build() {
            return new EmployeeRequest(firstName, lastName, email, phone, department, designation, joiningDate, role, password);
        }
    }
}
