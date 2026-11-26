
package com.healthdekho.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PolicyRegistrationRequest(

        @NotNull
        Long productId,

        @Positive
        int termYears

) {}
