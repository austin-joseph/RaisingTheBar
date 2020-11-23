package raisingthebar.database.entity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "drinks")
public class Drink {

    @Id
    private String id;

    private String name;
    private String description;
    private boolean isPublic;

    private Date dateCreated;

    //id of the creator's user account
    private String creator;

    private String json;

    private boolean hidden = false;

    public Map<String, Object> convertToMap() {

        Map<String, Object> outputMap = new HashMap<>();

        outputMap.put("id", id);
        outputMap.put("name", name);
        outputMap.put("description", description);
        outputMap.put("isPublic", isPublic);

        outputMap.put("dateCreated", dateCreated);

        outputMap.put("creator", creator);
        outputMap.put("json", json);
        return outputMap;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIsPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date date) {
        this.dateCreated = date;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public String getJson() {
        return json;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

}
