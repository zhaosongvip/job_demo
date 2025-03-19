package com.example.service;

import com.example.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    Page<Comment> getCommentsByPostId(Long postId, Pageable pageable);
    Comment createComment(Long postId, Comment comment, String username);
    void deleteComment(Long commentId, String username);
} 