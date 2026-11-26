
package com.healthdekho.backend.config;

import com.healthdekho.backend.entity.InsuranceProduct;
import com.healthdekho.backend.repository.InsuranceProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;

@Configuration
@Profile("!prod")
public class DataSeeder {

    @Bean
    CommandLineRunner seedInsuranceProducts(
            InsuranceProductRepository productRepository) {

        return args -> {

            if (productRepository.count() > 0) {
                System.out.println("Insurance products already exist. Skipping seed.");
                return;
            }

            InsuranceProduct termLife = new InsuranceProduct();
            termLife.setProductCode("TERM-001");
            termLife.setProductName("Secure Life Term Plan");
            termLife.setInsuranceType("TERM_LIFE");
            termLife.setDescription("Term life insurance offering financial protection to your family.");
            termLife.setMinAge(18);
            termLife.setMaxAge(60);
            termLife.setMinTermYears(10);
            termLife.setMaxTermYears(40);
            termLife.setPremiumAmount(new BigDecimal("12000.00"));
            termLife.setPremiumFrequency("YEARLY");
            termLife.setSumInsured(new BigDecimal("5000000.00"));
            termLife.setActive(true);

            InsuranceProduct health = new InsuranceProduct();
            health.setProductCode("HEALTH-001");
            health.setProductName("Family Health Protect");
            health.setInsuranceType("HEALTH");
            health.setDescription("Health insurance coverage for medical expenses.");
            health.setMinAge(18);
            health.setMaxAge(65);
            health.setMinTermYears(1);
            health.setMaxTermYears(5);
            health.setPremiumAmount(new BigDecimal("8000.00"));
            health.setPremiumFrequency("YEARLY");
            health.setSumInsured(new BigDecimal("1000000.00"));
            health.setActive(true);

            InsuranceProduct retirement = new InsuranceProduct();
            retirement.setProductCode("RETIRE-001");
            retirement.setProductName("Golden Retirement Plan");
            retirement.setInsuranceType("RETIREMENT");
            retirement.setDescription("Long-term savings plan designed to support retirement goals.");
            retirement.setMinAge(25);
            retirement.setMaxAge(55);
            retirement.setMinTermYears(10);
            retirement.setMaxTermYears(30);
            retirement.setPremiumAmount(new BigDecimal("20000.00"));
            retirement.setPremiumFrequency("YEARLY");
            retirement.setSumInsured(new BigDecimal("2000000.00"));
            retirement.setActive(true);

            productRepository.save(termLife);
            productRepository.save(health);
            productRepository.save(retirement);

            System.out.println("Sample insurance products inserted successfully.");
        };
    }
}
