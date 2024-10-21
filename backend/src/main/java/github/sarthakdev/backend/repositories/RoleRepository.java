package github.sarthakdev.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import github.sarthakdev.backend.beans.Role;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    Role findByName(String string);
    
}
