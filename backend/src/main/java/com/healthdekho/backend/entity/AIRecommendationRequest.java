
package com.healthdekho.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ai_recommendation_requests")
public class AIRecommendationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 1000)
    private String goalsAndPreferences;

    @Column(nullable = false)
    private Integer preferredTermYears;

    @Column(length = 50)
    private String preferredInsuranceType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
        mappedBy = "recommendationRequest",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<AIRecommendationItem> recommendationItems = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public AIRecommendationRequest() {
    }

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGoalsAndPreferences() {
        return goalsAndPreferences;
    }

    public void setGoalsAndPreferences(String goalsAndPreferences) {
        this.goalsAndPreferences = goalsAndPreferences;
    }

    public Integer getPreferredTermYears() {
        return preferredTermYears;
    }

    public void setPreferredTermYears(Integer preferredTermYears) {
        this.preferredTermYears = preferredTermYears;
    }

    public String getPreferredInsuranceType() {
        return preferredInsuranceType;
    }

    public void setPreferredInsuranceType(String preferredInsuranceType) {
        this.preferredInsuranceType = preferredInsuranceType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<AIRecommendationItem> getRecommendationItems() {
        return recommendationItems;
    }
}
