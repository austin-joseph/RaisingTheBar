package raisingthebar.database.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import raisingthebar.database.entity.Test;

public interface TestRepository extends MongoRepository<Test, String> {

    Test findByid(String Id);
    
}
