package github.sarthakdev.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardResponse {

    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private boolean verified;
    private String status;
    private LocalDateTime createdAt;
    private String profilePictureUrl;
    private List<String> roles;
    private List<BankAccount> bankAccounts;
    private List<Plot> plots;
    private List<Transaction> transactions;
}