package github.sarthakdev.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class SecureLoginRequest {
    @NotBlank
    private String identifier;
    
    @NotBlank
    private String password;
}