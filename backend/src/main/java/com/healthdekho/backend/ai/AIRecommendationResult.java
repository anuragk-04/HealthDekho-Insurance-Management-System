package com.healthdekho.backend.ai;

import java.util.List;

public record AIRecommendationResult(

        List<RecommendedProduct> recommendations

) {

    public record RecommendedProduct(

            Long productId,

            String rationale,

            String suitability

    ) {}
}