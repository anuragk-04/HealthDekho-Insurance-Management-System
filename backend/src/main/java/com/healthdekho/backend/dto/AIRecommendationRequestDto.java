package com.healthdekho.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AIRecommendationRequestDto(

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        @NotBlank(message = "Goals and preferences are required")
        @Size(max = 1000, message = "Goals and preferences cannot exceed 1000 characters")
        String goalsAndPreferences,

        @NotNull(message = "Preferred term is required")
        @Positive(message = "Preferred term must be positive")
        Integer preferredTermYears,

        String preferredInsuranceType

) {}