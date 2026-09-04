package com.employee.management.dto;

public class AdminDashboardResponse {
    private long totalEmployees;
    private long activeEmployees;
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long cancelledTasks;
    private long highPriorityTasks;

    public AdminDashboardResponse() {}

    public AdminDashboardResponse(long totalEmployees, long activeEmployees, long totalTasks, long pendingTasks, long inProgressTasks, long completedTasks, long cancelledTasks, long highPriorityTasks) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.cancelledTasks = cancelledTasks;
        this.highPriorityTasks = highPriorityTasks;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }

    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }

    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }

    public long getCancelledTasks() { return cancelledTasks; }
    public void setCancelledTasks(long cancelledTasks) { this.cancelledTasks = cancelledTasks; }

    public long getHighPriorityTasks() { return highPriorityTasks; }
    public void setHighPriorityTasks(long highPriorityTasks) { this.highPriorityTasks = highPriorityTasks; }

    public static AdminDashboardResponseBuilder builder() { return new AdminDashboardResponseBuilder(); }

    public static class AdminDashboardResponseBuilder {
        private long totalEmployees;
        private long activeEmployees;
        private long totalTasks;
        private long pendingTasks;
        private long inProgressTasks;
        private long completedTasks;
        private long cancelledTasks;
        private long highPriorityTasks;

        public AdminDashboardResponseBuilder totalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; return this; }
        public AdminDashboardResponseBuilder activeEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; return this; }
        public AdminDashboardResponseBuilder totalTasks(long totalTasks) { this.totalTasks = totalTasks; return this; }
        public AdminDashboardResponseBuilder pendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; return this; }
        public AdminDashboardResponseBuilder inProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; return this; }
        public AdminDashboardResponseBuilder completedTasks(long completedTasks) { this.completedTasks = completedTasks; return this; }
        public AdminDashboardResponseBuilder cancelledTasks(long cancelledTasks) { this.cancelledTasks = cancelledTasks; return this; }
        public AdminDashboardResponseBuilder highPriorityTasks(long highPriorityTasks) { this.highPriorityTasks = highPriorityTasks; return this; }

        public AdminDashboardResponse build() {
            return new AdminDashboardResponse(totalEmployees, activeEmployees, totalTasks, pendingTasks, inProgressTasks, completedTasks, cancelledTasks, highPriorityTasks);
        }
    }
}
