
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

function Recommendations() {
  const navigate = useNavigate();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [goalsAndPreferences, setGoalsAndPreferences] = useState("");
  const [preferredTermYears, setPreferredTermYears] = useState("10");
  const [preferredInsuranceType, setPreferredInsuranceType] = useState("");

  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [requestId, setRequestId] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        const [profileResponse, productsResponse] = await Promise.all([
          api.get("/customers/me"),
          api.get("/customers/me/available-products"),
        ]);

        setDateOfBirth(profileResponse.data.dateOfBirth || "");
        setProducts(productsResponse.data || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadCustomerData();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setRecommendations([]);
    setRequestId(null);
    setLoadingRecommendations(true);

    try {
      const response = await api.post("/ai/recommendations", {
        dateOfBirth,
        goalsAndPreferences,
        preferredTermYears: Number(preferredTermYears),
        preferredInsuranceType: preferredInsuranceType || null,
      });

      setRequestId(response.data.recommendationRequestId);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to generate recommendations. Please try again."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const getProductDetails = (recommendedProduct) =>
    products.find(
      (product) =>
        String(product.id) === String(recommendedProduct.productId)
    );

  const handleExplore = (recommendedProduct) => {
    const selectedProduct = getProductDetails(recommendedProduct);

    if (!selectedProduct) {
      setError(
        "This product is no longer available. Please refresh the page."
      );
      return;
    }

    navigate("/products/details", {
      state: {
        product: selectedProduct,
        recommendation: {
          rationale: recommendedProduct.rationale,
          suitability: recommendedProduct.suitability,
        },
      },
    });
  };

  const formatCurrency = (amount) =>
    amount == null
      ? "—"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amount);

  const formatType = (type) =>
    type?.replaceAll("_", " ") || "—";

  if (loadingProfile) {
    return (
      <div className="dashboard-loading">
        <LoaderCircle className="spin" size={28} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-container">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <header className="recommendations-header">
          <div className="recommendations-heading-icon">
            <Sparkles size={30} />
          </div>

          <span className="dashboard-eyebrow">
            POWERED BY AWS BEDROCK
          </span>

          <h1>AI Insurance Recommendations</h1>

          <p>
            Tell us about your insurance goals and let AI help you
            explore suitable products from HealthDekho.
          </p>
        </header>

        <section className="recommendation-form-card">
          <h2>Tell us your requirements</h2>

          <p className="recommendation-form-subtitle">
            Your information helps us identify relevant insurance products.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="recommendation-form-grid">
              <div className="form-group">
                <label htmlFor="recommendationDob">
                  Date of birth
                </label>

                <input
                  id="recommendationDob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredTerm">
                  Preferred term (years)
                </label>

                <input
                  id="preferredTerm"
                  type="number"
                  min="1"
                  max="50"
                  value={preferredTermYears}
                  onChange={(event) =>
                    setPreferredTermYears(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group recommendation-type-field">
                <label htmlFor="insuranceType">
                  Preferred insurance type
                </label>

                <select
                  id="insuranceType"
                  value={preferredInsuranceType}
                  onChange={(event) =>
                    setPreferredInsuranceType(event.target.value)
                  }
                >
                  <option value="">No preference</option>
                  <option value="TERM_LIFE">Term Life</option>
                  <option value="HEALTH">Health</option>
                  <option value="RETIREMENT">Retirement</option>
                </select>
              </div>

              <div className="form-group recommendation-goals-field">
                <label htmlFor="goals">
                  Goals and preferences
                </label>

                <textarea
                  id="goals"
                  rows="5"
                  maxLength="1000"
                  placeholder="Example: I want affordable health insurance for myself and my family..."
                  value={goalsAndPreferences}
                  onChange={(event) =>
                    setGoalsAndPreferences(event.target.value)
                  }
                  required
                />

                <span className="field-hint">
                  {goalsAndPreferences.length}/1000 characters
                </span>
              </div>
            </div>

            {error && (
              <div className="error-message recommendation-error">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit recommendation-submit"
              disabled={
                loadingRecommendations ||
                !dateOfBirth ||
                !goalsAndPreferences.trim() ||
                !Number.isInteger(Number(preferredTermYears)) ||
                Number(preferredTermYears) <= 0
              }
            >
              {loadingRecommendations ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Generating recommendations...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Get AI Recommendations
                </>
              )}
            </button>
          </form>
        </section>

        {requestId && (
          <section className="recommendation-results">
            <div className="recommendation-results-heading">
              <div>
                <span className="dashboard-eyebrow">
                  AI ANALYSIS COMPLETE
                </span>

                <h2>Your Recommended Products</h2>

                <p>Recommendation request #{requestId}</p>
              </div>

              <CheckCircle size={30} />
            </div>

            {recommendations.length === 0 ? (
              <div className="empty-state">
                <ShieldCheck size={35} />

                <h3>No suitable products found</h3>

                <p>
                  Try changing your preferred term or insurance
                  requirements.
                </p>
              </div>
            ) : (
              <div className="recommendation-table-wrapper">
                <table className="recommendation-table">
                  <thead>
                    <tr>
                      <th>Product Code</th>
                      <th>Policy Name</th>
                      <th>Policy Type</th>
                      <th>Policy Term</th>
                      <th>Sum Insured</th>
                      <th>Premium Frequency</th>
                      <th>Premium Amount</th>
                      <th>AI Rationale</th>
                      <th>Suitability</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recommendations.map((item) => {
                      const product = getProductDetails(item);

                      return (
                        <tr key={item.productId}>
                          <td className="recommendation-code">
                            {item.productCode || "—"}
                          </td>

                          <td className="recommendation-name">
                            {item.productName || "—"}
                          </td>

                          <td>
                            {formatType(item.insuranceType)}
                          </td>

                          <td>
                            {preferredTermYears
                              ? `${preferredTermYears} ${
                                  Number(preferredTermYears) === 1
                                    ? "year"
                                    : "years"
                                }`
                              : "—"}
                          </td>

                          <td className="recommendation-amount">
                            {formatCurrency(product?.sumInsured)}
                          </td>

                          <td>
                            {product?.premiumFrequency || "—"}
                          </td>

                          <td className="recommendation-amount">
                            {formatCurrency(product?.premiumAmount)}
                          </td>

                          <td className="recommendation-rationale-cell">
                            {item.rationale || "—"}
                          </td>

                          <td>
                            <span className="recommendation-suitability">
                              {item.suitability || "—"}
                            </span>
                          </td>

                          <td>
                            <button
                              className="table-register-button"
                              onClick={() => handleExplore(item)}
                              disabled={!product}
                            >
                              Explore
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <footer className="dashboard-footer">
          AI recommendations are informational and do not replace
          professional insurance advice.
        </footer>
      </div>
    </div>
  );
}

export default Recommendations;
