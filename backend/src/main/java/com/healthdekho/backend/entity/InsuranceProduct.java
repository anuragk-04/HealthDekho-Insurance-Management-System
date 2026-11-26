
package com.healthdekho.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "insurance_products")
public class InsuranceProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String productCode;

    @Column(nullable = false, length = 150)
    private String productName;

    @Column(nullable = false, length = 50)
    private String insuranceType;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer minAge;

    @Column(nullable = false)
    private Integer maxAge;

    @Column(nullable = false)
    private Integer minTermYears;

    @Column(nullable = false)
    private Integer maxTermYears;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal premiumAmount;

    @Column(nullable = false, length = 30)
    private String premiumFrequency;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal sumInsured;

    @Column(nullable = false)
    private boolean active = true;

    public InsuranceProduct() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public Integer getMinTermYears() {
        return minTermYears;
    }

    public void setMinTermYears(Integer minTermYears) {
        this.minTermYears = minTermYears;
    }

    public Integer getMaxTermYears() {
        return maxTermYears;
    }

    public void setMaxTermYears(Integer maxTermYears) {
        this.maxTermYears = maxTermYears;
    }

    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }

    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }

    public String getPremiumFrequency() {
        return premiumFrequency;
    }

    public void setPremiumFrequency(String premiumFrequency) {
        this.premiumFrequency = premiumFrequency;
    }

    public BigDecimal getSumInsured() {
        return sumInsured;
    }

    public void setSumInsured(BigDecimal sumInsured) {
        this.sumInsured = sumInsured;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
