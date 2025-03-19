package com.example.service;

import com.example.dto.PostDTO;
import com.example.entity.Post;
import com.example.entity.User;
import com.example.payload.request.PostRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PostService {
    
    // 获取所有文章（分页）
    Page<PostDTO> getAllPosts(Pageable pageable);
    
    // 根据ID获取文章
    PostDTO getPostById(Long id);
    
    // 创建文章
    PostDTO createPost(PostRequest postRequest, User user);
    
    // 更新文章
    PostDTO updatePost(Long id, PostRequest postRequest, User user);
    
    // 删除文章
    void deletePost(Long id, User user);
    
    // 获取用户的文章
    List<PostDTO> getPostsByUser(Long userId, Pageable pageable);
} 