package github.sarthakdev.backend.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import github.sarthakdev.backend.bean.Role;
import github.sarthakdev.backend.bean.User;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {

    Optional<Role> findByUsername(String username);

    Optional<Role> findByEmail(String email);

    Optional<Role> findByPhoneNumber(String phoneNumber);
}