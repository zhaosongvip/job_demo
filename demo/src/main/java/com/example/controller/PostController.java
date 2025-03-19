package com.example.controller;

import com.example.entity.Post;
import com.example.service.PostService;
import com.example.dto.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Post> posts = postService.findAll(pageable);
            Page<PostDTO> postDTOs = posts.map(post -> {
                try {
                    return PostDTO.fromEntity(post);
                } catch (Exception e) {
                    log.error("Error converting post to DTO: " + e.getMessage(), e);
                    return null;
                }
            });
            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            log.error("Error fetching posts: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(PostDTO.fromEntity(post));
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestBody Post post,
            Authentication authentication) {
        String username = authentication.getName();
        Post createdPost = postService.createPost(post, username);
        return ResponseEntity.ok(PostDTO.fromEntity(createdPost));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody Post postDetails,
            Authentication authentication) {
        String username = authentication.getName();
        Post updatedPost = postService.updatePost(id, postDetails, username);
        return ResponseEntity.ok(PostDTO.fromEntity(updatedPost));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        postService.deletePost(id, username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Page<PostDTO>> getPostsByUsername(
            @PathVariable String username,
            Pageable pageable) {
        Page<Post> posts = postService.getPostsByUsername(username, pageable);
        return ResponseEntity.ok(posts.map(PostDTO::fromEntity));
    }
} 