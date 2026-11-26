
package com.healthdekho.backend.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.healthdekho.backend.dto.AIRecommendationRequestDto;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BedrockRecommendationService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public BedrockRecommendationService(
            ChatClient.Builder chatClientBuilder,
            ObjectMapper objectMapper
    ) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public AIRecommendationResult generateRecommendations(
            AIRecommendationRequestDto request,
            int customerAge,
            List<AIProductCandidate> candidates
    ) {

        try {
            // Convert eligible products into JSON for the AI prompt
            String candidateJson =
                    objectMapper.writeValueAsString(candidates);

            String prompt = """
                    You are an insurance recommendation assistant
                    for HealthDekho.

                    Your task is to recommend suitable insurance
                    products based on the customer's requirements.

                    CUSTOMER DETAILS:
                    Age: %d
                    Goals and preferences: %s
                    Preferred term: %d years
                    Preferred insurance type: %s

                    AVAILABLE PRODUCTS:
                    %s

                    STRICT RULES:
                    1. Recommend products ONLY from the available
                       products list.
                    2. Use the exact productId provided.
                    3. Never invent product IDs or products.
                    4. Recommend a maximum of 3 products.
                    5. Explain why each product matches the
                       customer's requirements.
                    6. Provide a suitability assessment:
                       High, Medium, or Low.
                    7. Return only structured data matching the
                       requested response format.
                    8. If no product is suitable, return an
                       empty recommendations list.
                    """.formatted(
                    customerAge,
                    request.goalsAndPreferences(),
                    request.preferredTermYears(),
                    request.preferredInsuranceType() == null
                            ? "No preference"
                            : request.preferredInsuranceType(),
                    candidateJson
            );

            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .entity(AIRecommendationResult.class);

        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                    "Unable to prepare insurance products for AI",
                    exception
            );
        }
    }
}
