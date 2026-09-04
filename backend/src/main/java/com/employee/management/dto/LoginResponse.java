package com.employee.management.dto;

import com.employee.management.entity.Role;

public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private Role role;
    private String fullName;
    private Long employeeId;

    public LoginResponse() {}

    public LoginResponse(String accessToken, String tokenType, Long userId, String email, Role role, String fullName, Long employeeId) {
        this.accessToken = accessToken;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.employeeId = employeeId;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public static LoginResponseBuilder builder() { return new LoginResponseBuilder(); }

    public static class LoginResponseBuilder {
        private String accessToken;
        private String tokenType = "Bearer";
        private Long userId;
        private String email;
        private Role role;
        private String fullName;
        private Long employeeId;

        public LoginResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public LoginResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public LoginResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public LoginResponseBuilder email(String email) { this.email = email; return this; }
        public LoginResponseBuilder role(Role role) { this.role = role; return this; }
        public LoginResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public LoginResponseBuilder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }

        public LoginResponse build() {
            return new LoginResponse(accessToken, tokenType, userId, email, role, fullName, employeeId);
        }
    }
}
