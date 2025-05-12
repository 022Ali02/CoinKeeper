package org.example;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.findByUsername("admin").isPresent()) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(encoder.encode("admin"));
                userRepository.save(user);
            }
        };
    }

}

