package github.sarthakdev.backend.model;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import github.sarthakdev.backend.dto.PlotOwner;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "plots")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Plot {
    @Id
    private ObjectId id;
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
    private List<String> tags;
    private List<String> amenities;
    private List<Double> priceHistory;
    private Boolean isSold = false;
    private Long totalViews = 0L;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Instant lastModified;
}