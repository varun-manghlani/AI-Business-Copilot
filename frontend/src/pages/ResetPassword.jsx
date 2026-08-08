import { useState } from "react";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import "../styles/ResetPassword.css";

function ResetPassword({ onBackToLogin }) {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(event) {
    event.preventDefault();

    if (!resetToken) {
      toast.error("Invalid or missing password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please enter both password fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            new_password: password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to reset password.");
      }

      setSuccess(true);

      toast.success("Password reset successfully.");
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="reset-page">
        <div className="reset-card">
          <img src={logo} alt="AI Business Copilot" className="reset-logo" />

          <div className="reset-success-icon">✓</div>

          <h1 className="reset-title">Password Reset</h1>

          <p className="reset-subtitle">
            Your password has been successfully changed. You can now sign in
            with your new password.
          </p>

          <button
            type="button"
            className="reset-button"
            onClick={onBackToLogin}
          >
            Back to Sign In
          </button>

          <p className="reset-footer">
            Secure access to your company's AI workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">
      <div className="reset-card">
        <img src={logo} alt="AI Business Copilot" className="reset-logo" />

        <h1 className="reset-title">Reset Password</h1>

        <p className="reset-subtitle">
          Create a new password for your AI workspace.
        </p>

        {!resetToken ? (
          <>
            <p className="reset-error">
              This password reset link is invalid or missing.
            </p>

            <button
              type="button"
              className="reset-button"
              onClick={onBackToLogin}
            >
              Back to Sign In
            </button>
          </>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="reset-field">
              <label htmlFor="new-password">New Password</label>

              <div className="reset-password-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="reset-field">
              <label htmlFor="confirm-password">Confirm Password</label>

              <div className="reset-password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password →"}
            </button>
          </form>
        )}

        {!success && (
          <button
            type="button"
            className="reset-back-button"
            onClick={onBackToLogin}
            disabled={loading}
          >
            ← Back to Sign In
          </button>
        )}

        {!success && (
          <p className="reset-footer">
            🔒 Secure access to your company's AI workspace
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
