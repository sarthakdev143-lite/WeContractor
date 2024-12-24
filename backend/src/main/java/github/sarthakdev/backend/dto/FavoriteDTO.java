package github.sarthakdev.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FavoriteDTO {
    private String plotId;
    private String plotName;
    private LocalDateTime favoritedAt;
}