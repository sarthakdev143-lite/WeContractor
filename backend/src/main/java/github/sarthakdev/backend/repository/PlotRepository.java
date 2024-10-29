package github.sarthakdev.backend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import github.sarthakdev.backend.bean.Plot;

@Repository
public interface PlotRepository extends MongoRepository<Plot, ObjectId> {
}
