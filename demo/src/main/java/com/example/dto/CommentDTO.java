package com.example.dto;

import com.example.entity.Comment;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private UserDTO user;
    private LocalDateTime createdAt;

    public static CommentDTO fromEntity(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUser(UserDTO.fromEntity(comment.getUser()));
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
} 