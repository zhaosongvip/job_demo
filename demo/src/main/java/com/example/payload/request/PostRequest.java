package com.example.payload.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class PostRequest {
    
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题长度不能超过100个字符")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    @Size(max = 500, message = "摘要长度不能超过500个字符")
    private String summary;
    
    private List<String> tags;
    
    // 可选字段
    private String coverImage;
} 