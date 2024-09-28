package github.sarthakdev143.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TransactionDTO {

    private Integer transactionId;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal salePrice;

    private OffsetDateTime transactionDate;

    @NotNull
    @Size(max = 255)
    private String paymentStatus;

    private OffsetDateTime createdAt;

    private Integer plot;

    private Integer buyer;

    private Integer seller;

}
