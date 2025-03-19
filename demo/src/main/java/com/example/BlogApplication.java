package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class BlogApplication {
    public static void main(String[] args) {
            ConfigurableApplicationContext context = SpringApplication.run(BlogApplication.class, args);

    }
} 