
package com.healthdekho.backend.repository;

import com.healthdekho.backend.entity.AIRecommendationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIRecommendationRequestRepository
        extends JpaRepository<AIRecommendationRequest, Long> {

    List<AIRecommendationRequest> findByCustomer_IdOrderByCreatedAtDesc(
            Long customerId
    );
}
