
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
  Calendar,
  IndianRupee,
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

  // Track the currently selected dashboard section
  const [activeSection, setActiveSection] = useState(
    window.location.hash.replace("#", "") || "overview"
  );

  // Update active sidebar item when the URL hash changes
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

          <Link
            to="/recommendations"
            className="sidebar-link"
          >
            <Sparkles size={19} />
            AI Recommendations
          </Link>
        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
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
                <div className="policy-grid">
                  {policies.map((policy) => (
                    <div
                      className="policy-card"
                      key={policy.id}
                    >
                      <div className="policy-card-top">
                        <div className="product-icon">
                          <ShieldCheck size={23} />
                        </div>

                        <span className="status-badge">
                          {policy.status}
                        </span>
                      </div>

                      <h3>{policy.productName}</h3>

                      <span className="policy-number">
                        {policy.policyNumber}
                      </span>

                      <div className="policy-details">
                        <div>
                          <span>Sum insured</span>
                          <strong>
                            {formatCurrency(policy.sumInsured)}
                          </strong>
                        </div>

                        <div>
                          <span>Premium</span>
                          <strong>
                            {formatCurrency(policy.premiumAmount)} /{" "}
                            {policy.premiumFrequency}
                          </strong>
                        </div>

                        <div>
                          <span>Start date</span>
                          <strong>
                            {formatDate(policy.startDate)}
                          </strong>
                        </div>

                        <div>
                          <span>Maturity date</span>
                          <strong>
                            {formatDate(policy.maturityDate)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

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
                <div className="product-grid">
                  {products.map((product) => (
                    <div
                      className="available-product-card"
                      key={product.id}
                    >
                      <div className="product-card-icon">
                        <HeartPulse size={25} />
                      </div>

                      <span className="product-type">
                        {product.insuranceType?.replaceAll("_", " ")}
                      </span>

                      <h3>{product.productName}</h3>
                      <p>{product.description}</p>

                      <div className="product-info">
                        <div>
                          <span>Premium</span>
                          <strong>
                            {formatCurrency(product.premiumAmount)}
                          </strong>
                        </div>

                        <div>
                          <span>Sum insured</span>
                          <strong>
                            {formatCurrency(product.sumInsured)}
                          </strong>
                        </div>
                      </div>

                      <div className="product-term">
                        <Calendar size={15} />
                        {product.minTermYears}–{product.maxTermYears} years
                      </div>

                      <button
                        className="register-product-button"
                        onClick={() =>
                          navigate("/policies/register", {
                            state: { product },
                          })
                        }
                      >
                        Register Now
                      </button>
                    </div>
                  ))}
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
