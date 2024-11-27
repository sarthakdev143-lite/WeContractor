package github.sarthakdev.backend.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDashboardTransactionDTO {
    private Double transactionAmount;
    private Date transactionDate;
}
