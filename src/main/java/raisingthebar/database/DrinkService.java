package raisingthebar.database;

import raisingthebar.database.entity.Drink;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import raisingthebar.database.repositories.DrinkRepository;

@Service
public class DrinkService {
    @Autowired
    private DrinkRepository drinkRepository;    
    
    public Drink findDrinkById(String id) {
        return drinkRepository.findByid(id);
    }
    
    public void saveDrink(Drink recipe) {
        drinkRepository.save(recipe);
    }
    
    public void deleteDrink(String recId) {
        drinkRepository.delete(findDrinkById(recId));
    }
    
    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }
}
