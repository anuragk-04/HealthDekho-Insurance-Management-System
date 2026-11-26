package com.healthdekho.backend.controller;

import com.healthdekho.backend.ai.BedrockTestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class BedrockTestController {

    private final BedrockTestService bedrockTestService;

    public BedrockTestController(BedrockTestService bedrockTestService) {
        this.bedrockTestService = bedrockTestService;
    }

    @GetMapping("/test")
    public String testBedrockConnection() {
        return bedrockTestService.testConnection();
    }
}