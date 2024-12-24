package github.sarthakdev.backend.service;

import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

import github.sarthakdev.backend.model.User;

import java.time.LocalDateTime;
import javax.security.auth.login.AccountLockedException;

@Service
public class LoginAttemptService {

    private final EmailService emailService;
    private final int MAX_ATTEMPTS = 5;
    private final int LOCK_TIME_MINUTES = 30;

    public LoginAttemptService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void checkLoginAttempts(User user) throws AccountLockedException {
        if (user.getLoginAttempts() >= MAX_ATTEMPTS &&
                user.getLastLoginAttemptTime().plusMinutes(LOCK_TIME_MINUTES).isAfter(LocalDateTime.now())) {
            System.out.println("""
                    
                    
                    Account temporarily locked due to too many failed attempts. \
                    Please try again later or reset your password.
                    
                    """);
            throw new AccountLockedException("Account temporarily locked due to too many failed attempts. " +
                    "Please try again later or reset your password.");
        }
    }

    public void recordFailedAttempt(User user) throws jakarta.mail.MessagingException {
        user.setLoginAttempts(user.getLoginAttempts() + 1);
        user.setLastLoginAttemptTime(LocalDateTime.now());

        // If max attempts reached, notify user via email
        if (user.getLoginAttempts() >= MAX_ATTEMPTS) {
            try {
                emailService.sendLoginAttemptWarning(user.getEmail());
            } catch (MessagingException e) {
                System.out.println("\n\nFailed to send login attempt warning email\n\n" + e.getMessage());
            }
        } else {
            System.out.println("\n\nLogin attempt recorded. Current attempts: " + user.getLoginAttempts() + "\n\n");
        }
    }

    public void resetAttempts(User user) {
        user.setLoginAttempts(0);
        user.setLastLoginAttemptTime(null);
        System.out.println("\n\nLogin attempts have been reset for user: " + user.getEmail() + "\n\n");
    }
}
