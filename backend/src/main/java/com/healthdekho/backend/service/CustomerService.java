
package com.healthdekho.backend.service;

import com.healthdekho.backend.dto.CustomerProfileResponse;
import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.repository.CustomerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getCurrentCustomerProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Customer not found"));

        return new CustomerProfileResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getDateOfBirth(),
                customer.getPhoneNumber()
        );
    }
}
