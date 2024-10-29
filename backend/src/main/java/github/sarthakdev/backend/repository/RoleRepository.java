package github.sarthakdev.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import github.sarthakdev.backend.bean.Role;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    Role findByName(String string);
    
}
