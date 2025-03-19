package com.example.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DataSourceConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);
    
    @Autowired
    private DataSource dataSource;
    
    @Bean
    public CommandLineRunner checkDatabaseConnection() {
        return args -> {
            logger.info("检查数据库连接...");
            try (Connection connection = dataSource.getConnection()) {
                logger.info("数据库连接成功: URL={}, User={}", 
                    connection.getMetaData().getURL(),
                    connection.getMetaData().getUserName());
            } catch (Exception e) {
                logger.error("数据库连接失败!", e);
                throw e; // 如果连接失败，应用启动失败
            }
        };
    }
} 