package com.example.controller;

import com.example.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    private final AIService aiService;
    
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }
    
    @PostMapping("/summary")
    public ResponseEntity<?> generateSummary(@RequestBody String content) {
        try {
            String summary = aiService.generateSummary(content);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("生成摘要失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/tags")
    public ResponseEntity<?> suggestTags(@RequestBody String content) {
        try {
            String tags = aiService.suggestTags(content);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("推荐标签失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/improve")
    public ResponseEntity<?> improveWriting(@RequestBody String content) {
        try {
            String improved = aiService.improveWriting(content);
            return ResponseEntity.ok(improved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("优化内容失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/title")
    public ResponseEntity<?> generateTitle(@RequestBody String content) {
        try {
            String title = aiService.generateTitle(content);
            return ResponseEntity.ok(title);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("生成标题失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/recommend")
    public ResponseEntity<?> recommendRelatedPosts(@RequestBody String content) {
        try {
            String recommendations = aiService.recommendRelatedPosts(content);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("推荐相关主题失败: " + e.getMessage());
        }
    }
} 