package github.sarthakdev143.backend.model;

import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ContractorDTO {

    private Integer contractorId;
    private String expertise;
    private String certifications;
    private Double ratings;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private Integer user;

}
