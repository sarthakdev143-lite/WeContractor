package github.sarthakdev.backend.repository;

import github.sarthakdev.backend.model.Favorite;
import github.sarthakdev.backend.model.Plot;
import github.sarthakdev.backend.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, ObjectId> {
    Optional<Favorite> findByUserAndPlot(User user, Plot plot);

    List<Favorite> findByUser(User user);

    void deleteByUserAndPlot(User user, Plot plot);

    boolean existsByUserAndPlot(User user, Plot plot);
}