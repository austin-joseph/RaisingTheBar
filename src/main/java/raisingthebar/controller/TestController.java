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
import raisingthebar.database.DrinkService;
import raisingthebar.database.entity.Drink;

@RestController
public class TestController {

    @Autowired
    private TestService testInterfaceService;

    @Autowired
    private DrinkService drinkService;

    @Autowired
    private CustomUserDetailsService userService;

    @RequestMapping(value = "/tests/get", method = RequestMethod.GET)
    public ResponseEntity getTest(@RequestParam("id") String simulationId) {
        Test sim = testInterfaceService.findSimulationById(simulationId);
        if (sim != null) {
            return ResponseEntity.status(HttpStatus.OK).body(sim);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);

    }

    @RequestMapping(value = "/tests/grade/add", method = RequestMethod.POST)
    public ResponseEntity addGrade(@RequestParam("simID") String simID, @RequestParam("grade") String grades) {
        User user = userService.getLoggedInUser();
        if (user != null) {
            TestResult simGrade = new TestResult();
            simGrade.setSimulationId(simID);
            simGrade.setUserId(user.getId());
            simGrade.setDateCompleted(new Date());
            simGrade.setJsonGrades(grades);
            testInterfaceService.submitSimulationGrade(simGrade);
            return ResponseEntity.status(HttpStatus.OK).body(simGrade);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    //TODO add proper security checking to this
    @RequestMapping(value = "/tests/grade/get", method = RequestMethod.POST)
    public ResponseEntity getTestGrade(@RequestParam("id") String simulationId) {
        List gradeList = testInterfaceService.getSimGrades(simulationId);
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
    public ResponseEntity createNewTest(@RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("isPublic") boolean isPublic, @RequestParam("isPractice") boolean isPractice, @RequestParam("drinkIds") List<String> drinkIds, @RequestParam("json") String json) {

        User user = userService.getLoggedInUser();
        if (user != null) {
            Test simulation = new Test();
            simulation.setCreator(user.getId());
            simulation.setName(name);
            simulation.setDescription(description);
            simulation.setIsPublic(isPublic);
            simulation.setIsPractice(isPractice);
            simulation.setDrinkIds(drinkIds);
            Date currentDateTime = new Date();
            simulation.setDateCreated(currentDateTime);
            simulation.setDateLastModified(currentDateTime);
            simulation.setJson(json);
            simulation.setEditable(true);
            testInterfaceService.saveSimulation(simulation);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "/tests/edit", method = RequestMethod.POST)
    public ResponseEntity editTest(@RequestParam("id") String id, @RequestParam("name") String name, @RequestParam("description") String description, @RequestParam("isPublic") boolean isPublic, @RequestParam("isPractice") boolean isPractice, @RequestParam("drinkIds") List<String> drinkIds, @RequestParam("json") String json) {

        User user = userService.getLoggedInUser();
        if (user != null) {
            Test toBeEdited = testInterfaceService.findSimulationById(id);
            toBeEdited.setName(name);
            toBeEdited.setDescription(description);
            toBeEdited.setIsPublic(isPublic);
            toBeEdited.setIsPractice(isPractice);
            toBeEdited.setDrinkIds(drinkIds);
            toBeEdited.setDateLastModified(new Date());
            toBeEdited.setJson(json);
            testInterfaceService.saveSimulation(toBeEdited);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "/tests/delete", method = RequestMethod.POST)
    public ResponseEntity deleteTest(@RequestParam("id") String testId) {
        User user = userService.getLoggedInUser();
        if (user != null) {
            Test toBeDeleted = testInterfaceService.findSimulationById(testId);
            if (toBeDeleted != null) {
                if (toBeDeleted.getCreator().equals(user.getId())) {
                    testInterfaceService.deleteSimulation(toBeDeleted);
                    return ResponseEntity.status(HttpStatus.OK).body(null);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @RequestMapping(value = "/tests/list", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getAllTests() {
        ObjectMapper mapper = new ObjectMapper();
        User user = userService.getLoggedInUser();
        try {
            Map outputMap = new HashMap();
            List<Test> simulationList = testInterfaceService.getAllSimulations();
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
        User user = userService.getLoggedInUser();
        if (user != null) {
            try {
                Map outputMap = new HashMap();
                List<Test> simulationList = testInterfaceService.getAllSimulations();
                List<Map> approvedList = new ArrayList();
                for (Test currentTest : simulationList) {
                    if (currentTest.getCreator().equals(user.getId()) || (currentTest.getTestAdmins() != null && currentTest.getTestAdmins().contains(user.getId()))) {
                        Map testMap = currentTest.convertToMap();
                        List<Map> testDrinkObjects = new ArrayList();
                        List<String> currentTestDrinkIds = (List<String>) testMap.get("drinkIds");
                        if (currentTestDrinkIds != null) {
                            for (String id : currentTestDrinkIds) {
                                Drink drink = drinkService.findDrinkById(id);
                                if (drink != null) {
                                    testDrinkObjects.add(drink.convertToMap());
                                }
                            }
                            testMap.put("drinks", testDrinkObjects);
                        }
                        approvedList.add(currentTest.convertToMap());
                    }
                }
                outputMap.put("tests", approvedList);
                ObjectMapper mapper = new ObjectMapper();
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
