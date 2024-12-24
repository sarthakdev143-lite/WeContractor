package github.sarthakdev.backend.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "favorites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {
    @Id
    private ObjectId id;

    @DBRef
    private User user;

    @DBRef
    private Plot plot;

    private LocalDateTime createdAt;

    public Favorite(User user, Plot plot) {
        this.user = user;
        this.plot = plot;
        this.createdAt = LocalDateTime.now();
    }
}