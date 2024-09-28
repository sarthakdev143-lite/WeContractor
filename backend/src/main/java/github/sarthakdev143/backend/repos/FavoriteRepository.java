package github.sarthakdev143.backend.repos;

import github.sarthakdev143.backend.domain.Favorite;
import github.sarthakdev143.backend.domain.Plot;
import github.sarthakdev143.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface FavoriteRepository extends MongoRepository<Favorite, Integer> {

    Favorite findFirstByUser(User user);

    Favorite findFirstByPlot(Plot plot);

}
