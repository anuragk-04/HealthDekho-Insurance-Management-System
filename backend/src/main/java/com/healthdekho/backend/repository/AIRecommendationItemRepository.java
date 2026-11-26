
package com.healthdekho.backend.repository;

import com.healthdekho.backend.entity.AIRecommendationItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIRecommendationItemRepository
        extends JpaRepository<AIRecommendationItem, Long> {

    List<AIRecommendationItem> findByRecommendationRequest_Id(
            Long recommendationRequestId
    );
}
