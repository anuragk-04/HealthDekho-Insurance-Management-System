
package com.healthdekho.backend.service;

import com.healthdekho.backend.dto.AuthResponse;
import com.healthdekho.backend.dto.LoginRequest;
import com.healthdekho.backend.dto.RegisterRequest;
import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.repository.CustomerRepository;
import com.healthdekho.backend.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // Customer registration
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        // Check whether email already exists
        if (customerRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        // Create customer
        Customer customer = new Customer();

        customer.setFullName(request.fullName().trim());
        customer.setEmail(email);

        // Encrypt password before saving
        customer.setPassword(
                passwordEncoder.encode(request.password())
        );

        customer.setDateOfBirth(request.dateOfBirth());
        customer.setPhoneNumber(request.phoneNumber());

        // Save customer in PostgreSQL
        Customer savedCustomer = customerRepository.save(customer);

        // Generate JWT after successful registration
        String token = jwtService.generateToken(savedCustomer.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                savedCustomer.getId(),
                savedCustomer.getFullName(),
                savedCustomer.getEmail()
        );
    }

    // Customer login
    public AuthResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        // Authenticate customer credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.password()
                )
        );

        // Retrieve authenticated customer
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        // Generate JWT
        String token = jwtService.generateToken(customer.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                customer.getId(),
                customer.getFullName(),
                customer.getEmail()
        );
    }
}
