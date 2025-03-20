package com.example.controller;

import com.example.dto.CommentDTO;
import com.example.payload.request.CommentRequest;
import com.example.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class LegacyCommentController {

    private static final Logger logger = LoggerFactory.getLogger(LegacyCommentController.class);

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
        logger.info("开始获取文章评论: postId={}", postId);
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        logger.info("找到评论数量: {}", comments.size());
        // 输出评论详情，便于调试
        if (!comments.isEmpty()) {
            for (int i = 0; i < Math.min(comments.size(), 3); i++) {
                logger.info("评论 #{}: id={}, content={}, user={}", 
                    i+1, comments.get(i).getId(), 
                    comments.get(i).getContent(), 
                    comments.get(i).getUser());
            }
        }
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest commentRequest) {
        try {
            logger.info("接收到评论请求：postId={}, content={}", postId, commentRequest.getContent());
            
            // 确保请求中的postId与路径中的一致
            commentRequest.setPostId(postId);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            logger.info("评论用户：{}", username);
            
            CommentDTO commentDTO = commentService.createComment(commentRequest, username);
            logger.info("评论创建成功：id={}", commentDTO.getId());
            return ResponseEntity.ok(commentDTO);
        } catch (Exception e) {
            logger.error("创建评论失败", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        commentService.deleteComment(commentId, username);
        return ResponseEntity.ok().build();
    }
} 