
package com.healthdekho.backend.repository;

import com.healthdekho.backend.entity.CustomerPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerPolicyRepository
        extends JpaRepository<CustomerPolicy, Long> {

    List<CustomerPolicy> findByCustomer_IdOrderByStartDateDesc(
            Long customerId
    );

    Optional<CustomerPolicy> findByPolicyNumber(String policyNumber);

    boolean existsByCustomer_IdAndInsuranceProduct_Id(
            Long customerId,
            Long productId
    );
    List<CustomerPolicy> findByCustomer_EmailOrderByStartDateDesc(String email);
}
