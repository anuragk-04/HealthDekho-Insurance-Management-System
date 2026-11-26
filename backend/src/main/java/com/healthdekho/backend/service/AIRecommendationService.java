
package com.healthdekho.backend.service;

import com.healthdekho.backend.ai.AIProductCandidate;
import com.healthdekho.backend.ai.AIRecommendationResult;
import com.healthdekho.backend.ai.BedrockRecommendationService;

import com.healthdekho.backend.dto.AIRecommendationRequestDto;
import com.healthdekho.backend.dto.AIRecommendationResponse;

import com.healthdekho.backend.entity.AIRecommendationItem;
import com.healthdekho.backend.entity.AIRecommendationRequest;
import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.entity.CustomerPolicy;
import com.healthdekho.backend.entity.InsuranceProduct;

import com.healthdekho.backend.repository.AIRecommendationRequestRepository;
import com.healthdekho.backend.repository.CustomerPolicyRepository;
import com.healthdekho.backend.repository.CustomerRepository;
import com.healthdekho.backend.repository.InsuranceProductRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@Service
public class AIRecommendationService {

    private final CustomerRepository customerRepository;
    private final CustomerPolicyRepository customerPolicyRepository;
    private final InsuranceProductRepository insuranceProductRepository;
    private final AIRecommendationRequestRepository recommendationRequestRepository;
    private final BedrockRecommendationService bedrockRecommendationService;

    public AIRecommendationService(
            CustomerRepository customerRepository,
            CustomerPolicyRepository customerPolicyRepository,
            InsuranceProductRepository insuranceProductRepository,
            AIRecommendationRequestRepository recommendationRequestRepository,
            BedrockRecommendationService bedrockRecommendationService
    ) {
        this.customerRepository = customerRepository;
        this.customerPolicyRepository = customerPolicyRepository;
        this.insuranceProductRepository = insuranceProductRepository;
        this.recommendationRequestRepository = recommendationRequestRepository;
        this.bedrockRecommendationService = bedrockRecommendationService;
    }

    // Main FR-2 recommendation workflow
    @Transactional
    public AIRecommendationResponse generateRecommendations(
            AIRecommendationRequestDto request
    ) {

        // 1. Identify the logged-in customer
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND, "Customer not found"
                ));

        // 2. Validate request and calculate age
        validateRequest(request);

        int age = Period.between(
                request.dateOfBirth(),
                LocalDate.now()
        ).getYears();

        // 3. Get eligible products from PostgreSQL
        List<AIProductCandidate> candidates =
                buildEligibleCandidates(customer, request, age);

        // 4. Send eligible products to Amazon Bedrock
        AIRecommendationResult aiResult =
                bedrockRecommendationService.generateRecommendations(
                        request,
                        age,
                        candidates
                );

        // 5. Validate AI response against eligible products
        List<AIRecommendationResult.RecommendedProduct> validatedResults =
                validateAIResults(aiResult, candidates);

        // 6. Save recommendation request
        AIRecommendationRequest savedRequest =
                saveRecommendationRequest(customer, request);

        // 7. Save validated recommendation items
        List<AIRecommendationResponse.RecommendedProduct> responseItems =
                saveRecommendationItems(
                        savedRequest,
                        validatedResults,
                        candidates
                );

        // 8. Return final API response
        return new AIRecommendationResponse(
                savedRequest.getId(),
                savedRequest.getCreatedAt(),
                responseItems
        );
    }

    // Validates customer input
    private void validateRequest(AIRecommendationRequestDto request) {

        if (request == null) {
            throw new ResponseStatusException(
                    BAD_REQUEST, "Recommendation request is required"
            );
        }

        if (request.dateOfBirth() == null ||
                request.dateOfBirth().isAfter(LocalDate.now())) {

            throw new ResponseStatusException(
                    BAD_REQUEST, "Date of birth cannot be in the future"
            );
        }

        if (request.preferredTermYears() == null ||
                request.preferredTermYears() <= 0) {

            throw new ResponseStatusException(
                    BAD_REQUEST, "Preferred term must be positive"
            );
        }

        if (request.goalsAndPreferences() == null ||
                request.goalsAndPreferences().isBlank()) {

            throw new ResponseStatusException(
                    BAD_REQUEST, "Goals and preferences are required"
            );
        }
    }

    // Fetches and filters eligible products
    @Transactional(readOnly = true)
    public List<AIProductCandidate> getEligibleCandidates(
            AIRecommendationRequestDto request
    ) {

        validateRequest(request);

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND, "Customer not found"
                ));

        int age = Period.between(
                request.dateOfBirth(),
                LocalDate.now()
        ).getYears();

        return buildEligibleCandidates(customer, request, age);
    }

    private List<AIProductCandidate> buildEligibleCandidates(
            Customer customer,
            AIRecommendationRequestDto request,
            int age
    ) {

        // Find products already registered by this customer
        List<CustomerPolicy> registeredPolicies =
                customerPolicyRepository
                        .findByCustomer_IdOrderByStartDateDesc(customer.getId());

        Set<Long> registeredProductIds = registeredPolicies.stream()
                .map(policy -> policy.getInsuranceProduct().getId())
                .collect(java.util.stream.Collectors.toSet());

        // Fetch active products and apply eligibility filters
        List<AIProductCandidate> candidates =
                insuranceProductRepository.findByActiveTrue()
                        .stream()

                        .filter(product ->
                                !registeredProductIds.contains(product.getId()))

                        .filter(product ->
                                age >= product.getMinAge()
                                && age <= product.getMaxAge())

                        .filter(product ->
                                request.preferredTermYears() >= product.getMinTermYears()
                                && request.preferredTermYears() <= product.getMaxTermYears())

                        .filter(product ->
                                request.preferredInsuranceType() == null
                                || request.preferredInsuranceType().isBlank()
                                || product.getInsuranceType().equalsIgnoreCase(
                                        request.preferredInsuranceType()
                                ))

                        .map(product -> new AIProductCandidate(
                                product.getId(),
                                product.getProductCode(),
                                product.getProductName(),
                                product.getInsuranceType(),
                                product.getDescription(),
                                product.getMinAge(),
                                product.getMaxAge(),
                                product.getMinTermYears(),
                                product.getMaxTermYears(),
                                product.getPremiumAmount(),
                                product.getPremiumFrequency(),
                                product.getSumInsured()
                        ))
                        .toList();

        if (candidates.isEmpty()) {
            throw new ResponseStatusException(
                    UNPROCESSABLE_ENTITY,
                    "No eligible insurance products found"
            );
        }

        return candidates;
    }

    // Checks that the AI recommends only eligible products
    private List<AIRecommendationResult.RecommendedProduct> validateAIResults(
            AIRecommendationResult aiResult,
            List<AIProductCandidate> candidates
    ) {

        if (aiResult == null || aiResult.recommendations() == null) {
            throw new IllegalStateException(
                    "AI returned an invalid recommendation response"
            );
        }

        Set<Long> eligibleProductIds = new HashSet<>();

        for (AIProductCandidate candidate : candidates) {
            eligibleProductIds.add(candidate.productId());
        }

        Set<Long> processedProductIds = new HashSet<>();

        List<AIRecommendationResult.RecommendedProduct> validated =
                new ArrayList<>();

        // Validate every returned ID, including entries beyond the limit
        for (AIRecommendationResult.RecommendedProduct item :
                aiResult.recommendations()) {

            if (item == null ||
                    item.productId() == null ||
                    !eligibleProductIds.contains(item.productId())) {

                throw new IllegalStateException(
                        "AI returned an unknown or ineligible product ID"
                );
            }

            if (item.rationale() == null || item.rationale().isBlank()
                    || item.suitability() == null
                    || item.suitability().isBlank()) {

                throw new IllegalStateException(
                        "AI returned incomplete recommendation details"
                );
            }

            // Remove duplicate product recommendations
            if (!processedProductIds.add(item.productId())) {
                continue;
            }

            // Maximum three recommendations
            if (validated.size() < 3) {
                validated.add(item);
            }
        }

        return validated;
    }

    // Persists the customer's recommendation request
    private AIRecommendationRequest saveRecommendationRequest(
            Customer customer,
            AIRecommendationRequestDto request
    ) {

        AIRecommendationRequest recommendationRequest =
                new AIRecommendationRequest();

        recommendationRequest.setCustomer(customer);
        recommendationRequest.setDateOfBirth(request.dateOfBirth());
        recommendationRequest.setGoalsAndPreferences(
                request.goalsAndPreferences()
        );
        recommendationRequest.setPreferredTermYears(
                request.preferredTermYears()
        );
        recommendationRequest.setPreferredInsuranceType(
                request.preferredInsuranceType()
        );

        return recommendationRequestRepository.save(
                recommendationRequest
        );
    }

    // Saves recommendation items using trusted database product details
    private List<AIRecommendationResponse.RecommendedProduct>
    saveRecommendationItems(
            AIRecommendationRequest savedRequest,
            List<AIRecommendationResult.RecommendedProduct> aiResults,
            List<AIProductCandidate> candidates
    ) {

        Set<Long> recommendedIds = new HashSet<>();

        for (AIRecommendationResult.RecommendedProduct result : aiResults) {
            recommendedIds.add(result.productId());
        }

        Map<Long, InsuranceProduct> productsById = new HashMap<>();

        for (InsuranceProduct product :
                insuranceProductRepository.findAllById(recommendedIds)) {

            productsById.put(product.getId(), product);
        }

        List<AIRecommendationResponse.RecommendedProduct> response =
                new ArrayList<>();

        for (AIRecommendationResult.RecommendedProduct result : aiResults) {

            InsuranceProduct product = productsById.get(result.productId());

            if (product == null) {
                throw new IllegalStateException(
                        "Recommended product no longer exists"
                );
            }

            AIRecommendationItem item = new AIRecommendationItem();

            item.setRecommendationRequest(savedRequest);
            item.setInsuranceProduct(product);
            item.setRationale(result.rationale());
            item.setSuitability(result.suitability());

            // CascadeType.ALL saves this item with the parent request
            savedRequest.getRecommendationItems().add(item);

            response.add(
                    new AIRecommendationResponse.RecommendedProduct(
                            product.getId(),
                            product.getProductCode(),
                            product.getProductName(),
                            product.getInsuranceType(),
                            result.rationale(),
                            result.suitability()
                    )
            );
        }

        return response;
    }
}
