
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Calendar,
  IndianRupee,
  ArrowLeft,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function PolicyRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [termYears, setTermYears] = useState(
    product?.minTermYears ?? 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

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
                Review your selected insurance product and choose
                your preferred policy term.
              </p>
            </div>

            <div className="registration-grid">
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

              <section className="registration-form-card">
                <h2>Policy Details</h2>
                <p className="registration-subtitle">
                  Select your preferred policy duration.
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
                      onChange={(e) => setTermYears(e.target.value)}
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

                  <div className="registration-note">
                    <IndianRupee size={19} />
                    <div>
                      <strong>Premium calculation</strong>
                      <span>
                        Total premium and installment schedule will be
                        calculated by the server.
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="error-message">{error}</div>
                  )}

                  <button
                    type="submit"
                    className="auth-submit"
                    disabled={
                      loading ||
                      !Number.isInteger(Number(termYears)) ||
                      Number(termYears) < product.minTermYears ||
                      Number(termYears) > product.maxTermYears
                    }
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="spin" size={17} />
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
                <strong>{result.startDate}</strong>
              </div>

              <div>
                <span>Maturity date</span>
                <strong>{result.maturityDate}</strong>
              </div>

              <div>
                <span>Premium amount</span>
                <strong>{formatCurrency(result.premiumAmount)}</strong>
              </div>

              <div>
                <span>Total premium</span>
                <strong>{formatCurrency(result.totalPremium)}</strong>
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
