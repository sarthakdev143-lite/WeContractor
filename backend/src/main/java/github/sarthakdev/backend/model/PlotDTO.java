package github.sarthakdev.backend.model;

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

    @Size(max = 50)
    @PlotPlotIdValid
    private String plotId;

    @NotNull
    @Size(max = 100)
    private String title;

    @NotNull
    @Size(max = 255)
    private String location;

    @NotNull
    @Digits(integer = 12, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal price;

    @NotNull
    @Size(max = 255)
    private String plotType;

    private Integer viewsCount;

    @Digits(integer = 7, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal discount;

    private String amenities;

    private String images;

    private String videos;

    private String tags;

    private OffsetDateTime createdAt;

    @Size(max = 50)
    private String createdBy;

}
