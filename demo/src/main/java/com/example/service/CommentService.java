package com.example.service;

import com.example.dto.CommentDTO;
import com.example.payload.request.CommentRequest;

import java.util.List;

public interface CommentService {
    
    /**
     * 获取文章的评论列表
     */
    List<CommentDTO> getCommentsByPostId(Long postId);
    
    /**
     * 创建评论
     */
    CommentDTO createComment(CommentRequest commentRequest, String username);
    
    /**
     * 删除评论
     */
    void deleteComment(Long id, String username);
} 