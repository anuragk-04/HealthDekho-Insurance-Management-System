
package com.healthdekho.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PolicyRegistrationResponse(
        Long policyId,
        String policyNumber,
        String productName,
        LocalDate startDate,
        LocalDate maturityDate,
        int termYears,
        BigDecimal premiumAmount,
        String premiumFrequency,
        BigDecimal sumInsured,
        BigDecimal totalPremium,
        String status,
        int totalInstallments
) {}
