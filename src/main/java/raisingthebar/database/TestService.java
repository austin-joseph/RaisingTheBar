package raisingthebar.database;

import raisingthebar.database.entity.Test;
import raisingthebar.database.entity.TestResult;
import raisingthebar.database.repositories.TestResultsRepository;
import raisingthebar.database.repositories.TestRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {
    
    @Autowired
    private TestRepository simulationRepository;
    
    @Autowired
    private TestResultsRepository testResultRepository;
    
    
    public Test findSimulationById(String id) {
        return simulationRepository.findByid(id);
    }
    
    public void saveSimulation(Test simulation) {
        simulationRepository.save(simulation);
    }
    
    public void deleteSimulation(Test simulation) {
        simulationRepository.delete(simulation);
    }
    
     public List<Test> getAllSimulations() {
        return simulationRepository.findAll();
    }
     
   public void submitSimulationGrade(TestResult simGrade) {
       testResultRepository.save(simGrade);
   }
   
   public TestResult getSimulationGrade(String simGradeID) {
       return testResultRepository.findByid(simGradeID);
   }
   
   public List<TestResult> getSimGrades(String simulationId) {
       return testResultRepository.findAll().stream().filter(grade -> grade.getSimulationId().equals(simulationId)).collect(Collectors.toList());
   }
   
   public List<TestResult> getUserSimGrades(String userId) {
       return testResultRepository.findAll().stream().filter(grade -> grade.getUserId().equals(userId)).collect(Collectors.toList());       
   }    
}
