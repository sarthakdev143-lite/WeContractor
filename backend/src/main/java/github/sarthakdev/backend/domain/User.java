package github.sarthakdev.backend.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
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
public class User {

    @NotNull
    @Id
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

    @DocumentReference(lazy = true)
    private Set<Role> userRoleRoles;

    @DocumentReference(lazy = true, lookup = "{ 'createdBy' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Plot> createdByPlots;

    @DocumentReference(lazy = true, lookup = "{ 'buyer' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Transaction> buyerTransactions;

    @DocumentReference(lazy = true, lookup = "{ 'seller' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Transaction> sellerTransactions;

    @DocumentReference(lazy = true, lookup = "{ 'user' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Favorite> userFavorites;

}
