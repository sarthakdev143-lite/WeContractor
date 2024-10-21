package github.sarthakdev.backend.repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import github.sarthakdev.backend.beans.Plot;

@Repository
public interface PlotRepository extends MongoRepository<Plot, ObjectId> {
}
