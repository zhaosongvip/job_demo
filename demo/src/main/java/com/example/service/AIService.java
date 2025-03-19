package com.example.service;

public interface AIService {
    String generateSummary(String content);
    String suggestTags(String content);
    String improveWriting(String content);
    String generateTitle(String content);
    String recommendRelatedPosts(String content);
} 