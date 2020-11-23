package raisingthebar.database.repositories;

import raisingthebar.database.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);
    User findByResetToken(String resetToken);
}
