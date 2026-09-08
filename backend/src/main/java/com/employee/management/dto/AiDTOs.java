package com.employee.management.dto;

import java.util.List;

public class AiDTOs {

    public static class TaskBreakdownRequest {
        private String title;
        private String description;

        public TaskBreakdownRequest() {}

        public TaskBreakdownRequest(String title, String description) {
            this.title = title;
            this.description = description;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class SubTaskItem {
        private String title;
        private Integer estimatedHours;
        private String suggestedPriority;

        public SubTaskItem() {}

        public SubTaskItem(String title, Integer estimatedHours, String suggestedPriority) {
            this.title = title;
            this.estimatedHours = estimatedHours;
            this.suggestedPriority = suggestedPriority;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public Integer getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }

        public String getSuggestedPriority() { return suggestedPriority; }
        public void setSuggestedPriority(String suggestedPriority) { this.suggestedPriority = suggestedPriority; }
    }

    public static class TaskBreakdownResponse {
        private String originalTitle;
        private String summary;
        private List<SubTaskItem> subTasks;

        public TaskBreakdownResponse() {}

        public TaskBreakdownResponse(String originalTitle, String summary, List<SubTaskItem> subTasks) {
            this.originalTitle = originalTitle;
            this.summary = summary;
            this.subTasks = subTasks;
        }

        public String getOriginalTitle() { return originalTitle; }
        public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public List<SubTaskItem> getSubTasks() { return subTasks; }
        public void setSubTasks(List<SubTaskItem> subTasks) { this.subTasks = subTasks; }
    }

    public static class WorkloadInsightResponse {
        private Integer totalPendingTasks;
        private String workloadAnalysis;
        private List<String> recommendedActions;
        private Integer teamHealthScore; // 0-100

        public WorkloadInsightResponse() {}

        public WorkloadInsightResponse(Integer totalPendingTasks, String workloadAnalysis, List<String> recommendedActions, Integer teamHealthScore) {
            this.totalPendingTasks = totalPendingTasks;
            this.workloadAnalysis = workloadAnalysis;
            this.recommendedActions = recommendedActions;
            this.teamHealthScore = teamHealthScore;
        }

        public Integer getTotalPendingTasks() { return totalPendingTasks; }
        public void setTotalPendingTasks(Integer totalPendingTasks) { this.totalPendingTasks = totalPendingTasks; }

        public String getWorkloadAnalysis() { return workloadAnalysis; }
        public void setWorkloadAnalysis(String workloadAnalysis) { this.workloadAnalysis = workloadAnalysis; }

        public List<String> getRecommendedActions() { return recommendedActions; }
        public void setRecommendedActions(List<String> recommendedActions) { this.recommendedActions = recommendedActions; }

        public Integer getTeamHealthScore() { return teamHealthScore; }
        public void setTeamHealthScore(Integer teamHealthScore) { this.teamHealthScore = teamHealthScore; }
    }
}
