
package com.healthdekho.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_recommendation_items")
public class AIRecommendationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_request_id", nullable = false)
    private AIRecommendationRequest recommendationRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private InsuranceProduct insuranceProduct;

    @Column(nullable = false, length = 2000)
    private String rationale;

    @Column(nullable = false, length = 500)
    private String suitability;

    public AIRecommendationItem() {
    }

    public Long getId() {
        return id;
    }

    public AIRecommendationRequest getRecommendationRequest() {
        return recommendationRequest;
    }

    public void setRecommendationRequest(
        AIRecommendationRequest recommendationRequest
    ) {
        this.recommendationRequest = recommendationRequest;
    }

    public InsuranceProduct getInsuranceProduct() {
        return insuranceProduct;
    }

    public void setInsuranceProduct(InsuranceProduct insuranceProduct) {
        this.insuranceProduct = insuranceProduct;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getSuitability() {
        return suitability;
    }

    public void setSuitability(String suitability) {
        this.suitability = suitability;
    }
}
