package com.serviceops.controller;

import com.serviceops.dto.KnowledgeArticleDto;
import com.serviceops.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
@Tag(name = "Knowledge Base", description = "IT runbooks, solutions, and self-help articles (KCS)")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping
    @Operation(summary = "Search published knowledge articles")
    public ResponseEntity<List<KnowledgeArticleDto>> searchArticles(
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(knowledgeService.searchPublished(query));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SERVICE_AGENT', 'SERVICE_MANAGER', 'ADMIN')")
    @Operation(summary = "Publish a new knowledge article (Staff only)")
    public ResponseEntity<KnowledgeArticleDto> createArticle(
            @RequestBody KnowledgeArticleDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(knowledgeService.createArticle(dto, userDetails.getUsername()));
    }

    @PostMapping("/{id}/view")
    @Operation(summary = "Record view count milestone")
    public ResponseEntity<KnowledgeArticleDto> incrementView(@PathVariable String id) {
        return ResponseEntity.ok(knowledgeService.incrementViews(id));
    }

    @PostMapping("/{id}/helpful")
    @Operation(summary = "Cast helpful vote for article")
    public ResponseEntity<KnowledgeArticleDto> voteHelpful(@PathVariable String id) {
        return ResponseEntity.ok(knowledgeService.voteHelpful(id));
    }
}
