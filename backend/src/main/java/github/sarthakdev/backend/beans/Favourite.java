package github.sarthakdev.backend.beans;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Document(collection = "favourites")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Favourite {
    @Id
    private ObjectId id;

    @DBRef
    private User user;

    @DBRef
    private Plot plot;

    @CreatedDate
    private Date createdAt;
}