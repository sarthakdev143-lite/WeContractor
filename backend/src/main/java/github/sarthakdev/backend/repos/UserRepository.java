package github.sarthakdev.backend.repos;

import github.sarthakdev.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByUserIdIgnoreCase(String userId);

}
