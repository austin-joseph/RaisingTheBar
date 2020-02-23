package raisingthebar.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import raisingthebar.database.CustomUserDetailsService;
import raisingthebar.database.DrinkService;
import raisingthebar.database.entity.Drink;
import raisingthebar.database.entity.User;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
public class DrinkController {

    @Autowired
    private DrinkService drinkService;

    @Autowired
    private CustomUserDetailsService userService;

    @RequestMapping(value = "/drinks/get", method = RequestMethod.GET)
    public ResponseEntity getDrink(@RequestParam("id") String drinkId) {
        Drink rec = drinkService.findDrinkById(drinkId);
        if (rec != null) {
            return ResponseEntity.status(HttpStatus.OK).body(rec);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @RequestMapping(value = "/drinks/add", method = RequestMethod.POST)
    public ResponseEntity addDrink(@RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("public") boolean isPublic, @RequestParam("json") String json) {
        User user = userService.getLoggedUser();
        if (user != null) {
            Drink recipe = new Drink();
            recipe.setName(name);
            recipe.setDescription(description);
            recipe.setIsPublic(isPublic);
            recipe.setCreator(user.getId());
            recipe.setJson(json);
            recipe.setDate(new Date());
            drinkService.saveDrink(recipe);
            return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @RequestMapping(value = "/drinks/delete", method = RequestMethod.POST)
    public ResponseEntity deleteDrink(@RequestParam("id") String drinkId) {
        User user = userService.getLoggedUser();
        if (user != null) {
            Drink rec = drinkService.findDrinkById(drinkId);
            if (rec != null) {
                if (rec.getCreator().equals(user.getId())) {
                    rec.setHidden(true);
                    drinkService.saveDrink(rec);
                    return ResponseEntity.status(HttpStatus.OK).body(null);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "/drinks/list", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity findAllDrinks() {
        ObjectMapper mapper = new ObjectMapper();
        User user = userService.getLoggedUser();
        try {
            Map outputMap = new HashMap();
            List<Drink> recipeList = drinkService.getAllDrinks();
            List<Drink> approvedList = new ArrayList();
            for (Drink r : recipeList) {
                if (!r.isHidden() && (r.isIsPublic() || r.getCreator().equals(user.getId()))) {
                    approvedList.add(r);
                }
            }
            outputMap.put("drinks", approvedList);
            String output = mapper.writeValueAsString(outputMap);
            return ResponseEntity.status(HttpStatus.OK).body(output);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
