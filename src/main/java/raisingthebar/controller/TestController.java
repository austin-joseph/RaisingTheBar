package raisingthebar.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import raisingthebar.database.CustomUserDetailsService;
import raisingthebar.database.TestService;
import raisingthebar.database.entity.Test;
import raisingthebar.database.entity.TestResult;
import raisingthebar.database.entity.User;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private TestService simulationService;

    @Autowired
    private CustomUserDetailsService userService;

    @RequestMapping(value = "/tests/get", method = RequestMethod.GET)
    public ResponseEntity getTest(@RequestParam("id") String simulationId) {
        Test sim = simulationService.findSimulationById(simulationId);
        if (sim != null) {
            return ResponseEntity.status(HttpStatus.OK).body(sim);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }

    @RequestMapping(value = "/tests/grade/add", method = RequestMethod.POST)
    public ResponseEntity addGrade(@RequestParam("simID") String simID, @RequestParam("grade") String grades) {
        User user = userService.getLoggedUser();
        if (user != null) {
            TestResult simGrade = new TestResult();
            simGrade.setSimulationId(simID);
            simGrade.setUserId(user.getId());
            simGrade.setDateCompleted(new Date());
            simGrade.setJsonGrades(grades);
            simulationService.submitSimulationGrade(simGrade);
            return ResponseEntity.status(HttpStatus.OK).body(simGrade);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    //TODO add proper security checking to this
    @RequestMapping(value = "/tests/grade/get", method = RequestMethod.POST)
    public ResponseEntity getTestGrade(@RequestParam("id") String simulationId) {
        List gradeList = simulationService.getSimGrades(simulationId);
        ObjectMapper mapper = new ObjectMapper();
        Map outputMap = new HashMap();
        outputMap.put("grades", gradeList);
        try {
            String output = mapper.writeValueAsString(outputMap);
            return ResponseEntity.status(HttpStatus.OK).body(output);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @RequestMapping(value = "/tests/add", method = RequestMethod.POST)
    public ResponseEntity createNewTest(@RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("public") boolean isPublic, @RequestParam("practice") boolean isPractice, @RequestParam("recipes") String[] recipes, @RequestParam("json") String json) {

        User user = userService.getLoggedUser();
        if (user != null) {
            Test simulation = new Test();
            simulation.setCreator(user.getId());
            simulation.setName(name);
            simulation.setDescription(description);
            simulation.setIsPublic(isPublic);
            simulation.setIsPractice(isPractice);
            simulation.setRecipes(recipes);
            simulation.setDate(new Date());
            simulation.setJson(json);
            simulationService.saveSimulation(simulation);
            return ResponseEntity.status(HttpStatus.OK).body(simulation);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "/tests/edit", method = RequestMethod.POST)
    public ResponseEntity editTest(@RequestParam("id") String id, @RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("public") boolean isPublic, @RequestParam("practice") boolean isPractice, @RequestParam("recipes") String[] recipes, @RequestParam("json") String json) {

        User user = userService.getLoggedUser();
        if (user != null) {
            Test simulation = new Test();
            simulation.setId(id);
            simulation.setCreator(user.getId());
            simulation.setName(name);
            simulation.setDescription(description);
            simulation.setIsPublic(isPublic);
            simulation.setIsPractice(isPractice);
            simulation.setRecipes(recipes);
            simulation.setDate(new Date());
            simulation.setJson(json);
            simulationService.saveSimulation(simulation);
            return ResponseEntity.status(HttpStatus.OK).body(simulation);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "/tests/delete", method = RequestMethod.POST)
    public ResponseEntity deleteTest(@RequestParam("id") String simulationId) {
        User user = userService.getLoggedUser();
        if (user != null) {
            Test toBeDeleted = simulationService.findSimulationById(simulationId);
            if (toBeDeleted != null && toBeDeleted.getCreator().equals(user.getId())) {
                simulationService.deleteSimulation(toBeDeleted);
                return ResponseEntity.status(HttpStatus.OK).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @RequestMapping(value = "/tests/list", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getAllTests() {
        ObjectMapper mapper = new ObjectMapper();
        User user = userService.getLoggedUser();
        try {
            Map outputMap = new HashMap();
            List<Test> simulationList = simulationService.getAllSimulations();
            List<Test> approvedList = new ArrayList();
            for (Test r : simulationList) {
                if (r.isIsPublic() || r.getCreator().equals(user.getId())) {
                    approvedList.add(r);
                }
            }
            outputMap.put("tests", approvedList);
            String output = mapper.writeValueAsString(outputMap);
            return ResponseEntity.status(HttpStatus.OK).body(output);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @RequestMapping(value = "/tests/list/mine", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity allUserTests() {
        ObjectMapper mapper = new ObjectMapper();
        User user = userService.getLoggedUser();
        if (user != null) {
            try {
                Map outputMap = new HashMap();
                List<Test> simulationList = simulationService.getAllSimulations();
                List<Test> approvedList = new ArrayList();
                for (Test r : simulationList) {
                    if (r.getCreator().equals(user.getId())) {
                        approvedList.add(r);
                    }
                }
                outputMap.put("tests", approvedList);
                String output = mapper.writeValueAsString(outputMap);
                return ResponseEntity.status(HttpStatus.OK).body(output);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
