package raisingthebar.database.repositories;

import raisingthebar.database.entity.TestResult;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestResultsRepository extends MongoRepository<TestResult, String> {
    
    TestResult findByid(String Id);
}
