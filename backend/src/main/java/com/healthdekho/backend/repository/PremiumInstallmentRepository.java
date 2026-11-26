
package com.healthdekho.backend.repository;

import com.healthdekho.backend.entity.PremiumInstallment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PremiumInstallmentRepository
        extends JpaRepository<PremiumInstallment, Long> {

    List<PremiumInstallment> findByCustomerPolicy_IdOrderByInstallmentNumberAsc(
            Long policyId
    );
}
