package github.sarthakdev.backend.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;


@Document
@Getter
@Setter
public class Role {

    @NotNull
    @Id
    private String roleId;

    @NotNull
    @Size(max = 50)
    private String roleName;

    @DocumentReference(lazy = true, lookup = "{ 'userRoleRoles' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<User> userRoleUsers;

}
