package github.sarthakdev.backend.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;


@Document
@Getter
@Setter
public class Plot {

    @NotNull
    @Id
    private String plotId;

    @NotNull
    @Size(max = 100)
    private String title;

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
    private String plotType;

    private Integer viewsCount;

    @Digits(integer = 7, fraction = 2)
    @Field(
            targetType = FieldType.DECIMAL128
    )
    private BigDecimal discount;

    private String amenities;

    private String images;

    private String videos;

    private String tags;

    private OffsetDateTime createdAt;

    @DocumentReference(lazy = true)
    private User createdBy;

    @DocumentReference(lazy = true, lookup = "{ 'plot' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Transaction> plotTransactions;

    @DocumentReference(lazy = true, lookup = "{ 'plot' : ?#{#self._id} }")
    @ReadOnlyProperty
    private Set<Favorite> plotFavorites;

}
