package github.sarthakdev143.backend.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;


@Document
@Getter
@Setter
public class Transaction {

    @Id
    private Integer transactionId;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @Field(
            targetType = FieldType.DECIMAL128
    )
    private BigDecimal salePrice;

    private OffsetDateTime transactionDate;

    @NotNull
    @Size(max = 255)
    private String paymentStatus;

    private OffsetDateTime createdAt;

    @DocumentReference(lazy = true)
    private Plot plot;

    @DocumentReference(lazy = true)
    private User buyer;

    @DocumentReference(lazy = true)
    private User seller;

    @CreatedDate
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    private OffsetDateTime lastUpdated;

    @Version
    private Integer version;

}
