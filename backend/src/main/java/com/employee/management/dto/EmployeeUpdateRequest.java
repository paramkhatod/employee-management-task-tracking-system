package com.employee.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class EmployeeUpdateRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @Pattern(regexp = "^$|^[+]*[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private Boolean active;

    public EmployeeUpdateRequest() {}

    public EmployeeUpdateRequest(String firstName, String lastName, String phone, String department, String designation, Boolean active) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.active = active;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static EmployeeUpdateRequestBuilder builder() { return new EmployeeUpdateRequestBuilder(); }

    public static class EmployeeUpdateRequestBuilder {
        private String firstName;
        private String lastName;
        private String phone;
        private String department;
        private String designation;
        private Boolean active;

        public EmployeeUpdateRequestBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public EmployeeUpdateRequestBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public EmployeeUpdateRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public EmployeeUpdateRequestBuilder department(String department) { this.department = department; return this; }
        public EmployeeUpdateRequestBuilder designation(String designation) { this.designation = designation; return this; }
        public EmployeeUpdateRequestBuilder active(Boolean active) { this.active = active; return this; }

        public EmployeeUpdateRequest build() {
            return new EmployeeUpdateRequest(firstName, lastName, phone, department, designation, active);
        }
    }
}
