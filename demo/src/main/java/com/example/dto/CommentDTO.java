package com.example.dto;

import com.example.entity.Comment;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private Long postId;
    private UserDTO user;
    private LocalDateTime createdAt;

    public static CommentDTO fromEntity(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setPostId(comment.getPost().getId());
        dto.setCreatedAt(comment.getCreatedAt());
        
        try {
            // 创建嵌套的UserDTO对象
            if (comment.getUser() != null) {
                UserDTO userDTO = new UserDTO();
                userDTO.setId(comment.getUser().getId());
                userDTO.setUsername(comment.getUser().getUsername());
                userDTO.setAvatar(comment.getUser().getAvatar());
                dto.setUser(userDTO);
            }
        } catch (Exception e) {
            // 处理延迟加载异常
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername("未知用户");
            dto.setUser(userDTO);
        }
        
        return dto;
    }
} 