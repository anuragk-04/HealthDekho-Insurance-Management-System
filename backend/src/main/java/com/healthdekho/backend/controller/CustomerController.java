
package com.healthdekho.backend.controller;

import com.healthdekho.backend.dto.CustomerProfileResponse;
import com.healthdekho.backend.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/me")
    public CustomerProfileResponse getCurrentCustomerProfile() {
        return customerService.getCurrentCustomerProfile();
    }
}
