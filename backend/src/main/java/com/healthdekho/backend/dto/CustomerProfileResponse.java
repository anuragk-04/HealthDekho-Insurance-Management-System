
package com.healthdekho.backend.dto;

import java.time.LocalDate;

public record CustomerProfileResponse(
        Long id,
        String fullName,
        String email,
        LocalDate dateOfBirth,
        String phoneNumber
) {
}
