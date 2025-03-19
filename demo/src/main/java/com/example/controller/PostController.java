package com.example.controller;

import com.example.dto.PostDTO;
import com.example.entity.Post;
import com.example.entity.User;
import com.example.payload.request.PostRequest;
import com.example.payload.response.MessageResponse;
import com.example.repository.UserRepository;
import com.example.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        logger.info("获取文章列表: page={}, size={}, sortBy={}, direction={}", page, size, sortBy, direction);
        
        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<PostDTO> posts = postService.getAllPosts(pageable);
            
            logger.info("成功获取{}篇文章", posts.getContent().size());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("获取文章列表失败", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "获取文章列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        logger.info("获取文章详情: id={}", id);
        
        try {
            PostDTO post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("获取文章详情失败: id={}", id, e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "文章未找到: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest) {
        logger.info("创建文章: {}", postRequest.getTitle());
        
        try {
            // 获取当前认证用户
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));
            
            PostDTO createdPost = postService.createPost(postRequest, user);
            
            logger.info("文章创建成功: id={}, title={}", createdPost.getId(), createdPost.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            logger.error("创建文章失败", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("创建文章失败: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest postRequest) {
        logger.info("更新文章: id={}, title={}", id, postRequest.getTitle());
        
        try {
            // 获取当前认证用户
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));
            
            PostDTO updatedPost = postService.updatePost(id, postRequest, user);
            
            logger.info("文章更新成功: id={}", id);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            logger.error("更新文章失败: id={}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("更新文章失败: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        logger.info("删除文章: id={}", id);
        
        try {
            // 获取当前认证用户
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));
            
            postService.deletePost(id, user);
            
            logger.info("文章删除成功: id={}", id);
            return ResponseEntity.ok(new MessageResponse("文章删除成功"));
        } catch (Exception e) {
            logger.error("删除文章失败: id={}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("删除文章失败: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        logger.info("获取用户文章: userId={}, page={}, size={}", userId, page, size);
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            List<PostDTO> posts = postService.getPostsByUser(userId, pageable);
            
            logger.info("成功获取用户文章: count={}", posts.size());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("获取用户文章失败: userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "获取用户文章失败: " + e.getMessage());
        }
    }
} 