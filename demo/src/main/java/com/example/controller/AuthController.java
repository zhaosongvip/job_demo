package com.example.controller;

import com.example.entity.User;
import com.example.dto.UserDTO;
import com.example.security.JwtTokenUtil;
import com.example.service.UserService;
import com.example.payload.request.LoginRequest;
import com.example.payload.response.MessageResponse;
import com.example.dto.RegisterRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService, 
            JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenUtil.generateToken(loginRequest.getUsername());
            
            User user = userService.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
            UserDTO userDTO = UserDTO.fromEntity(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("user", userDTO);
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("用户名或密码错误"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("收到注册请求: {}", request.getUsername());
        try {
            User user = userService.register(request);
            String token = jwtTokenUtil.generateToken(user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            
            logger.info("用户注册成功: {}", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("注册失败: {}", e.getMessage());
            return ResponseEntity
                .badRequest()
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        try {
            // 从请求头中获取token
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                // 验证token并获取用户名
                String username = jwtTokenUtil.extractUsername(token);
                if (username != null && jwtTokenUtil.validateToken(token)) {
                    // 获取用户信息
                    User user = userService.findByUsername(username)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
                    
                    // 返回用户信息
                    return ResponseEntity.ok(user);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("无效的token"));
        } catch (Exception e) {
            logger.error("验证token失败", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("验证token过程中发生错误"));
        }
    }
} 