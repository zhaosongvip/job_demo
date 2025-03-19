package com.example.dto;

import com.example.entity.User;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String avatar;

    // 构造函数、getter和setter
    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        try {
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setAvatar(user.getAvatar());
        } catch (Exception e) {
            // 如果出现懒加载问题，返回基本信息
            dto.setId(0L);
            dto.setUsername("Unknown User");
        }
        return dto;
    }
} 