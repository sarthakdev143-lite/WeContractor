package github.sarthakdev143.backend.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;


@Document
@Getter
@Setter
public class Plot {

    @Id
    private Integer plotId;

    @NotNull
    @Size(max = 100)
    private String title;

    @NotNull
    private Double size;

    @NotNull
    @Size(max = 255)
    private String location;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @Field(
            targetType = FieldType.DECIMAL128
    )
    private BigDecimal price;

    @NotNull
    @Size(max = 255)
    private String availability;

    private String zoningInformation;

    private String amenities;

    private String images;

    private String videos;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @DocumentReference(lazy = true)
    private User createdBy;

    @DocumentReference(lazy = true, lookup = "{ 'plot' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Transaction> plotTransactions;

    @DocumentReference(lazy = true, lookup = "{ 'plot' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Favorite> plotFavorites;

    @CreatedDate
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    private OffsetDateTime lastUpdated;

    @Version
    private Integer version;

}
