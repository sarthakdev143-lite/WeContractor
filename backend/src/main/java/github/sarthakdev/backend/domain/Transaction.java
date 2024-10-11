package github.sarthakdev.backend.domain;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;


@Document
@Getter
@Setter
public class Transaction {

    @NotNull
    @Id
    private String transactionId;

    private OffsetDateTime transactionDate;

    private OffsetDateTime createdAt;

    @DocumentReference(lazy = true)
    private Plot plot;

    @DocumentReference(lazy = true)
    private User buyer;

    @DocumentReference(lazy = true)
    private User seller;

}
