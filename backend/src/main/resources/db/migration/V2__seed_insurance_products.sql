
-- =====================================================
-- HealthDekho V2: Seed insurance products
-- =====================================================

INSERT INTO insurance_products (
    product_code,
    product_name,
    insurance_type,
    description,
    min_age,
    max_age,
    min_term_years,
    max_term_years,
    premium_amount,
    premium_frequency,
    sum_insured,
    active
)
VALUES
(
    'TERM-001',
    'Secure Life Term Plan',
    'TERM_LIFE',
    'Term life insurance offering financial protection to your family.',
    18,
    60,
    10,
    40,
    12000.00,
    'YEARLY',
    5000000.00,
    TRUE
),
(
    'HEALTH-001',
    'Family Health Protect',
    'HEALTH',
    'Health insurance coverage for medical expenses.',
    18,
    65,
    1,
    5,
    8000.00,
    'YEARLY',
    1000000.00,
    TRUE
),
(
    'RETIRE-001',
    'Golden Retirement Plan',
    'RETIREMENT',
    'Long-term savings plan designed to support retirement goals.',
    25,
    55,
    10,
    30,
    20000.00,
    'YEARLY',
    2000000.00,
    TRUE
);
