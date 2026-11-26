
package com.healthdekho.backend.controller;

import com.healthdekho.backend.dto.AIRecommendationRequestDto;
import com.healthdekho.backend.dto.AIRecommendationResponse;
import com.healthdekho.backend.service.AIRecommendationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/recommendations")
public class AIRecommendationController {

    private final AIRecommendationService aiRecommendationService;

    public AIRecommendationController(
            AIRecommendationService aiRecommendationService
    ) {
        this.aiRecommendationService = aiRecommendationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AIRecommendationResponse generateRecommendations(
            @Valid @RequestBody AIRecommendationRequestDto request
    ) {
        return aiRecommendationService.generateRecommendations(request);
    }
}
