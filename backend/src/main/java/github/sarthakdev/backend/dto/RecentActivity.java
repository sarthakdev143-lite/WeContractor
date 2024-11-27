package github.sarthakdev.backend.dto;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentActivity {
    private String activityType;
    private String activityName;

    @CreatedDate
    private Date activityTime;
}
