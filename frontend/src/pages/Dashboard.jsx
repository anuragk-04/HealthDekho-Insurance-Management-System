
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Package,
  Sparkles,
  LogOut,
  User,
  HeartPulse,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState(
    window.location.hash.replace("#", "") || "overview"
  );

  useEffect(() => {
    const updateActiveSection = () => {
      setActiveSection(
        window.location.hash.replace("#", "") || "overview"
      );
    };

    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError("");

      const [
        profileResponse,
        policiesResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/customers/me"),
        api.get("/customers/me/policies"),
        api.get("/customers/me/available-products"),
      ]);

      setCustomer(profileResponse.data);
      setPolicies(policiesResponse.data);
      setProducts(productsResponse.data);
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

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatType = (type) =>
    type?.replaceAll("_", " ") || "—";

  const registerProduct = (product) => {
    navigate("/policies/register", {
      state: { product },
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin" size={28} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <ShieldCheck size={30} />
          <span>HealthDekho</span>
        </div>

        <div className="sidebar-label">MENU</div>

        <nav className="sidebar-nav">
          <a
            href="#overview"
            className={`sidebar-link ${
              activeSection === "overview" ? "active" : ""
            }`}
          >
            <LayoutDashboard size={19} />
            Overview
          </a>

          <a
            href="#policies"
            className={`sidebar-link ${
              activeSection === "policies" ? "active" : ""
            }`}
          >
            <FileText size={19} />
            My Policies
          </a>

          <a
            href="#products"
            className={`sidebar-link ${
              activeSection === "products" ? "active" : ""
            }`}
          >
            <Package size={19} />
            Insurance Products
          </a>

          <Link to="/recommendations" className="sidebar-link">
            <Sparkles size={19} />
            AI Recommendations
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              CUSTOMER PORTAL
            </span>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              <User size={21} />
            </div>

            <div>
              <strong>{customer?.fullName}</strong>
              <span>{customer?.email}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-message dashboard-error">
            {error}
            <button onClick={fetchDashboardData}>Retry</button>
          </div>
        )}

        {!error && (
          <>
            <section className="welcome-banner">
              <div>
                <span>WELCOME TO HEALTHDEKHO</span>
                <h2>
                  Hello, {customer?.fullName?.split(" ")[0]}!
                </h2>
                <p>
                  Manage your insurance coverage and explore plans
                  designed around your needs.
                </p>
              </div>

              <div className="welcome-icon">
                <HeartPulse size={54} />
              </div>
            </section>

            <section className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon teal">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <span>Registered Policies</span>
                  <h3>{policies.length}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  <Package size={23} />
                </div>
                <div>
                  <span>Available Products</span>
                  <h3>{products.length}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <Sparkles size={23} />
                </div>
                <div>
                  <span>AI Recommendations</span>
                  <h3>Explore</h3>
                </div>
              </div>
            </section>

            {/* FR-1: Registered Policies Table */}
            <section
              className="dashboard-section"
              id="policies"
            >
              <div className="section-heading">
                <div>
                  <h2>My Insurance Policies</h2>
                  <p>Your registered insurance coverage</p>
                </div>
              </div>

              {policies.length === 0 ? (
                <div className="empty-state">
                  <FileText size={35} />
                  <h3>No policies registered yet</h3>
                  <p>
                    Explore available insurance products to get started.
                  </p>
                </div>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Policy Identifier</th>
                        <th>Policy Name</th>
                        <th>Policy Type</th>
                        <th>Policy Term</th>
                        <th>Start Date</th>
                        <th>Maturity Date</th>
                        <th>Premium Frequency</th>
                        <th>Premium Amount</th>
                        <th>Sum Insured</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {policies.map((policy) => (
                        <tr key={policy.id}>
                          <td className="table-code">
                            {policy.policyNumber || "—"}
                          </td>
                          <td className="table-primary">
                            {policy.productName || "—"}
                          </td>
                          <td>
                            {formatType(
                              policy.insuranceType || policy.productType
                            )}
                          </td>
                          <td>
                            {policy.termYears
                                ? `${policy.termYears} ${policy.termYears === 1 ? "year" : "years"}`
                                : "—"}
                          </td>
                          <td>{formatDate(policy.startDate)}</td>
                          <td>{formatDate(policy.maturityDate)}</td>
                          <td>
                            {policy.premiumFrequency || "—"}
                          </td>
                          <td className="table-amount">
                            {formatCurrency(policy.premiumAmount)}
                          </td>
                          <td className="table-amount">
                            {formatCurrency(policy.sumInsured)}
                          </td>
                          <td>
                            <span className="status-badge">
                              {policy.status || "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* FR-1: Available Insurance Products Table */}
            <section
              className="dashboard-section"
              id="products"
            >
              <div className="section-heading">
                <div>
                  <h2>Available Insurance Products</h2>
                  <p>
                    Explore products you haven't registered for
                  </p>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="empty-state">
                  <Package size={35} />
                  <h3>No new products available</h3>
                  <p>
                    You're already registered for all available products.
                  </p>
                </div>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Product Code</th>
                        <th>Policy Name</th>
                        <th>Policy Type</th>
                        <th>Policy Term</th>
                        <th>Sum Insured</th>
                        <th>Premium Frequency</th>
                        <th>Premium Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="table-code">
                            {product.productCode || "—"}
                          </td>
                          <td className="table-primary">
                            {product.productName || "—"}
                          </td>
                          <td>
                            {formatType(product.insuranceType)}
                          </td>
                          <td>
                            {product.minTermYears}–{product.maxTermYears} years
                          </td>
                          <td className="table-amount">
                            {formatCurrency(product.sumInsured)}
                          </td>
                          <td>
                            {product.premiumFrequency || "—"}
                          </td>
                          <td className="table-amount">
                            {formatCurrency(product.premiumAmount)}
                          </td>
                          <td>
                            <button
                              className="table-register-button"
                              onClick={() => registerProduct(product)}
                            >
                              Register
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section
              className="ai-promo"
              id="recommendations"
            >
              <div className="ai-promo-icon">
                <Sparkles size={30} />
              </div>

              <div>
                <h2>Find the right insurance with AI</h2>
                <p>
                  Get personalized insurance recommendations based
                  on your age, goals and preferences.
                </p>
              </div>

              <button
                onClick={() => navigate("/recommendations")}
                className="ai-promo-button"
              >
                Get Recommendations
              </button>
            </section>

            <footer className="dashboard-footer">
              © 2026 HealthDekho. All rights reserved.
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
