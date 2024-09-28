package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Contractor;
import github.sarthakdev143.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ContractorRepository extends MongoRepository<Contractor, Integer> {

    Contractor findFirstByUser(User user);

}
