package com.employee.management.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTaskNotification(Long userId, String title, String message, String type) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("message", message);
        notification.put("type", type); // INFO, TASK_ASSIGNED, TASK_UPDATED
        notification.put("timestamp", LocalDateTime.now().toString());

        try {
            // Global Broadcast
            messagingTemplate.convertAndSend("/topic/notifications", notification);

            // User-specific Broadcast
            if (userId != null) {
                messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
            }
        } catch (Exception e) {
            System.err.println("WebSocket notification push failed: " + e.getMessage());
        }
    }
}
