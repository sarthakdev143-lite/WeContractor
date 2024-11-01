package github.sarthakdev.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public void sendWelcomeEmail(String to, String name) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Welcome to Our Service");

        // Create Thymeleaf context and load welcome email template
        Context context = new Context();
        context.setVariable("name", name);
        String body = templateEngine.process("welcome-email", context);

        helper.setText(body, true);

        mailSender.send(message);
    }
}
