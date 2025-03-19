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
    
    @Value("${openai.api.key:sk-dummy}")
    private String apiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
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
    public List<String> generateTags(String content) {
        String prompt = "请为以下博客内容推荐5个相关的标签，以JSON数组格式返回。格式必须是['标签1','标签2','标签3','标签4','标签5']：\n" + content;
        String response = callAI(prompt);
        try {
            return objectMapper.readValue(response, List.class);
        } catch (Exception e) {
            logger.error("解析标签失败，使用默认标签", e);
            // 解析失败时返回默认标签
            List<String> defaultTags = new ArrayList<>();
            defaultTags.add("技术");
            defaultTags.add("编程");
            defaultTags.add("博客");
            return defaultTags;
        }
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
    
    @Override
    public String optimizeContent(String content) {
        String prompt = "请优化以下博客内容，修正错别字、标点符号错误，改善语法和句子结构，但保持原意不变：\n" + content;
        return callAI(prompt);
    }
    
    private String callAI(String prompt) {
        int maxRetries = 3;
        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < maxRetries) {
            try {
                logger.info("Calling AI API with prompt: {}, attempt: {}", prompt.substring(0, Math.min(50, prompt.length())), retryCount + 1);
                
                // 构建请求体
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", "gpt-3.5-turbo");
                
                // 构建消息列表
                List<Map<String, String>> messages = new ArrayList<>();
                
                // 系统消息
                Map<String, String> systemMessage = new HashMap<>();
                systemMessage.put("role", "system");
                systemMessage.put("content", "你是一个专业的博客写作助手，擅长内容优化和建议。请使用中文回复。");
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
                        MediaType.parse("application/json"),
                        objectMapper.writeValueAsString(requestBody)
                    ))
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();
                
                // 发送请求
                try (Response response = okHttpClient.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        String errorBody = response.body() != null ? response.body().string() : "No response body";
                        throw new RuntimeException("API 调用失败: " + response.code() + " " + response.message() + ", body: " + errorBody);
                    }
                    
                    String responseBody = response.body().string();
                    Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
                    
                    // 解析响应
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    
                    logger.info("AI API response received successfully");
                    return content.trim();
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
        // 失败后返回一个友好的错误消息
        return "AI服务暂时不可用，请稍后再试。";
    }
} 