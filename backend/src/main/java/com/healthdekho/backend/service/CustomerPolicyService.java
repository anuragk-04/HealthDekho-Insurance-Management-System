
package com.healthdekho.backend.service;

import com.healthdekho.backend.dto.CustomerPolicyResponse;
import com.healthdekho.backend.entity.CustomerPolicy;
import com.healthdekho.backend.repository.CustomerPolicyRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerPolicyService {

    private final CustomerPolicyRepository customerPolicyRepository;

    public CustomerPolicyService(
            CustomerPolicyRepository customerPolicyRepository) {
        this.customerPolicyRepository = customerPolicyRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerPolicyResponse> getMyPolicies() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        // Retrieve policies belonging to the authenticated customer.
        List<CustomerPolicy> policies =
                customerPolicyRepository
                        .findByCustomer_EmailOrderByStartDateDesc(email);

        return policies.stream()
                .map(policy -> new CustomerPolicyResponse(
                        policy.getId(),
                        policy.getPolicyNumber(),
                        policy.getInsuranceProduct().getProductName(),
                        policy.getInsuranceProduct().getInsuranceType(),
                        policy.getTermYears(),
                        policy.getStartDate(),
                        policy.getMaturityDate(),
                        policy.getPremiumFrequency(),
                        policy.getPremiumAmount(),
                        policy.getSumInsured(),
                        policy.getStatus()
                ))
                .toList();
    }
}
