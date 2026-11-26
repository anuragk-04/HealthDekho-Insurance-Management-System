
package com.healthdekho.backend.service;

import com.healthdekho.backend.dto.InsuranceProductResponse;
import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.entity.CustomerPolicy;
import com.healthdekho.backend.entity.InsuranceProduct;
import com.healthdekho.backend.repository.CustomerPolicyRepository;
import com.healthdekho.backend.repository.CustomerRepository;
import com.healthdekho.backend.repository.InsuranceProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class InsuranceProductService {

    private final InsuranceProductRepository insuranceProductRepository;
    private final CustomerPolicyRepository customerPolicyRepository;
    private final CustomerRepository customerRepository;

    public InsuranceProductService(
            InsuranceProductRepository insuranceProductRepository,
            CustomerPolicyRepository customerPolicyRepository,
            CustomerRepository customerRepository) {
        this.insuranceProductRepository = insuranceProductRepository;
        this.customerPolicyRepository = customerPolicyRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<InsuranceProductResponse> getAvailableProducts() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Customer not found"));

        List<CustomerPolicy> registeredPolicies =
                customerPolicyRepository
                        .findByCustomer_IdOrderByStartDateDesc(customer.getId());

        Set<Long> registeredProductIds = registeredPolicies.stream()
                .map(policy -> policy.getInsuranceProduct().getId())
                .collect(Collectors.toSet());

        List<InsuranceProduct> activeProducts =
                insuranceProductRepository.findByActiveTrue();

        return activeProducts.stream()
                .filter(product ->
                        !registeredProductIds.contains(product.getId()))
                .map(product -> new InsuranceProductResponse(
                        product.getId(),
                        product.getProductCode(),
                        product.getProductName(),
                        product.getInsuranceType(),
                        product.getDescription(),
                        product.getMinAge(),
                        product.getMaxAge(),
                        product.getMinTermYears(),
                        product.getMaxTermYears(),
                        product.getPremiumAmount(),
                        product.getPremiumFrequency(),
                        product.getSumInsured()
                ))
                .toList();
    }
}
