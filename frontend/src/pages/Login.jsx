
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, HeartPulse } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("customer", JSON.stringify(response.data));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-brand-panel">
        <div className="brand-logo">
          <ShieldCheck size={32} />
          <span>HealthDekho</span>
        </div>

        <div className="brand-content">
          <div className="brand-icon">
            <HeartPulse size={42} />
          </div>

          <h1>Your health deserves better protection.</h1>

          <p>
            Discover insurance plans, manage your policies, and get
            AI-powered recommendations — all in one place.
          </p>

          <div className="brand-features">
            <div>✓ Smart insurance recommendations</div>
            <div>✓ Simple policy management</div>
            <div>✓ Secure customer dashboard</div>
          </div>
        </div>

        <p className="brand-footer">
          © 2026 HealthDekho. All rights reserved.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="mobile-logo">
            <ShieldCheck size={28} />
            <span>HealthDekho</span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </div>

          <div className="security-note">
            <ShieldCheck size={16} />
            Your information is protected with secure authentication.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
