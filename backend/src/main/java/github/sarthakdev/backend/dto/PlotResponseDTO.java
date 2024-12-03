package github.sarthakdev.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlotResponseDTO {
    private String id;
    private String image;
    private String title;
    private String description;
    private String location;
    private Double price;
    private Double length;
    private Double breadth;
    private String soldBy;  
    private Double rating;
    private String dateAdded;
    private String tags;
    private String plotType;
    private Long totalViews;
}