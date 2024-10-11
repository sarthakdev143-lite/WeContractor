package github.sarthakdev.backend.model;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FavoriteDTO {

    @Size(max = 50)
    @FavoriteFavoriteIdValid
    private String favoriteId;

    private OffsetDateTime createdAt;

    @Size(max = 50)
    private String user;

    @Size(max = 50)
    private String plot;

}
