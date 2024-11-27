package github.sarthakdev.backend.dto;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PlotInUserDTO {
    private ObjectId plotId;
    private String plotName;
    private boolean isPlotSold;
}
