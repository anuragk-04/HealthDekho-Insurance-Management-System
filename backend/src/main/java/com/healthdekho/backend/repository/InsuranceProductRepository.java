
package com.healthdekho.backend.repository;

import com.healthdekho.backend.entity.InsuranceProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InsuranceProductRepository
        extends JpaRepository<InsuranceProduct, Long> {

    List<InsuranceProduct> findByActiveTrue();

    Optional<InsuranceProduct> findByProductCode(String productCode);

    boolean existsByProductCode(String productCode);
}
