package github.sarthakdev.backend.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDTO {

    @Size(max = 50)
    @UserUserIdValid
    private String userId;

    @NotNull
    @Size(max = 50)
    private String username;

    @NotNull
    @Size(max = 255)
    private String passwordHash;

    @NotNull
    @Size(max = 100)
    private String email;

    @Size(max = 255)
    private String profilePictureUrl;

    private Boolean twoStepVerification;

    private OffsetDateTime createdAt;

    private List<String> userRoleRoles;

}
