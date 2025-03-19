package com.example.controller;

import com.example.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AIController {

    private static final Logger logger = LoggerFactory.getLogger(AIController.class);
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/title")
    public ResponseEntity<String> generateTitle(@RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("内容不能为空");
            }
            
            String title = aiService.generateTitle(content);
            return ResponseEntity.ok(title);
        } catch (Exception e) {
            logger.error("生成标题失败", e);
            return ResponseEntity.badRequest().body("生成标题失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/tags")
    public ResponseEntity<List<String>> generateTags(@RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            
            List<String> tags = aiService.generateTags(content);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            logger.error("生成标签失败", e);
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PostMapping("/summary")
    public ResponseEntity<String> generateSummary(@RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("内容不能为空");
            }
            
            String summary = aiService.generateSummary(content);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("生成摘要失败", e);
            return ResponseEntity.badRequest().body("生成摘要失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/optimize")
    public ResponseEntity<String> optimizeContent(@RequestBody Map<String, String> payload) {
        try {
            String content = payload.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("内容不能为空");
            }
            
            String optimized = aiService.optimizeContent(content);
            return ResponseEntity.ok(optimized);
        } catch (Exception e) {
            logger.error("优化内容失败", e);
            return ResponseEntity.badRequest().body("优化内容失败: " + e.getMessage());
        }
    }
} 