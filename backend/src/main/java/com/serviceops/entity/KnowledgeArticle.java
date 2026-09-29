package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "knowledge_articles", indexes = {
    @Index(name = "idx_kb_number", columnList = "article_number", unique = true),
    @Index(name = "idx_kb_category", columnList = "category"),
    @Index(name = "idx_kb_status", columnList = "status")
})
public class KnowledgeArticle {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "article_number", nullable = false, unique = true, length = 32)
    private String articleNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(nullable = false, length = 20)
    private String status = "PUBLISHED"; // DRAFT, PUBLISHED, ARCHIVED

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @Column(name = "helpful_count", nullable = false)
    private int helpfulCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public KnowledgeArticle() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getArticleNumber() { return articleNumber; }
    public void setArticleNumber(String articleNumber) { this.articleNumber = articleNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }
    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
