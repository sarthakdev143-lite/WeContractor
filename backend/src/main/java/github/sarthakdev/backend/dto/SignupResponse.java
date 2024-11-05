package github.sarthakdev.backend.dto;

import github.sarthakdev.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponse {
    private String message;
    private User user;
    private boolean success;
    private boolean requiresVerification;  
    
    public SignupResponse(String message, User user, boolean success) {
        this.message = message;
        this.user = user;
        this.success = success;
        this.requiresVerification = true;  // Default to true for new implementation
    }
}