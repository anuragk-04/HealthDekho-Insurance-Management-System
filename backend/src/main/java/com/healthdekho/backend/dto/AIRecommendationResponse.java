package com.healthdekho.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AIRecommendationResponse(

        Long recommendationRequestId,

        LocalDateTime createdAt,

        List<RecommendedProduct> recommendations

) {

    public record RecommendedProduct(

            Long productId,

            String productCode,

            String productName,

            String insuranceType,

            String rationale,

            String suitability

    ) {}

}