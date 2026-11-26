
package com.healthdekho.backend.service;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class PolicyNumberGenerator {

    public String generatePolicyNumber() {
        return "HDK-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
    }
}
