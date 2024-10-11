package github.sarthakdev.backend.repos;

import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface PlotRepository extends MongoRepository<Plot, String> {

    Plot findFirstByCreatedBy(User user);

    boolean existsByPlotIdIgnoreCase(String plotId);

}
