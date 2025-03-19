package com.example.service.impl;

import com.example.dto.PostDTO;
import com.example.entity.Post;
import com.example.entity.User;
import com.example.exception.ResourceNotFoundException;
import com.example.payload.request.PostRequest;
import com.example.repository.PostRepository;
import com.example.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

    @Autowired
    private PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PostDTO> getAllPosts(Pageable pageable) {
        logger.info("获取所有文章，页码: {}, 大小: {}", pageable.getPageNumber(), pageable.getPageSize());
        return postRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        logger.info("根据ID获取文章: {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章不存在，ID: " + id));
        return convertToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO createPost(PostRequest postRequest, User user) {
        logger.info("创建文章: {}, 作者: {}", postRequest.getTitle(), user.getUsername());
        
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setSummary(postRequest.getSummary());
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        // 处理标签
        if (postRequest.getTags() != null && !postRequest.getTags().isEmpty()) {
            post.setTags(String.join(",", postRequest.getTags()));
        }
        
        // 封面图片
        post.setCoverImage(postRequest.getCoverImage());
        
        Post savedPost = postRepository.save(post);
        logger.info("文章创建成功，ID: {}", savedPost.getId());
        
        return convertToDTO(savedPost);
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostRequest postRequest, User user) {
        logger.info("更新文章: {}, 作者: {}", id, user.getUsername());
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章不存在，ID: " + id));
        
        // 检查权限
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("没有权限更新此文章");
        }
        
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setSummary(postRequest.getSummary());
        post.setUpdatedAt(LocalDateTime.now());
        
        // 处理标签
        if (postRequest.getTags() != null && !postRequest.getTags().isEmpty()) {
            post.setTags(String.join(",", postRequest.getTags()));
        } else {
            post.setTags(null);
        }
        
        // 封面图片
        post.setCoverImage(postRequest.getCoverImage());
        
        Post updatedPost = postRepository.save(post);
        logger.info("文章更新成功，ID: {}", updatedPost.getId());
        
        return convertToDTO(updatedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long id, User user) {
        logger.info("删除文章: {}, 作者: {}", id, user.getUsername());
        
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("文章不存在，ID: " + id));
        
        // 检查权限
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new AccessDeniedException("没有权限删除此文章");
        }
        
        postRepository.delete(post);
        logger.info("文章删除成功，ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByUser(Long userId, Pageable pageable) {
        logger.info("获取用户文章: {}", userId);
        return postRepository.findByAuthorId(userId, pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 辅助方法 - 转换 Post 实体为 PostDTO
    private PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setSummary(post.getSummary());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getUsername());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        // 处理标签 - 使用Arrays.asList代替List.of
        if (post.getTags() != null && !post.getTags().isEmpty()) {
            dto.setTags(Arrays.asList(post.getTags().split(",")));
        }
        
        dto.setCoverImage(post.getCoverImage());
        
        return dto;
    }
} 