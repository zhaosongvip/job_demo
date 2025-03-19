package com.example.service;

import com.example.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    Page<Post> getAllPosts(Pageable pageable);
    Post getPostById(Long id);
    Post createPost(Post post, String username);
    Post updatePost(Long id, Post postDetails, String username);
    void deletePost(Long id, String username);
    Page<Post> getPostsByUsername(String username, Pageable pageable);
} 