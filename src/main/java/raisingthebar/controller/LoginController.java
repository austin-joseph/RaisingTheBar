package raisingthebar.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import raisingthebar.database.entity.User;
import raisingthebar.database.CustomUserDetailsService;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @Autowired
    protected CustomUserDetailsService userService;

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ResponseEntity getCurrentUser() {
        User user = userService.getLoggedUser();
        if (user != null) {
            ObjectMapper mapper = new ObjectMapper();
            Map outputMap = new HashMap();
            Map userMap = new HashMap();
            userMap.put("id", user.getId());
            outputMap.put("user", userMap);
            try {
                String output = mapper.writeValueAsString(outputMap);
                return ResponseEntity.status(HttpStatus.OK).body(output);
            } catch (JsonProcessingException e) {

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @RequestMapping(value = "/user/get", method = RequestMethod.POST)
    public ResponseEntity getUser(@RequestParam("id") String id) {
        User user = userService.findUserById(id);
        if (user != null) {
            ObjectMapper mapper = new ObjectMapper();
            Map outputMap = new HashMap();
            Map userMap = new HashMap();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            outputMap.put("user", userMap);
            try {
                String output = mapper.writeValueAsString(outputMap);
                return ResponseEntity.status(HttpStatus.OK).body(output);
            } catch (JsonProcessingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @RequestMapping(value = "/user/login", method = RequestMethod.GET)
    public String loginPage() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth instanceof AnonymousAuthenticationToken)) {
            return "redirect:/home";
        }
        return "forward:/index.html";
    }

    /**
     * This is a request mapping because the createNewUser() POST method blocks
     * the GET request endpoint. So inorder to make sure that the user can see
     * the page there must be a matching mapping for a GET request
     *
     * @return
     */
    @RequestMapping(value = "/user/signup", method = RequestMethod.GET)
    public String signupPage() {
        return "forward:index.html";
    }

    @RequestMapping(value = "/user/signup", method = RequestMethod.POST)
    public ResponseEntity signupAction(@Valid User user) {

        User userExists = userService.findUserByEmail(user.getEmail());
        if (userExists != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(null);
        }
    }

    @RequestMapping(value = "/user/logout", method = RequestMethod.GET)
    public ResponseEntity logoutGET(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @RequestMapping(value = "/user/logout", method = RequestMethod.POST)
    public ResponseEntity logoutPOST(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
