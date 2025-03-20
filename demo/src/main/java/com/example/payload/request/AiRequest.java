package com.example.payload.request;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class AiRequest {
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    // 可选参数，用于指定AI生成的内容类型
    private String type;
} 