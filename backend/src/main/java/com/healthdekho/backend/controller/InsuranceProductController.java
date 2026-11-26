
package com.healthdekho.backend.controller;

import com.healthdekho.backend.dto.InsuranceProductResponse;
import com.healthdekho.backend.service.InsuranceProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers/me/available-products")
public class InsuranceProductController {

    private final InsuranceProductService insuranceProductService;

    public InsuranceProductController(
            InsuranceProductService insuranceProductService) {
        this.insuranceProductService = insuranceProductService;
    }

    @GetMapping
    public List<InsuranceProductResponse> getAvailableProducts() {
        return insuranceProductService.getAvailableProducts();
    }
}
