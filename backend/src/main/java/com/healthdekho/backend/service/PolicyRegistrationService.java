
package com.healthdekho.backend.service;

import com.healthdekho.backend.dto.PolicyRegistrationRequest;
import com.healthdekho.backend.dto.PolicyRegistrationResponse;
import com.healthdekho.backend.entity.Customer;
import com.healthdekho.backend.entity.CustomerPolicy;
import com.healthdekho.backend.entity.InsuranceProduct;
import com.healthdekho.backend.entity.PremiumInstallment;
import com.healthdekho.backend.repository.CustomerPolicyRepository;
import com.healthdekho.backend.repository.CustomerRepository;
import com.healthdekho.backend.repository.InsuranceProductRepository;
import com.healthdekho.backend.repository.PremiumInstallmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PolicyRegistrationService {

    private final CustomerRepository customerRepository;
    private final InsuranceProductRepository productRepository;
    private final CustomerPolicyRepository policyRepository;
    private final PremiumInstallmentRepository installmentRepository;
    private final PolicyNumberGenerator policyNumberGenerator;

    public PolicyRegistrationService(
            CustomerRepository customerRepository,
            InsuranceProductRepository productRepository,
            CustomerPolicyRepository policyRepository,
            PremiumInstallmentRepository installmentRepository,
            PolicyNumberGenerator policyNumberGenerator) {

        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.policyRepository = policyRepository;
        this.installmentRepository = installmentRepository;
        this.policyNumberGenerator = policyNumberGenerator;
    }

    @Transactional
    public PolicyRegistrationResponse registerPolicy(
            PolicyRegistrationRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Customer not found"));

        InsuranceProduct product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Insurance product not found"));

        if (!product.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Insurance product is inactive");
        }

        LocalDate today = LocalDate.now();
        int age = Period.between(customer.getDateOfBirth(), today).getYears();

        if (age < product.getMinAge() || age > product.getMaxAge()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Customer is not eligible for this product based on age");
        }

        if (request.termYears() < product.getMinTermYears()
                || request.termYears() > product.getMaxTermYears()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected term is outside the product's allowed range");
        }

        if (policyRepository.existsByCustomer_IdAndInsuranceProduct_Id(
                customer.getId(), product.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Customer has already registered for this product");
        }

        int monthsBetweenInstallments =
                getMonthsBetweenInstallments(product.getPremiumFrequency());

        int installmentsPerYear = 12 / monthsBetweenInstallments;
        int totalInstallments = request.termYears() * installmentsPerYear;

        BigDecimal premiumAmount = product.getPremiumAmount();
        BigDecimal totalPremium = premiumAmount.multiply(
                BigDecimal.valueOf(totalInstallments));

        LocalDate maturityDate = today.plusYears(request.termYears());

        CustomerPolicy policy = new CustomerPolicy();
        policy.setPolicyNumber(policyNumberGenerator.generatePolicyNumber());
        policy.setCustomer(customer);
        policy.setInsuranceProduct(product);
        policy.setStartDate(today);
        policy.setMaturityDate(maturityDate);
        policy.setTermYears(request.termYears());
        policy.setPremiumAmount(premiumAmount);
        policy.setPremiumFrequency(product.getPremiumFrequency());
        policy.setSumInsured(product.getSumInsured());
        policy.setTotalPremium(totalPremium);
        policy.setStatus("ACTIVE");

        CustomerPolicy savedPolicy = policyRepository.save(policy);

        List<PremiumInstallment> installments = new ArrayList<>();

        for (int i = 0; i < totalInstallments; i++) {
            PremiumInstallment installment = new PremiumInstallment();

            installment.setCustomerPolicy(savedPolicy);
            installment.setInstallmentNumber(i + 1);
            installment.setAmount(premiumAmount);
            installment.setDueDate(
                    today.plusMonths((long) i * monthsBetweenInstallments));
            installment.setStatus("PENDING");

            installments.add(installment);
        }

        installmentRepository.saveAll(installments);

        return new PolicyRegistrationResponse(
                savedPolicy.getId(),
                savedPolicy.getPolicyNumber(),
                product.getProductName(),
                savedPolicy.getStartDate(),
                savedPolicy.getMaturityDate(),
                savedPolicy.getTermYears(),
                savedPolicy.getPremiumAmount(),
                savedPolicy.getPremiumFrequency(),
                savedPolicy.getSumInsured(),
                savedPolicy.getTotalPremium(),
                savedPolicy.getStatus(),
                totalInstallments
        );
    }

    private int getMonthsBetweenInstallments(String frequency) {

        return switch (frequency.toUpperCase(Locale.ROOT)) {
            case "MONTHLY" -> 1;
            case "QUARTERLY" -> 3;
            case "HALF_YEARLY", "HALF-YEARLY" -> 6;
            case "YEARLY", "ANNUALLY" -> 12;
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unsupported premium frequency: " + frequency);
        };
    }
}
