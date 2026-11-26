
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Calendar,
  IndianRupee,
  ArrowLeft,
  CheckCircle,
  LoaderCircle,
  User,
  Clock,
} from "lucide-react";
import api from "../services/api";

function PolicyRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [customer, setCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  const [termYears, setTermYears] = useState(
    product?.minTermYears ?? 1
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/customers/me");
        setCustomer(response.data);
      } catch (err) {
        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("customer");
          navigate("/login");
          return;
        }

        setError("Unable to load customer information.");
      } finally {
        setLoadingCustomer(false);
      }
    };

    loadCustomer();
  }, [navigate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const frequencyMonths = {
    MONTHLY: 1,
    QUARTERLY: 3,
    HALF_YEARLY: 6,
    YEARLY: 12,
  };

  const normalizedFrequency = product?.premiumFrequency
    ?.toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  const monthsBetweenInstallments =
    frequencyMonths[normalizedFrequency];

  const validTerm =
    Number.isInteger(Number(termYears)) &&
    Number(termYears) >= product?.minTermYears &&
    Number(termYears) <= product?.maxTermYears;

  const premiumPreview = useMemo(() => {
    if (
      !product ||
      !monthsBetweenInstallments ||
      !validTerm ||
      Number(product.premiumAmount) <= 0
    ) {
      return null;
    }

    const totalMonths = Number(termYears) * 12;

    if (totalMonths % monthsBetweenInstallments !== 0) {
      return null;
    }

    const installmentCount =
      totalMonths / monthsBetweenInstallments;

    const totalPremium =
      Number(product.premiumAmount) * installmentCount;

    return {
      installmentCount,
      totalPremium,
    };
  }, [
    product,
    termYears,
    monthsBetweenInstallments,
    validTerm,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post("/policies/register", {
        productId: product.id,
        termYears: Number(termYears),
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register this policy. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="registration-page">
        <div className="registration-card">
          <h2>No insurance product selected</h2>
          <p>Please select an insurance product before registering.</p>

          <button
            className="primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loadingCustomer) {
    return (
      <div className="dashboard-loading">
        <LoaderCircle className="spin" size={28} />
        <p>Loading registration details...</p>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {!result ? (
          <>
            <div className="registration-heading">
              <span className="dashboard-eyebrow">
                INSURANCE ENROLLMENT
              </span>

              <h1>Register Your Policy</h1>

              <p>
                Review your customer details, selected product and
                premium breakdown before registration.
              </p>
            </div>

            {/* Customer Information */}
            <section className="registration-info-card">
              <div className="registration-section-title">
                <User size={21} />
                <div>
                  <h2>Customer Information</h2>
                  <p>Automatically retrieved from your profile</p>
                </div>
              </div>

              <div className="registration-product-details">
                <div>
                  <span>Customer name</span>
                  <strong>{customer?.fullName || "—"}</strong>
                </div>

                <div>
                  <span>Date of birth</span>
                  <strong>
                    {formatDate(customer?.dateOfBirth)}
                  </strong>
                </div>

                <div>
                  <span>Email address</span>
                  <strong>{customer?.email || "—"}</strong>
                </div>

                <div>
                  <span>Contact information</span>
                  <strong>
                    {customer?.phoneNumber ||
                      customer?.phone ||
                      customer?.contactNumber ||
                      "Not available"}
                  </strong>
                </div>
              </div>
            </section>

            <div className="registration-grid">
              {/* Selected Product */}
              <section className="registration-product">
                <div className="registration-product-icon">
                  <ShieldCheck size={30} />
                </div>

                <span className="product-type">
                  {product.insuranceType?.replaceAll("_", " ")}
                </span>

                <h2>{product.productName}</h2>

                <p>{product.description}</p>

                <div className="registration-product-details">
                  <div>
                    <span>Product code</span>
                    <strong>{product.productCode}</strong>
                  </div>

                  <div>
                    <span>Premium amount</span>
                    <strong>
                      {formatCurrency(product.premiumAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Premium frequency</span>
                    <strong>{product.premiumFrequency}</strong>
                  </div>

                  <div>
                    <span>Sum insured</span>
                    <strong>
                      {formatCurrency(product.sumInsured)}
                    </strong>
                  </div>

                  <div>
                    <span>Eligible age</span>
                    <strong>
                      {product.minAge}–{product.maxAge} years
                    </strong>
                  </div>

                  <div>
                    <span>Available term</span>
                    <strong>
                      {product.minTermYears}–{product.maxTermYears} years
                    </strong>
                  </div>
                </div>
              </section>

              {/* Registration Form */}
              <section className="registration-form-card">
                <h2>Policy Details</h2>

                <p className="registration-subtitle">
                  Select your policy duration.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="termYears">
                      Policy term (years)
                    </label>

                    <input
                      id="termYears"
                      type="number"
                      min={product.minTermYears}
                      max={product.maxTermYears}
                      step="1"
                      value={termYears}
                      onChange={(e) =>
                        setTermYears(e.target.value)
                      }
                      required
                    />

                    <span className="field-hint">
                      Choose between {product.minTermYears} and{" "}
                      {product.maxTermYears} years.
                    </span>
                  </div>

                  <div className="registration-note">
                    <Calendar size={19} />

                    <div>
                      <strong>Policy start date</strong>
                      <span>
                        Your policy will start on the registration date.
                      </span>
                    </div>
                  </div>

                  {/* Premium Breakdown */}
                  <div className="premium-breakdown">
                    <div className="premium-breakdown-heading">
                      <IndianRupee size={20} />
                      <h3>Premium Breakdown</h3>
                    </div>

                    <div className="premium-breakdown-row">
                      <span>Payment frequency</span>
                      <strong>
                        {product.premiumFrequency}
                      </strong>
                    </div>

                    <div className="premium-breakdown-row">
                      <span>Premium per installment</span>
                      <strong>
                        {formatCurrency(product.premiumAmount)}
                      </strong>
                    </div>

                    <div className="premium-breakdown-row">
                      <span>Number of installments</span>
                      <strong>
                        {premiumPreview?.installmentCount ?? "—"}
                      </strong>
                    </div>

                    <div className="premium-breakdown-row">
                      <span>Policy duration</span>
                      <strong>
                        {termYears || "—"} years
                      </strong>
                    </div>

                    <div className="premium-breakdown-total">
                      <span>Total Premium Payable</span>
                      <strong>
                        {premiumPreview
                          ? formatCurrency(premiumPreview.totalPremium)
                          : "—"}
                      </strong>
                    </div>

                    <p className="premium-breakdown-hint">
                      Calculated using the product's configured
                      payment frequency and premium amount.
                      Final values are calculated and validated by
                      the server.
                    </p>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  {!monthsBetweenInstallments && (
                    <div className="error-message">
                      The configured premium frequency is not supported.
                      Please contact support.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="auth-submit"
                    disabled={
                      loading ||
                      !validTerm ||
                      !premiumPreview ||
                      !customer
                    }
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          className="spin"
                          size={17}
                        />
                        Registering...
                      </>
                    ) : (
                      "Confirm Policy Registration"
                    )}
                  </button>
                </form>
              </section>
            </div>
          </>
        ) : (
          <div className="registration-success">
            <div className="success-icon">
              <CheckCircle size={42} />
            </div>

            <span className="dashboard-eyebrow">
              REGISTRATION COMPLETE
            </span>

            <h1>Policy Registered Successfully!</h1>

            <p>
              Your insurance policy has been created and saved.
            </p>

            <div className="registration-result">
              <div>
                <span>Policy number</span>
                <strong>{result.policyNumber}</strong>
              </div>

              <div>
                <span>Product</span>
                <strong>{result.productName}</strong>
              </div>

              <div>
                <span>Policy term</span>
                <strong>{result.termYears} years</strong>
              </div>

              <div>
                <span>Start date</span>
                <strong>{formatDate(result.startDate)}</strong>
              </div>

              <div>
                <span>Maturity date</span>
                <strong>{formatDate(result.maturityDate)}</strong>
              </div>

              <div>
                <span>Premium frequency</span>
                <strong>{product.premiumFrequency}</strong>
              </div>

              <div>
                <span>Premium per installment</span>
                <strong>
                  {formatCurrency(result.premiumAmount)}
                </strong>
              </div>

              <div>
                <span>Total premium payable</span>
                <strong>
                  {formatCurrency(result.totalPremium)}
                </strong>
              </div>

              <div>
                <span>Installments generated</span>
                <strong>{result.totalInstallments}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{result.status}</strong>
              </div>
            </div>

            <div className="registration-note">
              <Clock size={19} />
              <div>
                <strong>Installment schedule generated</strong>
                <span>
                  Your installment schedule has been saved with your
                  registered policy.
                </span>
              </div>
            </div>

            <button
              className="auth-submit"
              onClick={() => navigate("/dashboard")}
            >
              Go to My Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PolicyRegistration;
