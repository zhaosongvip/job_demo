package com.example.repository;

import com.example.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    // 使用JOIN FETCH预加载用户信息
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.post.id = ?1 ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdWithUser(Long postId);
} 