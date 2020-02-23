package raisingthebar.database.entity;

import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "testResults")
public class TestResult {

    @Id
    private String id;

    private String testId;

    private String userId;

    private Date dateCompleted;

    private String jsonGrades;

    public String getSimulationId() {
        return testId;
    }

    public void setSimulationId(String simulationId) {
        this.testId = simulationId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getDateCompleted() {
        return dateCompleted;
    }

    public void setDateCompleted(Date dateCompleted) {
        this.dateCompleted = dateCompleted;
    }

    public String getJsonGrades() {
        return jsonGrades;
    }

    public void setJsonGrades(String jsonGrades) {
        this.jsonGrades = jsonGrades;
    }
}
