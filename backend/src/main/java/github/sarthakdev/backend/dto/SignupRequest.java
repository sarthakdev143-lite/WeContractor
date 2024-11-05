package github.sarthakdev.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class SignupRequest {
    private String fullName;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String profilePictureUrl;
}
