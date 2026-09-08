package com.employee.management.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${app.mail.from:noreply@employeemanagement.com}")
    private String fromAddress;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendTaskAssignmentEmail(String toEmail, String employeeName, String taskTitle, String priority, String dueDate) {
        if (!mailEnabled || toEmail == null || toEmail.isBlank()) {
            System.out.println("Email notification skipped (disabled or no target email address).");
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("📋 New Task Assigned: " + taskTitle);

            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);'>" +
                "<h2 style='color: #4f46e5; margin-top: 0;'>New Task Assignment</h2>" +
                "<p>Hello <strong>%s</strong>,</p>" +
                "<p>A new task has been assigned to you on the Employee Management Portal:</p>" +
                "<div style='background: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px 16px; margin: 16px 0;'>" +
                "<h3 style='margin: 0 0 8px 0; color: #1e293b;'>%s</h3>" +
                "<p style='margin: 4px 0;'><strong>Priority:</strong> <span style='color: #dc2626;'>%s</span></p>" +
                "<p style='margin: 4px 0;'><strong>Due Date:</strong> %s</p>" +
                "</div>" +
                "<p>Please log in to your dashboard to review details and update task status as you make progress.</p>" +
                "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'/>" +
                "<p style='font-size: 12px; color: #64748b;'>Employee Management System &bull; Automated System Notification</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                employeeName, taskTitle, priority, dueDate != null ? dueDate : "Not specified"
            );

            helper.setText(htmlBody, true);
            javaMailSender.send(message);
            System.out.println("✅ Email notification successfully sent to: " + toEmail);
        } catch (Exception e) {
            // Log & catch to ensure core task creation succeeds even if SMTP is unconfigured
            System.err.println("ℹ️ Note: Email notification dispatch suppressed (SMTP server unconfigured in dev): " + e.getMessage());
        }
    }
}
