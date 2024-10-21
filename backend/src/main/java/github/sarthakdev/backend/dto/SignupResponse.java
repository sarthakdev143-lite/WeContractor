package github.sarthakdev.backend.dto;

import github.sarthakdev.backend.beans.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@ToString
public class SignupResponse {
    private String message;
    private User user;
    private boolean success;
}