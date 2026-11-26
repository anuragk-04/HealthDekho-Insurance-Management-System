
package com.healthdekho.backend.controller;

import com.healthdekho.backend.dto.CustomerPolicyResponse;
import com.healthdekho.backend.service.CustomerPolicyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers/me/policies")
public class CustomerPolicyController {

    private final CustomerPolicyService customerPolicyService;

    public CustomerPolicyController(
            CustomerPolicyService customerPolicyService) {
        this.customerPolicyService = customerPolicyService;
    }

    @GetMapping
    public List<CustomerPolicyResponse> getMyPolicies() {
        return customerPolicyService.getMyPolicies();
    }
}
