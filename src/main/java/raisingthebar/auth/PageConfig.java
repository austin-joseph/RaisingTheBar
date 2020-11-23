package raisingthebar.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PageConfig implements WebMvcConfigurer {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/home").setViewName("forward:/index.html");
        registry.addViewController("/forgot-password").setViewName("forward:/index.html");
        registry.addViewController("/reset-password").setViewName("forward:/index.html");
        registry.addViewController("/signup").setViewName("forward:/index.html");
        registry.addViewController("/workshop").setViewName("forward:/index.html");
        registry.addViewController("/creator/**").setViewName("forward:/index.html");
        registry.addViewController("/bartop/**").setViewName("forward:/index.html");
        registry.addViewController("/user/**").setViewName("forward:/index.html");
//        registry.addViewController("/signin").setViewName("forward:/index.html");
    }
}
