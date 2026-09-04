package com.employee.management.dto;

import java.util.List;

public class EmployeeDashboardResponse {
    private long totalAssignedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private List<TaskResponse> upcomingDeadlines;

    public EmployeeDashboardResponse() {}

    public EmployeeDashboardResponse(long totalAssignedTasks, long pendingTasks, long inProgressTasks, long completedTasks, List<TaskResponse> upcomingDeadlines) {
        this.totalAssignedTasks = totalAssignedTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.upcomingDeadlines = upcomingDeadlines;
    }

    public long getTotalAssignedTasks() { return totalAssignedTasks; }
    public void setTotalAssignedTasks(long totalAssignedTasks) { this.totalAssignedTasks = totalAssignedTasks; }

    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }

    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }

    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }

    public List<TaskResponse> getUpcomingDeadlines() { return upcomingDeadlines; }
    public void setUpcomingDeadlines(List<TaskResponse> upcomingDeadlines) { this.upcomingDeadlines = upcomingDeadlines; }

    public static EmployeeDashboardResponseBuilder builder() { return new EmployeeDashboardResponseBuilder(); }

    public static class EmployeeDashboardResponseBuilder {
        private long totalAssignedTasks;
        private long pendingTasks;
        private long inProgressTasks;
        private long completedTasks;
        private List<TaskResponse> upcomingDeadlines;

        public EmployeeDashboardResponseBuilder totalAssignedTasks(long totalAssignedTasks) { this.totalAssignedTasks = totalAssignedTasks; return this; }
        public EmployeeDashboardResponseBuilder pendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; return this; }
        public EmployeeDashboardResponseBuilder inProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; return this; }
        public EmployeeDashboardResponseBuilder completedTasks(long completedTasks) { this.completedTasks = completedTasks; return this; }
        public EmployeeDashboardResponseBuilder upcomingDeadlines(List<TaskResponse> upcomingDeadlines) { this.upcomingDeadlines = upcomingDeadlines; return this; }

        public EmployeeDashboardResponse build() {
            return new EmployeeDashboardResponse(totalAssignedTasks, pendingTasks, inProgressTasks, completedTasks, upcomingDeadlines);
        }
    }
}
