
package com.healthdekho.backend.dto;

public record AuthResponse(
        String token,
        String tokenType,
        Long customerId,
        String fullName,
        String email
) {
}
