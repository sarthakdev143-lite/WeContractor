package github.sarthakdev.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String to, String token) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Create Thymeleaf context and load verification email template
        Context context = new Context();
        context.setVariable("token", token);
        context.setVariable("frontendUrl", frontendUrl);
        String body = templateEngine.process("verification-email", context);

        helper.setText(body, true);
        helper.setTo(to);
        helper.setSubject("Email Verification");
        helper.setFrom("noreply@sarthakdev-contractor.com");

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendWelcomeEmail(String to, String name) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Create Thymeleaf context and load welcome email template
        Context context = new Context();
        context.setVariable("name", name);
        String body = templateEngine.process("welcome-email", context);

        helper.setText(body, true);
        helper.setTo(to);
        helper.setSubject("Welcome to Our Service");
        helper.setFrom("noreply@sarthakdev-contractor.com");

        mailSender.send(message);
    }

    @Async
    public void sendLoginLink(String email, String loginLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Create Thymeleaf context and load login verification email template
        Context context = new Context();
        context.setVariable("loginLink", loginLink);
        context.setVariable("expiryMinutes", 15);
        String body = templateEngine.process("login-verification", context);

        helper.setTo(email);
        helper.setSubject("Login Verification Link");
        helper.setText(body, true);
        helper.setFrom("noreply@sarthakdev-contractor.com");

        mailSender.send(message);
    }

    @Async
    public void sendLoginNotification(String username) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(username);
        helper.setSubject("Login Notification");
        helper.setText("Someone has logged in to your account.", true);

        mailSender.send(message);
    }

    @Async
    public void sendLoginAttemptWarning(String email) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Create Thymeleaf context and load login attempt warning email template
        Context context = new Context();
        context.setVariable("lockMinutes", 30);
        String body = templateEngine.process("login-attempt-warning", context);

        helper.setTo(email);
        helper.setSubject("Security Alert - Multiple Failed Login Attempts");
        helper.setText(body, true);
        helper.setFrom("noreply@sarthakdev-contractor.com");

        mailSender.send(message);
    }

    @Async
    public void sendLoginNotification(String email, String ipAddress, String userAgent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Create Thymeleaf context and load login notification email template
        Context context = new Context();
        context.setVariable("ipAddress", ipAddress);
        context.setVariable("userAgent", userAgent);
        context.setVariable("loginTime", LocalDateTime.now().toString());
        String body = templateEngine.process("login-notification", context);

        helper.setTo(email);
        helper.setSubject("New Login to Your Account");
        helper.setText(body, true);
        helper.setFrom("noreply@sarthakdev-contractor.com");

        mailSender.send(message);
    }
}