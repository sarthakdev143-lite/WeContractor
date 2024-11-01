package github.sarthakdev.backend.repository;

import github.sarthakdev.backend.model.VerificationToken;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends MongoRepository<VerificationToken, ObjectId> {
    Optional<VerificationToken> findByToken(String token);
}