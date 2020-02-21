package raisingthebar.database.repositories;

import raisingthebar.database.entity.Drink;
import raisingthebar.database.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DrinkRepository extends MongoRepository<Drink, String> {
    Drink findByid(String id);
}
