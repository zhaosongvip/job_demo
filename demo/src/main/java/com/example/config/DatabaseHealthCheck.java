package com.example.config;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseHealthCheck {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseHealthCheck.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @EventListener(ApplicationStartedEvent.class)
    public void checkDatabaseOnStartup() {
        try {
            // 检查用户表
            long userCount = userRepository.count();
            logger.info("数据库中现有用户数量: {}", userCount);
            
            List<User> users = userRepository.findAll();
            logger.info("用户列表: {}", users.stream()
                    .map(user -> user.getUsername() + " (ID: " + user.getId() + ")")
                    .toArray());
            
            // 数据库状态良好
            logger.info("数据库状态检查完成 - 正常");
        } catch (Exception e) {
            logger.error("数据库状态检查失败!", e);
        }
    }
} 