package github.sarthakdev.backend.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "login_verification_tokens")
@Data
@NoArgsConstructor
public class LoginVerificationToken {
    @Id
    private String id;
    private String token;
    private String email;
    private String passwordHash; // Store hashed password attempt
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime confirmedAt;
    private int attempts; // Track verification attempts
    private boolean passwordVerified;
    private String ipAddress; // Store requesting IP address
    private String userAgent; // Store browser/device info

    public LoginVerificationToken(String token, String email, String passwordHash, String ipAddress, String userAgent) {
        this.token = token;
        this.email = email;
        this.passwordHash = passwordHash;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(15);
        this.attempts = 0;
        this.passwordVerified = false;
    }
}