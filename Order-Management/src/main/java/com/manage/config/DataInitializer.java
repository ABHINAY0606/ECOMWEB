package com.manage.config;

import com.manage.model.User;
import com.manage.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // In a real app, encrypt this!
                admin.setEmail("admin@example.com");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Seeded admin user.");
            }

            if (userRepository.findByUsername("Renuka").isEmpty()) {
                User user = new User();
                user.setUsername("Renuka");
                user.setPassword("password"); // In a real app, encrypt this! (matches the screenshot length approx?)
                // Actually the screenshot had many dots, but "password" is a safe default for
                // dev.
                // The user can register a new one if they want, this is just to ensure ONE
                // works.
                user.setEmail("renuka@example.com");
                user.setRole("ROLE_USER");
                userRepository.save(user);
                System.out.println("Seeded user 'Renuka'.");
            }
        };
    }
}
