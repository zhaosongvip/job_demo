package com.example.service;

import com.example.entity.User;
import com.example.dto.RegisterRequest;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User register(RegisterRequest request);
} 