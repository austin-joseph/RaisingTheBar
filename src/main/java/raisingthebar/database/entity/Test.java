package raisingthebar.database.entity;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tests")
public class Test {

    @Id
    private String id;

    private String creator;
    private String name;
    private String description;
    private boolean isPublic;
    private boolean isPractice;
    //List of drink ids for every drink part of this test
    private List<String> drinkIds;
    private Date dateCreated;
    private Date dateLastModified;
    //Additional data clients can use to customize a test
    private String json;
    //List of user ids for admins
    private List<String> testAdmins;

    private boolean editable;

    public Test() {
    }

    public Map<String, Object> convertToMap() {

        Map<String, Object> outputMap = new HashMap<>();

        outputMap.put("id", id);
        outputMap.put("creator", creator);
        outputMap.put("name", name);
        outputMap.put("description", description);
        outputMap.put("isPublic", isPublic);
        outputMap.put("isPractice", isPractice);

        outputMap.put("drinkIds", drinkIds);
        outputMap.put("dateCreated", dateCreated);
        outputMap.put("dateLastModified", dateLastModified);

        outputMap.put("testAdmins", testAdmins);
        outputMap.put("json", json);
        outputMap.put("editable", editable);
        
        
        return outputMap;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
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

    public boolean isIsPractice() {
        return isPractice;
    }

    public void setIsPractice(boolean isPractice) {
        this.isPractice = isPractice;
    }

    public List<String> getDrinkIds() {
        return drinkIds;
    }

    public void setDrinkIds(List<String> drinkIds) {
        this.drinkIds = drinkIds;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getDateLastModified() {
        return dateLastModified;
    }

    public void setDateLastModified(Date dateLastModified) {
        this.dateLastModified = dateLastModified;
    }

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public List<String> getTestAdmins() {
        return testAdmins;
    }

    public void setTestAdmins(List<String> testAdmins) {
        this.testAdmins = testAdmins;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }
}
