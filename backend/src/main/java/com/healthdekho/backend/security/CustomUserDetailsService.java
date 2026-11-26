
package com.healthdekho.backend.security;

import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.repository.CustomerRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    public CustomUserDetailsService(
            CustomerRepository customerRepository
    ) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Customer not found with email: " + email
                        )
                );

        return User.builder()
                .username(customer.getEmail())
                .password(customer.getPassword())
                .authorities("ROLE_CUSTOMER")
                .build();
    }
}
