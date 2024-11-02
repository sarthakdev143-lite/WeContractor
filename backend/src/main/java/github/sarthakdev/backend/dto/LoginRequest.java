package github.sarthakdev.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class LoginRequest {
    private String identifier;
    private String password;
}
