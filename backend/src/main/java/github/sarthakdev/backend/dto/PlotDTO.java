package github.sarthakdev.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class PlotDTO {
    private String title;
    private String description;
    private Double length;
    private Double breadth;
    private String location;
    private Double price;
    private String plotType;
    private Double discount;
    private List<String> amenities;
    private List<String> images;
    private List<String> videos;
    private List<String> tags;
}