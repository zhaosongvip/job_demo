package com.example.service.impl;

import com.example.service.AIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {
    
    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);
    private final OkHttpClient okHttpClient;
    private final ObjectMapper objectMapper;
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Value("${openai.api.url}")
    private String apiUrl;
    
    public AIServiceImpl(OkHttpClient okHttpClient, ObjectMapper objectMapper) {
        this.okHttpClient = okHttpClient;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public String generateSummary(String content) {
        String prompt = "请为以下博客内容生成一个简洁的摘要（不超过100字）：\n" + content;
        return callAI(prompt);
    }
    
    @Override
    public String suggestTags(String content) {
        String prompt = "请为以下博客内容推荐5个相关的标签，以逗号分隔：\n" + content;
        return callAI(prompt);
    }
    
    @Override
    public String improveWriting(String content) {
        String prompt = "请帮我改进以下博客内容的写作质量，使其更专业和吸引人，但保持原有的主要意思：\n" + content;
        return callAI(prompt);
    }
    
    @Override
    public String generateTitle(String content) {
        String prompt = "请为以下博客内容生成一个吸引人的标题（不超过20字）：\n" + content;
        return callAI(prompt);
    }
    
    @Override
    public String recommendRelatedPosts(String content) {
        String prompt = "基于这篇博客的内容，请推荐5个相关的博客主题，每个主题一行：\n" + content;
        return callAI(prompt);
    }
    
    private String callAI(String prompt) {
        int maxRetries = 3;
        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < maxRetries) {
            try {
                logger.info("Calling AI API with prompt: {}, attempt: {}", prompt, retryCount + 1);
                
                // 构建请求体
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", "gpt-3.5-turbo");
                
                // 构建消息列表
                List<Map<String, String>> messages = new ArrayList<>();
                
                // 系统消息
                Map<String, String> systemMessage = new HashMap<>();
                systemMessage.put("role", "system");
                systemMessage.put("content", "你是一个专业的博客写作助手，擅长内容优化和建议。");
                messages.add(systemMessage);
                
                // 用户消息
                Map<String, String> userMessage = new HashMap<>();
                userMessage.put("role", "user");
                userMessage.put("content", prompt);
                messages.add(userMessage);
                
                requestBody.put("messages", messages);
                requestBody.put("max_tokens", 1000);
                requestBody.put("temperature", 0.7);
                
                // 构建请求
                Request request = new Request.Builder()
                    .url(apiUrl)
                    .post(RequestBody.create(
                        objectMapper.writeValueAsString(requestBody),
                        MediaType.parse("application/json")
                    ))
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();
                
                // 发送请求
                try (Response response = okHttpClient.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        throw new RuntimeException("API 调用失败: " + response.code() + " " + response.message());
                    }
                    
                    String responseBody = response.body().string();
                    Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
                    
                    // 解析响应
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    
                    logger.info("AI API response received successfully");
                    return content;
                }
            } catch (Exception e) {
                lastException = e;
                retryCount++;
                logger.warn("AI API call failed, attempt {}/{}: {}", 
                    retryCount, maxRetries, e.getMessage());
                
                if (retryCount < maxRetries) {
                    try {
                        Thread.sleep(1000L * retryCount * retryCount);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("重试被中断", ie);
                    }
                }
            }
        }
        
        logger.error("AI API call failed after {} attempts", maxRetries, lastException);
        throw new RuntimeException("AI 服务调用失败 (重试" + maxRetries + "次): " 
            + lastException.getMessage());
    }
} 