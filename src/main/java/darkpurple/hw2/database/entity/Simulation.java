/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package darkpurple.hw2.database.entity;

import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 *
 * @author anilramsoomye
 */
@Document (collection = "simulation")
public class Simulation {
    
    @Id
    private int id;
    
    private String name;
    private Date date;
    
    private Recipe[] recipes;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    

    public Recipe[] getRecipes() {
        return recipes;
    }

    public void setRecipes(Recipe[] recipes) {
        this.recipes = recipes;
    }
    
    
    
}