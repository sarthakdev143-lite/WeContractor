package github.sarthakdev.backend.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import github.sarthakdev.backend.model.LoginVerificationToken;

public interface LoginVerificationTokenRepository extends MongoRepository<LoginVerificationToken, String> {
    Optional<LoginVerificationToken> findByToken(String token);
    Optional<LoginVerificationToken> findByEmail(String email);
}