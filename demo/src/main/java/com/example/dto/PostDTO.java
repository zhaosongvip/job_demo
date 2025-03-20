package com.example.dto;

import com.example.entity.Post;
import com.example.entity.User;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Arrays;

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
        dto.setSummary(post.getSummary());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setCoverImage(post.getCoverImage());
        
        // 处理标签
        if (post.getTags() != null && !post.getTags().isEmpty()) {
            dto.setTags(Arrays.asList(post.getTags().split(",")));
        }
        
        // 设置作者信息
        User author = post.getAuthor();
        if (author != null) {
            dto.setAuthorId(author.getId());
            dto.setAuthorName(author.getUsername());
            
            try {
                UserDTO authorDTO = new UserDTO();
                authorDTO.setId(author.getId());
                authorDTO.setUsername(author.getUsername());
                authorDTO.setAvatar(author.getAvatar());
                dto.setAuthor(authorDTO);
            } catch (Exception e) {
                UserDTO defaultUser = new UserDTO();
                defaultUser.setId(0L);
                defaultUser.setUsername("Unknown User");
                dto.setAuthor(defaultUser);
            }
        }
        
        // 评论数量
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