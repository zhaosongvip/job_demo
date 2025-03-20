package com.example.payload.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentRequest {
    
    private Long id;
    
    @NotBlank(message = "评论内容不能为空")
    private String content;
    
    @NotNull(message = "文章ID不能为空")
    private Long postId;
} 