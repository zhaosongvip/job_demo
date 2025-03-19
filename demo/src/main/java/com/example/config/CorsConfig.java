package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许cookies跨域
        config.setAllowCredentials(true);
        
        // 允许向该服务器提交请求的URI，*表示全部允许
        config.addAllowedOriginPattern("*");
        
        // 允许访问的头信息,*表示全部
        config.addAllowedHeader("*");
        
        // 允许提交请求的方法，*表示全部允许
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 