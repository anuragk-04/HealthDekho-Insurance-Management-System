
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, UserPlus } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new Date(formData.dateOfBirth) >= new Date()) {
      setError("Please enter a valid date of birth.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("customer", JSON.stringify(response.data));

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create your account. Please check your details."
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
            <UserPlus size={42} />
          </div>

          <h1>Start your journey towards a healthier future.</h1>

          <p>
            Create your account to explore insurance plans,
            manage your coverage and receive personalized
            AI-powered recommendations.
          </p>

          <div className="brand-features">
            <div>✓ Easy and secure registration</div>
            <div>✓ Personalized insurance plans</div>
            <div>✓ All your policies in one place</div>
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
            <span className="eyebrow">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Enter your details to register with HealthDekho.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email address</label>
              <input
                id="registerEmail"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>

              <div className="password-wrapper">
                <input
                  id="registerPassword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={72}
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

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of birth</label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={15}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && (
              <div className="success-message">{success}</div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
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

export default Register;
