package github.sarthakdev.backend.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class PlotDTO {
    private String title;
    private String description;
    private String discount;
    private String location;
    private Double price;
    private String plotType;
    private Double length;
    private Double breadth;
    private Float rating;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private List<String> tags;
    private List<String> amenities;
    private List<Double> priceHistory;
}
