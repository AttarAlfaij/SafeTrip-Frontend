import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title =
      activeTab === "login"
        ? "Sign In | Safe Trip Planner"
        : "Create Account | Safe Trip Planner";
  }, [activeTab]);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/plan-trip", { replace: true });
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setErrorMessage(decodeURIComponent(urlError));
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }
    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!formData.password) {
      return "Please enter your password.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (activeTab === "signup") {
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const clientValidationError = validate();
    if (clientValidationError) {
      setErrorMessage(clientValidationError);
      return;
    }

    setSubmitting(true);
    try {
      if (activeTab === "login") {
        await login(formData.email.trim(), formData.password);
        setSuccessMessage("Signed in successfully! Redirecting...");
        navigate("/plan-trip", { replace: true });
      } else {
        await register(
          formData.email.trim(),
          formData.password,
          formData.name.trim() || undefined
        );
        setSuccessMessage("Account created successfully! Redirecting...");
        navigate("/plan-trip", { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err.message || "An error occurred during authentication."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="auth-card modern-auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/" className="auth-logo-pill">
            <span className="auth-logo-dot" />
            Safe Trip Planner
          </Link>
          <h1 className="auth-main-title">
            {activeTab === "login" ? "Welcome back" : "Get started with Safe Trip"}
          </h1>
          <p className="auth-main-sub">
            {activeTab === "login"
              ? "Sign in to access your saved trips and personalized itineraries."
              : "Create an account to start planning and saving smart, safe trips."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login"}
            className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabSwitch("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "signup"}
            className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => handleTabSwitch("signup")}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="auth-alert auth-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="auth-alert auth-alert-success" role="status">
            <span className="alert-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {activeTab === "signup" && (
            <div className="form-group">
              <label htmlFor="auth-name" className="form-label">
                Full Name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email Address
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-with-action">
              <label htmlFor="auth-password" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={activeTab === "login" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          {activeTab === "signup" && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="submitting-spinner">
                <span className="spinner-dot" /> Processing...
              </span>
            ) : activeTab === "login" ? (
              "Sign In with Email"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="auth-card-footer">
          {activeTab === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-link-button"
                onClick={() => handleTabSwitch("signup")}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-button"
                onClick={() => handleTabSwitch("login")}
              >
                Sign in
              </button>
            </p>
          )}
          <div className="back-home-link-wrap">
            <Link to="/" className="back-home-link">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
