package com.serviceops.dto;

import java.time.Instant;

public record KnowledgeArticleDto(
    String id,
    String articleNumber,
    String title,
    String summary,
    String content,
    String category,
    String authorName,
    String status,
    int viewCount,
    int helpfulCount,
    Instant createdAt,
    Instant updatedAt
) {}
