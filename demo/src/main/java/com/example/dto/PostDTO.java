package com.example.dto;

import com.example.entity.Post;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;
    private String coverImage;
    private UserDTO author;
    private int commentCount;

    // 构造函数、getter和setter
    public static PostDTO fromEntity(Post post) {
        if (post == null) return null;
        
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        if (post.getAuthor() != null) {
            try {
                dto.setAuthor(UserDTO.fromEntity(post.getAuthor()));
            } catch (Exception e) {
                UserDTO defaultUser = new UserDTO();
                defaultUser.setId(0L);
                defaultUser.setUsername("Unknown User");
                dto.setAuthor(defaultUser);
            }
        }
        
        try {
            if (post.getComments() != null) {
                dto.setCommentCount(post.getComments().size());
            }
        } catch (Exception e) {
            dto.setCommentCount(0);
        }
        
        return dto;
    }
} 