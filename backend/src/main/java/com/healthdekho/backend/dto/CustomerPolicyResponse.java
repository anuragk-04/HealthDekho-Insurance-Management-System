
package com.healthdekho.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerPolicyResponse(
        Long id,
        String policyNumber,
        String productName,
        String insuranceType,
        Integer termYears,
        LocalDate startDate,
        LocalDate maturityDate,
        String premiumFrequency,
        BigDecimal premiumAmount,
        BigDecimal sumInsured,
        String status
) {
}
