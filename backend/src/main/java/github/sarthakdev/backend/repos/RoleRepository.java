package github.sarthakdev.backend.repos;

import github.sarthakdev.backend.domain.Role;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface RoleRepository extends MongoRepository<Role, String> {
}
