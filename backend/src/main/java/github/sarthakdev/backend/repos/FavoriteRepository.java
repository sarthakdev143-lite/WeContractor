package github.sarthakdev.backend.repos;

import github.sarthakdev.backend.domain.Favorite;
import github.sarthakdev.backend.domain.Plot;
import github.sarthakdev.backend.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    Favorite findFirstByUser(User user);

    Favorite findFirstByPlot(Plot plot);

    boolean existsByFavoriteIdIgnoreCase(String favoriteId);

}
