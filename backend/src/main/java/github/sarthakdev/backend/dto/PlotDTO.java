package github.sarthakdev.backend.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlotDTO {
    private String id;
    private String title;
    private String description;
    private String location;
    private String plotType;
    private Double price;
    private Double discount;
    private Double length;
    private Double breadth;
    private PlotOwner plotOwner;
    private List<Float> rating;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private List<String> amenities;
    private List<Double> priceHistory;
    private Boolean isSold;
    private Long totalViews;
    private Date createdAt;
}
