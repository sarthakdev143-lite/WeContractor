package github.sarthakdev.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenRefreshResponse {
    private String authToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public TokenRefreshResponse(String authToken, String refreshToken) {
        this.authToken = authToken;
        this.refreshToken = refreshToken;
    }
}