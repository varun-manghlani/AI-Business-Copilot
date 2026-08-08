import { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/LoginPage.css";
import toast from "react-hot-toast";

function LoginPage({ onLogin, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      /*
       * Keep your existing authentication flow.
       *
       * Remember Me:
       * For now we continue using localStorage because
       * that is how your current backend/frontend authentication works.
       *
       * Later, when we implement refresh tokens properly,
       * this can be changed to HttpOnly cookies.
       */
      localStorage.setItem("token", data.access_token);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      toast.success("Signed in successfully!");

      onLogin();
    } catch (error) {
      console.error("Login error:", error);

      toast.error(error.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    /*
     * We will connect this to the real forgot-password
     * backend endpoint when that endpoint is ready.
     */
    toast("Forgot password functionality will be available soon.");
  }

  return (
    <div className="login-page">
      {/* Background glow */}
      <div className="login-background-glow"></div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-brand">
          <img src={logo} alt="AI Business Copilot" className="login-logo" />

          <h1 className="login-title">AI Business Copilot</h1>

          <p className="login-subtitle">
            Enterprise AI Assistant powered by Llama 3.2
          </p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          {/* Email */}
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email Address
            </label>

            <input
              id="email"
              className="login-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>

            <div className="password-input-wrapper">
              <input
                id="password"
                className="login-input password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={onForgotPassword}
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In */}
          <button
            type="button"
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span className="security-icon">🔒</span>

          <span>Secure access to your company's AI workspace</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
