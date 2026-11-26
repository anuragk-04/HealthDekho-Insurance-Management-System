
package com.healthdekho.backend.dto;

import java.math.BigDecimal;

public record InsuranceProductResponse(
        Long id,
        String productCode,
        String productName,
        String insuranceType,
        String description,
        Integer minAge,
        Integer maxAge,
        Integer minTermYears,
        Integer maxTermYears,
        BigDecimal premiumAmount,
        String premiumFrequency,
        BigDecimal sumInsured
) {
}
