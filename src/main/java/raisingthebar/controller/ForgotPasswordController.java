package raisingthebar.controller;

import raisingthebar.database.CustomUserDetailsService;
//import raisingthebar.database.EmailSenderService;
import raisingthebar.database.entity.User;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ForgotPasswordController {

    @Autowired
    protected CustomUserDetailsService userService;

//    @Autowired
//    private EmailSenderService emailSenderService;
    
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // Display forgotPassword page
    @RequestMapping(value = "/forgot-password", method = RequestMethod.GET)
    public String displayResetPassword() {
        return "forward:index.html";
    }

    // Process form submission from forgotPassword page
    @RequestMapping(value = "/forgot-password", method = RequestMethod.POST)
    public ModelAndView processForgotPasswordForm(ModelAndView modelAndView, @RequestParam("email") String userEmail, HttpServletRequest request) {

        // Lookup user in database by e-mail
        User user = userService.findUserByEmail(userEmail);

        if (user == null) {
            modelAndView.addObject("errorMessage", "We didn't find an account for that e-mail address.");
            modelAndView.setViewName("error");
        } else {
            
            user.setResetToken(UUID.randomUUID().toString());
            userService.saveUserUpdate(user);
            
            String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

            // create the email
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Complete Password Reset!");
            mailMessage.setText("To reset your password, click the link below:\n" + appUrl
					+ "/reset-password?token=" + user.getResetToken());

//            emailSenderService.sendEmail(mailMessage);

            modelAndView.addObject("message", "Request to reset password received. Check your inbox for the reset link.");
            modelAndView.setViewName("successResetPassword");
        }

        return modelAndView;

    }

    @RequestMapping(value = "/reset-password", method = RequestMethod.GET)
    public ModelAndView validateResetToken(ModelAndView modelAndView, @RequestParam("token") String passwordResetToken) {
        
        User user = userService.findUserByResetToken(passwordResetToken);
        if (user!=null) {
            user.setEnabled(true);
            userService.saveUser(user);
            modelAndView.addObject("user", user);
            modelAndView.addObject("emailId", user.getEmail());
            modelAndView.setViewName("resetPassword");
        } else {
            modelAndView.addObject("errorMessage", "The link is invalid or broken!");
            modelAndView.setViewName("error");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/reset-password", method = RequestMethod.POST)
    public ModelAndView resetUserPassword(ModelAndView modelAndView, User user) {  

        if (user.getEmail() != null) {
            User tokenUser = userService.findUserByEmail(user.getEmail());
            tokenUser.setEnabled(true);
            tokenUser.setPassword(bCryptPasswordEncoder.encode(tokenUser.getPassword()));
            tokenUser.setResetToken(null);
            userService.saveUserUpdate(tokenUser);
            modelAndView.addObject("message", "Password successfully reset. You can now log in with the new credentials.");
            modelAndView.setViewName("successResetPassword");
        } else {
            modelAndView.addObject("errorMessage", "The link is invalid or broken!");
            modelAndView.setViewName("error");
        }

        return modelAndView;
    }

}
