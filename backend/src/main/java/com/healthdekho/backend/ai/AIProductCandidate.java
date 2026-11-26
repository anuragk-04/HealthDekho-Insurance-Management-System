package com.healthdekho.backend.ai;

import java.math.BigDecimal;

public record AIProductCandidate(

        Long productId,
        String productCode,
        String productName,
        String insuranceType,
        String description,

        int minAge,
        int maxAge,

        int minTermYears,
        int maxTermYears,

        BigDecimal premiumAmount,
        String premiumFrequency,
        BigDecimal sumInsured

) {}