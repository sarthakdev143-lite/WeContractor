package github.sarthakdev.backend.beans;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import github.sarthakdev.backend.dto.BankAccount;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "password")
public class User {

    @Id
    private ObjectId id;

    @Indexed(unique = true)
    private String username;

    private String password;

    @Indexed(unique = true)
    private String email;

    private String status;
    private Boolean verified = false;
    private String profilePictureUrl;

    @Indexed(unique = true)
    private String phoneNumber;

    @DBRef
    private List<Role> roles;

    @DBRef
    private List<Favourite> favourites;

    private List<Transaction> transactions;
    private List<Plot> plots;

    @DBRef
    private List<BankAccount> bankAccounts;

    @CreatedDate
    private Instant createdAt;
}
