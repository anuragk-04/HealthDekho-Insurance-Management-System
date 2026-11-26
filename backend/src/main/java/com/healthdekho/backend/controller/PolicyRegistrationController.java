
package com.healthdekho.backend.controller;

import com.healthdekho.backend.dto.PolicyRegistrationRequest;
import com.healthdekho.backend.dto.PolicyRegistrationResponse;
import com.healthdekho.backend.service.PolicyRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
public class PolicyRegistrationController {

    private final PolicyRegistrationService policyRegistrationService;

    public PolicyRegistrationController(
            PolicyRegistrationService policyRegistrationService) {
        this.policyRegistrationService = policyRegistrationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public PolicyRegistrationResponse registerPolicy(
            @Valid @RequestBody PolicyRegistrationRequest request) {

        return policyRegistrationService.registerPolicy(request);
    }
}
