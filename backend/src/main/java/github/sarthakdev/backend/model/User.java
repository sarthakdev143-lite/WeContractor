package github.sarthakdev.backend.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import github.sarthakdev.backend.dto.BankAccount;
import github.sarthakdev.backend.dto.PlotInUserDTO;
import github.sarthakdev.backend.dto.RecentActivity;
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
@ToString
public class User {

    @Id
    private ObjectId id;

    private String fullName;

    @Indexed(unique = true)
    private String username;

    private String password;

    @Indexed(unique = true)
    private String email;

    private String status;
    private Boolean verified = false;
    private Boolean enabled = false;
    private String profilePictureUrl;

    @Indexed(unique = true)
    private String phoneNumber;

    @DBRef
    private List<Role> roles;

    @DBRef
    private List<Favorite> favourites;

    private List<Transaction> transactions;

    private List<PlotInUserDTO> plots;

    private List<BankAccount> bankAccounts;

    private List<RecentActivity> recentActivities;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant lastModified;

    private int loginAttempts = 0;
    private LocalDateTime lastLoginAttemptTime;
}