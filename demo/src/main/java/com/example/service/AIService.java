package com.example.service;

import java.util.List;

public interface AIService {
    String generateSummary(String content);
    List<String> generateTags(String content);
    String improveWriting(String content);
    String generateTitle(String content);
    String recommendRelatedPosts(String content);
    String optimizeContent(String content);
} 