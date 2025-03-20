package com.example.payload.response;

import lombok.Data;
import java.util.List;

@Data
public class AiSuggestionResponse {
    private List<String> tags;
    private String title;
    private String summary;
} 