package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface PlotRepository extends MongoRepository<Plot, Integer> {

    Plot findFirstByCreatedBy(User user);

}
