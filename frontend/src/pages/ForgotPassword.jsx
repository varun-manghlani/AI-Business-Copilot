import { useState } from "react";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import "../styles/ForgotPassword.css";

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to process password reset request.",
        );
      }

      if (data.development_token) {
        toast.success("Password reset link generated.");

        window.location.href = `/reset-password?token=${encodeURIComponent(
          data.development_token,
        )}`;

        return;
      }

      setSubmitted(true);

      toast.success(
        "If an account exists for this email, you will receive reset instructions.",
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleForgotPassword();
  }

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-logo-wrapper">
          <img src={logo} alt="AI Business Copilot" className="forgot-logo" />
        </div>

        {!submitted ? (
          <>
            <h1 className="forgot-title">Forgot Password?</h1>

            <p className="forgot-subtitle">
              Enter your email address and we'll help you reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="forgot-label" htmlFor="forgot-email">
                Email Address
              </label>

              <input
                id="forgot-email"
                className="forgot-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                className="forgot-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <button
              type="button"
              className="back-login-button"
              onClick={onBackToLogin}
            >
              ← Back to Sign In
            </button>
          </>
        ) : (
          <div className="forgot-success">
            <div className="success-icon">✓</div>

            <h1 className="forgot-title">Check Your Email</h1>

            <p className="forgot-subtitle">
              If an account exists for <strong>{email}</strong>, you will
              receive instructions to reset your password.
            </p>

            <p className="forgot-note">
              Please also check your spam or junk folder.
            </p>

            <button
              type="button"
              className="forgot-button"
              onClick={onBackToLogin}
            >
              Back to Sign In
            </button>
          </div>
        )}

        <p className="forgot-footer">
          Secure access to your company's AI workspace
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
