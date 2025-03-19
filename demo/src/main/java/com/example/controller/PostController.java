package com.example.controller;

import com.example.entity.Post;
import com.example.service.PostService;
import com.example.dto.PostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(Pageable pageable) {
        Page<Post> posts = postService.getAllPosts(pageable);
        Page<PostDTO> postDTOs = posts.map(PostDTO::fromEntity);
        return ResponseEntity.ok(postDTOs);
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