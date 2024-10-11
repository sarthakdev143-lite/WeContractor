package github.sarthakdev.backend.model;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TransactionDTO {

    @Size(max = 50)
    @TransactionTransactionIdValid
    private String transactionId;

    private OffsetDateTime transactionDate;

    private OffsetDateTime createdAt;

    @Size(max = 50)
    private String plot;

    @Size(max = 50)
    private String buyer;

    @Size(max = 50)
    private String seller;

}
