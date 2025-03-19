package com.example.service;

import com.example.entity.User;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    User registerUser(User user);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 