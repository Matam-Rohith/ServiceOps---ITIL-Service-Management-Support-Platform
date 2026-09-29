package com.serviceops.service;

import com.serviceops.dto.KnowledgeArticleDto;
import com.serviceops.entity.KnowledgeArticle;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.repository.KnowledgeArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class KnowledgeService {

    private final KnowledgeArticleRepository kbRepository;

    public KnowledgeService(KnowledgeArticleRepository kbRepository) {
        this.kbRepository = kbRepository;
    }

    @Transactional
    public KnowledgeArticleDto createArticle(KnowledgeArticleDto dto, String authorName) {
        String id = UUID.randomUUID().toString();
        long nextNum = kbRepository.count() + 101;
        String articleNum = String.format("KB-%05d", nextNum);

        KnowledgeArticle k = new KnowledgeArticle();
        k.setId(id);
        k.setArticleNumber(articleNum);
        k.setTitle(dto.title());
        k.setSummary(dto.summary());
        k.setContent(dto.content());
        k.setCategory(dto.category() != null ? dto.category() : "General Support");
        k.setAuthorName(authorName);
        k.setStatus("PUBLISHED");
        k.setViewCount(1);
        k.setHelpfulCount(0);
        k.setCreatedAt(Instant.now());
        k.setUpdatedAt(Instant.now());

        return toDto(kbRepository.save(k));
    }

    @Transactional
    public KnowledgeArticleDto incrementViews(String id) {
        KnowledgeArticle k = kbRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge article not found with ID: " + id));
        k.setViewCount(k.getViewCount() + 1);
        return toDto(kbRepository.save(k));
    }

    @Transactional
    public KnowledgeArticleDto voteHelpful(String id) {
        KnowledgeArticle k = kbRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Knowledge article not found with ID: " + id));
        k.setHelpfulCount(k.getHelpfulCount() + 1);
        return toDto(kbRepository.save(k));
    }

    @Transactional(readOnly = true)
    public List<KnowledgeArticleDto> searchPublished(String query) {
        List<KnowledgeArticle> list = (query != null && !query.isBlank())
                ? kbRepository.searchPublished(query)
                : kbRepository.findByStatus("PUBLISHED");

        return list.stream().map(this::toDto).toList();
    }

    private KnowledgeArticleDto toDto(KnowledgeArticle k) {
        return new KnowledgeArticleDto(
                k.getId(),
                k.getArticleNumber(),
                k.getTitle(),
                k.getSummary(),
                k.getContent(),
                k.getCategory(),
                k.getAuthorName(),
                k.getStatus(),
                k.getViewCount(),
                k.getHelpfulCount(),
                k.getCreatedAt(),
                k.getUpdatedAt()
        );
    }
}
