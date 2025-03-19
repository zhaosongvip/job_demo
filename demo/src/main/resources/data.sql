-- 插入测试用户
INSERT INTO users (username, password, email) VALUES
('admin', '$2a$10$rDz7.5GwQKG.R.F0L3B6UeHh5ZXYCYw9W9ClZkq.mYkZvN6BB6TjW', 'admin@example.com'),
('test', '$2a$10$rDz7.5GwQKG.R.F0L3B6UeHh5ZXYCYw9W9ClZkq.mYkZvN6BB6TjW', 'test@example.com');

-- 插入测试文章
INSERT INTO posts (title, content, summary, tags, author_id) VALUES
('测试文章1', '这是测试文章1的内容', '这是测试文章1的摘要', 'test,demo', 1),
('测试文章2', '这是测试文章2的内容', '这是测试文章2的摘要', 'test,example', 1); 