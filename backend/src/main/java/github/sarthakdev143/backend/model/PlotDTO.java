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
public class PlotDTO {

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
    @JsonFormat(shape = JsonFormat.Shape.STRING)
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

    private Integer createdBy;

}
