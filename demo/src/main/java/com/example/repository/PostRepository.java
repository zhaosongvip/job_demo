package com.example.repository;

import com.example.entity.Post;
import com.example.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // 分页查询所有帖子，按创建时间降序排序
    @Query(value = "SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.author ORDER BY p.createdAt DESC",
           countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findAllPosts(Pageable pageable);
    
    // 获取单个帖子时使用 JOIN FETCH
    @Query("SELECT p FROM Post p JOIN FETCH p.author WHERE p.id = ?1")
    Optional<Post> findPostWithAuthorById(Long id);
    
    @Query(value = "SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.author WHERE p.author = ?1",
           countQuery = "SELECT COUNT(p) FROM Post p WHERE p.author = ?1")
    Page<Post> findByAuthor(User author, Pageable pageable);

    List<Post> findByAuthorId(Long authorId, Pageable pageable);

    // 修复：为JOIN FETCH查询添加countQuery
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.author",
           countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findAllWithAuthor(Pageable pageable);
} 