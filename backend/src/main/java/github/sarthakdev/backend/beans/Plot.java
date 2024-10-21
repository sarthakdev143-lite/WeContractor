package github.sarthakdev.backend.beans;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

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
    private String discount;
    private String location;
    private Double price;
    private Double length;
    private String plotType;
    private Double breadth;
    private User createdBy;
    private List<Float> rating;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private List<String> tags;
    private List<String> amenities;
    private List<Double> priceHistory;

    @CreatedDate
    private Date createdAt;
}