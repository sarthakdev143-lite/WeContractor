package github.sarthakdev143.backend.model;

import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FavoriteDTO {

    private Integer favoriteId;
    private OffsetDateTime createdAt;
    private Integer user;
    private Integer plot;

}
