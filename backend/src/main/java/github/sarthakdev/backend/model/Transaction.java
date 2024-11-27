package github.sarthakdev.backend.model;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "transactions")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Transaction {
    @Id
    private ObjectId id;

    @DBRef
    private Plot plot;

    @DBRef
    private User buyer;

    @DBRef
    private User seller;

    private Double transactionAmount;

    private String transactionType;

    @CreatedDate
    private Date transactionDate;    
}
