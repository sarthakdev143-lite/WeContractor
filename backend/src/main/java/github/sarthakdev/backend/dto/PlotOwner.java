package github.sarthakdev.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlotOwner {
    private String fullName;
    private String username;
    private String email;
    private Boolean verified;
    private String profilePictureUrl;
    private String phoneNumber;
}
