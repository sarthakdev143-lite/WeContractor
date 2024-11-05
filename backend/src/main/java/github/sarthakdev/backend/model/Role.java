package github.sarthakdev.backend.model;

import java.util.List;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "roles")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Role {
    @Id
    private String id;

    private String name;

    @DBRef
    private List<User> users;

    @CreatedDate
    private Date createdAt;
}