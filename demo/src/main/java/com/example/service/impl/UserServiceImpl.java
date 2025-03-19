package com.example.service.impl;

import com.example.dto.RegisterRequest;
import com.example.entity.User;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        
        // 调试信息 - 检查加载时的用户数量
        try {
            logger.info("UserServiceImpl初始化 - 当前用户数: {}", userRepository.count());
        } catch (Exception e) {
            logger.error("无法在初始化时检查用户数量", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        logger.debug("查找用户名: {}", username);
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public User register(RegisterRequest request) {
        logger.info("开始注册用户: {}", request.getUsername());
        
        // 验证密码是否匹配
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            logger.error("密码不匹配: {}", request.getUsername());
            throw new IllegalArgumentException("两次输入的密码不匹配");
        }
        
        // 检查用户名是否已存在
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            logger.error("用户名已存在: {}", request.getUsername());
            throw new IllegalArgumentException("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.error("邮箱已被使用: {}", request.getEmail());
            throw new IllegalArgumentException("邮箱已被使用");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        
        // 保存用户
        User savedUser = userRepository.save(user);
        
        // 强制刷新
        userRepository.flush();
        
        logger.info("用户注册成功: {} (ID: {})", savedUser.getUsername(), savedUser.getId());
        
        // 验证保存是否成功
        Optional<User> verifyUser = userRepository.findById(savedUser.getId());
        if (verifyUser.isPresent()) {
            logger.info("验证: 用户 {} 已成功保存到数据库", savedUser.getUsername());
        } else {
            logger.error("验证失败: 用户 {} 未能正确保存到数据库", savedUser.getUsername());
        }
        
        return savedUser;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
} 