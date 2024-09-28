package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface UserRepository extends MongoRepository<User, Integer> {
}
