package com.serviceops.repository;

import com.serviceops.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, String> {
    Optional<KnowledgeArticle> findByArticleNumber(String articleNumber);
    List<KnowledgeArticle> findByStatus(String status);
    List<KnowledgeArticle> findByCategoryAndStatus(String category, String status);

    @Query("SELECT k FROM KnowledgeArticle k WHERE k.status = 'PUBLISHED' AND " +
           "(LOWER(k.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.summary) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(k.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<KnowledgeArticle> searchPublished(String query);
}
