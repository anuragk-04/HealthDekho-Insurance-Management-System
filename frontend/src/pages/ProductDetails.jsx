
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CalendarDays,
  IndianRupee,
  UserCheck,
  Sparkles,
} from "lucide-react";

const frequencyMonths = {
  MONTHLY: 1,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12,
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount ?? 0);

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const recommendation = location.state?.recommendation;

  const [unused] = [];

  const defaultTerm = product?.minTermYears ?? 1;
  const termYears = defaultTerm;

  const premiumDetails = useMemo(() => {
    if (!product) return null;

    const interval = frequencyMonths[product.premiumFrequency];
    if (!interval || !Number.isFinite(Number(product.premiumAmount))) {
      return null;
    }

    const totalMonths = Number(termYears) * 12;
    const count = totalMonths / interval;

    if (!Number.isInteger(count)) return null;

    return {
      count,
      total: Number(product.premiumAmount) * count,
    };
  }, [product, termYears]);

  if (!product) {
    return (
      <div className="product-details-page">
        <button onClick={() => navigate("/dashboard")} className="back-link">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <h2>Product details unavailable</h2>
        <p>Please return to the dashboard and select a product again.</p>
      </div>
    );
  }

  const handleRegistration = () => {
    navigate("/policies/register", {
      state: { product },
    });
  };

  return (
    <div className="product-details-page">
      <button
        onClick={() => navigate(-1)}
        className="back-link"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="product-details-heading">
        <span className="section-eyebrow">INSURANCE PLAN DETAILS</span>
        <h1>Explore Your Insurance Plan</h1>
        <p>Review the plan benefits, eligibility and premium details before registration.</p>
      </div>

      <div className="product-details-layout">
        <section className="product-details-card">
          <div className="product-details-icon">
            <ShieldCheck size={30} />
          </div>

          <span className="product-type-badge">
            {product.insuranceType?.replaceAll("_", " ")}
          </span>

          <h2>{product.productName}</h2>
          <p>{product.description || "Insurance plan designed to support your financial protection needs."}</p>

          <div className="product-details-divider" />

          <div className="product-facts-grid">
            <div>
              <span>Product code</span>
              <strong>{product.productCode}</strong>
            </div>
            <div>
              <span>Sum insured</span>
              <strong>{formatCurrency(product.sumInsured)}</strong>
            </div>
            <div>
              <span>Premium per installment</span>
              <strong>{formatCurrency(product.premiumAmount)}</strong>
            </div>
            <div>
              <span>Premium frequency</span>
              <strong>{product.premiumFrequency}</strong>
            </div>
            <div>
              <span>Eligible age</span>
              <strong>{product.minAge}–{product.maxAge} years</strong>
            </div>
            <div>
              <span>Available policy term</span>
              <strong>{product.minTermYears}–{product.maxTermYears} years</strong>
            </div>
          </div>

          {recommendation && (
            <div className="recommendation-detail-box">
              <h3><Sparkles size={18} /> AI Recommendation</h3>
              <p>{recommendation.rationale}</p>
              <strong>Suitability: {recommendation.suitability}</strong>
            </div>
          )}
        </section>

        <section className="product-premium-card">
          <h2>Premium Overview</h2>
          <p>Based on the product's configured premium frequency and minimum policy term.</p>

          <div className="premium-detail-row">
            <span>Policy term</span>
            <strong>{termYears} years</strong>
          </div>
          <div className="premium-detail-row">
            <span>Payment frequency</span>
            <strong>{product.premiumFrequency}</strong>
          </div>
          <div className="premium-detail-row">
            <span>Premium per installment</span>
            <strong>{formatCurrency(product.premiumAmount)}</strong>
          </div>
          <div className="premium-detail-row">
            <span>Number of installments</span>
            <strong>{premiumDetails?.count ?? "—"}</strong>
          </div>

          <div className="premium-total-row">
            <span>Total premium payable</span>
            <strong>
              {premiumDetails
                ? formatCurrency(premiumDetails.total)
                : "Unavailable"}
            </strong>
          </div>

          <p className="premium-note">
            The final premium and installment schedule will be calculated and validated by the server during registration.
          </p>

          <button
            className="product-proceed-button"
            onClick={handleRegistration}
          >
            Proceed to Registration
          </button>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;
